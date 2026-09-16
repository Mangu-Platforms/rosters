import { useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Banknote, Bell, Landmark, LayoutDashboard, Menu, Scale, Settings, Stamp, Timer, Umbrella, Users, Wallet, X } from "lucide-react";
import { useA, NJ_MIN, money, cn, CRAFT, type Emp } from "./store";

function Mark({ className = "size-8" }: { className?: string }) {
  return <svg viewBox="0 0 32 32" className={className}><rect width="32" height="32" rx="6" fill="#191a16" /><path d="M8 22 L16 8 L24 22" fill="none" stroke="#d7d3c4" strokeWidth="2" /><circle cx="16" cy="20" r="2" fill="#d7d3c4" /></svg>;
}
function Av({ e, size = "md" }: { e: Emp; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "size-8 text-[10px]" : size === "lg" ? "size-14 text-base" : "size-10 text-xs";
  return <span className={cn("inline-flex items-center justify-center rounded-full font-medium", dim)} style={{ background: `hsl(${e.hue} 18% 28%)` }}>{e.first[0]}{e.last[0]}</span>;
}
function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl bg-surface p-5 hairline", className)}>{children}</div>;
}
function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "ok" | "warn" | "danger" | "primary" }) {
  const m = { default: "bg-elevated text-muted", ok: "bg-ok/15 text-ok", warn: "bg-warn/15 text-warn", danger: "bg-danger/15 text-danger", primary: "bg-primary/15 text-primary" };
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", m[tone])}>{children}</span>;
}
function Btn({ children, onClick, to, variant = "default", disabled }: { children: React.ReactNode; onClick?: () => void; to?: string; variant?: "default" | "secondary" | "ghost"; disabled?: boolean }) {
  const cls = cn("inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium disabled:opacity-40", variant === "default" && "bg-primary text-primary-fg", variant === "secondary" && "bg-elevated hairline", variant === "ghost" && "text-muted hover:text-fg");
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}
function Head({ k, t, d, a }: { k?: string; t: string; d?: string; a?: React.ReactNode }) {
  return <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div>{k ? <p className="mb-1 text-[11px] tracking-[0.16em] text-muted uppercase">{k}</p> : null}<h1 className="font-serif text-3xl">{t}</h1>{d ? <p className="mt-1 max-w-2xl text-sm text-muted">{d}</p> : null}</div>{a}</div>;
}
const NAV = [["/app", "Command", LayoutDashboard],["/app/exceptions", "Exceptions", AlertTriangle],["/app/payroll", "Payroll", Banknote],["/app/people", "People", Users],["/app/time", "Time", Timer],["/app/leave", "Leave", Umbrella],["/app/certified", "Certified", Stamp],["/app/credits", "Credits", Landmark],["/app/cash", "Cash", Wallet],["/app/compliance", "Compliance", Scale],["/app/inbox", "Inbox", Bell],["/app/settings", "Settings", Settings]] as const;
function rid(entity: string) { return entity === "harbor" ? "run_harbor" : "run_palisade"; }

