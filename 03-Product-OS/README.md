# Aether Product OS

This is the software side of Aether: the parts of "Stage II — The Living Spec" that can be built and tested before an embedded payroll rail is signed, before the entity is incorporated, and before any real workforce data exists.

## Design principle: rent the rail, own the brain

Every folder here respects one boundary, taken directly from the source Operating Plan: **tools write exceptions; models never call ACH.** Nothing in this repo moves money or files a tax return. `services/rail-adapter/` is the single, thin seam where Aether's system of record talks to whichever embedded payroll provider is chosen (see the ADR in `docs/architecture-decision-records/`); everything else — the copilot, the compliance engine, the credit scanner, the forecast, the Health Score — operates on data, never on payment rails directly.

## Layout

- **`apps/`** — the three surfaces named in the Full Build doc's experience-design section: the operator console (exception queue, cash position, Health Score), the employee app (pay stub, earned balance, coach card), and the CEO dashboard (Health Score, next three payrolls, credits found, sites on fire). None of these have real UI code yet — they're placeholders until a frontend stack is chosen — but the data contracts they'll consume already exist in `packages/schemas/`.
- **`services/`** — one directory per module in the v1 + v1.1 bundle (copilot, compliance engine, tax-credit scanner, labor forecast, Health Score), plus `control-plane` (the org/workplace/employee/pay-period/roles system of record) and `rail-adapter` (the payroll-rail integration boundary). Each is a placeholder for a real service; what's real today is the data model and contracts they'll all share.
- **`packages/schemas/`** — the canonical Exception object as a JSON Schema, and the reference data model expressed as shared types. This is the actual, load-bearing content in this repo right now: every service above is meant to read and write objects that validate against these schemas, so building the schemas first (rather than any one service) is the highest-leverage thing to do before a rail is chosen or an engineer is hired.
- **`data/`** — the Postgres DDL for the reference data model, the compliance rules packs (structured as data, not code, per the plan's own instruction to write rules "as tests, not as essays"), and a synthetic New Jersey construction crew with planted errors, so the copilot's exception logic has something realistic to run against without touching a real employee's data.
- **`infra/`** — where the "isolated cloud, separate keys, empty production" instruction from Stage I becomes an actual environment checklist, and where the least-privilege / audit-every-agent-action posture from the Operating Plan's data section gets written down as policy before it's implemented.
- **`docs/`** — architecture decision records (start with 0001, the rail choice — nearly everything else in this repo is easier to finish once that one is closed), the Exception object spec in prose form, and API contracts between the control plane and whatever rail is chosen.

## How this maps to the plan's own milestone

Stage II of the Ambition Build Plan is explicit about when it's "complete": *"a synthetic crew can be loaded, five planted errors speak English, and an approver can lock a previewed run. No dollars have to move."* That milestone is the acceptance test for this entire folder. `data/synthetic-crews/` and `packages/schemas/exception.schema.json` are the two pieces that make that milestone checkable today; `services/copilot-exceptions` is the piece that makes it real, and is the natural next build cycle once an engineer is on the schemas.

## What this repo deliberately does not contain

No payment code. No tax-filing code. No code that holds a customer or employee balance. No training of any model on identifiable payroll data, per the data posture in Section 7 of the Operating Plan. If a future addition to this repo would do any of those things, the Operating Plan's own law-is-terrain section and the Feasibility Study's Section 4 are the places to check first, not this README.
