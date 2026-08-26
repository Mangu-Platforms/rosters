const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, TableOfContents, PageBreak,
  Header, Footer, PageNumber, VerticalAlign, TabStopType, TabStopPosition, LeaderType
} = require('docx');
const fs = require('fs');

const GREEN = "1B7A3D";
const DARKGREEN = "0F3D22";
const GRAY = "595959";
const LIGHTGRAY = "F2F2F2";
const BLACK = "1A1A1A";

// ---------- helpers ----------
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 420, after: 200 },
    border: { bottom: { color: GREEN, space: 4, style: BorderStyle.SINGLE, size: 8 } },
    children: [new TextRun({ text, color: DARKGREEN, bold: true })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, color: GREEN, bold: true })],
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 288 },
    children: [new TextRun({ text, italics: !!opts.italics, bold: !!opts.bold, color: opts.color || BLACK, size: opts.size || 22 })],
  });
}
function pMulti(runs, opts = {}) {
  return new Paragraph({ spacing: { after: 160, line: 288 }, children: runs });
}
function tag(text) {
  return new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: GREEN, size: 18, characterSpacing: 20 })],
  });
}
function note(text) {
  return new Paragraph({
    spacing: { before: 80, after: 200 },
    indent: { left: 360 },
    border: { left: { color: "BFBFBF", space: 8, style: BorderStyle.SINGLE, size: 12 } },
    children: [new TextRun({ text, italics: true, color: GRAY, size: 20 })],
  });
}
function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 2000, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: DARKGREEN } : (opts.shade ? { type: ShadingType.CLEAR, fill: LIGHTGRAY } : undefined),
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: !!opts.header, color: opts.header ? "FFFFFF" : BLACK, size: opts.size || 19 })],
    })],
  });
}
function table(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: headers.map((htext, i) => cell(htext, { header: true, width: widths[i] })),
      }),
      ...rows.map((r, ri) => new TableRow({
        cantSplit: true,
        children: r.map((c, i) => cell(c, { width: widths[i], shade: ri % 2 === 1 })),
      })),
    ],
  });
}
function spacer(h) { return new Paragraph({ spacing: { after: h || 120 }, children: [] }); }
function tocLine(text, pageNum, isSub) {
  return new Paragraph({
    spacing: { after: isSub ? 60 : 140 },
    indent: { left: isSub ? 360 : 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: LeaderType.DOT }],
    children: [
      new TextRun({ text, bold: !isSub, color: isSub ? GRAY : BLACK, size: isSub ? 20 : 22 }),
      new TextRun({ text: `\t${pageNum}`, color: GRAY, size: isSub ? 20 : 22 }),
    ],
  });
}

// ================= CONTENT =================

const titleBlock = [
  new Paragraph({ spacing: { before: 1400, after: 0 }, children: [new TextRun({ text: "AETHER", bold: true, color: GREEN, size: 28, characterSpacing: 40 })] }),
  new Paragraph({ spacing: { before: 200, after: 0 }, children: [new TextRun({ text: "Feasibility Study", bold: true, color: DARKGREEN, size: 56 })] }),
  new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: "Autonomous Workforce Operations — a grounded assessment before Stage I capital is committed", italics: true, color: GRAY, size: 26 })] }),
  new Paragraph({ spacing: { before: 800, after: 0 }, children: [new TextRun({ text: "Prepared for Renee · Mangu Publishers", color: BLACK, size: 22 })] }),
  new Paragraph({ spacing: { before: 40, after: 0 }, children: [new TextRun({ text: "August 26, 2026", color: GRAY, size: 22 })] }),
  new Paragraph({ spacing: { before: 400, after: 0 }, children: [new TextRun({ text: "Concept-stage assessment. Not a solicitation. Not a claim of existing customers, filings, licenses, or certifications. Figures inherited from source materials are marked as such; figures independently checked this session are marked accordingly and sourced in Appendix A.", italics: true, color: GRAY, size: 18 })] }),
];

