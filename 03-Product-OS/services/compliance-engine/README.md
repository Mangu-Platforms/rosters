# Compliance Engine

Not built yet. Evaluates `data/rules-packs/**/rules.yaml` against the workforce in the control plane and produces `approval` rows (entity-wide alerts like the NJ minimum-wage example) or `exception` rows (per-employee, per-pay-run issues). Do not let this service claim coverage for a vertical × state whose rules pack is still a `status: stub`.
