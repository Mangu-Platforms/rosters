export type Role = "ceo" | "operator" | "employee";
export type Decision = "pending" | "approved" | "rejected" | "noted_no_change";
export type PayRunStatus = "draft" | "previewed" | "approved" | "filed" | "paid";

export type Employee = {
  id: string;
  first: string;
  last: string;
  role: string;
  rate: number;
  hire: string;
  status: "active" | "on_leave";
  workplace: string;
  initials: string;
};

export type Exception = {
  id: string;
  employeeId: string;
  sourceId: string;
  kind: "overtime" | "missing_punch" | "rate_mismatch" | "overlap" | "min_wage";
  earningType: string;
  currentValue: number;
  baselineValue: number;
  baselineWindow: string;
  suggestedValue: number | null;
  dollarEmployer: number;
  dollarEmployee: number;
  explanation: string;
  recommended: string;
  createdAt: string;
};

export type Punch = {
  id: string;
  employeeId: string;
  date: string;
  in: string | null;
  out: string | null;
  hours: number | null;
  job: string;
  flag?: string;
};

export type Credit = {
  id: string;
  type: string;
  employee?: string;
  status: "identified" | "documented" | "filed" | "collected" | "contingent";
  estimated: number;
  recovered: number;
  note: string;
};

export type Site = {
  id: string;
  name: string;
  city: string;
  state: "NJ" | "NY" | "PA";
  headcount: number;
  health: number;
  onFire: boolean;
  reason?: string;
  prevailingWage: boolean;
};

export const COMPANY = {
  legal: "Palisade Builders LLC",
  dba: "Palisade Builders",
  einLast4: "4418",
  vertical: "construction",
  state: "NJ",
  period: { start: "2026-08-10", end: "2026-08-23", payDate: "2026-08-28" },
  frequency: "biweekly" as const,
  health: 73,
  cash: 412400,
  nextTax: 38400,
  taxDate: "2026-09-15",
  ewaCap: 18000,
  ewaOut: 3240,
};

export const EMPLOYEES: Employee[] = [
  { id: "EMP-001", first: "Maria", last: "Delgado", role: "Carpenter", rate: 29.5, hire: "2023-04-03", status: "active", workplace: "Fort Lee", initials: "MD" },
  { id: "EMP-002", first: "Deshawn", last: "Carter", role: "Laborer", rate: 23, hire: "2024-06-17", status: "active", workplace: "Fort Lee", initials: "DC" },
  { id: "EMP-003", first: "Kevin", last: "O'Malley", role: "Apprentice Laborer", rate: 17.25, hire: "2025-09-02", status: "active", workplace: "Fort Lee", initials: "KO" },
  { id: "EMP-004", first: "Priya", last: "Nair", role: "Electrician", rate: 36, hire: "2022-01-10", status: "active", workplace: "Fort Lee", initials: "PN" },
  { id: "EMP-005", first: "Tyler", last: "Brooks", role: "Apprentice Laborer", rate: 14.75, hire: "2026-05-12", status: "active", workplace: "Fort Lee", initials: "TB" },
  { id: "EMP-006", first: "Sam", last: "Reyes", role: "Equipment Operator", rate: 27.5, hire: "2021-11-04", status: "active", workplace: "Fort Lee", initials: "SR" },
  { id: "EMP-007", first: "Angela", last: "Fitzgerald", role: "Foreman", rate: 41, hire: "2019-03-22", status: "active", workplace: "Fort Lee", initials: "AF" },
  { id: "EMP-008", first: "Marcus", last: "Webb", role: "Carpenter", rate: 30.25, hire: "2023-08-14", status: "active", workplace: "Newark", initials: "MW" },
  { id: "EMP-009", first: "Lena", last: "Kowalski", role: "HVAC Technician", rate: 31.5, hire: "2022-07-01", status: "active", workplace: "Paramus", initials: "LK" },
  { id: "EMP-010", first: "Diego", last: "Alvarez", role: "Plumber", rate: 33, hire: "2020-02-18", status: "active", workplace: "Newark", initials: "DA" },
  { id: "EMP-011", first: "Jordan", last: "Pierce", role: "Laborer", rate: 22.5, hire: "2024-10-07", status: "active", workplace: "Fort Lee", initials: "JP" },
  { id: "EMP-012", first: "Fatima", last: "Haidari", role: "Electrician", rate: 34.75, hire: "2021-05-29", status: "active", workplace: "Paramus", initials: "FH" },
  { id: "EMP-013", first: "Chris", last: "Nolan", role: "Equipment Operator", rate: 26.75, hire: "2023-01-09", status: "active", workplace: "Newark", initials: "CN" },
  { id: "EMP-014", first: "Rashad", last: "Wells", role: "Carpenter", rate: 28.75, hire: "2024-03-03", status: "active", workplace: "Fort Lee", initials: "RW" },
  { id: "EMP-015", first: "Olivia", last: "Santos", role: "Foreman", rate: 39.5, hire: "2018-06-25", status: "active", workplace: "Newark", initials: "OS" },
  { id: "EMP-016", first: "Ben", last: "Turner", role: "Laborer", rate: 22, hire: "2025-01-20", status: "active", workplace: "Paramus", initials: "BT" },
  { id: "EMP-017", first: "Hana", last: "Park", role: "Carpenter", rate: 29, hire: "2022-11-11", status: "active", workplace: "Paramus", initials: "HP" },
  { id: "EMP-018", first: "Luis", last: "Mendez", role: "Laborer", rate: 21.75, hire: "2025-04-08", status: "on_leave", workplace: "Newark", initials: "LM" },
  { id: "EMP-019", first: "Nora", last: "Quinn", role: "Office Manager", rate: 38, hire: "2017-09-01", status: "active", workplace: "Fort Lee", initials: "NQ" },
  { id: "EMP-020", first: "James", last: "Palisade", role: "Owner", rate: 0, hire: "2014-02-01", status: "active", workplace: "Fort Lee", initials: "JP" },
];