const execSummary = [
  h1("Executive Summary"),
  p("Aether, as specified across the four source documents (the Ambition Build Plan, the Concept Deck, the Full Build deep-dive, and the Operating Plan), is a coherent, well-researched product thesis: an “AI Workforce Operating System” that wraps payroll — rather than trying to out-build it — with an exception-detecting copilot, a tax-credit scanner, employer-funded earned wage access, continuous compliance monitoring, and a Workforce Health Score, sold to 50–500 employee, hourly-heavy operators in construction, home care, and three adjacent verticals. The category argument (payroll as commodity, workforce intelligence as the moat) is sound and matches how several well-funded competitors are themselves repositioning in 2026."),
  p("This study's job is narrower than the source documents: to pressure-test the plan against what is independently verifiable right now, and to flag where the ground has moved since the documents were written. Two findings change the sequencing meaningfully. First, the federal Work Opportunity Tax Credit — the credit the Operating Plan itself leans on hardest for the “software pays for itself” claim — lapsed for new hires after December 31, 2025, and as of this writing has not been renewed; the tax-savings wedge needs to be rebuilt around state credits and the R&D payroll-tax offset as the primary claim, with WOTC as upside if Congress acts. Second, the “copilot” feature that anchors the v1 bundle is no longer a whitespace claim: Gusto shipped an agentic payroll assistant (“Cofounder”) in 2026 with more than twenty automations, and Rippling is reported to have its own AI payroll assistant live. Aether's differentiation has to rest on the full bundle and the vertical compliance depth, not on having an AI copilot at all."),
  p("Everything else in the plan holds up under scrutiny reasonably well. The embedded-payroll-rail category (Check, Gusto Embedded, Salsa, Zeal) is real and active in 2026, which validates the “rent the rail, own the brain” architecture. SOC 2 Type I is realistically reachable pre-revenue for roughly $20,000–$60,000 over two to three months, which is good news for the “trust” stream. The earned-wage-access regulatory picture is workable but uneven: twelve states now have EWA-specific statutes, and while most treat a properly designed employer-funded product as wage access rather than lending, Maryland and Connecticut do not, and a federal EWA bill is moving through the House Financial Services Committee that could reshape the whole map. None of this is disqualifying. It does mean the three verifications in Section 9 should close before Stage I capital (entity, bank, insurance, the spine hire) is spent, not after."),
  p("Overall verdict: conditionally feasible. The wedge is real, the architecture is buildable with 2026-available infrastructure, and the numbers are directionally sound. The condition is that the credit-engine story and the EWA legal design get rebuilt on today's facts before they are put in front of a design partner, a bank partner, or an investor.", { bold: true }),
];

const section1 = [
  h1("1. What Aether Is, in One Page"),
  p("Aether is positioned as Autonomous Workforce Operations, not human capital management and not a payroll company: the pitch is that payroll becomes nearly invisible while the platform runs the work around it. The v1 bundle, as specified in the Operating Plan, is deliberately narrow — four modules ship first, six more exist only so the company knows what it is becoming."),
  table(
    ["Module (v1)", "Job it does", "Why it is in the wedge"],
    [
      ["AI Payroll Copilot", "Treats the pay run as an agent workflow: ingests time and schedules, scores every line against history, surfaces exceptions in plain language, never auto-pushes a net-pay change without human approval.", "The hours-back-every-week feature and the trust feature. If it is wrong twice, the account is dead."],
      ["Predictive labor-cost intelligence", "Forecasts next payroll, quarterly tax, and annual labor under current and proposed headcount.", "Turns a rear-view system into a forward one a CFO will open unprompted."],
      ["On-demand pay without loans", "Employer-funded or bank-partnered liquidity pool; AI cash-flow forecast caps the pool; no APR, no rollover balance, no sale of worker debt.", "The employee-side hook that creates organic “can we switch” pressure inside a shop."],
      ["Automated compliance AI", "Continuously maps federal, state, and local wage, overtime, leave, and posted-notice rules onto the actual workforce for the five named verticals.", "Fear closes deals in this segment; a wrong compliance claim is fatal, so year one is five verticals in the states they actually operate, not “every ordinance in America.”"],
    ],
    [2400, 4200, 3200]
  ),
  spacer(80),
  p("Two more modules ship close behind: a Workforce Health Score (a single 0–100 number a CEO will track) and a tax-savings engine that scans the workforce and entity against state hiring/training credits, the R&D payroll-tax offset, and — while it exists — WOTC. The architecture principle is “rent the rail, own the brain”: an embedded payroll-as-a-service provider handles calculation, tax filing, and money movement, while Aether owns the copilot, the compliance graph, the credit scanner, the forecast, and the Health Score. The beachhead is 50–500 employee, hourly-heavy, multi-site operators in healthcare/home care, construction, light manufacturing, logistics, and multi-unit franchises — starting with construction and home care in the New Jersey / New York / Pennsylvania corridor."),
];

