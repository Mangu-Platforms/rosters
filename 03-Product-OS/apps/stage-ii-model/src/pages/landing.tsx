import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/data";
import { useAether } from "@/lib/store";

export function Landing() {
  const setRole = useAether((s) => s.setRole);
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--fg)" }}>
      <header style={{ maxWidth: 1152, margin: "0 auto", display: "flex", justifyContent: "space-between", padding: "24px 20px" }}>
        <span className="serif" style={{ fontSize: 20 }}>Aether</span>
        <Link to="/briefing" className="kicker muted">War Room</Link>
      </header>
      <main style={{ maxWidth: 1152, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p className="kicker" style={{ letterSpacing: "0.22em" }}>Autonomous workforce operations</p>
        <h1 className="serif" style={{ margin: "16px 0 0", fontSize: "clamp(40px, 8vw, 72px)", lineHeight: 1.05, fontWeight: 400 }}>
          Payroll that<br /><em>runs itself.</em>
        </h1>
        <p className="muted" style={{ marginTop: 24, maxWidth: 520, fontSize: 18, lineHeight: 1.6 }}>
          Not another engine. A copilot that speaks English, a tax engine that pays for the seat, and a human gate on every dollar. This is the live model of Palisade Builders — 20 people, five planted errors, one pay period.
        </p>
        <div className="grid-3" style={{ marginTop: 48 }}>
          <Door to="/ceo" kicker="Owner" title="See the score" copy="Health, next three payrolls, credits in flight, sites on fire. No timesheet grid." onEnter={() => setRole("ceo")} />
          <Door to="/operator" kicker="Office manager" title="Clear the queue" copy="Five exceptions. Approve, reject, or note a reason. Then lock the run." onEnter={() => setRole("operator")} />
          <Door to="/employee" kicker="Field" title="Take home" copy="Maria's stub, earned-but-unpaid balance, and this week's coach card." onEnter={() => setRole("employee")} />
        </div>
        <dl style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, borderTop: "1px solid var(--border)", paddingTop: 32 }}>
          <div><dt className="kicker">Company</dt><dd style={{ margin: "4px 0 0", fontSize: 14 }}>{COMPANY.dba}</dd></div>
          <div><dt className="kicker">Vertical</dt><dd style={{ margin: "4px 0 0", fontSize: 14 }}>NJ construction</dd></div>
          <div><dt className="kicker">Period</dt><dd style={{ margin: "4px 0 0", fontSize: 14 }}>Aug 10–23</dd></div>
          <div><dt className="kicker">Open exceptions</dt><dd style={{ margin: "4px 0 0", fontSize: 14 }}>5</dd></div>
        </dl>
      </main>
    </div>
  );
}

function Door({ to, kicker, title, copy, onEnter }: { to: string; kicker: string; title: string; copy: string; onEnter: () => void }) {
  return (
    <Link to={to} onClick={onEnter} className="panel" style={{ display: "flex", flexDirection: "column", padding: 20 }}>
      <span className="kicker">{kicker}</span>
      <span className="serif" style={{ marginTop: 12, fontSize: 24 }}>{title}</span>
      <span className="muted" style={{ marginTop: 8, flex: 1, fontSize: 14, lineHeight: 1.55 }}>{copy}</span>
      <span style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14, color: "var(--accent)" }}>
        Enter <ArrowRight size={16} />
      </span>
    </Link>
  );
}