function Shell({ children }: { children: React.ReactNode }) {
  const loc = useLocation(); const s = useA(); const [open, setOpen] = useState(false);
  const pending = s.exceptions.filter((e) => e.decision === "pending" && e.runId === rid(s.entity)).length;
  const name = s.entity === "harbor" ? "Harbor Care" : "Palisade Builders";
  const Nav = ({ onClick }: { onClick?: () => void }) => (
    <div className="flex h-full flex-col gap-2 overflow-y-auto p-3">
      <button className="flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-elevated" onClick={() => s.setEntity(s.entity === "palisade" ? "harbor" : "palisade")}><Mark /><span><span className="block text-sm">Aether</span><span className="block text-[11px] text-muted">{name} · switch</span></span></button>
      {NAV.map(([to, label, Icon]) => (
        <Link key={to} to={to} onClick={onClick} className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm", loc.pathname === to || (to !== "/app" && loc.pathname.startsWith(to)) ? "bg-elevated" : "text-muted hover:text-fg")}>
          <Icon className="size-4" /><span className="flex-1">{label}</span>{to === "/app/exceptions" && pending > 0 ? <span className="rounded-full bg-warn/20 px-2 text-[11px] text-warn">{pending}</span> : null}
        </Link>
      ))}
      <div className="mt-auto border-t border-border pt-3 text-xs text-muted"><Link to="/ceo" className="block px-3 py-1.5 hover:text-fg">Owner</Link><Link to="/me" className="block px-3 py-1.5 hover:text-fg">Employee</Link><Link to="/" className="block px-3 py-1.5 hover:text-fg">Home</Link></div>
    </div>
  );
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-border bg-surface md:flex md:flex-col"><Nav /></aside>
      <div className="md:pl-56">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-4 md:hidden"><button onClick={() => setOpen(true)}><Menu className="size-5" /></button><Mark className="size-7" /><span className="font-serif text-lg">Aether</span></header>
        {open ? <div className="fixed inset-0 z-40 md:hidden"><div className="absolute inset-0 bg-bg/70" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-72 bg-surface"><button className="absolute right-3 top-3" onClick={() => setOpen(false)}><X className="size-4" /></button><Nav onClick={() => setOpen(false)} /></div></div> : null}
        <main className="overflow-x-hidden px-4 py-6 pb-20 md:px-8">{children}</main>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><div className="flex items-center gap-2"><Mark /><span className="font-serif text-xl">Aether</span></div><Btn to="/app">Open console</Btn></header>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Workforce OS · Construction & home care</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.08] md:text-6xl">The pay run is an agent workflow. A human still gates the money.</h1>
        <p className="mt-6 max-w-xl text-muted">Rent the rail. Own the brain. Palisade’s five planted errors speak English. Models never call ACH.</p>
        <div className="mt-8 flex gap-3"><Btn to="/app">Work Palisade Builders</Btn><Btn to="/ceo" variant="secondary">Owner dashboard</Btn></div>
      </section>
    </div>
  );
}

