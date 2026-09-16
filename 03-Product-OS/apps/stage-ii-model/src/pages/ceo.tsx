import { Link } from "react-router-dom";
import { CREDITS, HEALTH, PAYROLLS, SITES } from "@/lib/data";
import { Badge, Panel, Stat } from "@/components/ui";
import { usd } from "@/lib/utils";

export function CeoHome() {
  const creditsYtd = CREDITS.filter((c) => c.status !== "contingent").reduce((a, c) => a + c.estimated, 0);
  const fire = SITES.filter((s) => s.onFire);
  return (
    <div className="page">
      <header>
        <p className="kicker">Owner</p>
        <h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Ten seconds.</h1>
        <p className="muted">Health. Next three payrolls. Credits found. Sites on fire.</p>
      </header>
      <div className="grid-4">
        <Panel><Stat label="Health Score" value={`${HEALTH.score}`} tone="warn" /></Panel>
        <Panel><Stat label="This payroll" value={usd(PAYROLLS[0].amount)} hint={PAYROLLS[0].note} /></Panel>
        <Panel><Stat label="Credits YTD" value={usd(creditsYtd)} tone="ok" /></Panel>
        <Panel><Stat label="Sites on fire" value={String(fire.length)} hint={fire[0]?.name} tone="ember" /></Panel>
      </div>
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>Next three payrolls</h2>
          <Link to="/ceo/health" style={{ fontSize: 14, color: "var(--accent)" }}>Break down the score</Link>
        </div>
        {PAYROLLS.map((p) => (
          <div key={p.date} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
            <div><p style={{ margin: 0, fontSize: 14 }}>{p.label}</p><p className="subtle" style={{ margin: 0, fontSize: 12 }}>{p.date} · {p.note}</p></div>
            <p className="serif tabular" style={{ margin: 0, fontSize: 24 }}>{usd(p.amount)}</p>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function CeoHealth() {
  return (
    <div className="page">
      <header><p className="kicker">Workforce Health Score</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>{HEALTH.score} / 100</h1></header>
      <div className="grid-2">
        {HEALTH.components.map((c) => (
          <Panel key={c.key}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className="muted" style={{ margin: 0, fontSize: 14, fontWeight: 400 }}>{c.label}</h2>
              <span className="serif tabular" style={{ fontSize: 24 }}>{c.value}</span>
            </div>
            <div style={{ marginTop: 12, height: 6, borderRadius: 99, background: "var(--elevated)" }}>
              <div style={{ height: "100%", width: `${c.value}%`, background: c.value < 65 ? "var(--ember)" : c.value < 75 ? "var(--warn)" : "var(--ok)" }} />
            </div>
            <p className="subtle" style={{ marginTop: 8, fontSize: 14 }}>{c.note}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function CeoCredits() {
  return (
    <div className="page">
      <header><p className="kicker">Credits</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>What we found</h1></header>
      {CREDITS.map((c) => (
        <Panel key={c.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className="serif" style={{ margin: 0, fontSize: 20 }}>{c.type}</p>
            <Badge tone={c.status === "contingent" ? "warn" : "ok"}>{c.status}</Badge>
          </div>
          <p className="tabular">{usd(c.estimated)}</p>
          <p className="muted" style={{ fontSize: 14 }}>{c.note}</p>
        </Panel>
      ))}
    </div>
  );
}

export function CeoSites() {
  return (
    <div className="page">
      <header><p className="kicker">Workplaces</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Sites</h1></header>
      <div className="grid-3">
        {SITES.map((s) => (
          <Panel key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className="serif" style={{ margin: 0, fontSize: 22 }}>{s.name}</h2>
              {s.onFire ? <Badge tone="ember">On fire</Badge> : <Badge tone="ok">Steady</Badge>}
            </div>
            <p className="muted" style={{ fontSize: 14 }}>{s.city}, {s.state} · {s.headcount} people</p>
            {s.reason ? <p className="ember" style={{ fontSize: 14 }}>{s.reason}</p> : null}
          </Panel>
        ))}
      </div>
    </div>
  );
}
