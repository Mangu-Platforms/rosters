# Compliance Rules Packs

Structured inputs for `services/compliance-engine`, one file per vertical × state, per the Operating Plan's own instruction: rules are written "as tests, not as essays." This directory is data, not prose — the engine reads `rules.yaml`, evaluates each rule against the workforce loaded in the reference data model, and produces `approval`-table rows (or `exception`-table rows, for anything with a per-employee dollar impact) when a rule and the actual workforce disagree. The New Jersey minimum-wage alert example used throughout the source documents — *"New Jersey minimum wage changes in 45 days… Approve the wage-floor increase now or on the statutory date"* — is exactly what a `minimum_wage` rule with a future `effective_date` is for.

## Format

```yaml
vertical: construction
state: NJ
status: active            # active | stub
last_reviewed_by_counsel: null   # date, once employment-tax counsel has signed off — see caveat below
rules:
  - rule_id: nj-construction-min-wage-2026
    category: minimum_wage
    description: "Plain-language description of what this rule checks."
    statute_ref: "N.J.S.A. 34:11-56a4 (illustrative — confirm citation with counsel)"
    effective_date: "2026-01-01"
    parameters:
      hourly_minimum_usd: 15.49
    source_confidence: verified_this_session   # verified_this_session | carried_from_source_docs | placeholder_needs_research
    needs_counsel_review: true
```

`source_confidence` is there so nobody mistakes a placeholder for a verified figure six months from now. `needs_counsel_review: true` on every rule in this directory is not boilerplate — it is the literal instruction from both the Ambition Build Plan ("counsel reads the design in every state you touch") and the Feasibility Study (Section 4): **nothing in this directory should reach a live payroll run before employment-tax counsel has signed off on it per state.** These files are a starting structure and a best-effort draft of the parameters, not a compliance certification.

## Status by vertical × state

Per the Feasibility Study and the source plan's own instinct to "own the five verticals in the states they actually operate" rather than claim national coverage on day one, only the two beachhead verticals × the anchor state are drafted with real parameters. New York and Pennsylvania are structural stubs — the file exists, the format is right, the values are not filled in — to be completed once the New Jersey pack has been validated against an actual parallel-run pay cycle, per the 30-day migration runbook.

| Vertical | NJ | NY | PA |
|---|---|---|---|
| Construction | drafted | stub | stub |
| Home care | drafted | stub | stub |