const section2 = [
  h1("2. Market Feasibility"),
  h2("The pools are real, but treat the point estimates as directional"),
  p("The source materials size US HR & payroll software at roughly $16 billion in 2026 (attributed to IBISWorld) and employer-sponsored earned wage access at roughly $4.5 billion in 2025 growing to $5.9 billion in 2026, with the category potentially reaching the mid-teens of billions by 2030 if regulation does not constrain it. These figures were not independently re-derived this session — they are carried forward from the source documents' own citations — and the documents themselves are candid that “point estimates are marketing” while the direction is real. That is the right level of confidence to hold them at. Before either figure appears in a raise deck, they are worth re-pulling from the primary IBISWorld report and a current EWA market forecast, since both markets are moving quickly enough that a 2025-vintage numbers deck ages fast."),
  p("The incumbent stack is not asleep, and the source documents already say so plainly: ADP on the order of $20 billion-plus in FY2025 revenue, Paychex a mid-single-digit-billion business that has absorbed Paycor, Gusto near $1 billion ARR, Rippling growing fast off a unified employee record, and DailyPay/Branch established as EWA-overlay leaders. This session's research confirms one more data point worth adding to that list: Warp, an AI-native payroll/HR/IT entrant aimed mostly at tech companies, closed a $60 million Series B in June 2026 specifically to build AI agents into payroll and compliance — confirmed independently across multiple outlets (see Appendix A). That funding is aimed at a different customer (tech companies, not jobsites and home-care agencies), which supports rather than undercuts the source documents' argument that the 50–500 employee, blue-collar, multi-site beachhead is under-served by the AI-native entrants."),
  h2("The beachhead math is the right shape"),
  p("The Full Build document cites Census County Business Patterns figures for US establishments in the 50–500 employee band (roughly 249,000 at 50–99 employees, 138,000 at 100–249, and 38,000 at 250–499), then correctly narrows that to the hourly-heavy, multi-site subset across five verticals — tens of thousands of firms, not hundreds of thousands. That narrowing is the right instinct: a market-sizing exercise that stops at the establishment count and does not narrow by vertical and operating pattern is not a beachhead, it is a TAM slide. This session did not re-pull the Census release; it is a standard public dataset and the citation is plausible, but it is old enough (2023 vintage cited in an August 2026 document) that a refresh against the current release is a cheap, worthwhile check before it appears anywhere external."),
];

const competitiveRows = [
  ["ADP / Paychex", "Deep compliance bench, brand, distribution; assist-layer AI, not an operating agent.", "Generic at 50–500 employees; wins on trust, not on labor-cost intelligence for dirty-workforce industries."],
  ["Gusto", "Easiest SMB onboarding; shipped “Cofounder,” an agentic assistant with 20+ automations (running payroll, flagging missing timesheets, staffing conflicts, labor-cost reports) in 2026.", "Thins out fast once overtime, multi-state, and trades complexity show up; Cofounder closes some of the copilot gap but is not vertical-compliance-deep."],
  ["Rippling", "Unified employee record, strong workflow engine; reported to be shipping its own AI payroll assistant in 2026.", "System-of-record for IT/HR, not a labor-cost operating system built for jobsites and care agencies."],
  ["Warp", "AI-native payroll/HR/IT; closed a $60M Series B in June 2026 (independently confirmed).", "Built for tech companies, not home care or construction — different buyer, different compliance surface."],
  ["DailyPay / Branch", "EWA category leaders, thousands of employers, millions of workers.", "Consumer-fee overlay DNA, not embedded in the payroll system of record or the compliance graph."],
  ["Check / Gusto Embedded / Salsa / Zeal", "Embedded payroll infrastructure — calculation, filing, money movement as an API.", "Partners, not competitors, unless Aether tries to own filing too early. Gusto Embedded specifically is owned by a direct competitor at the platform layer — see 5.2."],
];

