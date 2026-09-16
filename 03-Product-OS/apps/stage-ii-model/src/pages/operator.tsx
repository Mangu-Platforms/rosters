import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COMPANY, CREDITS, EMPLOYEES, EXCEPTIONS, FORECAST, HIRE_SCENARIO, PUNCHES, RULES, RUN_TARGET, buildRunLines, emp } from "@/lib/data";
import { pendingCount, useAether } from "@/lib/store";
import { ExceptionQueue } from "@/components/exception-queue";
import { Badge, Button, Modal, Panel, Stat } from "@/components/ui";
import { usd } from "@/lib/utils";

export function OperatorToday() {
  const pending = pendingCount(useAether((s) => s.exceptions));
  return (
    <div className="page">
      <header>
        <p className="kicker">Today</p>
        <h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Exception queue</h1>
        <p className="muted" style={{ marginTop: 8, maxWidth: 640 }}>Tools write exceptions. You move money. Clear this queue, then lock the run.</p>
      </header>
      <div className="grid-3">
        <Panel><Stat label="Open" value={String(pending)} hint="of 5 planted errors" tone={pending ? "ember" : "ok"} /></Panel>
        <Panel><Stat label="Cash vs tax deposit" value={usd(COMPANY.cash - COMPANY.nextTax)} hint={`Next 941 on ${COMPANY.taxDate}`} /></Panel>
        <Panel><Stat label="Health" value={`${COMPANY.health}`} hint="Fort Lee is on fire" tone="warn" /></Panel>
      </div>
      {pending === 0 ? (
        <Panel>
          <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>Lock the run.</h2>
          <p className="muted" style={{ marginTop: 8 }}>Queue is clear.</p>
          <Link to="/operator/run" className="btn btn-primary" style={{ marginTop: 16 }}>Preview pay run</Link>
        </Panel>
      ) : null}
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>This cycle</h2>
          <Link to="/operator/run" style={{ fontSize: 14, color: "var(--accent)" }}>Preview pay run</Link>
        </div>
        <ExceptionQueue />
      </Panel>
    </div>
  );
}

