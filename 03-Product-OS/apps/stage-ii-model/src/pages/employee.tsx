import { useState } from "react";
import { Link } from "react-router-dom";
import { COACH, MARIA_STUB, PUNCHES } from "@/lib/data";
import { useAether } from "@/lib/store";
import { Badge, Button, Modal, Panel, Stat } from "@/components/ui";
import { usd } from "@/lib/utils";

export function EmployeeHome() {
  const ewa = useAether((s) => s.ewaRequested);
  const request = useAether((s) => s.requestEwa);
  const [open, setOpen] = useState(false);
  const available = MARIA_STUB.earnedUnpaid - ewa;
  return (
    <div className="page">
      <header>
        <p className="kicker">Maria Delgado</p>
        <h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Payday {MARIA_STUB.payDate}</h1>
      </header>
      <div className="grid-2">
        <Panel>
          <Stat label="Earned, unpaid" value={usd(available)} hint="Available before Friday" />
          <Button style={{ marginTop: 20 }} disabled={available < 50} onClick={() => setOpen(true)}>Move $200 now</Button>
        </Panel>
        <Panel>
          <Stat label="Last stub net" value={usd(MARIA_STUB.net)} hint={MARIA_STUB.period} />
          <Link to="/employee/pay" style={{ display: "inline-block", marginTop: 20, fontSize: 14, color: "var(--accent)" }}>Open stub</Link>
        </Panel>
      </div>
      <Panel>
        <p className="kicker">Coach this week</p>
        <h2 className="serif" style={{ margin: "8px 0 0", fontSize: 24 }}>{COACH.title}</h2>
        <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>{COACH.body}</p>
      </Panel>
      <Modal open={open} onClose={() => setOpen(false)} title="Move $200">
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>Instant to your debit. Flat $1.99, absorbed by Palisade. Earned wages, not a loan. Remaining {usd(available - 200)}.</p>
        <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
          <Button onClick={() => { request(ewa + 200); setOpen(false); }}>Confirm transfer</Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}

export function EmployeePay() {
  const rows: [string, number][] = [
    ["Regular 80.00h × $29.50", MARIA_STUB.regular],
    ["Overtime 8.50h × $44.25", MARIA_STUB.overtime],
    ["Gross", MARIA_STUB.gross],
    ["Federal withholding", -MARIA_STUB.federal],
    ["NJ withholding", -MARIA_STUB.state],
    ["FICA", -MARIA_STUB.fica],
    ["NJ UI", -MARIA_STUB.njui],
    ["Net", MARIA_STUB.net],
  ];
  return (
    <div className="page">
      <header><p className="kicker">Pay stub</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>{MARIA_STUB.period}</h1></header>
      <Panel>
        <Stat label="Take home" value={usd(MARIA_STUB.net)} hint={`YTD net ${usd(MARIA_STUB.ytdNet)}`} />
        <ul style={{ listStyle: "none", margin: "24px 0 0", padding: 0 }}>
          {rows.map(([k, v]) => (
            <li key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--border)", fontSize: 14 }}>
              <span className={k === "Net" || k === "Gross" ? "" : "muted"}>{k}</span>
              <span className="tabular">{usd(v)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export function EmployeeTime() {
  const mine = PUNCHES.filter((p) => p.employeeId === "EMP-001");
  return (
    <div className="page">
      <header><p className="kicker">Time</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Your punches</h1></header>
      <Panel style={{ padding: 0 }}>
        {mine.map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
            <span>{p.date}</span>
            <span className="tabular muted">{p.in}–{p.out ?? "—"}</span>
            <span className="tabular">{p.hours ?? "—"}h</span>
            {p.flag ? <Badge tone="ember">{p.flag}</Badge> : <span />}
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function EmployeeCoach() {
  return (
    <div className="page">
      <header><p className="kicker">Wellness</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Coach</h1></header>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>{COACH.title}</h2>
        <p style={{ marginTop: 12, lineHeight: 1.6 }}>{COACH.body}</p>
      </Panel>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>Cash calendar</h2>
        <p className="muted" style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>Friday Aug 28 is payday. Rent is the 1st. Earned-wage access is wages you already worked, not a payday loan.</p>
      </Panel>
    </div>
  );
}
