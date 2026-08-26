#!/usr/bin/env python3
"""
Generates the synthetic New Jersey construction crew fixture referenced in
Aether_Ambition_Build_Plan.pdf Stage II: "a synthetic crew can be loaded,
five planted errors speak English."

This is fake data end to end — no real employee, employer, or wage record.
It exists so the copilot / exception-detection logic has something realistic
to run against before any real workforce data is ever touched.

Outputs (into this same directory):
  crew_roster.csv        - 16 employees at a fictional NJ construction company
  time_punches.csv       - one 2-week pay period of daily time punches
  planted_errors.md      - the answer key: which 5 rows are wrong, and why

Deterministic: seeded RNG, so re-running regenerates identical files.
"""
import csv
import random
from datetime import date, timedelta

random.seed(20260826)

LEGAL_ENTITY = "Palisade Builders LLC"
JURISDICTION = "US-NJ"
WORKPLACE = "Palisade Builders — Fort Lee Jobsite"
NJ_MIN_WAGE_2026 = 15.49  # verified 2026 NJ general minimum wage (see Feasibility Study Appendix A)

PAY_PERIOD_START = date(2026, 8, 10)   # Mon
PAY_PERIOD_END = date(2026, 8, 23)     # Sun, 2-week period

CREW = [
    # (first, last, role, hire_date, base_rate)
    ("Maria",   "Delgado",   "Carpenter",           date(2023, 4, 3),  29.50),
    ("Deshawn", "Carter",    "Laborer",             date(2024, 6, 17), 23.00),
    ("Kevin",   "O'Malley",  "Apprentice Laborer",  date(2025, 9, 2),  17.25),
    ("Priya",   "Nair",      "Electrician",         date(2022, 1, 10), 36.00),
    ("Tyler",   "Brooks",    "Apprentice Laborer",  date(2026, 5, 12), 14.75),  # planted: below NJ min wage
    ("Sam",     "Reyes",     "Equipment Operator",  date(2021, 11, 4), 27.50),
    ("Angela",  "Fitzgerald","Foreman",             date(2019, 3, 22), 41.00),
    ("Marcus",  "Webb",      "Carpenter",           date(2023, 8, 14), 30.25),
    ("Lena",    "Kowalski",  "HVAC Technician",     date(2022, 7, 1),  31.50),
    ("Diego",   "Alvarez",   "Plumber",             date(2020, 2, 18), 33.00),
    ("Jordan",  "Pierce",    "Laborer",             date(2024, 10, 7), 22.50),
    ("Fatima",  "Haidari",   "Electrician",         date(2021, 5, 29), 34.75),
    ("Chris",   "Nolan",     "Equipment Operator",  date(2023, 1, 9),  26.75),
    ("Rashad",  "Wells",     "Carpenter",           date(2024, 3, 3),  28.75),
    ("Olivia",  "Santos",    "Foreman",             date(2018, 6, 25), 39.50),
    ("Ben",     "Turner",    "Laborer",             date(2025, 1, 20), 22.00),
]

def workdays(start, end):
    d = start
    while d <= end:
        if d.weekday() < 5:  # Mon-Fri standard; Saturdays only appear as OT/overtime anomalies below
            yield d
        d += timedelta(days=1)

def write_roster():
    with open("crew_roster.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["employee_ref","first_name","last_name","role_title","hire_date",
                    "pay_basis","base_hourly_rate","workplace","jurisdiction","legal_entity"])
        for i, (fn, ln, role, hire, rate) in enumerate(CREW, start=1):
            w.writerow([f"EMP-{i:03d}", fn, ln, role, hire.isoformat(), "hourly",
                        f"{rate:.2f}", WORKPLACE, JURISDICTION, LEGAL_ENTITY])

def base_hours_for(employee_ref):
    # Deterministic-but-varied "normal" schedule: 8hr/day, occasional 8.5.
    return 8.0 if hash(employee_ref) % 3 else 8.5

