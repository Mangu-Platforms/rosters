import { useState } from "react";
import { EXCEPTIONS, REASON_CODES, emp, type Decision, type Exception } from "@/lib/data";
import { useAether } from "@/lib/store";
import { Badge, Button, Modal } from "@/components/ui";
import { usd } from "@/lib/utils";

const CLOCKS = ["15:00", "15:15", "15:30", "16:00", "16:30", "17:00"];

export function ExceptionQueue() {
  const exceptions = useAether((s) => s.exceptions);
  const decide = useAether((s) => s.decide);
  const [open, setOpen] = useState<string | null>(null);
  const active = EXCEPTIONS.find((e) => e.id === open) ?? null;
  const state = open ? exceptions[open] : undefined;
  return (
    <>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {EXCEPTIONS.map((ex) => {
          const person = emp(ex.employeeId);
          const st = exceptions[ex.id]?.decision ?? "pending";
          return (
            <li key={ex.id}>
              <button type="button" onClick={() => setOpen(ex.id)} className="btn-ghost" style={{ width: "100%", height: "auto", textAlign: "left", border: "1px solid var(--border)", background: "var(--elevated)", borderRadius: 16, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <p className="muted" style={{ margin: 0, fontSize: 14 }}>{person.first} {person.last}<span className="subtle"> · {person.role}</span></p>
                    <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.4 }}>{ex.explanation}</p>
                  </div>
                  {st === "pending" ? <Badge tone="ember">Open</Badge> : st === "approved" ? <Badge tone="ok">Approved</Badge> : st === "rejected" ? <Badge tone="warn">Rejected</Badge> : <Badge>Noted</Badge>}
                </div>
                <div className="subtle" style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 12 }}>
                  <span className="tabular">Employer {usd(ex.dollarEmployer, { sign: true })}</span>
                  <span>{ex.baselineWindow}</span>
                  <span style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>{ex.kind.replace("_", " ")}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      <ExceptionModal ex={active} decision={state?.decision ?? "pending"} onClose={() => setOpen(null)} onDecide={(d, extra) => { if (!active) return; decide(active.id, d, extra); setOpen(null); }} />
    </>
  );
}

function ExceptionModal({ ex, decision, onClose, onDecide }: { ex: Exception | null; decision: Decision; onClose: () => void; onDecide: (d: Decision, extra?: { reason?: string; clockOut?: string }) => void }) {
  const [reason, setReason] = useState(REASON_CODES[0].id);
  const [clockOut, setClockOut] = useState("15:15");
  if (!ex) return null;
  const person = emp(ex.employeeId);
  return (
    <Modal open onClose={onClose} title={`${person.first} ${person.last}`}>
      <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{ex.explanation}</p>
      <dl style={{ margin: "16px 0 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14 }}>
        <div><dt className="kicker">Current</dt><dd className="tabular" style={{ margin: 0 }}>{ex.currentValue}</dd></div>
        <div><dt className="kicker">Baseline</dt><dd className="tabular" style={{ margin: 0 }}>{ex.baselineValue}</dd></div>
        <div><dt className="kicker">Employer</dt><dd className="tabular" style={{ margin: 0 }}>{usd(ex.dollarEmployer, { sign: true })}</dd></div>
        <div><dt className="kicker">Suggested</dt><dd className="tabular" style={{ margin: 0 }}>{ex.suggestedValue ?? "—"}</dd></div>
      </dl>
      {ex.kind === "missing_punch" ? (
        <label style={{ display: "block", marginTop: 16, fontSize: 14 }}>Clock-out
          <select value={clockOut} onChange={(e) => setClockOut(e.target.value)} style={{ marginTop: 6 }}>{CLOCKS.map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </label>
      ) : (
        <label style={{ display: "block", marginTop: 16, fontSize: 14 }}>Reason
          <select value={reason} onChange={(e) => setReason(e.target.value)} style={{ marginTop: 6 }}>{REASON_CODES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
        </label>
      )}
      <p className="subtle" style={{ margin: "12px 0 0", fontSize: 12 }}>{ex.recommended}</p>
      <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button variant="ok" disabled={decision !== "pending"} onClick={() => onDecide("approved", { reason, clockOut: ex.kind === "missing_punch" ? clockOut : undefined })}>Approve</Button>
        <Button variant="outline" disabled={decision !== "pending"} onClick={() => onDecide("noted_no_change", { reason })}>Keep as-is</Button>
        <Button variant="ghost" disabled={decision !== "pending"} onClick={() => onDecide("rejected", { reason })}>Reject</Button>
        <Button variant="ghost" onClick={onClose} style={{ marginLeft: "auto" }}>Close</Button>
      </div>
    </Modal>
  );
}