const section3 = [
  h1("3. Competitive Feasibility"),
  p("The source documents already map the competitive field honestly and explicitly refuse to “pretend these people are asleep.” The update this session adds is timing: the window in which “has an AI copilot” was itself a differentiator has closed. Gusto's Cofounder and Rippling's AI assistant are both live in 2026, which means a copilot alone is table stakes, not a wedge. That does not break the plan — the plan's own answer is “the bundle and the data graph, not a single feature” — but it does mean the go-to-market materials and the design-partner pitch need to lead with the vertical compliance depth, the employer-funded EWA design, and the credit engine, and treat the copilot as expected functionality rather than the headline."),
  table(
    ["Player", "What they actually are (2026)", "Where Aether has room"],
    competitiveRows,
    [2000, 4200, 3600]
  ),
  spacer(80),
  p("The honest threat, as the Full Build document puts it, is not one competitor but a composite: Rippling shipping a decent copilot, ADP bundling EWA, and a vertical specialist doing “good enough” construction payroll, all at once. Nothing found this session changes that read — if anything, Gusto's Cofounder launch is an early instance of exactly that composite threat starting to assemble. The moat argument (a compensation graph, turnover models, a compliance graph tied to actual punches, a credit inventory, and switching gravity once employees live in the app) is correct in principle and does not exist on day one; it has to be earned through design-partner volume, which is why Section 9's sequencing keeps Phase 0 design partners on the critical path rather than treating them as a nice-to-have."),
];

const section4 = [
  h1("4. Regulatory & Legal Feasibility"),
  h2("Earned wage access: workable, but not uniform"),
  p("Twelve states currently have EWA-specific statutes: Arkansas, Connecticut, Indiana, Kansas, Louisiana, Maryland, Missouri, Nevada, South Carolina, Utah, Wisconsin, and California (registration-only), with effective dates spread between August 2023 and October 2025. Most of these treat a properly structured EWA product — particularly one that is employer-integrated rather than sold direct-to-consumer — as wage access rather than a loan. Two states are the exception the source documents' “stay employer-funded, no APR” posture needs to be checked against directly: Maryland classifies EWA as a loan under its Consumer Loan Law, and Connecticut designates it a small loan, with EWA-specific carve-outs. Neither is in Aether's initial NJ/NY/PA beachhead, which is good luck rather than design, and worth confirming does not change as the footprint expands. Separately, federal EWA legislation is currently advancing through the House Financial Services Committee; at least one legal commentary characterizes it as a preemption move that could override state-level rules. That bill's final shape is unresolved and should be tracked, not designed around in either direction, until it is closer to law."),
  note("This session did not find, and did not look for, a New Jersey-specific EWA legal opinion. “NJ is not Maryland or Connecticut” is a reasonable working assumption, not a confirmed one — it belongs on the list of things employment-tax/fintech counsel confirms before EWA code is written, exactly as the source Operating Plan already recommends generally (“counsel reads the design in every state you touch”)."),
  h2("The tax-credit engine's biggest input has a hole in it right now"),
  p("This is the most material update this study makes to the plan. The Work Opportunity Tax Credit expired for new hires after December 31, 2025. As of today, a business hiring someone in 2026 cannot generate a new WOTC claim unless Congress passes a retroactive extension — which has historical precedent (WOTC has been extended roughly thirteen times since 1996, and the 2015 PATH Act reached back to close a prior gap) but is not something to underwrite revenue on before it happens. The source Operating Plan already contains the right instinct — “WOTC has been extended in bursts and is not a perpetual machine … never make one federal program the business model” — but the illustrative unit-economics number it uses ($18,000–$60,000 in typical credits found) leans on WOTC as a component. The tax-savings engine's v1 scope and its numbers should be rebuilt around state hiring/training/apprenticeship credits and the R&D payroll-tax offset (up to the statutory cap, currently $500,000 against the employer Social Security portion for eligible small businesses) as the primary, current-law claim, with WOTC re-added as upside contingent on Congressional action — tracked, not assumed."),
  h2("The rest of the legal terrain is consistent with the source plan"),
  p("Nothing found this session changes the core legal posture already specified: software-and-agents-over-a-payroll-principal in v1 (Aether is not the employer or the filer), no holding of customer balances if counsel finds that triggers money-transmitter status, and treating worker payroll data as the most sensitive object in the building. SOC 2 Type I is realistically reachable pre-revenue — see Section 6 for cost — which supports starting it “in flight immediately” as the plan specifies. Employment-tax counsel and a SOC 2 firm belong in Stage I spend, not deferred."),
];

