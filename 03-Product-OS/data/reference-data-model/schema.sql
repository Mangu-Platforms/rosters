-- ============================================================================
-- AETHER — REFERENCE DATA MODEL
-- ============================================================================
-- Source: Aether_Workforce_OS_Full_Build.pdf, Section 7 ("Reference data model,
-- minimum") and Aether_Workforce_OS_Operating_Plan.docx, Section 7.
--
-- Scope discipline, per the source plan: this schema is the system of record
-- for workforce, pay-run, exception, credit, and score data. It intentionally
-- contains NO tables for storing customer bank credentials, card numbers, or
-- ACH routing secrets — those live in the embedded payroll rail, not here.
-- "Tools write exceptions; models never call ACH."
--
-- Target: Postgres 15+, single US region, encrypted at rest and in transit.
-- ============================================================================

create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- 1. ENTITIES, WORKPLACES, EMPLOYEES, EMPLOYMENT PERIODS, PAY SCHEDULES
-- ----------------------------------------------------------------------------

create table legal_entity (
    id                  uuid primary key default gen_random_uuid(),
    legal_name          text not null,
    dba_name            text,
    ein                 text not null,                 -- federal EIN, encrypted at column level in prod
    formation_state     char(2) not null,
    vertical            text not null check (vertical in ('construction','home_care','manufacturing','logistics','franchise')),
    onboarded_at        timestamptz not null default now(),
    parallel_run_status text not null default 'not_started'
                        check (parallel_run_status in ('not_started','shadow','parallel_1','parallel_2','live')),
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);
comment on table legal_entity is 'One row per customer employer entity. parallel_run_status tracks the 30-day migration runbook stage (see 05-Implementation-and-Runbooks).';

create table workplace (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    name                text not null,
    address_line1       text not null,
    city                text not null,
    state               char(2) not null,
    postal_code         text not null,
    jurisdiction_code   text not null,                  -- e.g. 'US-NJ', 'US-NJ-NEWARK' for local ordinances
    is_prevailing_wage_site boolean not null default false,
    created_at          timestamptz not null default now()
);
create index idx_workplace_entity on workplace(legal_entity_id);
create index idx_workplace_jurisdiction on workplace(jurisdiction_code);

create table employee (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    external_ref        text,                            -- id in the customer's prior HCM/payroll system, for migration reconciliation
    first_name          text not null,
    last_name           text not null,
    ssn_last4           char(4),                          -- full SSN is never stored here; tokenized in the rail
    hire_date           date not null,
    termination_date    date,
    employment_status   text not null default 'active' check (employment_status in ('active','on_leave','terminated')),
    role_title          text not null,
    primary_workplace_id uuid references workplace(id),
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);
create index idx_employee_entity on employee(legal_entity_id);
create index idx_employee_workplace on employee(primary_workplace_id);
create index idx_employee_status on employee(employment_status);

create table employment_period (
    id                  uuid primary key default gen_random_uuid(),
    employee_id         uuid not null references employee(id) on delete cascade,
    workplace_id        uuid not null references workplace(id),
    start_date          date not null,
    end_date            date,
    employment_type     text not null check (employment_type in ('w2','1099')),
    pay_basis           text not null check (pay_basis in ('hourly','salary')),
    base_rate           numeric(10,2) not null,          -- hourly rate OR annualized salary, per pay_basis
    fte_percent         numeric(5,2) not null default 100.00,
    created_at          timestamptz not null default now()
);
create index idx_employment_period_employee on employment_period(employee_id);

create table pay_schedule (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    name                text not null,
    frequency           text not null check (frequency in ('weekly','biweekly','semimonthly','monthly')),
    anchor_date         date not null
);

create table pay_period (
    id                  uuid primary key default gen_random_uuid(),
    pay_schedule_id     uuid not null references pay_schedule(id) on delete cascade,
    period_start        date not null,
    period_end          date not null,
    pay_date            date not null,
    status              text not null default 'open' check (status in ('open','locked','processed')),
    unique (pay_schedule_id, period_start, period_end)
);
create index idx_pay_period_schedule on pay_period(pay_schedule_id);

-- ----------------------------------------------------------------------------
-- 2. TIME, EARNING CODES, DEDUCTION CODES, TAX ELECTIONS
-- ----------------------------------------------------------------------------

create table earning_code (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    code                text not null,
    label               text not null,
    category            text not null check (category in
                          ('regular','overtime','double_time','pto','holiday','bonus','per_diem','prevailing_wage_fringe')),
    is_taxable          boolean not null default true,
    unique (legal_entity_id, code)
);

create table deduction_code (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    code                text not null,
    label               text not null,
    category            text not null check (category in ('pretax','posttax','garnishment','benefit')),
    paid_by             text not null check (paid_by in ('employer','employee')),
    unique (legal_entity_id, code)
);

create table tax_election (
    id                  uuid primary key default gen_random_uuid(),
    employee_id         uuid not null references employee(id) on delete cascade,
    jurisdiction_code   text not null,
    filing_status       text not null,
    election_detail     jsonb not null default '{}'::jsonb,   -- W-4 allowances/credits, state-specific fields
    effective_date      date not null
);
create index idx_tax_election_employee on tax_election(employee_id);

create table time_punch (
    id                  uuid primary key default gen_random_uuid(),
    employee_id         uuid not null references employee(id) on delete cascade,
    workplace_id        uuid not null references workplace(id),
    work_date           date not null,
    clock_in            timestamptz,
    clock_out           timestamptz,
    raw_hours           numeric(6,2),                    -- null when clock_out is missing — a planted-error signal
    job_code             text,
    source              text not null default 'import' check (source in ('import','aether_time','manual')),
    created_at          timestamptz not null default now()
);
create index idx_time_punch_employee_date on time_punch(employee_id, work_date);

-- ----------------------------------------------------------------------------
-- 3. PAY RUNS, LINE ITEMS, EXCEPTIONS, APPROVALS, FILINGS, PAYMENTS
-- ----------------------------------------------------------------------------

create table pay_run (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    pay_period_id       uuid not null references pay_period(id),
    status              text not null default 'draft' check (status in ('draft','previewed','approved','filed','paid','reverted')),
    created_at          timestamptz not null default now(),
    approved_by         uuid references employee(id),
    approved_at         timestamptz
);
create index idx_pay_run_entity on pay_run(legal_entity_id);
create index idx_pay_run_period on pay_run(pay_period_id);

create table pay_run_line_item (
    id                  uuid primary key default gen_random_uuid(),
    pay_run_id          uuid not null references pay_run(id) on delete cascade,
    employee_id         uuid not null references employee(id),
    earning_code_id     uuid references earning_code(id),
    deduction_code_id   uuid references deduction_code(id),
    hours               numeric(6,2),
    rate                numeric(10,2),
    amount              numeric(12,2) not null,
    jurisdiction_code   text not null
);
create index idx_line_item_pay_run on pay_run_line_item(pay_run_id);
create index idx_line_item_employee on pay_run_line_item(employee_id);

-- The canonical Exception object. Field names and meaning are frozen to match
-- packages/schemas/exception.schema.json exactly — do not rename columns here
-- without updating that schema and every service that reads it.
create table exception (
    id                    uuid primary key default gen_random_uuid(),
    pay_run_id            uuid not null references pay_run(id) on delete cascade,
    employee_id           uuid not null references employee(id),
    source_id             text not null,                 -- id of the upstream record that triggered this (e.g. a time_punch id)
    pay_period            daterange not null,
    earning_type          text not null,
    current_value         numeric(12,2) not null,
    baseline_value        numeric(12,2) not null,
    baseline_window       text not null,                  -- e.g. '12_week_trailing_average'
    suggested_value       numeric(12,2),
    dollar_impact_employer numeric(12,2) not null,
    dollar_impact_employee numeric(12,2) not null,
    explanation_plain     text not null,
    confidence_internal   numeric(4,3),                    -- 0.000–1.000, NEVER surfaced to the customer — internal precision tracking only
    recommended_action    text not null,
    approver_id           uuid references employee(id),
    decision              text not null default 'pending' check (decision in ('pending','approved','rejected','noted_no_change')),
    reason_code           text,
    audit_hash            text not null,                   -- hash of (source_id + policy_version + model_version + output) for the audit trail
    created_at            timestamptz not null default now(),
    decided_at            timestamptz
);
create index idx_exception_pay_run on exception(pay_run_id);
create index idx_exception_employee on exception(employee_id);
create index idx_exception_decision on exception(decision);
comment on column exception.confidence_internal is 'Internal precision-tracking signal only. The Operating Plan is explicit: never show a confidence percentage on a money movement to a customer.';

-- General-purpose approval log for non-exception approvals (e.g. "approve the
-- wage-floor increase now or on the statutory date" from the compliance engine).
create table approval (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    subject_type        text not null check (subject_type in ('compliance_alert','ewa_pool_cap','rule_update','other')),
    subject_id          text not null,
    approver_id         uuid not null references employee(id),
    decision            text not null check (decision in ('approved','rejected')),
    reason_code         text,
    decided_at          timestamptz not null default now()
);

create table filing (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    pay_run_id          uuid references pay_run(id),
    jurisdiction_code   text not null,
    filing_type         text not null check (filing_type in ('federal_941','federal_940','state_withholding','state_ui','local')),
    status              text not null default 'pending' check (status in ('pending','filed','accepted','rejected')),
    filed_via           text not null default 'rail_partner',
    confirmation_number text,
    filed_at            timestamptz
);
create index idx_filing_entity on filing(legal_entity_id);

create table payment (
    id                  uuid primary key default gen_random_uuid(),
    pay_run_id          uuid references pay_run(id),
    employee_id         uuid not null references employee(id),
    payment_type        text not null check (payment_type in ('net_pay','ewa_advance','tax_deposit')),
    amount              numeric(12,2) not null,
    method              text not null check (method in ('ach_standard','ach_instant','check')),
    status              text not null default 'initiated' check (status in ('initiated','settled','failed','reversed')),
    rail_transaction_id text,                              -- opaque reference into the embedded rail, never a raw account number
    initiated_at        timestamptz not null default now(),
    settled_at          timestamptz
);
create index idx_payment_employee on payment(employee_id);

-- ----------------------------------------------------------------------------
-- 4. TAX CREDITS
-- ----------------------------------------------------------------------------

create table credit_case (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    employee_id         uuid references employee(id),      -- null for entity-level credits (e.g. R&D payroll offset)
    credit_type         text not null check (credit_type in
                          ('wotc','state_hiring','state_training','state_apprenticeship','rd_payroll_offset','other')),
    status              text not null default 'identified' check (status in
                          ('identified','documented','filed','collected','denied')),
    estimated_amount    numeric(12,2),
    recovered_amount    numeric(12,2) default 0,
    documentation_url   text,
    identified_at       timestamptz not null default now(),
    filed_at            timestamptz,
    resolved_at         timestamptz
);
create index idx_credit_entity on credit_case(legal_entity_id);
create index idx_credit_type on credit_case(credit_type);
comment on table credit_case is 'Per Feasibility Study Section 4: wotc rows should be flagged contingent (federal WOTC lapsed for new hires after 2025-12-31) until Congress renews it. Do not model revenue on wotc rows alone.';

-- ----------------------------------------------------------------------------
-- 5. HEALTH SCORE + FORECASTING
-- ----------------------------------------------------------------------------

create table health_score_snapshot (
    id                          uuid primary key default gen_random_uuid(),
    legal_entity_id             uuid not null references legal_entity(id) on delete cascade,
    as_of_date                  date not null,
    score                       numeric(5,2) not null check (score between 0 and 100),
    turnover_risk_component     numeric(5,2),
    schedule_instability_component numeric(5,2),
    absenteeism_component       numeric(5,2),
    pay_anomaly_component       numeric(5,2),
    overtime_load_component     numeric(5,2),
    comp_benchmark_component    numeric(5,2),
    ewa_stress_component        numeric(5,2),
    span_of_control_component   numeric(5,2),
    unique (legal_entity_id, as_of_date)
);
comment on table health_score_snapshot is 'Per Operating Plan 5.5: hold out a validation set and publish 90-day-exit hit rates before marketing this as predictive.';

create table forecast_snapshot (
    id                  uuid primary key default gen_random_uuid(),
    legal_entity_id     uuid not null references legal_entity(id) on delete cascade,
    forecast_type       text not null check (forecast_type in ('next_payroll','quarterly_tax','annual_labor')),
    as_of_date          date not null,
    horizon_date        date not null,
    forecast_amount     numeric(14,2) not null,
    actual_amount       numeric(14,2),
    variance_amount     numeric(14,2) generated always as (actual_amount - forecast_amount) stored,
    variance_reason     text
);
create index idx_forecast_entity on forecast_snapshot(legal_entity_id);
comment on table forecast_snapshot is 'Publish forecast-versus-actual every cycle, per Operating Plan 5.2 — this table is what makes that publishable rather than anecdotal.';
