# ADR 0001 — Embedded Payroll Rail Selection

**Status:** Proposed — research-based, not vendor-verified. Do not sign a sandbox agreement off this document alone; see "What this ADR cannot tell you" below.
**Date:** 2026-08-26
**Deciders:** (Aether founder / payroll-operations spine hire, once in seat)

## Context

The Ambition Build Plan and Operating Plan both specify the same architecture: "rent the rail, own the brain." Aether does not build payroll calculation, tax filing, or ACH money movement in year one — it embeds one US payroll-as-a-service provider and builds the copilot, compliance engine, tax-credit scanner, forecast, and Health Score on top of it. The plan names four candidates without ranking them: Check, Gusto Embedded, Salsa, and Zeal. This ADR is the first pass at that ranking, using what this session's research could independently confirm.

## Decision drivers

1. **Data ownership and customer-logo ownership.** The Ambition Build Plan is explicit: "if a partner will not let you own the logo, they are not a partner." A rail that inserts its own brand into the employer or employee experience defeats the architecture.
2. **Competitive exposure.** Does the rail vendor compete with Aether at the application layer?
3. **State and jurisdiction coverage** for the NJ/NY/PA beachhead, construction and home-care verticals specifically (multi-worksite, prevailing wage, home-care wage nuances).
4. **Sandbox and API maturity** — per Stage II's own acceptance bar, "create, preview, discard pay runs until the API is boring."
5. **Filing scope** — 50-state filing capability, even if year one only activates 3 states, avoids a second migration later.

## Options considered

### Check
Independent embedded-payroll infrastructure company; not itself a payroll application competing for Aether's customers. Named as "the reference rail" in the Full Build document. Appears as an actively compared, active embedded-finance/payroll API provider in 2026 market coverage (openbankingtracker.com). No competitive-layer conflict.

### Gusto Embedded
Gusto's own white-label payroll API, built on the same infrastructure that powers gusto.com. Actively reviewed and compared in 2026 (hr.software). The material concern found this session: Gusto is also the company that shipped "Cofounder" in 2026 — an agentic AI teammate that runs payroll, flags missing timesheets, surfaces staffing conflicts, and generates labor-cost reports (see Feasibility Study Section 3 and Section 5.2). Building Aether's calculation and filing layer on a direct application-layer competitor's infrastructure is not disqualifying by itself, but it is a real dependency: contract terms on data access, roadmap visibility, and pricing changes deserve more scrutiny here than with a neutral vendor, and Gusto has both the means and a plausible motive to make embedding harder for a competitor over time.

### Salsa
Embedded payroll aimed generally at software platforms; vertical-agnostic. Appears in 2026 alternative/competitor comparison coverage (openbankingtracker.com), which confirms it's an active player but this session found less independent depth on it than on Check or Zeal.

### Zeal
Embedded payroll infrastructure; actively reviewed in 2026 (hr.software), including features and pricing commentary. Like Check, a neutral infrastructure vendor with no found application-layer competitive conflict.

## Comparison

| Criterion | Check | Gusto Embedded | Salsa | Zeal |
|---|---|---|---|---|
| Competitive-layer conflict | None found | **Yes — owns Cofounder, a direct copilot competitor** | None found | None found |
| Named as reference rail in source docs | Yes | No | No | No |
| Independent 2026 coverage found this session | Strong | Strong | Moderate | Strong |
| Logo/data ownership terms | Unconfirmed — verify | Unconfirmed — verify, with extra weight given the conflict above | Unconfirmed — verify | Unconfirmed — verify |
| NJ/NY/PA + construction/home-care jurisdiction depth | Unconfirmed — verify | Unconfirmed — verify | Unconfirmed — verify | Unconfirmed — verify |

## Recommendation

Prioritize **Check** and **Zeal** for first vendor conversations, specifically because neither carries the competitive-layer conflict that Gusto Embedded does. Keep **Salsa** as a third conversation rather than dropping it — the weaker independent coverage found this session reflects search-result depth, not a confirmed product weakness. Deprioritize **Gusto Embedded** unless Check and Zeal both fail on jurisdiction coverage or sandbox quality for the NJ/NY/PA beachhead — if that happens, the Gusto Embedded conversation should include explicit contract language addressing the competitive-conflict risk (data portability, advance notice of roadmap changes affecting embedded partners, pricing-change protections) rather than accepting standard terms.

## What this ADR cannot tell you

Everything in the comparison table's bottom three rows is marked "unconfirmed — verify" for a reason: this session could confirm that all four are active, real, 2026-current embedded-payroll businesses, but could not get live answers on state coverage for NJ/NY/PA construction and home-care jurisdictions specifically, sandbox access, current pricing, or willingness to let Aether own the customer-facing logo. That requires direct sales conversations — Section 9 of the Feasibility Study lists this as the first of three verifications that should close before Stage I capital is spent on an integration effort. Budget one to two weeks of outbound to get Check, Zeal, and Salsa on a call before this ADR's status changes from "Proposed" to "Accepted."

## Consequences

Once a rail is chosen, `services/rail-adapter` becomes the only place in this codebase that talks to it, per the "tools write exceptions; models never call ACH" boundary in `03-Product-OS/README.md`. The reference data model (`data/reference-data-model/schema.sql`) and the Exception object (`packages/schemas/exception.schema.json`) were deliberately built rail-agnostic and do not need to change regardless of which vendor wins this ADR.