const section5 = [
  h1("5. Technical Feasibility"),
  h2("5.1 The embedded-rail category is real and active"),
  p("Check, Gusto Embedded, Salsa, and Zeal all appear as live, actively compared embedded-payroll infrastructure providers in 2026 market coverage, which confirms the “rent the rail” premise is executable today rather than aspirational. It does not confirm any single vendor's current state coverage, sandbox quality, pricing, or willingness to let a partner “own the logo” — that requires direct sales conversations this study could not complete, and is exactly the first item in Section 9's verification list."),
  h2("5.2 One dependency is worth naming before a contract is signed"),
  p("Gusto Embedded is, unsurprisingly, owned by Gusto — the same company whose Cofounder product now competes directly with Aether's copilot and labor-cost modules at the platform layer. Building Aether's payroll calculation and filing on a competitor's embedded infrastructure is not disqualifying (many vertical fintechs run on a competitor's rails), but it is a strategic dependency worth entering with eyes open: contract terms on data access, roadmap visibility, and pricing changes deserve extra scrutiny if Gusto Embedded is the finalist. Check and Zeal are the more neutral infrastructure plays among the four named candidates; Salsa is vertical-agnostic embedded payroll aimed at software platforms generally. A short architecture decision record comparing the four on data ownership, competitive exposure, state coverage for the NJ/NY/PA beachhead, and sandbox quality is included in the build-out scaffold (Section 10) as a starting point — it still needs live vendor answers to be decision-ready."),
  h2("5.3 The control-plane and exception-object design is sound and buildable now"),
  p("The reference data model and the canonical Exception object specified in the Full Build and Operating Plan documents (source, baseline, suggested value, dollar impact both directions, plain-language explanation, approver, reason code, audit hash) are complete enough to implement directly — they do not need to wait for a rail decision. This study's accompanying build-out scaffold turns that specification into an actual Postgres schema, a JSON Schema for the exception object, and a synthetic New Jersey crew dataset, so the “synthetic crew can be loaded, five planted errors speak English” milestone from Stage II of the Ambition Build Plan is something to run against immediately, independent of which rail is ultimately chosen."),
  h2("5.4 SOC 2 is a real, budgetable line item, not a vague future cost"),
  p("Independently checked this session: SOC 2 Type I realistically runs $20,000–$60,000 all-in (audit fee plus compliance tooling plus the internal hours to prepare) over roughly two to three months with no monitoring period required. Type II adds another $30,000–$80,000 and three to twelve months, including a mandatory three-month monitoring window that cannot be compressed. Practically: if Type I starts on day one of Stage I, a report is realistic by month two or three; Type II realistically lands between month nine and month twelve, not sooner, no matter how well-resourced the effort is. That timeline should be reflected in any customer-facing promise about when a SOC 2 report will exist."),
];

const unitEconRows = [
  ["Software (PEPM)", "180 × $10 × 12 = $21,600/yr", "Below quoted mid-market stacks; stands alone without credit-share, as the source plan insists it must."],
  ["Credits found — revised baseline", "$5,000–$25,000/yr from state hiring/training credits + R&D payroll offset only", "WOTC removed from the base case per Section 4; add back as upside if Congress renews it."],
  ["Admin time recovered", "3–6 hrs/cycle × 26 cycles × ~$45 loaded ≈ $3,500–$7,000/yr", "Real, and independent of any tax-credit policy risk."],
  ["One avoided quit", "$8,000–$15,000 fully loaded replacement cost avoided", "One retention save covers years of the software seat."],
  ["EWA", "Float + small employer-absorbed or split flat fee", "Recruiting and attendance lift, not interest income — keep it that way for regulatory reasons in Section 4."],
];

const socRows = [
  ["SOC 2 Type I", "$20,000 – $60,000 all-in", "2–3 months", "Achievable pre-revenue; start on day one of Stage I."],
  ["SOC 2 Type II", "additional $30,000 – $80,000", "3–12 months (incl. mandatory 3-month monitoring window)", "Cannot be compressed below ~9 months from a standing start."],
];