export function App() {
  const s = useA();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ceo" element={<Ceo />} />
      <Route path="/me" element={<Me />} />
      <Route path="/app" element={<Shell><Command /></Shell>} />
      <Route path="/app/exceptions" element={<Shell><Exceptions /></Shell>} />
      <Route path="/app/exceptions/:id" element={<Shell><ExDetail /></Shell>} />
      <Route path="/app/payroll" element={<Shell><Payroll /></Shell>} />
      <Route path="/app/people" element={<Shell><People /></Shell>} />
      <Route path="/app/people/:id" element={<Shell><Person /></Shell>} />
      <Route path="/app/time" element={<Shell><Head k="Time" t="Punches" d="Missing clock-outs are exceptions, not silent zeros." /><Panel><p className="text-sm text-muted">Deshawn 11 Sep · in 7:00 · out — · flagged. Priya 10 Sep overlap flagged.</p></Panel></Shell>} />
      <Route path="/app/leave" element={<Shell><Leave /></Shell>} />
      <Route path="/app/certified" element={<Shell><Certified /></Shell>} />
      <Route path="/app/credits" element={<Shell><Credits /></Shell>} />
      <Route path="/app/cash" element={<Shell><Head k="Treasury" t="Cash" d="EWA designed, not live." /><Panel><p className="font-serif text-3xl tabular">{money(s.entity === "harbor" ? 186200 : 412400)}</p><p className="mt-2 text-sm text-muted">On hand · First National of Fort Lee · 4412</p></Panel></Shell>} />
      <Route path="/app/compliance" element={<Shell><Head k="NJ construction" t="Compliance" d="Rules are tests. Counsel still signs off." /><Panel><p className="font-serif text-lg">N.J.S.A. 34:11-56a4</p><p className="mt-2 text-sm text-muted">Hourly floor ${NJ_MIN.toFixed(2)}. Weekly OT 1.5× over 40. Sick 1h / 30h, cap 40.</p></Panel></Shell>} />
      <Route path="/app/inbox" element={<Shell><Head k="Now" t="Inbox" /><Link to="/app/exceptions" className="mb-2 block"><Panel><p>Tyler is under the NJ floor</p><p className="text-sm text-muted">$14.75 vs $15.49.</p></Panel></Link><Link to="/app/certified" className="block"><Panel><p>Newark has no wage determination</p></Panel></Link></Shell>} />
      <Route path="/app/settings" element={<Shell><Head k="Control plane" t="Settings" d="ADR 0001: Check / Zeal first." /><Panel className="mb-4"><p>{s.entity === "harbor" ? "Harbor Home Care LLC" : "Palisade Builders LLC"}</p></Panel><Btn variant="secondary" onClick={s.reset}>Reset demo</Btn></Shell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Command() {
  const s = useA();
  const pending = s.exceptions.filter((e) => e.decision === "pending" && e.runId === rid(s.entity));
  const crew = s.emps.filter((e) => e.entity === s.entity && e.status === "active" && !e.office);
  const cost = crew.reduce((n, e) => n + e.rate * 80 * 1.12, 0);
  return (
    <div>
      <Head k={s.entity === "harbor" ? "Harbor Home Care LLC" : "Palisade Builders LLC"} t="Command" d="Exception queue, cash versus the next tax deposit, sites on fire." a={<Btn to="/app/payroll">Open this run</Btn>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Panel><p className="text-[11px] uppercase text-muted">Health Score</p><p className="mt-2 font-serif text-2xl">{Math.max(40, 88 - pending.length * 4)}</p></Panel>
        <Panel><p className="text-[11px] uppercase text-muted">Open exceptions</p><p className="mt-2 font-serif text-2xl text-warn">{pending.length}</p></Panel>
        <Panel><p className="text-[11px] uppercase text-muted">This run</p><p className="mt-2 font-serif text-2xl tabular">{money(cost)}</p></Panel>
        <Panel><p className="text-[11px] uppercase text-muted">Cash on hand</p><p className="mt-2 font-serif text-2xl tabular">{money(s.entity === "harbor" ? 186200 : 412400)}</p></Panel>
      </div>
      <h2 className="mt-8 mb-3 font-serif text-xl">Exception queue</h2>
      <ul className="divide-y divide-border rounded-xl bg-surface hairline">{pending.map((ex) => { const e = s.emps.find((x) => x.id === ex.empId); return <li key={ex.id}><Link to={`/app/exceptions/${ex.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-elevated/40">{e ? <Av e={e} /> : null}<p className="flex-1 text-sm text-muted">{ex.plain}</p><Badge tone="warn">Pending</Badge></Link></li>; })}</ul>
      {s.entity === "palisade" && !s.wd ? <Panel className="mt-4"><p className="text-sm">Newark Public Works is on fire — no wage determination on file.</p><Btn to="/app/certified" variant="secondary">Open certified payroll</Btn></Panel> : null}
    </div>
  );
}

function Exceptions() {
  const s = useA();
  const list = s.exceptions.filter((e) => e.runId === rid(s.entity));
  return <div><Head k="Human gate" t="Exceptions" d="Tools write exceptions. Models never call ACH." /><ul className="space-y-2">{list.map((ex) => { const e = s.emps.find((x) => x.id === ex.empId); return <li key={ex.id}><Link to={`/app/exceptions/${ex.id}`} className="flex gap-3 rounded-xl bg-surface px-4 py-3 hairline hover:bg-elevated/40">{e ? <Av e={e} /> : null}<div className="flex-1"><p className="text-sm">{e?.first} {e?.last}</p><p className="text-sm text-muted">{ex.plain}</p></div><Badge tone={ex.decision === "pending" ? "warn" : ex.decision === "approved" ? "ok" : "default"}>{ex.decision}</Badge></Link></li>; })}</ul></div>;
}

function ExDetail() {
  const { id } = useParams(); const nav = useNavigate(); const s = useA();
  const ex = s.exceptions.find((e) => e.id === id); const emp = s.emps.find((e) => e.id === ex?.empId);
  if (!ex || !emp) return <Head t="Not found" />;
  return (
    <div className="mx-auto max-w-3xl">
      <Head k="Human gate" t={`${emp.first} ${emp.last}`} d={ex.plain} a={<Badge tone={ex.decision === "pending" ? "warn" : "ok"}>{ex.decision}</Badge>} />
      <Panel className="grid gap-3 text-sm sm:grid-cols-2">
        <div><p className="text-xs text-muted">Category</p><p>{ex.category.replace("_", " ")}</p></div>
        <div><p className="text-xs text-muted">Baseline</p><p>{ex.window}</p></div>
        <div><p className="text-xs text-muted">Current → suggested</p><p className="tabular">{ex.current} → {ex.suggested ?? "none"}</p></div>
        <div><p className="text-xs text-muted">Employer impact</p><p className="tabular">{money(ex.impact)}</p></div>
        <div className="sm:col-span-2"><p className="text-xs text-muted">Recommended</p><p>{ex.action}</p></div>
        <p className="font-mono text-[11px] text-subtle sm:col-span-2">{ex.hash}</p>
      </Panel>
      {ex.decision === "pending" ? <div className="mt-4 flex gap-2"><Btn onClick={() => { s.decide(ex.id, "approved"); nav("/app/exceptions"); }}>Approve</Btn><Btn variant="secondary" onClick={() => { s.decide(ex.id, "rejected"); nav("/app/exceptions"); }}>Reject</Btn></div> : null}
    </div>
  );
}

function Payroll() {
  const s = useA();
  const pending = s.exceptions.filter((e) => e.decision === "pending" && e.runId === rid(s.entity)).length;
  const crew = s.emps.filter((e) => e.entity === s.entity && e.status === "active");
  return (
    <div>
      <Head k="Pay run" t="7 Sep – 20 Sep 2026" d="Pay date 25 Sep. Approving instructs the rail." a={<><Badge tone={s.runStatus === "paid" ? "ok" : "primary"}>{s.runStatus}</Badge>{s.runStatus === "draft" ? <Btn variant="secondary" onClick={s.preview}>Preview</Btn> : null}{s.runStatus !== "paid" ? <Btn disabled={pending > 0} onClick={s.approve}>Approve and send to rail</Btn> : null}</>} />
      {pending > 0 ? <p className="mb-4 rounded-lg bg-warn/10 px-4 py-3 text-sm text-warn">{pending} pending exceptions. The gate stays closed.</p> : null}
      <ul className="divide-y divide-border rounded-xl bg-surface hairline">{crew.map((e) => <li key={e.id} className="flex items-center gap-3 px-4 py-3"><Av e={e} /><Link to={`/app/people/${e.id}`} className="flex-1">{e.first} {e.last}<span className="block text-xs text-muted">{e.role}</span></Link><span className="tabular text-sm">{e.office ? money(e.rate / 26) : money(e.rate * 80)}</span></li>)}</ul>
    </div>
  );
}

function People() {
  const s = useA(); const [open, setOpen] = useState(false); const [f, setF] = useState({ first: "", last: "", role: "Laborer", rate: "22" });
  const crew = s.emps.filter((e) => e.entity === s.entity);
  return (
    <div>
      <Head k="Roster" t="People" d="Rate edits re-fire the compliance engine." a={<Btn onClick={() => setOpen(true)}>Hire</Btn>} />
      <ul className="divide-y divide-border rounded-xl bg-surface hairline">{crew.map((e) => <li key={e.id}><Link to={`/app/people/${e.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-elevated/40"><Av e={e} /><span className="flex-1">{e.first} {e.last}<span className="block text-xs text-muted">{e.role} · {e.ref}</span></span><span className="tabular text-sm text-muted">{e.office ? money(e.rate) : `${money(e.rate)}/hr`}</span></Link></li>)}</ul>
      {open ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4"><form className="w-full max-w-md space-y-3 rounded-xl bg-surface p-6 hairline" onSubmit={(ev) => { ev.preventDefault(); s.hire(f.first, f.last, f.role, Number(f.rate)); setOpen(false); }}>
        <h2 className="font-serif text-xl">Hire</h2>
        <input required className="h-11 w-full rounded-md bg-elevated px-3 hairline" placeholder="First" value={f.first} onChange={(e) => setF({ ...f, first: e.target.value })} />
        <input required className="h-11 w-full rounded-md bg-elevated px-3 hairline" placeholder="Last" value={f.last} onChange={(e) => setF({ ...f, last: e.target.value })} />
        <input className="h-11 w-full rounded-md bg-elevated px-3 hairline" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} />
        <input type="number" step="0.01" className="h-11 w-full rounded-md bg-elevated px-3 hairline" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value })} />
        <div className="flex gap-2"><Btn>Save</Btn><Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn></div>
      </form></div> : null}
    </div>
  );
}

function Person() {
  const { id } = useParams(); const s = useA(); const e = s.emps.find((x) => x.id === id); const [rate, setRate] = useState(String(e?.rate ?? ""));
  if (!e) return <Head t="Not found" />;
  return <div><Head k={e.ref} t={`${e.first} ${e.last}`} d={e.role} /><div className="mb-4 flex items-center gap-3"><Av e={e} size="lg" />{!e.office && e.rate < NJ_MIN ? <p className="text-sm text-danger">Below the 2026 NJ floor of $15.49/hr.</p> : null}</div><Panel><form className="flex flex-wrap gap-2" onSubmit={(ev) => { ev.preventDefault(); s.setRate(e.id, Number(rate)); }}><input type="number" step="0.01" value={rate} onChange={(ev) => setRate(ev.target.value)} className="h-11 max-w-36 rounded-md bg-elevated px-3 hairline" /><Btn variant="secondary">Save rate</Btn></form></Panel></div>;
}

function Certified() {
  const s = useA(); const crew = s.emps.filter((e) => e.entity === "palisade" && e.site === "newark" && e.status === "active");
  return <div><Head k="WH-347" t="Certified payroll" d="Public-works hours against the determination." a={!s.wd ? <Btn onClick={s.attachWd}>Attach NJDOL packet</Btn> : <Badge tone="ok">Attached</Badge>} /><Panel><h2 className="font-serif text-xl">Newark Public Works</h2><p className="text-sm text-muted">{s.wd ? "Essex County packet attached." : "No determination on file."}</p><table className="mt-4 w-full text-left text-sm"><thead className="text-[11px] text-muted uppercase"><tr><th className="py-2">Person</th><th>Paid</th><th>Required</th><th>Delta</th></tr></thead><tbody>{crew.map((e) => { const req = CRAFT[e.role] ?? 40; return <tr key={e.id} className="border-t border-border"><td className="py-2">{e.first} {e.last}<span className="block text-xs text-muted">{e.role}</span></td><td className="tabular">{money(e.rate)}</td><td className="tabular">{money(req)}</td><td className={cn("tabular", e.rate < req && "text-danger")}>{money(req - e.rate)}</td></tr>; })}</tbody></table></Panel></div>;
}

function Leave() {
  const s = useA();
  return <div><Head k="NJ earned sick" t="Leave" d="1 hour per 30 worked, cap 40." />{s.leave.map((l) => { const e = s.emps.find((x) => x.id === l.empId); return <Panel key={l.id} className="mb-3 flex items-center justify-between gap-3"><div><p>{e?.first} {e?.last}</p><p className="text-sm text-muted">{l.note}</p></div>{l.status === "pending" ? <div className="flex gap-2"><Btn onClick={() => s.decideLeave(l.id, "approved")}>Approve</Btn><Btn variant="secondary" onClick={() => s.decideLeave(l.id, "denied")}>Deny</Btn></div> : <Badge tone={l.status === "approved" ? "ok" : "danger"}>{l.status}</Badge>}</Panel>; })}</div>;
}

function Credits() {
  return <div><Head k="Scanner" t="Tax credits" d="WOTC is contingent until Congress renews it." /><Panel className="mb-3"><p className="font-serif text-lg">NJ UEZ hiring credit</p><p className="text-sm text-muted">Tyler Brooks · missing Form NJ-3270</p><p className="tabular">{money(2500)}</p></Panel><Panel className="mb-3"><p className="font-serif text-lg">NJ apprenticeship</p><p className="text-sm text-muted">Kevin O'Malley · documented</p><p className="tabular">{money(1800)}</p></Panel><Panel><p className="font-serif text-lg">Federal WOTC — contingent</p><p className="text-sm text-muted">Lapsed for hires after 2025-12-31.</p><Badge tone="warn">Contingent</Badge></Panel></div>;
}

function Ceo() {
  const s = useA(); const pending = s.exceptions.filter((e) => e.decision === "pending" && e.runId === "run_palisade").length;
  return <div className="min-h-dvh bg-bg text-fg"><header className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5"><Mark /><div><p className="font-serif text-lg">Aether</p><p className="text-[11px] text-muted">Owner · Palisade</p></div><Btn to="/app" variant="ghost">Console</Btn></header><main className="mx-auto max-w-5xl px-5 pb-16"><p className="text-[11px] uppercase tracking-[0.18em] text-muted">No timesheet grid</p><h1 className="mt-2 font-serif text-4xl">The company, in four numbers.</h1><div className="mt-10 grid gap-4 md:grid-cols-2"><Panel><p className="text-xs text-muted">Health Score</p><p className="mt-2 font-serif text-5xl">{Math.max(40, 88 - pending * 4)}</p></Panel><Panel><p className="text-xs text-muted">Credits in flight (ex-WOTC)</p><p className="mt-2 font-serif text-5xl">{money(4300)}</p></Panel><Panel><p className="text-xs text-muted">Sites on fire</p><p className="mt-2 font-serif text-5xl">{s.wd ? 0 : 1}</p></Panel><Panel><p className="text-xs text-muted">Open exceptions</p><p className="mt-2 font-serif text-5xl">{pending}</p></Panel></div></main></div>;
}

function Me() {
  const s = useA(); const crew = s.emps.filter((e) => e.entity === s.entity && !e.office); const e = s.emps.find((x) => x.id === s.viewEmp) ?? crew[0];
  if (!e) return null; const inNow = s.clocked.includes(e.id);
  return <div className="min-h-dvh bg-bg text-fg"><div className="mx-auto max-w-md px-4 pb-16"><header className="flex items-center gap-3 py-5"><Mark className="size-8" /><select className="flex-1 bg-transparent text-sm" value={e.id} onChange={(ev) => s.setView(ev.target.value)}>{crew.map((x) => <option key={x.id} value={x.id}>{x.first} {x.last}</option>)}</select><Btn to="/app" variant="ghost">Console</Btn></header><div className="flex items-center gap-3"><Av e={e} size="lg" /><div><h1 className="font-serif text-2xl">{e.first} {e.last}</h1><p className="text-sm text-muted">{e.role}</p></div></div><Panel className="mt-8"><p className="text-[11px] uppercase text-muted">Earned, not yet paid</p><p className="mt-1 font-serif text-4xl tabular">{money(e.rate * 64 * 0.72)}</p><p className="mt-2 text-xs text-subtle">Accrued net for the open period. Not an advance.</p><div className="mt-4 rounded-lg bg-elevated px-3 py-3 text-xs text-muted">EWA is gated on an NJ counsel memo. Aether will not pretend it is live.</div></Panel><Panel className="mt-4"><h2 className="font-serif text-xl">Time clock</h2><div className="mt-3"><Btn onClick={() => s.clock(e.id)}>{inNow ? "Clock out" : "Clock in"}</Btn></div></Panel></div></div>;
}
