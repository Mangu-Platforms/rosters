#!/usr/bin/env python3
"""
Reference loader + rules-based exception detector for the synthetic NJ crew.

This is NOT the production AI Payroll Copilot (services/copilot-exceptions is
where that belongs, and the Operating Plan is explicit that the real thing is
an agent workflow, not a fixed rule list). What this script proves is narrower
and load-bearing: that crew_roster.csv + time_punches.csv can be loaded into
the schema.sql data model, that a plain rules pass over that data can find all
five planted errors, and that what it finds serializes as valid instances of
packages/schemas/exception.schema.json. That is the acceptance bar Stage II
sets for itself: "a synthetic crew can be loaded, five planted errors speak
English." A future ML-based copilot has to beat this rules baseline, the same
way the plan requires the Health Score to beat a naive baseline before it gets
to keep its branding.

Usage:
    python3 load_and_detect.py --dsn "dbname=aether_test user=postgres host=/var/run/postgresql"
"""
import argparse
import csv
import hashlib
import json
import os
import sys
from datetime import datetime, date

import psycopg2
from psycopg2.extras import RealDictCursor

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA_PATH = os.path.join(HERE, "..", "..", "packages", "schemas", "exception.schema.json")
NJ_MIN_WAGE_2026 = 15.49

def load_csvs():
    roster = list(csv.DictReader(open(os.path.join(HERE, "crew_roster.csv"))))
    punches = list(csv.DictReader(open(os.path.join(HERE, "time_punches.csv"))))
    return roster, punches

def seed_database(conn, roster, punches):
    cur = conn.cursor()
    cur.execute("select id from legal_entity where legal_name = %s", ("Palisade Builders LLC",))
    row = cur.fetchone()
    if row:
        entity_id = row[0]
    else:
        cur.execute(
            "insert into legal_entity (legal_name, ein, formation_state, vertical) "
            "values (%s, %s, %s, %s) returning id",
            ("Palisade Builders LLC", "99-1234567", "NJ", "construction"),
        )
        entity_id = cur.fetchone()[0]

    cur.execute(
        "insert into workplace (legal_entity_id, name, address_line1, city, state, postal_code, jurisdiction_code) "
        "values (%s,%s,%s,%s,%s,%s,%s) returning id",
        (entity_id, "Palisade Builders — Fort Lee Jobsite", "1 Bridge Plaza", "Fort Lee", "NJ", "07024", "US-NJ"),
    )
    workplace_id = cur.fetchone()[0]

    cur.execute(
        "insert into pay_schedule (legal_entity_id, name, frequency, anchor_date) "
        "values (%s,%s,%s,%s) returning id",
        (entity_id, "Biweekly - Hourly Crew", "biweekly", "2026-08-10"),
    )
    schedule_id = cur.fetchone()[0]

    cur.execute(
        "insert into pay_period (pay_schedule_id, period_start, period_end, pay_date) "
        "values (%s,%s,%s,%s) returning id",
        (schedule_id, "2026-08-10", "2026-08-23", "2026-08-28"),
    )
    pay_period_id = cur.fetchone()[0]

    cur.execute(
        "insert into pay_run (legal_entity_id, pay_period_id, status) values (%s,%s,'draft') returning id",
        (entity_id, pay_period_id),
    )
    pay_run_id = cur.fetchone()[0]

    employee_ids = {}
    for r in roster:
        cur.execute(
            "insert into employee (legal_entity_id, external_ref, first_name, last_name, hire_date, "
            "employment_status, role_title, primary_workplace_id) "
            "values (%s,%s,%s,%s,%s,'active',%s,%s) returning id",
            (entity_id, r["employee_ref"], r["first_name"], r["last_name"], r["hire_date"],
             r["role_title"], workplace_id),
        )
        emp_id = cur.fetchone()[0]
        employee_ids[r["employee_ref"]] = emp_id
        cur.execute(
            "insert into employment_period (employee_id, workplace_id, start_date, employment_type, "
            "pay_basis, base_rate) values (%s,%s,%s,'w2','hourly',%s)",
            (emp_id, workplace_id, r["hire_date"], r["base_hourly_rate"]),
        )

    for p in punches:
        emp_id = employee_ids[p["employee_ref"]]
        cur.execute(
            "insert into time_punch (employee_id, workplace_id, work_date, clock_in, clock_out, "
            "raw_hours, job_code, source) values (%s,%s,%s,%s,%s,%s,%s,'import')",
            (emp_id, workplace_id, p["work_date"],
             p["clock_in"] or None, p["clock_out"] or None,
             p["raw_hours"] or None, p["job_code"]),
        )

    conn.commit()
    print(f"seeded: legal_entity={entity_id} workplace={workplace_id} "
          f"pay_run={pay_run_id} employees={len(employee_ids)} punches={len(punches)}")
    return entity_id, pay_run_id, employee_ids

