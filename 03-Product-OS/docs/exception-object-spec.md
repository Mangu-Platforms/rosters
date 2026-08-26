# The Exception Object

The Exception is the single most important data shape in Aether. Every other v1 module either produces one (the copilot, the compliance engine) or consumes the trust that comes from getting it right (the CEO dashboard's "sites that are on fire," the Health Score's pay-anomaly component). This document is the prose version of `packages/schemas/exception.schema.json` and the `exception` table in `data/reference-data-model/schema.sql` — all three must describe the same object; if they ever disagree, the JSON Schema is the source of truth and the other two are wrong.

## What it is for

Per the Operating Plan: *"Treat the pay run as an agent workflow with a human gate on money."* An Exception is how that human gate works in practice. Something in the data (a time punch, a rate, a rule) disagrees with what was expected. The system's job is to say so in plain language, propose a fix, and require a named human to accept, reject, or note a reason — and to record all of that permanently, whether or not any money ever moves.

## The fields, and why each one exists

**source_id** — traces the exception back to the raw record that triggered it (a time punch, a rate lookup, a rule). Without this, "the copilot flagged something" is not debuggable.

**employee_id, pay_period, earning_type** — which person, which period, which kind of pay this concerns. `earning_type` should always resolve to a real `earning_code` in the reference data model, not a free-text guess.

**current_value, baseline_value, baseline_window** — the three fields that make an exception falsifiable rather than a vibe. `baseline_window` must always be statable in plain English ("12-week trailing average," "role on file," "statutory minimum wage 2026") — if a baseline can't be described that simply, it probably shouldn't be shown to an office manager yet.

**suggested_value** — optional by design. Some exceptions (a missing clock-out) don't have a computable correction; forcing a number here would manufacture false precision. Omit the field rather than sending a null — see `data/synthetic-crews/load_and_detect.py` for a worked example of both the "has a suggestion" and "no suggestion possible" cases.

**dollar_impact_employer, dollar_impact_employee** — also optional, for the same reason: a compliance exception like a minimum-wage floor breach affects every future pay period, not one line item, so forcing a single-period dollar figure would misstate it. When present, these are signed — negative means "the correction would reduce this run's cost," per the worked examples.

**explanation_plain** — the actual product. The Operating Plan's voice-of-product rule applies word for word: plain language, short sentences, numbers with denominators, never "leverage," never a bare confidence percentage on a money movement. `confidence_internal` exists precisely so that number has somewhere to live *other* than this field.

**confidence_internal** — internal only. Used to compute the true-positive / false-positive rates the Operating Plan says the copilot must be measured on ("Precision is the product"). A code reviewer should treat any code path that serializes this field into a customer-facing response as a bug, not a style issue.

**recommended_action, approver_id, decision, reason_code** — the human gate itself. `decision` starts `pending` and only becomes `approved`, `rejected`, or `noted_no_change` when a named `approver_id` acts. Money-moving corrections should never auto-apply from any other state.

**audit_hash** — per the Operating Plan's data-posture section: "every agent action that touches pay is audited: input snapshot, policy version, output, approver." The hash binds the exception to the exact inputs and policy/model version that produced it, so a later dispute ("why did the system say this") has a real answer.

**timestamp** — when the exception was generated. The data model's `decided_at` column (not part of this object) captures when a human acted on it; the gap between the two is itself a useful operational metric.

## Two examples worth keeping close

The bundled `examples` array in the JSON Schema is Maria's overtime exception from the source Operating Plan, verbatim in spirit: a 12-week-baseline OT spike traced to what looks like a clock-out miss. `data/synthetic-crews/planted_errors.md` extends this to all five of the errors the synthetic New Jersey crew fixture plants, with the exact plain-English explanation each one should produce — use it as a regression fixture, not just documentation, when `services/copilot-exceptions` moves from a rules baseline to a real model.