const section6 = [
  h1("6. Financial Feasibility & Unit Economics"),
  p("The illustrative 180-employee construction firm in the source Operating Plan produces roughly $21,600 a year in software revenue at the proposed $10 PEPM price — a real number, independent of any other claim, and the plan is correct to insist internally that “software PEPM has to stand alone” rather than leaning on credit-share for the growth story. The table below carries that unit-economics illustration forward with one change: the tax-credit line is rebuilt on the current-law baseline from Section 4 rather than including WOTC, which was part of the original illustrative range."),
  table(["Line", "Math / range", "Note"], unitEconRows, [2600, 3600, 3600]),
  spacer(80),
  p("The internal target of mid-70s gross margin on software PEPM is a reasonable aim for an embedded-rail vertical SaaS/fintech business and is broadly consistent with how comparable embedded-finance software businesses are structured — margin compresses once EWA float and credit-share are blended in, which is why the plan is right to model them separately rather than folding everything into one blended number for a fundraising narrative."),
  h2("What Stage I actually costs in cash, beyond the obvious"),
  p("The source Ambition Build Plan lists entity, bank, cap table, domain, counsel, a SOC 2 firm, cyber/E&O/crime insurance, an isolated cloud environment, and the payroll-operations “spine” hire as Stage I requirements without attaching numbers. This session's research fills in one of those blanks concretely:"),
  table(["Item", "Realistic cash range", "Timeline"], socRows, [2600, 3200, 4000]),
  spacer(80),
  p("Employment-tax counsel, cyber/E&O/crime coverage, and the payroll-operations lead's compensation are not quantified here — they are market- and candidate-dependent — but all three belong in the same Stage I cash-needs model alongside the SOC 2 figures above, rather than treated as soft costs to figure out later. A seed round or founder-funded runway sized only around engineering and the embedded-rail integration fee will understate what Stage I actually requires."),
];

const section7 = [
  h1("7. Operational & Team Feasibility"),
  p("The team shape specified in the Operating Plan — a CEO/operator who has sold into dirty-workforce industries, a payroll-operations lead who has “lived through a failed filing,” an applied ML/agent lead measured on exception precision rather than demo polish, compliance counsel plus a rules engineer as two distinct jobs, two vertical implementation people willing to sit at an office-manager's desk, and a bank/treasury partner owner for EWA — is a credible list, and the explicit refusal to hire a marketplace manager, a brand studio, or a “Head of AI with no payroll graph” before year one is a healthy discipline. The operational risk is not the list itself but its recruiting difficulty: the payroll-operations “spine” hire is a narrow, senior, scar-tissue role — someone who has personally been in the room for a missed deposit — and searches for that specific profile typically run two to four months even with a strong network, longer without one. The same is true, to a lesser degree, of a rules engineer comfortable turning statutes into executable tests. Both searches should start in parallel with fundraising and entity formation, not after Stage I is “complete,” because they sit on the critical path to Stage II."),
  p("The concierge implementation model — white-glove migration and two full parallel-run cycles for the first fifty logos, per the 30-day runbook — is real services labor wearing a software company's clothes for the first year. That is the right call operationally (the source documents are correct that “migration is the product” and that HCM companies die in migration), but it should be staffed and budgeted as such rather than assumed to be free founder time indefinitely; the two vertical implementation hires in the team list above exist precisely to absorb that load once it exceeds what a founder can personally carry."),
];

const riskRows = [
  ["WOTC lapse (new)", "High — active now", "Rebuild the tax-savings wedge on state credits + R&D payroll offset; treat WOTC as upside only if renewed."],
  ["Copilot no longer a wedge (new)", "High — active now", "Lead GTM and design-partner pitch with vertical compliance depth, EWA design, and the credit engine — not “we have AI.”"],
  ["EWA state patchwork + pending federal bill", "Medium–High", "Counsel memo per beachhead state before writing EWA code; monitor the federal bill without designing around a guess at its outcome."],
  ["Payroll is a trust business", "Catastrophic if realized", "Partner a proven filer; dual control on any file that moves money; insurance; a public status page for filings."],
  ["Rail concentration / competitive dependency", "Medium", "Weight Check and Zeal alongside Gusto Embedded given Gusto's Cofounder overlap; get contractual data and roadmap protections regardless of choice."],
  ["Implementation graveyard", "Medium–High", "Fund the 30-day runbook and concierge for the first 50 logos as real headcount, not founder overflow time."],
  ["Data liability", "High impact, ongoing", "SOC 2 (budgeted per Section 6), least-privilege agents, per-customer encryption, audited agent actions on anything touching pay."],
  ["Capital sequencing", "Medium", "Size the raise or runway to fund six parallel streams (agents, rail/treasury, law-as-code, trust, implementation, allies) at once, per the source plan's own model — not sequentially."],
  ["Hiring the “spine” and the rules engineer", "Medium", "Start both searches immediately and in parallel with entity/fundraising work; both sit on the Stage II critical path."],
  ["Tax-credit and EWA policy volatility (ongoing)", "Medium, recurring", "Diversify the credit inventory permanently; revisit the EWA legal design whenever a target state or the federal bill changes status."],
];

