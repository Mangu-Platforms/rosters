# Design-Partner Pipeline (Phase 0)

Per the Feasibility Study's Section 9 sequencing and the source Full Build document's GTM section: Phase 0 is twenty firms, two verticals, one region — start with the Mid-Atlantic/Northeast, where NJ/NY/PA multi-state complexity is real, not synthetic. White-glove migration (see `05-Implementation-and-Runbooks/30-day-migration-runbook.md`), parallel-run two full pay cycles, and measure five things per partner: hours saved, credits found, EWA take-up, forecast error, and whether the admin would go back to their old system.

`design_partner_tracker.csv` is the working list. Fill it in as firms are identified — the Ambition Build Plan's own instinct is blunt about the funnel: *"Name fifty operators. Call until three will run beside you."* Twenty rows here is the Phase-0 target list, not a guarantee of twenty design partners; expect to work through more than fifty names to land the first cohort.

## Do not sell first (from the Operating Plan, Section 4)

Skip these even if they're enthusiastic: sub-20-employee startups (Gusto's gravity is real and the pain is too thin), pure salaried professional-services firms with one state and no overtime complexity, and any public enterprise already three years into a Workday program. None of them will produce the two-vertical, hourly-heavy, multi-state signal Phase 0 needs.

## Columns

- **vertical** — construction or home_care only for Phase 0, per the beachhead in ADR-level product decisions.
- **state** — should skew NJ, with NY/PA as the "corridor" the plan names.
- **outreach_status** — not_contacted / contacted / meeting_booked / evaluating / signed / declined / not_a_fit.
- **migration_status** — maps to the 30-day runbook's own stages: ingest / employees_loaded / shadow / parallel_1 / parallel_2 / live.
- **would_go_back** — the single most important field to fill in honestly once a firm is live. This is the number Phase 1's sales motion gets built on.
