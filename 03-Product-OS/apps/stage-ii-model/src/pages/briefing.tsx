import { Link } from "react-router-dom";
import { Badge, Panel } from "@/components/ui";

export function Verdict() {
  return (
    <article className="page" style={{ maxWidth: 720 }}>
      <header>
        <p className="kicker">Deep dive</p>
        <h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Does the repo do it justice?</h1>
        <p className="muted" style={{ marginTop: 12, fontSize: 18, lineHeight: 1.6 }}>No. It saw the full picture as a plan. This model is Stage II made tangible.</p>
      </header>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>What is real</h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Thesis, schema, Exception object, NJ rules, Palisade crew, rail ADR, and now a runnable visual model.</p>
      </Panel>
      <p className="muted" style={{ fontSize: 14 }}>Not a social network. See <Link to="/briefing/moat" style={{ color: "var(--accent)" }}>How it wins</Link>.</p>
    </article>
  );
}

export function Features() {
  const items = [
    ["v1", "AI Payroll Copilot", "As an office manager, I clear a plain-English exception queue before money moves."],
    ["v1", "Pay run as agent workflow", "As an approver, I preview, lock, and only then hand a file to the rail."],
    ["v1", "Compliance engine", "Rules as YAML tests, not essays."],
    ["v1", "Tax savings engine", "Credits on the same desk as the pay run. WOTC is contingent."],
    ["v1", "Predictive labor cost", "Next payroll, quarterly tax, annual labor, hire what-if."],
    ["v1", "Earned wage access", "Employer-funded pool. No APR."],
    ["v1.1", "Workforce Health Score", "One 0–100 number. Ship only if it beats a naive exit baseline."],
    ["v1.1", "Financial wellness coach", "Withholding and cash-calendar from actual hours."],
  ];
  return (
    <article className="page" style={{ maxWidth: 720 }}>
      <header><p className="kicker">Catalog</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Features and stories</h1></header>
      <Panel><h2 className="serif" style={{ margin: 0, fontSize: 22 }}>Opportunities</h2><p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>NJ construction design partners, then home care. Credits that pay for the seat. Employee pull via earned wages.</p></Panel>
      <Panel><h2 className="serif" style={{ margin: 0, fontSize: 22 }}>Fixes</h2><p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Remove WOTC from revenue math. Sign Check or Zeal, not Gusto Embedded. Counsel-sign NJ packs.</p></Panel>
      <Panel><h2 className="serif" style={{ margin: 0, fontSize: 22 }}>Blockers</h2><p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Unsigned rail. Unsigned EWA memo. Missing payroll-ops spine hire. No SOC 2 locker.</p></Panel>
      <Panel><h2 className="serif" style={{ margin: 0, fontSize: 22 }}>Strategy</h2><p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Concierge 20 firms. Measure hours saved / credits found / whether the admin would go back.</p></Panel>
      {items.map(([v, name, story]) => (
        <Panel key={name}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge tone={v === "v1" ? "ok" : "muted"}>{v}</Badge>
            <h2 className="serif" style={{ margin: 0, fontSize: 20 }}>{name}</h2>
          </div>
          <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>{story}</p>
        </Panel>
      ))}
    </article>
  );
}

export function Pages() {
  const rows = [
    ["/", "Landing", "Three doors"],
    ["/operator", "Exception queue", "Approve / Keep / Reject modal"],
    ["/operator/run", "Pay run", "Lock-and-preview confirm"],
    ["/ceo", "Owner overview", "Health, payrolls, fire"],
    ["/employee", "Maria home", "EWA $200 confirm"],
    ["/briefing", "War Room", "Verdict through moat"],
  ];
  return (
    <article className="page" style={{ maxWidth: 720 }}>
      <header><p className="kicker">IA</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Pages and popups</h1></header>
      <Panel>
        {rows.map(([path, name, pops]) => (
          <div key={path} style={{ marginBottom: 12 }}>
            <Link to={path} style={{ color: "var(--accent)" }}>{name}</Link>
            <p className="subtle" style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11 }}>{path}</p>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>{pops}</p>
          </div>
        ))}
      </Panel>
    </article>
  );
}

export function Architecture() {
  return (
    <article className="page" style={{ maxWidth: 720 }}>
      <header><p className="kicker">Build</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Architecture</h1></header>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>This model's stack</h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Vite, React 19, React Router, Zustand, Palisade fixture in memory. Auth off: visual model, not a trust boundary.</p>
      </Panel>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>Skills to hire</h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>Payroll operations spine. Rules engineer. Fractional employment-tax and EWA counsel. Two vertical implementers.</p>
      </Panel>
    </article>
  );
}

export function Feasibility() {
  return (
    <article className="page" style={{ maxWidth: 720 }}>
      <header><p className="kicker">Go / no-go</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Feasibility</h1></header>
      <Panel><Badge tone="ok">Market</Badge><p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>Feasible. 50–500 hourly-heavy multi-site firms can still switch in a quarter.</p></Panel>
      <Panel><Badge tone="warn">Competitive</Badge><p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>Feasible only as a bundle. Copilot-alone is dead.</p></Panel>
      <Panel><Badge tone="warn">Regulatory</Badge><p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>WOTC lapsed after 2025-12-31. EWA is a state patchwork. Stay employer-funded.</p></Panel>
      <Panel><Badge tone="ember">Operational</Badge><p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>One missed tax deposit ends the company. HCM dies in migration.</p></Panel>
    </article>
  );
}

export function Documents() {
  const docs = [
    "Entity formation packet",
    "Employment-tax + EWA counsel engagement letter",
    "Embedded payroll rail sandbox (Check / Zeal) → signed ADR 0001",
    "Exception object spec + JSON Schema freeze",
    "NJ rules packs, counsel signed",
    "30-day migration runbook",
    "Pricing one-pager ($10 PEPM)",
    "Public filing status page + dual-control payday runbook",
  ];
  return (
    <article className="page" style={{ maxWidth: 720 }}>
      <header><p className="kicker">Procurement</p><h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>Documents</h1></header>
      <Panel>
        <ol className="muted" style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
          {docs.map((d) => <li key={d}>{d}</li>)}
        </ol>
      </Panel>
    </article>
  );
}

export function Moat() {
  return (
    <article className="page" style={{ maxWidth: 720 }}>
      <header>
        <p className="kicker">Category</p>
        <h1 className="serif" style={{ margin: "4px 0 0", fontSize: 36 }}>How it wins</h1>
        <p className="muted" style={{ marginTop: 12, fontSize: 18, lineHeight: 1.6 }}>Not a social app. One invoice that makes payroll admin, credit consultant, EWA overlay, and BI feel like three extra devices.</p>
      </header>
      <Panel>
        <h2 className="serif" style={{ margin: 0, fontSize: 24 }}>Against incumbents</h2>
        <p className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>ADP is generic at 50–500. Gusto thins out on trades — do not rent Gusto Embedded. Rippling is IT + employee record. DailyPay is an overlay.</p>
      </Panel>
    </article>
  );
}