const section8 = [
  h1("8. Risk Register"),
  p("This consolidates the risks already named across the four source documents with the updates this session's research adds. The first two rows are new information, not restatements — they did not exist as live conditions when the source documents were written this same month."),
  table(["Risk", "Severity", "Mitigation / owner"], riskRows, [2600, 1800, 4400]),
];

const verifyRows = [
  ["Rail diligence", "Direct conversations with at least Check, Zeal, and Salsa — confirm state coverage for NJ/NY/PA construction and home-care jurisdictions, sandbox quality, pricing, and whether Aether can own the customer logo.", "1–2 weeks of outbound; blocks signing an embedded-rail sandbox."],
  ["EWA legal memo", "Employment-tax / fintech counsel opinion on the employer-funded EWA design specifically for the chosen beachhead states, informed by the Maryland/Connecticut precedent and the pending federal bill.", "Blocks writing any EWA code or making EWA promises to a design partner."],
  ["Credit-engine re-model", "Rebuild the tax-savings unit economics and pitch language on state credits + R&D payroll offset as the current-law baseline, with WOTC re-added only as contingent upside.", "Blocks using the original $18k–$60k credit figure in any external deck."],
];

const section9 = [
  h1("9. Go / No-Go Recommendation & Sequencing"),
  p("Conditionally feasible. Nothing found this session breaks the thesis — the category argument, the architecture, and the beachhead math all hold up under independent scrutiny, and the embedded-rail and SOC 2 paths are executable with 2026-available infrastructure and realistic budgets. The condition is that three specific verifications close before Stage I cash is committed to entity formation, banking, and insurance, because each one would change either the product design or the numbers if it comes back differently than assumed.", { bold: true }),
  table(["Verification", "What it settles", "Why it gates Stage I"], verifyRows, [2200, 4200, 2600]),
  spacer(80),
  p("Once those three close clean, the source Ambition Build Plan's own instinct to run Stage I (sovereignty: entity, bank, insurance, the spine hire) and Stage II (the living spec: control plane, exception object, compliance rules pack, synthetic crew) in parallel rather than sequentially is the right call — and Stage II does not need to wait on any of the three verifications above, since none of it touches money movement or EWA design. That is exactly what the accompanying build-out architecture (delivered alongside this study) is scoped to start now: the reference data model, the exception object schema, a synthetic New Jersey crew, and a compliance rules-pack skeleton are buildable today, independent of which rail is chosen or how the EWA memo comes back."),
  p("One sequencing note on the plan's own “no clock, no quarters” framing: that stance is a fine and clarifying way to resist arbitrary deadlines, and this study does not argue against it as a general operating philosophy. But two of the findings above — the WOTC lapse and the fact that two well-funded competitors already ship a payroll copilot — are calendar-driven facts outside Aether's control, not internal pacing choices. “Sequence by capability, not by calendar” is the right rule for the ninety-nine things Aether controls; the credit-engine rebuild and the competitive repositioning are two things where the calendar has already moved and the plan should move with it."),
];

