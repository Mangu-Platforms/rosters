# Rail Adapter

Not built yet. The single, thin integration boundary to whichever embedded payroll provider wins ADR 0001 (`docs/architecture-decision-records/0001-embedded-payroll-rail.md`). This is the only service allowed to talk to the rail's calculation, filing, or money-movement APIs — see the "tools write exceptions; models never call ACH" boundary in this repo's root README.