export function OperatorRun() {
  const pending = pendingCount(useAether((s) => s.exceptions));
  const payRun = useAether((s) => s.payRun);
  const setPayRun = useAether((s) => s.setPayRun);
  const [lockOpen, setLockOpen] = useState(false);
  const lines = useMemo(() => buildRunLines(), []);
  const wages = lines.reduce((a, l) => a + l.gross, 0);
  return (
    <div className="page">
      <header style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p className="kicker">Pay run</p>
          <h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Aug 10 – 23</h1>
          <p className="muted">Pay date {COMPANY.period.payDate}</p>
        </div>
        <Badge tone={payRun === "approved" ? "ok" : "warn"}>{payRun}</Badge>
      </header>
      <div className="grid-3">
        <Panel><Stat label="This run" value={usd(RUN_TARGET)} hint={`Wages ${usd(wages)}`} /></Panel>
        <Panel><Stat label="Headcount" value={String(EMPLOYEES.filter((e) => e.status === "active").length)} hint="1 on leave" /></Panel>
        <Panel><Stat label="Gate" value={pending ? `${pending} open` : "Clear"} tone={pending ? "ember" : "ok"} /></Panel>
      </div>
      <Panel style={{ padding: 0, overflowX: "auto" }}>
        <table className="sheet">
          <thead><tr><th>Person</th><th>Reg</th><th>OT</th><th>Gross</th><th></th></tr></thead>
          <tbody>
            {lines.map((l) => {
              const person = emp(l.employeeId);
              return (
                <tr key={l.employeeId}>
                  <td>{person.first} {person.last}</td>
                  <td className="tabular">{l.regular || "—"}</td>
                  <td className="tabular">{l.ot || "—"}</td>
                  <td className="tabular">{usd(l.gross)}</td>
                  <td>{l.flag ? <Badge tone="ember">{l.flag.replace("_", " ")}</Badge> : person.status === "on_leave" ? <Badge>On leave</Badge> : null}</td>
                </tr>
              );
            })}
            <tr><td colSpan={3}>Employer burden (FICA, NJ UI, WC, health)</td><td className="tabular" colSpan={2}>{usd(Math.max(0, RUN_TARGET - wages))}</td></tr>
          </tbody>
        </table>
      </Panel>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>Human gate</h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Dual control. Nothing files and nothing ACHs.</p>
        <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
          <Button disabled={pending > 0 || payRun === "approved"} onClick={() => setLockOpen(true)}>{payRun === "approved" ? "Locked" : "Lock and preview"}</Button>
          <Button variant="outline" disabled={payRun !== "approved"}>Hand to rail</Button>
        </div>
      </Panel>
      <Modal open={lockOpen} onClose={() => setLockOpen(false)} title="Lock this run?">
        <p className="muted" style={{ fontSize: 14 }}>Names Nora Quinn as approver. Does not move dollars.</p>
        <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
          <Button onClick={() => { setPayRun("approved"); setLockOpen(false); }}>Lock run</Button>
          <Button variant="ghost" onClick={() => setLockOpen(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}

export function OperatorCrew() {
  const flagged = new Set(EXCEPTIONS.map((e) => e.employeeId));
  return (
    <div className="page">
      <header><p className="kicker">Control plane</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Crew</h1></header>
      <Panel style={{ padding: 0, overflowX: "auto" }}>
        <table className="sheet">
          <thead><tr><th>Person</th><th>Role</th><th>Site</th><th>Rate</th><th></th></tr></thead>
          <tbody>
            {EMPLOYEES.map((e) => (
              <tr key={e.id}>
                <td>{e.first} {e.last}</td>
                <td className="muted">{e.role}</td>
                <td className="muted">{e.workplace}</td>
                <td className="tabular">{e.rate ? usd(e.rate) : "—"}</td>
                <td>{flagged.has(e.id) ? <Badge tone="ember">Exception</Badge> : e.status === "on_leave" ? <Badge>Leave</Badge> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export function OperatorTime() {
  return (
    <div className="page">
      <header><p className="kicker">Time</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Punches</h1></header>
      <Panel style={{ padding: 0, overflowX: "auto" }}>
        <table className="sheet">
          <thead><tr><th>Date</th><th>Person</th><th>In</th><th>Out</th><th>Hours</th><th>Flag</th></tr></thead>
          <tbody>
            {PUNCHES.map((p) => {
              const person = emp(p.employeeId);
              return (
                <tr key={p.id}>
                  <td className="tabular">{p.date.slice(5)}</td>
                  <td>{person.first} {person.last}</td>
                  <td className="tabular">{p.in ?? "—"}</td>
                  <td className="tabular">{p.out ?? "—"}</td>
                  <td className="tabular">{p.hours ?? "—"}</td>
                  <td>{p.flag ? <Badge tone="ember">{p.flag}</Badge> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export function OperatorCompliance() {
  return (
    <div className="page">
      <header><p className="kicker">Law as data</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>NJ construction pack</h1></header>
      {RULES.map((r) => (
        <Panel key={r.id}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge tone={r.status === "placeholder" ? "warn" : "accent"}>{r.category.replace("_", " ")}</Badge>
            {!r.counsel ? <Badge tone="ember">Needs counsel</Badge> : <Badge tone="ok">Counsel signed</Badge>}
          </div>
          <p style={{ marginTop: 8, lineHeight: 1.55 }}>{r.text}</p>
        </Panel>
      ))}
    </div>
  );
}

export function OperatorCredits() {
  const live = CREDITS.filter((c) => c.status !== "contingent");
  return (
    <div className="page">
      <header><p className="kicker">Tax engine</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Credits in flight</h1></header>
      <Panel><Stat label="Current-law inventory" value={usd(live.reduce((a, c) => a + c.estimated, 0))} /></Panel>
      {CREDITS.map((c) => (
        <Panel key={c.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 className="serif" style={{ margin: 0, fontSize: 20 }}>{c.type}</h2>
            <Badge tone={c.status === "contingent" ? "warn" : "ok"}>{c.status}</Badge>
          </div>
          <p className="tabular">{usd(c.estimated)}</p>
          <p className="muted" style={{ fontSize: 14 }}>{c.note}</p>
        </Panel>
      ))}
    </div>
  );
}

export function OperatorForecast() {
  return (
    <div className="page">
      <header><p className="kicker">Labor cost</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Forecast</h1></header>
      <div className="grid-2">
        {FORECAST.map((f) => <Panel key={f.type}><Stat label={f.type} value={usd(f.forecast)} hint={f.actual != null ? `Actual ${usd(f.actual)}` : f.reason} /></Panel>)}
      </div>
      <Panel>
        <p className="kicker">What-if</p>
        <p className="serif" style={{ marginTop: 12, fontSize: 24 }}>Hiring {HIRE_SCENARIO.role} adds {usd(HIRE_SCENARIO.annual)} fully loaded.</p>
      </Panel>
    </div>
  );
}

export function OperatorCash() {
  return (
    <div className="page">
      <header><p className="kicker">Treasury</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Cash and EWA</h1></header>
      <div className="grid-3">
        <Panel><Stat label="Operating cash" value={usd(COMPANY.cash)} /></Panel>
        <Panel><Stat label="Next tax deposit" value={usd(COMPANY.nextTax)} hint={COMPANY.taxDate} tone="warn" /></Panel>
        <Panel><Stat label="EWA remaining" value={usd(COMPANY.ewaCap - COMPANY.ewaOut)} /></Panel>
      </div>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>Pool rules</h2>
        <p className="muted" style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>Employer-funded. No APR. No worker debt. Underwrite the employer cash cycle, not the worker's FICO.</p>
      </Panel>
    </div>
  );
}