const appendixA = [
  h1("Appendix A — Sources Independently Consulted This Session"),
  p("The following were retrieved and reviewed this session to check specific claims in the source documents. General market-category knowledge is not separately footnoted below; only the specific facts that materially affect this study's findings are."),
  p("Embedded payroll infrastructure landscape: openbankingtracker.com (Check, Salsa, Gusto Embedded profiles and alternatives), hr.software (Gusto Embedded and Zeal reviews)."),
  p("Earned wage access regulation: American Banker / PaymentsSource state-by-state EWA guide; Holland & Knight, “Proposed EWA Legislation Would Undercut State Regulations” (Jan 2026); Faegre Drinker, “Earned Wage Access Regulatory Update” (Aug 2026) and Indiana EWA law note; Consumer Finance Monitor on the House Financial Services Committee bill (Jul 2026)."),
  p("WOTC status: Instead.com, “Work Opportunity Tax Credit 2026 Expiration and Enhancements”; corroborating context from Paycom's 2026 employer guide and UHY's WOTC expiration note."),
  p("SOC 2 cost and timeline: Sprinto, “How Much Does SOC 2 Compliance Audit Cost in 2026?”; cross-checked against ranges reported by Atlant Security and ComplyJet's 2026 startup guides."),
  p("Competitive moves: SiliconANGLE, Dealroom, and fintech.global on Warp's $60M Series B (Jun 2026); TechEdgeAI on Gusto's “Cofounder” launch; general 2026 comparison coverage of Rippling, Gusto, and Deel referencing AI payroll features."),
  note("Figures attributed to IBISWorld, vendor revenue compilations, and US Census County Business Patterns in Section 2 are carried forward from the source documents' own Appendix A citations and were not independently re-pulled this session — they are old enough (2023–2025 vintage cited in an August 2026 document) to be worth refreshing before external use."),
];

const appendixB = [
  h1("Appendix B — Source Documents Reviewed"),
  table(
    ["Document", "What it holds"],
    [
      ["Aether_Ambition_Build_Plan.pdf", "The five-stage sequencing narrative (Sovereignty → Living Spec → Fire Against a Living Book → Live Steel → Institution), the six parallel streams, and the stack/law posture."],
      ["Aether_Workforce_OS_Concept_Deck.pptx / .pdf", "14-slide investor/operator walkthrough: thesis, ICP, competitive map, moat, pricing, and risks."],
      ["Aether_Workforce_OS_Full_Build.pdf", "The full deep-dive: market sizing, positioning, the ten-module product system, architecture and build order, the 30-day migration runbook, and the team shape."],
      ["Aether_Workforce_OS_Operating_Plan.docx", "The living, versioned operating document — same content as the Full Build deep-dive, structured as the working copy to edit going forward."],
      ["Notes .docx", "The original raw concept memo and the prior working session's transcript that produced the named product, wedge, and architecture."],
    ],
    [3400, 6000]
  ),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22, color: BLACK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 30, bold: true, color: DARKGREEN, font: "Calibri" } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 24, bold: true, color: GREEN, font: "Calibri" } },
    ],
  },
  sections: [
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            border: { bottom: { color: "BFBFBF", space: 4, style: BorderStyle.SINGLE, size: 4 } },
            children: [
              new TextRun({ text: "AETHER · FEASIBILITY STUDY", size: 16, color: GRAY, characterSpacing: 10 }),
              new TextRun({ text: "\tAugust 2026", size: 16, color: GRAY }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Page ", size: 16, color: GRAY }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY })],
          })],
        }),
      },
      children: [
        ...titleBlock,
        new Paragraph({ children: [new PageBreak()] }),
        tag("Contents"),
        spacer(120),
        tocLine("Executive Summary", 3),
        tocLine("1.  What Aether Is, in One Page", 3),
        tocLine("2.  Market Feasibility", 4),
        tocLine("3.  Competitive Feasibility", 5),
        tocLine("4.  Regulatory & Legal Feasibility", 6),
        tocLine("5.  Technical Feasibility", 7),
        tocLine("6.  Financial Feasibility & Unit Economics", 8),
        tocLine("7.  Operational & Team Feasibility", 9),
        tocLine("8.  Risk Register", 10),
        tocLine("9.  Go / No-Go Recommendation & Sequencing", 11),
        tocLine("Appendix A — Sources Independently Consulted This Session", 12),
        tocLine("Appendix B — Source Documents Reviewed", 12),
        new Paragraph({ children: [new PageBreak()] }),
        ...execSummary,
        ...section1,
        ...section2,
        ...section3,
        ...section4,
        ...section5,
        ...section6,
        ...section7,
        ...section8,
        ...section9,
        ...appendixA,
        ...appendixB,
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(__dirname + "/Aether_Feasibility_Study.docx", buf);
  console.log("written");
});