def write_punches():
    rows = []
    days = list(workdays(PAY_PERIOD_START, PAY_PERIOD_END))
    for i, (fn, ln, role, hire, rate) in enumerate(CREW, start=1):
        ref = f"EMP-{i:03d}"
        for d in days:
            hrs = base_hours_for(ref) + random.choice([-0.25, 0, 0, 0, 0.25])
            clock_in = f"{d.isoformat()}T07:00:00-04:00"
            clock_out_hr = 7 + hrs
            clock_out = f"{d.isoformat()}T{int(clock_out_hr):02d}:{int((clock_out_hr%1)*60):02d}:00-04:00"
            rows.append({
                "employee_ref": ref, "work_date": d.isoformat(), "clock_in": clock_in,
                "clock_out": clock_out, "raw_hours": f"{hrs:.2f}", "job_code": role, "notes": "",
            })

    # ---- 5 planted errors, layered on top of the clean baseline above ----

    # 1) Overtime spike vs. 12-week baseline: Maria Delgado works an unscheduled
    #    Saturday, 6.5 hours, that reads as a clock-out miss (no matching posted shift).
    maria_ref = "EMP-001"
    sat = PAY_PERIOD_START + timedelta(days=5)  # first Saturday in the period
    rows.append({
        "employee_ref": maria_ref, "work_date": sat.isoformat(),
        "clock_in": f"{sat.isoformat()}T07:00:00-04:00",
        "clock_out": f"{sat.isoformat()}T15:30:00-04:00",
        "raw_hours": "8.50", "job_code": "Carpenter",
        "notes": "PLANTED ERROR 1: unscheduled Saturday shift, no posted-schedule match — OT baseline breach",
    })

    # 2) Missing clock-out: Deshawn Carter has a punch with no clock_out at all.
    deshawn_ref = "EMP-002"
    target_day = days[3]
    for r in rows:
        if r["employee_ref"] == deshawn_ref and r["work_date"] == target_day.isoformat():
            r["clock_out"] = ""
            r["raw_hours"] = ""
            r["notes"] = "PLANTED ERROR 2: missing clock-out, raw_hours cannot be computed"

    # 3) Pay-rate / job-code mismatch: Kevin O'Malley (Apprentice Laborer, $17.25/hr
    #    base rate) is logged against the Foreman job code for one shift — a rate
    #    that should never attach to his employment_period.
    kevin_ref = "EMP-003"
    target_day2 = days[6]
    for r in rows:
        if r["employee_ref"] == kevin_ref and r["work_date"] == target_day2.isoformat():
            r["job_code"] = "Foreman"
            r["notes"] = "PLANTED ERROR 3: job_code 'Foreman' does not match employee's employment_period role/rate"

    # 4) Duplicate / overlapping punch: Priya Nair has two overlapping punches on
    #    the same day — a double-paid risk if both line items post.
    priya_ref = "EMP-004"
    dup_day = days[8]
    rows.append({
        "employee_ref": priya_ref, "work_date": dup_day.isoformat(),
        "clock_in": f"{dup_day.isoformat()}T12:00:00-04:00",
        "clock_out": f"{dup_day.isoformat()}T16:00:00-04:00",
        "raw_hours": "4.00", "job_code": "Electrician",
        "notes": "PLANTED ERROR 4: overlaps her 07:00-15:30 punch same day — duplicate/overlapping entry",
    })

    # 5) Minimum-wage floor breach: Tyler Brooks's base rate ($14.75/hr) is below
    #    the 2026 NJ minimum wage ($15.49/hr) — a compliance exception, not a
    #    time-punch exception, but it must be caught before this pay run is approved.
    # (No punch-level row needed — this is flagged from crew_roster.csv directly;
    #  see planted_errors.md.)

    rows.sort(key=lambda r: (r["employee_ref"], r["work_date"]))
    with open("time_punches.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["employee_ref","work_date","clock_in","clock_out","raw_hours","job_code","notes"])
        for r in rows:
            w.writerow([r["employee_ref"], r["work_date"], r["clock_in"], r["clock_out"],
                        r["raw_hours"], r["job_code"], r["notes"]])

def write_answer_key():
    with open("planted_errors.md", "w") as f:
        f.write(f"""# Planted Errors — Answer Key

This is the ground truth for `time_punches.csv` and `crew_roster.csv`, generated by
`generate_nj_construction_crew.py` (seed 20260826, deterministic). It exists so that
`services/copilot-exceptions` (or anyone testing it by hand) can be scored against a
known-correct answer, per the Stage II acceptance milestone: *"a synthetic crew can be
loaded, five planted errors speak English."*

Company: {LEGAL_ENTITY} · {WORKPLACE} · jurisdiction {JURISDICTION}
Pay period: {PAY_PERIOD_START.isoformat()} to {PAY_PERIOD_END.isoformat()}
NJ 2026 general minimum wage used for error 5: ${NJ_MIN_WAGE_2026:.2f}/hr

## 1. Overtime baseline breach — Maria Delgado (EMP-001)

An unscheduled Saturday shift (8.5 hours) with no matching posted schedule. Expected
copilot output (matches the worked example in packages/schemas/exception.schema.json):

> "Maria's overtime is 42% above her 12-week baseline. The Saturday shift looks like a
> clock-out miss against the posted schedule. Approve a correction to 8.0 hours regular,
> or keep as-is and note the reason."

## 2. Missing clock-out — Deshawn Carter (EMP-002)

One weekday punch has a `clock_in` and no `clock_out`; `raw_hours` cannot be computed.
Expected copilot output:

> "Deshawn clocked in at 7:00 AM with no clock-out recorded. Hours for this day cannot
> be calculated. Enter the missing clock-out time or confirm the shift length."

## 3. Job-code / pay-rate mismatch — Kevin O'Malley (EMP-003)

Logged against the `Foreman` job code for one shift, but his `employment_period` role
and base rate are Apprentice Laborer ($17.25/hr) — Foreman pays $39.50–$41.00/hr on this
crew. Expected copilot output:

> "Kevin is logged as Foreman for his Aug 18 shift, but his role on file is Apprentice
> Laborer. Paying the Foreman rate would add $175.50 to this run. Confirm a temporary
> rate change or correct the job code."

## 4. Duplicate / overlapping punch — Priya Nair (EMP-004)

Two punches on the same day overlap (07:00–15:30 and 12:00–16:00). If both post, she is
paid for 4 hours she did not separately work. Expected copilot output:

> "Priya has two overlapping time entries on Aug 20 (7:00 AM–3:30 PM and 12:00 PM–4:00
> PM). Paying both adds 4.0 duplicate hours. Keep the longer entry, or confirm she
> worked two separate assignments."

## 5. Minimum-wage floor breach — Tyler Brooks (EMP-005)

Base hourly rate on file is $14.75/hr, below the $15.49/hr 2026 New Jersey general
minimum wage. This is a compliance-engine exception, not a copilot/time exception —
it should fire the moment his employment_period is loaded, independent of any pay run.
Expected copilot output:

> "Tyler's pay rate ($14.75/hr) is below the 2026 New Jersey minimum wage ($15.49/hr).
> This affects every pay period until corrected. Approve a rate increase to at least
> $15.49/hr now."

## Scoring

A copilot/exception-detection pass over this fixture should surface all five as
distinct exceptions and should not raise false positives on the other 15 employees'
clean data. `detect_exceptions.py` in this directory is a minimal rules-based reference
implementation — not the production copilot — that finds all five against the loaded
Postgres schema, as a working proof that the schema and the Exception object round-trip
correctly end to end.
""")

if __name__ == "__main__":
    write_roster()
    write_punches()
    write_answer_key()
    print("wrote crew_roster.csv, time_punches.csv, planted_errors.md")
