# First 18 Months — Role Briefs

Source: `Aether_Workforce_OS_Operating_Plan.docx` Section 15, cross-checked against the Feasibility Study's Section 7 (Operational & Team Feasibility). The plan's own instruction stands: *"Do not hire a marketplace manager, a content brand studio, or a Head of AI with no payroll graph in year one."*

## The two hires to start sourcing immediately, in parallel with entity formation

### Payroll operations lead ("the spine")

**What they owe the company:** the person who has already been in the room when a tax deposit went wrong, and knows exactly what that costs. Not a hire in the normal sense — the Ambition Build Plan calls this person "the spine."

**Why source now:** the Feasibility Study flags this as a narrow, senior, scar-tissue role with a realistic 2–4 month search even with a strong network. It sits on the critical path to Stage II because the compliance rules packs (`../../03-Product-OS/data/rules-packs/`) and the rail ADR both need this person's judgment before they can move from "drafted" to "counsel-reviewed and production-ready."

**Where to look:** payroll operations leadership at a PEO, at ADP/Paychex/Gusto-scale incumbents, or at a startup that has already been through a filing failure and survived it.

### Compliance counsel + rules engineer (two distinct jobs, per the source plan)

**What they owe the company:** counsel turns statutes into legal positions; the rules engineer turns those positions into the structured `rules.yaml` entries the compliance engine actually runs. Pre-seed, counsel can realistically be a fractional/outside employment-tax and fintech specialist rather than a full-time hire — see `../06-vendor-and-partner-contracts/`.

**Immediate task once in place:** close the `needs_counsel_review: true` flag on every rule in `../../03-Product-OS/data/rules-packs/construction/NJ/rules.yaml` and `.../home-care/NJ/rules.yaml`, and resolve the EWA legal-design memo (Feasibility Study Section 4, risk register item 3).

## The rest of the first-18-months team (source after the two above are moving)

- **CEO/operator** who has sold into dirty-workforce industries — not only a SaaS generalist.
- **Applied ML / agent lead** willing to be measured on exception precision (the true-positive/false-positive rates referenced in `../../03-Product-OS/docs/exception-object-spec.md`), not demo polish.
- **Two vertical implementation people** who will sit at a customer's office-manager desk — see `../../05-Implementation-and-Runbooks/30-day-migration-runbook.md` for what they'll actually be doing.
- **A bank/treasury partner owner for EWA** — do not improvise money movement, per the source plan's explicit instruction.

## Explicitly not year-one hires

Marketplace manager, content/brand studio, "Head of AI" without a payroll graph to work from. If any of these roles start to feel urgent before the six streams above are staffed, that's worth treating as a signal on the "conditions that reset the board" checklist (`../../06-Risk-and-Governance/conditions-that-reset-the-board.md`), not just a hiring-plan update.