export const EXCEPTIONS: Exception[] = [
  {
    id: "EX-001",
    employeeId: "EMP-001",
    sourceId: "PUNCH-001-SAT",
    kind: "overtime",
    earningType: "OT",
    currentValue: 8.5,
    baselineValue: 6,
    baselineWindow: "12-week trailing average",
    suggestedValue: 8,
    dollarEmployer: -136.13,
    dollarEmployee: -88.5,
    explanation:
      "Maria's overtime is 42% above her 12-week baseline. The Saturday shift looks like a clock-out miss against the posted schedule. Approve a correction to 8.0 hours regular, or keep as-is and note the reason.",
    recommended: "Correct Saturday to 8.0 hours regular, or keep and note.",
    createdAt: "2026-08-23T18:12:00-04:00",
  },
  {
    id: "EX-002",
    employeeId: "EMP-002",
    sourceId: "PUNCH-002-0813",
    kind: "missing_punch",
    earningType: "REG",
    currentValue: 0,
    baselineValue: 8.25,
    baselineWindow: "role on file, typical weekday",
    suggestedValue: null,
    dollarEmployer: 0,
    dollarEmployee: 0,
    explanation:
      "Deshawn clocked in at 7:00 AM with no clock-out recorded. Hours for this day cannot be calculated. Enter the missing clock-out time or confirm the shift length.",
    recommended: "Enter the missing clock-out or confirm shift length.",
    createdAt: "2026-08-13T18:00:00-04:00",
  },
  {
    id: "EX-003",
    employeeId: "EMP-003",
    sourceId: "PUNCH-003-0818",
    kind: "rate_mismatch",
    earningType: "REG",
    currentValue: 39.5,
    baselineValue: 17.25,
    baselineWindow: "role on file",
    suggestedValue: 17.25,
    dollarEmployer: -175.5,
    dollarEmployee: -175.5,
    explanation:
      "Kevin is logged as Foreman for his Aug 18 shift, but his role on file is Apprentice Laborer. Paying the Foreman rate would add $175.50 to this run. Confirm a temporary rate change or correct the job code.",
    recommended: "Correct job code to Apprentice Laborer, or confirm a temp rate.",
    createdAt: "2026-08-18T16:40:00-04:00",
  },
  {
    id: "EX-004",
    employeeId: "EMP-004",
    sourceId: "PUNCH-004-0820",
    kind: "overlap",
    earningType: "REG",
    currentValue: 12.5,
    baselineValue: 8.5,
    baselineWindow: "posted schedule",
    suggestedValue: 8.5,
    dollarEmployer: -144,
    dollarEmployee: -144,
    explanation:
      "Priya has two overlapping time entries on Aug 20 (7:00 AM–3:30 PM and 12:00 PM–4:00 PM). Paying both adds 4.0 duplicate hours. Keep the longer entry, or confirm she worked two separate assignments.",
    recommended: "Keep the longer entry, or confirm two assignments.",
    createdAt: "2026-08-20T17:05:00-04:00",
  },
  {
    id: "EX-005",
    employeeId: "EMP-005",
    sourceId: "EMP-005-RATE",
    kind: "min_wage",
    earningType: "REG",
    currentValue: 14.75,
    baselineValue: 15.49,
    baselineWindow: "statutory minimum wage 2026 (N.J.S.A. 34:11-56a4)",
    suggestedValue: 15.49,
    dollarEmployer: 59.2,
    dollarEmployee: 59.2,
    explanation:
      "Tyler's pay rate ($14.75/hr) is below the 2026 New Jersey minimum wage ($15.49/hr). This affects every pay period until corrected. Approve a rate increase to at least $15.49/hr now.",
    recommended: "Raise rate to $15.49/hr now, or on the statutory date.",
    createdAt: "2026-08-10T08:00:00-04:00",
  },
];

