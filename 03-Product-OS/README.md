# Aether Product OS

This is the software side of Aether: the parts of "Stage II — The Living Spec" that can be built and tested before an embedded payroll rail is signed, before the entity is incorporated, and before any real workforce data exists.

## Design principle: rent the rail, own the brain

Every folder here respects one boundary, taken directly from the source Operating Plan: **tools write exceptions; models never call ACH.** Nothing in this repo moves money or files a tax return. `services/rail-adapter/` is the single, thin seam where Aether's system of record talks to whichever embedded payroll provider is chosen (see the ADR in `docs/architecture-decision-records/`); everything else — the copilot, the compliance engine, the credit scanner, the forecast, the Health Score — operates on data, never on payment rails directly.

## Layout

- **`apps/`** — the three production surfaces (operator console, employee app, CEO dashboard) plus **`apps/stage-ii-model/`**, a runnable Vite + React visual model of Palisade Builders. Five planted errors speak English; an approver can lock a previewed run; nothing ACHs. The three named apps remain the production split. The model is the Stage II acceptance test made touchable.
- **`services/`** — one directory per module in the v1 + v1.1 bundle (copilot, compliance engine, tax-credit scanner, labor forecast, Health Score), plus `control-plane` and `rail-adapter`. Each is a placeholder for a real service; what's real today is the data model, the contracts, and the visual model.
- **`packages/schemas/`** — the canonical Exception object as a JSON Schema.
- **`data/`** — Postgres DDL, compliance rules packs, and the synthetic NJ construction crew with planted errors.
- **`infra/`** — isolated cloud / separate keys checklist and least-privilege agent policy.
- **`docs/`** — ADRs, the Exception object spec, API contracts, and `white-paper.md`.

## How this maps to the plan's own milestone

Stage II of the Ambition Build Plan is explicit about when it's "complete": *"a synthetic crew can be loaded, five planted errors speak English, and an approver can lock a previewed run. No dollars have to move."* That milestone is now visible in `apps/stage-ii-model/`. `data/synthetic-crews/` and `packages/schemas/exception.schema.json` remain the fixtures; `services/copilot-exceptions` is the next real service.

## What this repo deliberately does not contain

No payment code. No tax-filing code. No code that holds a customer or employee balance. No training of any model on identifiable payroll data.
