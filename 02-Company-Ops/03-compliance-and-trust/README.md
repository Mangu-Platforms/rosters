# Compliance & Trust (SOC 2 / GRC)

This is the "Trust" stream from the Ambition Build Plan's six-streams table: *"GRC that treats SOC as product → a house a CFO will enter."*

## Checklist

- [ ] Engage a SOC 2 auditor. Feasibility Study Section 6 has real 2026 cost/timeline figures: Type I is realistically $20,000–$60,000 all-in over 2–3 months with no monitoring period; Type II adds $30,000–$80,000 and a mandatory 3-month monitoring window on top, landing realistically at month 9–12 from a standing start.
- [ ] Start Type I immediately at Stage I — it does not need to wait for revenue or for a rail decision.
- [ ] Stand up the security policies the audit will check: least-privilege access (see `../../03-Product-OS/infra/security/`), encryption at rest and in transit, and an audit trail for every agent action that touches pay (already designed into the `exception.audit_hash` field — see `../../03-Product-OS/docs/exception-object-spec.md`).
- [ ] Build the evidence locker — screenshots, config exports, and policy documents an auditor will ask for — incrementally, rather than assembling it in a scramble right before the audit window opens.
- [ ] Publish a public status page for payroll filings once live, per the risk-mitigation language in the Ambition Build Plan and the Feasibility Study's risk register (item 4).

## What to file here once it exists

SOC 2 audit engagement letter, the Type I and (later) Type II reports themselves, security policy documents, and the evidence locker.