export const SITES: Site[] = [
  { id: "SITE-FL", name: "Fort Lee Jobsite", city: "Fort Lee", state: "NJ", headcount: 11, health: 61, onFire: true, reason: "5 open exceptions this run", prevailingWage: false },
  { id: "SITE-NK", name: "Newark Yard", city: "Newark", state: "NJ", headcount: 5, health: 84, onFire: false, prevailingWage: true },
  { id: "SITE-PA", name: "Paramus Fit-out", city: "Paramus", state: "NJ", headcount: 4, health: 78, onFire: false, prevailingWage: false },
];

export const CREDITS: Credit[] = [
  { id: "CR-001", type: "NJ hiring credit", employee: "Tyler Brooks", status: "identified", estimated: 4000, recovered: 0, note: "New apprentice hire after May 2026. Packet ready for counsel." },
  { id: "CR-002", type: "NJ apprenticeship", employee: "Kevin O'Malley", status: "documented", estimated: 4200, recovered: 0, note: "Registered apprenticeship hours documented against NJDOL program." },
  { id: "CR-003", type: "R&D payroll offset", status: "identified", estimated: 6100, recovered: 0, note: "Qualified small-business payroll-tax offset on field engineering." },
  { id: "CR-004", type: "WOTC (contingent)", employee: "Ben Turner", status: "contingent", estimated: 2400, recovered: 0, note: "Federal WOTC lapsed for new hires after 2025-12-31. Do not model revenue on this row." },
  { id: "CR-005", type: "NJ training", status: "filed", estimated: 1800, recovered: 0, note: "Filed 2026-07-12. Awaiting NJDOL acknowledgement." },
];

export const PAYROLLS = [
  { date: "2026-08-28", label: "This cycle", amount: 87420, status: "previewed" as const, note: "5 exceptions still open" },
  { date: "2026-09-11", label: "Next", amount: 91200, status: "forecast" as const, note: "Includes Labor Day OT pattern" },
  { date: "2026-09-25", label: "Following", amount: 88100, status: "forecast" as const, note: "Seasonal dip after pour" },
];