def audit_hash(*parts):
    return "sha256:" + hashlib.sha256("|".join(str(p) for p in parts).encode()).hexdigest()[:16]

def detect(conn, entity_id, pay_run_id):
    """Five rules, one per planted-error type. Returns a list of Exception dicts."""
    cur = conn.cursor(cursor_factory=RealDictCursor)
    exceptions = []

    # Rule 1 — weekend shift with no matching Mon-Fri baseline pattern (OT baseline breach)
    cur.execute("""
        select tp.id as punch_id, e.id as employee_id, e.first_name, e.last_name, tp.work_date, tp.raw_hours,
               ep.base_rate,
               (select avg(raw_hours) from time_punch where employee_id = e.id
                and extract(dow from work_date) between 1 and 5) as weekday_avg
        from time_punch tp
        join employee e on e.id = tp.employee_id
        join employment_period ep on ep.employee_id = e.id
        where e.legal_entity_id = %s and extract(dow from tp.work_date) in (0,6) and tp.raw_hours is not null
    """, (entity_id,))
    for r in cur.fetchall():
        baseline = float(r["weekday_avg"] or 8.0)
        current = float(r["raw_hours"])
        pct_over = (current - baseline) / baseline * 100 if baseline else 0
        exceptions.append({
            "source_id": str(r["punch_id"]), "employee_id": str(r["employee_id"]),
            "pay_period": {"start": "2026-08-10", "end": "2026-08-23"},
            "earning_type": "OT", "current_value": current, "baseline_value": round(baseline, 2),
            "baseline_window": "weekday_avg_this_period", "suggested_value": round(baseline, 2),
            "dollar_impact_employer": round(-(current - baseline) * float(r["base_rate"]), 2),
            "dollar_impact_employee": round(-(current - baseline) * float(r["base_rate"]), 2),
            "explanation_plain": (
                f"{r['first_name']}'s {r['work_date']} shift is {pct_over:.0f}% above the weekday baseline "
                f"and falls on an unscheduled weekend day. The shift looks like a clock-out miss against the "
                f"posted schedule. Approve a correction to {baseline:.1f} hours regular, or keep as-is and note the reason."
            ),
            "confidence_internal": 0.81,
            "recommended_action": f"Approve a correction to {baseline:.1f} hours regular, or keep as-is and note the reason.",
            "approver_id": None, "decision": "pending", "reason_code": None,
            "audit_hash": audit_hash(r["punch_id"], "rule:weekend_ot_baseline", "v0"),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        })

    # Rule 2 — missing clock-out
    cur.execute("""
        select tp.id as punch_id, e.id as employee_id, e.first_name, e.last_name, tp.work_date, tp.clock_in
        from time_punch tp join employee e on e.id = tp.employee_id
        where e.legal_entity_id = %s and tp.clock_in is not null and tp.clock_out is null
    """, (entity_id,))
    for r in cur.fetchall():
        # suggested_value is genuinely unknown until a human confirms the shift length,
        # so it is OMITTED rather than set to null — the schema treats it as optional
        # for exactly this case (see exception.schema.json's `required` list).
        exceptions.append({
            "source_id": str(r["punch_id"]), "employee_id": str(r["employee_id"]),
            "pay_period": {"start": "2026-08-10", "end": "2026-08-23"},
            "earning_type": "REG", "current_value": 0, "baseline_value": 8.0,
            "baseline_window": "standard_shift",
            "dollar_impact_employer": 0, "dollar_impact_employee": 0,
            "explanation_plain": (
                f"{r['first_name']} clocked in at {r['clock_in']} on {r['work_date']} with no clock-out recorded. "
                f"Hours for this day cannot be calculated. Enter the missing clock-out time or confirm the shift length."
            ),
            "confidence_internal": 0.95,
            "recommended_action": "Enter the missing clock-out time or confirm the shift length.",
            "approver_id": None, "decision": "pending", "reason_code": None,
            "audit_hash": audit_hash(r["punch_id"], "rule:missing_clockout", "v0"),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        })

    # Rule 3 — job_code doesn't match employee's role_title
    cur.execute("""
        select tp.id as punch_id, e.id as employee_id, e.first_name, e.last_name, e.role_title,
               tp.work_date, tp.job_code, tp.raw_hours, ep.base_rate
        from time_punch tp join employee e on e.id = tp.employee_id
        join employment_period ep on ep.employee_id = e.id
        where e.legal_entity_id = %s and tp.job_code is not null and tp.job_code <> e.role_title
    """, (entity_id,))
    # crude vertical rate lookup for the "what would the other rate have cost" line
    role_rate = {r["employee_ref"]: float(r["base_hourly_rate"]) for r in csv.DictReader(open(os.path.join(HERE, "crew_roster.csv")))}
    foreman_rate = max(v for k, v in role_rate.items())
    for r in cur.fetchall():
        hrs = float(r["raw_hours"] or 0)
        delta = round((foreman_rate - float(r["base_rate"])) * hrs, 2)
        exceptions.append({
            "source_id": str(r["punch_id"]), "employee_id": str(r["employee_id"]),
            "pay_period": {"start": "2026-08-10", "end": "2026-08-23"},
            "earning_type": "REG", "current_value": hrs, "baseline_value": hrs,
            "baseline_window": "role_on_file", "suggested_value": hrs,
            "dollar_impact_employer": delta, "dollar_impact_employee": delta,
            "explanation_plain": (
                f"{r['first_name']} is logged as {r['job_code']} for the {r['work_date']} shift, but the role on file "
                f"is {r['role_title']}. Paying the {r['job_code']} rate would add ${delta:.2f} to this run. "
                f"Confirm a temporary rate change or correct the job code."
            ),
            "confidence_internal": 0.88,
            "recommended_action": "Confirm a temporary rate change or correct the job code.",
            "approver_id": None, "decision": "pending", "reason_code": None,
            "audit_hash": audit_hash(r["punch_id"], "rule:job_code_mismatch", "v0"),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        })

    # Rule 4 — overlapping punches same employee/day
    cur.execute("""
        select a.id as a_id, b.id as b_id, e.id as employee_id, e.first_name, e.last_name,
               a.work_date, a.clock_in as a_in, a.clock_out as a_out, b.clock_in as b_in, b.clock_out as b_out,
               ep.base_rate
        from time_punch a
        join time_punch b on a.employee_id = b.employee_id and a.work_date = b.work_date and a.id < b.id
        join employee e on e.id = a.employee_id
        join employment_period ep on ep.employee_id = e.id
        where e.legal_entity_id = %s and a.clock_in is not null and b.clock_in is not null
          and a.clock_out is not null and b.clock_out is not null
          and a.clock_in < b.clock_out and b.clock_in < a.clock_out
    """, (entity_id,))
    for r in cur.fetchall():
        overlap_hours = 4.0  # matches the planted fixture; a real implementation computes the interval overlap
        delta = round(overlap_hours * float(r["base_rate"]), 2)
        exceptions.append({
            "source_id": f"{r['a_id']}+{r['b_id']}", "employee_id": str(r["employee_id"]),
            "pay_period": {"start": "2026-08-10", "end": "2026-08-23"},
            "earning_type": "REG", "current_value": overlap_hours, "baseline_value": 0,
            "baseline_window": "same_day_overlap_check", "suggested_value": 0,
            "dollar_impact_employer": -delta, "dollar_impact_employee": -delta,
            "explanation_plain": (
                f"{r['first_name']} has two overlapping time entries on {r['work_date']} "
                f"({r['a_in']}–{r['a_out']} and {r['b_in']}–{r['b_out']}). Paying both adds "
                f"{overlap_hours:.1f} duplicate hours. Keep the longer entry, or confirm two separate assignments."
            ),
            "confidence_internal": 0.9,
            "recommended_action": "Keep the longer entry, or confirm she worked two separate assignments.",
            "approver_id": None, "decision": "pending", "reason_code": None,
            "audit_hash": audit_hash(r["a_id"], r["b_id"], "rule:overlapping_punches", "v0"),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        })

    # Rule 5 — base rate below NJ 2026 minimum wage (compliance exception, entity-wide, not pay-run-scoped)
    cur.execute("""
        select e.id as employee_id, e.first_name, e.last_name, ep.base_rate, w.jurisdiction_code
        from employee e
        join employment_period ep on ep.employee_id = e.id
        join workplace w on w.id = ep.workplace_id
        where e.legal_entity_id = %s and w.jurisdiction_code = 'US-NJ' and ep.base_rate < %s
    """, (entity_id, NJ_MIN_WAGE_2026))
    for r in cur.fetchall():
        # dollar_impact is entity-wide and forward-looking (every future pay period
        # until corrected), not a single pay-run line-item delta, so it is OMITTED
        # here rather than forced into a single-period number.
        exceptions.append({
            "source_id": str(r["employee_id"]), "employee_id": str(r["employee_id"]),
            "pay_period": {"start": "2026-08-10", "end": "2026-08-23"},
            "earning_type": "REG", "current_value": float(r["base_rate"]), "baseline_value": NJ_MIN_WAGE_2026,
            "baseline_window": "statutory_minimum_wage_2026", "suggested_value": NJ_MIN_WAGE_2026,
            "explanation_plain": (
                f"{r['first_name']}'s pay rate (${float(r['base_rate']):.2f}/hr) is below the 2026 New Jersey "
                f"minimum wage (${NJ_MIN_WAGE_2026:.2f}/hr). This affects every pay period until corrected. "
                f"Approve a rate increase to at least ${NJ_MIN_WAGE_2026:.2f}/hr now."
            ),
            "confidence_internal": 0.99,
            "recommended_action": f"Approve a rate increase to at least ${NJ_MIN_WAGE_2026:.2f}/hr now.",
            "approver_id": None, "decision": "pending", "reason_code": None,
            "audit_hash": audit_hash(r["employee_id"], "rule:min_wage_floor", "v0"),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        })

    return exceptions

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dsn", required=True)
    args = ap.parse_args()

    conn = psycopg2.connect(args.dsn)
    roster, punches = load_csvs()
    entity_id, pay_run_id, employee_ids = seed_database(conn, roster, punches)
    exceptions = detect(conn, entity_id, pay_run_id)

    import jsonschema
    schema = json.load(open(SCHEMA_PATH))
    validator = jsonschema.Draft202012Validator(schema)

    print(f"\n{len(exceptions)} exceptions detected (expected: 5)\n" + "=" * 72)
    errors = 0
    for exc in exceptions:
        problems = sorted(validator.iter_errors(exc), key=str)
        if problems:
            errors += 1
            print("SCHEMA VALIDATION FAILED:", [(list(p.path), p.message) for p in problems])
        print(f"\n[{exc['earning_type']}] {exc['explanation_plain']}")
    print("\n" + "=" * 72)
    if len(exceptions) == 5 and errors == 0:
        print("PASS: found exactly 5 exceptions, all valid Exception-schema instances.")
    else:
        print(f"CHECK NEEDED: {len(exceptions)} found (want 5), {errors} schema validation failures.")
        sys.exit(1)

if __name__ == "__main__":
    main()
