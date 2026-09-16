import { useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { create } from "zustand";
import {
  AlertTriangle, Banknote, Bell, Landmark, LayoutDashboard, Menu, Scale,
  Settings, Stamp, Timer, Umbrella, Users, Wallet, X,
} from "lucide-react";

const NJ_MIN = 15.49;
type Decision = "pending" | "approved" | "rejected" | "noted_no_change";

function money(n: number) {
  const v = Math.abs(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
  return n < 0 ? `−${v}` : v;
}
function cn(...xs: Array<string | false | undefined>) { return xs.filter(Boolean).join(" "); }
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `sha256:${(h >>> 0).toString(16).padStart(8, "0")}`;
}

interface Emp { id: string; first: string; last: string; role: string; rate: number; site: string; office?: boolean; hue: number; entity: string; ref: string; status: "active" | "terminated"; }
interface Ex {
  id: string; empId: string; runId: string; category: string; plain: string; action: string;
  current: number; baseline: number; window: string; suggested?: number; impact: number;
  decision: Decision; hash: string;
}

const CRAFT: Record<string, number> = { Carpenter: 48.53, Laborer: 38.2, "Apprentice Laborer": 26.74, Electrician: 58.9, "Equipment Operator": 52.1, Foreman: 53.38 };

function seedEmps(): Emp[] {
  const p = (id: string, first: string, last: string, role: string, rate: number, site: string, extra?: Partial<Emp>): Emp =>
    ({ id, first, last, role, rate, site, entity: extra?.entity ?? "palisade", ref: extra?.ref ?? id.replace("emp_", "EMP-"), status: "active", hue: first.charCodeAt(0) * 17 % 360, office: extra?.office, ...extra });
  return [
    p("emp_maria", "Maria", "Delgado", "Carpenter", 29.5, "fortlee", { ref: "EMP-001" }),
    p("emp_deshawn", "Deshawn", "Carter", "Laborer", 23, "fortlee", { ref: "EMP-002" }),
    p("emp_kevin", "Kevin", "O'Malley", "Apprentice Laborer", 17.25, "fortlee", { ref: "EMP-003" }),
    p("emp_priya", "Priya", "Nair", "Electrician", 36, "fortlee", { ref: "EMP-004" }),
    p("emp_tyler", "Tyler", "Brooks", "Apprentice Laborer", 14.75, "fortlee", { ref: "EMP-005" }),
    p("emp_marcus", "Marcus", "Webb", "Carpenter", 30.25, "newark", { ref: "EMP-008" }),
    p("emp_jordan", "Jordan", "Pierce", "Laborer", 22.5, "newark", { ref: "EMP-011" }),
    p("emp_olivia", "Olivia", "Santos", "Foreman", 39.5, "newark", { ref: "EMP-015" }),
    p("emp_dana", "Dana", "Chen", "Office Manager", 78000, "fortlee", { office: true, ref: "EMP-100" }),
    p("emp_robert", "Robert", "Palisade", "Owner", 165000, "fortlee", { office: true, ref: "EMP-101" }),
    p("emp_nkechi", "Nkechi", "Okoro", "Home Health Aide", 19.25, "jc", { entity: "harbor", ref: "HC-001" }),
    p("emp_sofia", "Sofia", "Ramirez", "Home Health Aide", 18.5, "jc", { entity: "harbor", ref: "HC-002" }),
  ];
}

function detect(emps: Emp[], wd: boolean, entity: string): Ex[] {
  const runId = entity === "harbor" ? "run_harbor" : "run_palisade";
  const crew = emps.filter((e) => e.entity === entity && e.status === "active");
  const out: Ex[] = [];
  const push = (x: Omit<Ex, "runId" | "decision" | "hash">) =>
    out.push({ ...x, runId, decision: "pending", hash: hash(x.id) });
  for (const e of crew) {
    if (!e.office && e.rate < NJ_MIN) {
      push({ id: `ex_${e.id}_min`, empId: e.id, category: "minimum_wage", current: e.rate, baseline: NJ_MIN, window: "statutory minimum wage 2026", suggested: NJ_MIN, impact: Math.round((NJ_MIN - e.rate) * 80 * 100) / 100, plain: `${e.first}'s pay rate ($${e.rate.toFixed(2)}/hr) is below the 2026 New Jersey minimum wage ($${NJ_MIN.toFixed(2)}/hr). This affects every pay period until corrected.`, action: `Approve a rate increase to at least $${NJ_MIN.toFixed(2)}/hr now.` });
    }
    if (e.site === "newark" && wd && (CRAFT[e.role] ?? 40) > e.rate + 0.01) {
      const req = CRAFT[e.role] ?? 40;
      push({ id: `ex_${e.id}_pw`, empId: e.id, category: "prevailing_wage", current: e.rate, baseline: req, window: "Essex County prevailing wage", suggested: req, impact: Math.round((req - e.rate) * 57 * 100) / 100, plain: `${e.first} is paid $${e.rate.toFixed(2)}/hr as ${e.role} on a prevailing-wage site. The determination lists $${req.toFixed(2)}/hr.`, action: `Approve lifting the rate to $${req.toFixed(2)}.` });
    }
  }
  if (entity === "palisade") {
    push({ id: "ex_maria_ot", empId: "emp_maria", category: "overtime", current: 14.5, baseline: 10.2, window: "12-week trailing average", suggested: 8, impact: -146.25, plain: "Maria's overtime is 42% above her 12-week baseline. The Saturday shift looks like a clock-out miss against the posted schedule.", action: "Approve a correction to 8.0 hours regular, or keep as-is and note the reason." });
    push({ id: "ex_deshawn_clock", empId: "emp_deshawn", category: "clock", current: 0, baseline: 8, window: "posted shift length", impact: 0, plain: "Deshawn clocked in at 7:00 AM with no clock-out recorded. Hours for this day cannot be calculated.", action: "Enter the missing clock-out time or confirm the shift length." });
    push({ id: "ex_kevin_rate", empId: "emp_kevin", category: "rate", current: 41, baseline: 17.25, window: "role on file", suggested: 17.25, impact: 184.06, plain: "Kevin is logged as Foreman for the 2026-09-11 shift, but their role on file is Apprentice Laborer. Paying the Foreman rate would add $184.06 to this run.", action: "Confirm a temporary rate change or correct the job code." });
    push({ id: "ex_priya_ov", empId: "emp_priya", category: "overlap", current: 11.75, baseline: 8.25, window: "non-overlapping clock time", suggested: 8.25, impact: -108, plain: "Priya has two overlapping time entries on 2026-09-10. Paying both adds 3.0 duplicate hours.", action: "Keep the longer entry, or confirm they worked two separate assignments." });
  }
  if (entity === "harbor") {
    push({ id: "ex_nkechi_travel", empId: "emp_nkechi", category: "travel", current: 0, baseline: 1.1, window: "travel time between clients", suggested: 1.1, impact: 21.18, plain: "Nkechi logged 1.10 hours of travel between clients this period. Those hours are currently unpaid.", action: "Approve paying travel at the regular rate." });
  }
  return out;
}

type Leave = { id: string; empId: string; status: "pending" | "approved" | "denied"; note: string };
interface S {
  entity: "palisade" | "harbor";
  viewEmp: string;
  emps: Emp[];
  exceptions: Ex[];
  wd: boolean;
  runStatus: "draft" | "previewed" | "paid";
  leave: Leave[];
  clocked: string[];
  setEntity: (e: "palisade" | "harbor") => void;
  setView: (id: string) => void;
  decide: (id: string, d: Decision) => void;
  preview: () => void;
  approve: () => void;
  attachWd: () => void;
  decideLeave: (id: string, st: "approved" | "denied") => void;
  clock: (id: string) => void;
  hire: (first: string, last: string, role: string, rate: number) => void;
  setRate: (id: string, rate: number) => void;
  reset: () => void;
}

function boot(): Pick<S, "entity" | "viewEmp" | "emps" | "exceptions" | "wd" | "runStatus" | "leave" | "clocked"> {
  const emps = seedEmps();
  return {
    entity: "palisade", viewEmp: "emp_maria", emps, wd: false, runStatus: "draft", clocked: [],
    exceptions: [...detect(emps, false, "palisade"), ...detect(emps, false, "harbor")],
    leave: [{ id: "lv1", empId: "emp_deshawn", status: "pending", note: "Sick · Sep 16 · 8h · NJ earned sick leave" }],
  };
}

const useA = create<S>()((set, get) => ({
  ...boot(),
  setEntity: (entity) => set({ entity }),
  setView: (viewEmp) => set({ viewEmp }),
  decide: (id, d) => {
    const s = get();
    const ex = s.exceptions.find((e) => e.id === id);
    if (!ex) return;
    let emps = s.emps;
    if (d === "approved" && ex.suggested && (ex.category === "minimum_wage" || ex.category === "prevailing_wage")) {
      emps = emps.map((e) => e.id === ex.empId ? { ...e, rate: ex.suggested! } : e);
    }
    const exceptions = s.exceptions.map((e) => e.id === id ? { ...e, decision: d } : e);
    set({ emps, exceptions });
  },
  preview: () => set({ runStatus: "previewed" }),
  approve: () => {
    const s = get();
    if (s.exceptions.some((e) => e.decision === "pending" && ((s.entity === "palisade" && e.runId === "run_palisade") || (s.entity === "harbor" && e.runId === "run_harbor")))) return;
    set({ runStatus: "paid" });
  },
  attachWd: () => {
    const s = get();
    const exceptions = [
      ...s.exceptions.filter((e) => e.category !== "prevailing_wage"),
      ...detect(s.emps, true, "palisade").filter((e) => e.category === "prevailing_wage"),
    ];
    set({ wd: true, exceptions });
  },
  decideLeave: (id, st) => set((s) => ({ leave: s.leave.map((l) => l.id === id ? { ...l, status: st } : l) })),
  clock: (id) => set((s) => ({ clocked: s.clocked.includes(id) ? s.clocked.filter((x) => x !== id) : [...s.clocked, id] })),
  hire: (first, last, role, rate) => {
    const s = get();
    const id = `emp_${Date.now()}`;
    const emps = [...s.emps, { id, first, last, role, rate, site: "fortlee", entity: s.entity, ref: "EMP-NEW", status: "active" as const, hue: first.charCodeAt(0) * 13 % 360 }];
    set({ emps, exceptions: [...s.exceptions.filter((e) => e.runId !== (s.entity === "harbor" ? "run_harbor" : "run_palisade")), ...detect(emps, s.wd, s.entity)] });
  },
  setRate: (id, rate) => {
    const s = get();
    const emps = s.emps.map((e) => e.id === id ? { ...e, rate } : e);
    set({ emps, exceptions: [...s.exceptions.filter((e) => e.empId !== id || e.decision !== "pending"), ...detect(emps, s.wd, s.entity).filter((e) => e.empId === id)] });
  },
  reset: () => set(boot()),
}));