export const HEALTH = {
  score: 73,
  asOf: "2026-08-23",
  components: [
    { key: "turnover", label: "Turnover risk", value: 62, note: "2 exits in 90 days; 1 more flagged" },
    { key: "schedule", label: "Schedule instability", value: 71, note: "Saturday add-ons at Fort Lee" },
    { key: "absenteeism", label: "Absenteeism", value: 81, note: "Luis on leave; otherwise clean" },
    { key: "pay", label: "Pay anomalies", value: 54, note: "5 planted exceptions this run" },
    { key: "ot", label: "Overtime load", value: 68, note: "Maria 42% above 12-week baseline" },
    { key: "comp", label: "Comp vs metro", value: 79, note: "Trades at or above Bergen County" },
    { key: "ewa", label: "EWA stress", value: 86, note: "Low take-up; pool healthy" },
    { key: "span", label: "Span of control", value: 74, note: "Two foremen / 16 field" },
  ],
};

export const FORECAST = [
  { type: "Last payroll", asOf: "2026-08-09", horizon: "2026-08-14", forecast: 85100, actual: 86220, reason: "Unscheduled Saturday at Fort Lee" },
  { type: "Next payroll", asOf: "2026-08-23", horizon: "2026-08-28", forecast: 87420, actual: null as number | null, reason: "Open exceptions can swing ±$515" },
  { type: "Quarterly tax", asOf: "2026-08-23", horizon: "2026-09-15", forecast: 38400, actual: null as number | null, reason: "Federal 941 + NJ UI + withholding" },
  { type: "Annual labor", asOf: "2026-08-23", horizon: "2026-12-31", forecast: 2_284_000, actual: null as number | null, reason: "Current headcount, no new hires" },
];

export const HIRE_SCENARIO = {
  role: "3 additional technicians",
  site: "Edison (proposed)",
  annual: 247000,
  note: "Fully loaded: OT pattern + healthcare take-up.",
};

export const RULES = [
  { id: "nj-construction-min-wage-2026", category: "minimum_wage", state: "NJ", vertical: "construction", status: "active", counsel: false, text: "Hourly base_rate ≥ $15.49 (NJ general minimum, 2026). Fires on employment_period load — Tyler Brooks is the fixture." },
  { id: "nj-construction-overtime", category: "overtime", state: "NJ", vertical: "construction", status: "active", counsel: false, text: "1.5× after 40 hours in a workweek. NJ has no daily OT on top of FLSA weekly." },
  { id: "nj-earned-sick-leave", category: "paid_leave", state: "NJ", vertical: "construction", status: "active", counsel: false, text: "1 hour accrued per 30 worked, 40-hour annual cap." },
  { id: "nj-prevailing-wage", category: "prevailing_wage", state: "NJ", vertical: "construction", status: "active", counsel: false, text: "Public-works sites flagged is_prevailing_wage_site require NJDOL craft/county determination — Newark Yard is marked." },
  { id: "nj-posted-notice", category: "posted_notice", state: "NJ", vertical: "construction", status: "placeholder", counsel: false, text: "Placeholder. Coverage map is honest: this category is not yet enumerated rule-by-rule." },
];

export const PUNCHES: Punch[] = [
  { id: "p1a", employeeId: "EMP-001", date: "2026-08-10", in: "07:00", out: "15:30", hours: 8.5, job: "Carpenter" },
  { id: "p1b", employeeId: "EMP-001", date: "2026-08-11", in: "07:00", out: "15:30", hours: 8.5, job: "Carpenter" },
  { id: "p1c", employeeId: "EMP-001", date: "2026-08-12", in: "07:00", out: "15:00", hours: 8, job: "Carpenter" },
  { id: "p1d", employeeId: "EMP-001", date: "2026-08-13", in: "07:00", out: "15:30", hours: 8.5, job: "Carpenter" },
  { id: "p1e", employeeId: "EMP-001", date: "2026-08-14", in: "07:00", out: "15:00", hours: 8, job: "Carpenter" },
  { id: "p1", employeeId: "EMP-001", date: "2026-08-15", in: "07:00", out: "15:30", hours: 8.5, job: "Carpenter", flag: "Unscheduled Saturday" },
  { id: "p1f", employeeId: "EMP-001", date: "2026-08-17", in: "07:00", out: "15:30", hours: 8.5, job: "Carpenter" },
  { id: "p1g", employeeId: "EMP-001", date: "2026-08-18", in: "07:00", out: "15:00", hours: 8, job: "Carpenter" },
  { id: "p1h", employeeId: "EMP-001", date: "2026-08-19", in: "07:00", out: "15:30", hours: 8.5, job: "Carpenter" },
  { id: "p1i", employeeId: "EMP-001", date: "2026-08-20", in: "07:00", out: "15:00", hours: 8, job: "Carpenter" },
  { id: "p5", employeeId: "EMP-001", date: "2026-08-21", in: "07:00", out: "15:00", hours: 8, job: "Carpenter" },
  { id: "p2", employeeId: "EMP-002", date: "2026-08-13", in: "07:00", out: null, hours: null, job: "Laborer", flag: "Missing clock-out" },
  { id: "p3", employeeId: "EMP-003", date: "2026-08-18", in: "07:00", out: "14:45", hours: 7.75, job: "Foreman", flag: "Job code ≠ role on file" },
  { id: "p4a", employeeId: "EMP-004", date: "2026-08-20", in: "07:00", out: "15:30", hours: 8.5, job: "Electrician", flag: "Overlap A" },
  { id: "p4b", employeeId: "EMP-004", date: "2026-08-20", in: "12:00", out: "16:00", hours: 4, job: "Electrician", flag: "Overlap B" },
  { id: "p6", employeeId: "EMP-007", date: "2026-08-21", in: "06:30", out: "16:00", hours: 9.5, job: "Foreman" },
  { id: "p7", employeeId: "EMP-006", date: "2026-08-21", in: "07:00", out: "15:15", hours: 8.25, job: "Equipment Operator" },
];

export const MARIA_STUB = {
  period: "Aug 10 – Aug 23, 2026",
  payDate: "Fri, Aug 28",
  regularHours: 80,
  otHours: 8.5,
  regular: 2360,
  overtime: 376.13,
  gross: 2736.13,
  federal: 312.4,
  state: 87.2,
  fica: 209.31,
  njui: 11.4,
  net: 2115.82,
  ytdGross: 41280,
  ytdNet: 31890,
  earnedUnpaid: 846.33,
};

export const COACH = {
  title: "Withholding check",
  body: "Your federal withholding is set as Single, no extras. Based on this year's actual hours, adjusting one allowance would put about $4,200 more in your pocket this year — and you would still cover April. This is a check, not advice to under-withhold.",
};

export function emp(id: string) {
  return EMPLOYEES.find((e) => e.id === id)!;
}

export const REASON_CODES = [
  { id: "schedule_error", label: "Schedule error — correct the hours" },
  { id: "worked_as_logged", label: "Worked as logged — keep" },
  { id: "temp_rate", label: "Temporary rate / acting role" },
  { id: "duplicate_entry", label: "Duplicate entry — drop one" },
  { id: "statutory", label: "Statutory correction required" },
  { id: "needs_more", label: "Need more information" },
];

export const RUN_OT: Record<string, number> = {
  "EMP-001": 8.5,
  "EMP-007": 9.5,
  "EMP-006": 2,
};

export const RUN_REGULAR: Record<string, number> = {
  "EMP-002": 72,
  "EMP-018": 0,
  "EMP-020": 0,
};

export const RUN_TARGET = 87420;

export function buildRunLines() {
  const flagByEmp: Record<string, string> = Object.fromEntries(
    EXCEPTIONS.map((e) => [e.employeeId, e.kind]),
  );
  return EMPLOYEES.filter((e) => e.id !== "EMP-020").map((e) => {
    const regular = RUN_REGULAR[e.id] ?? (e.status === "on_leave" ? 0 : 80);
    const ot = RUN_OT[e.id] ?? 0;
    const gross = Math.round((e.rate * regular + e.rate * 1.5 * ot) * 100) / 100;
    return { employeeId: e.id, regular, ot, gross, flag: flagByEmp[e.id] ?? null };
  });
}
