# The Proof Artifact

Per the Full Build document's go-to-market section: *"The proof artifact in every deal: a credit scan plus a dummy exception queue on last month's data. If you cannot show dollars and mistakes on their file, you are selling a story."* This folder is where that artifact's template lives, so every sales conversation produces the same leave-behind instead of a one-off deck.

## What it is

Two things, built from a prospective design partner's own last month of payroll data (with their permission, under an NDA — this is real workforce data the moment it's requested, and should be handled under the same data posture as production, not as a sales exception):

1. **A credit scan.** Run `services/tax-credit-scanner`'s logic (or, before that service is built, the underlying rules manually) against the prospect's actual entity and workforce to produce a real, specific number: *"Your business appears to qualify for $X in documented incentives."* Per the Feasibility Study, this should be built on state hiring/training credits and the R&D payroll-tax offset as the base case, with WOTC called out separately and explicitly marked contingent on federal renewal — never blended into one number that implies certainty a lapsed federal credit doesn't currently have.
2. **A dummy exception queue.** Load the prospect's own last-month time and pay data into a non-production Aether instance and run the copilot's exception detection against it (see `services/copilot-exceptions` and the reference rules baseline in `data/synthetic-crews/load_and_detect.py` for what this looks like structurally). Show the actual exceptions their own data produces, in the same plain-language format defined in `docs/exception-object-spec.md` — not a generic demo screen with placeholder names.

## Why it has to be their data

The Operating Plan's precision standard applies here too: this artifact is what makes the difference between "we have an AI copilot" (which Gusto and Rippling can now also say, per the Feasibility Study's Section 3) and "here is what your own payroll is currently missing." The second one is not reproducible by a generic demo, which is the entire point.

## Handling requirements

Treat any prospect data used to build this artifact as production-sensitive from the moment it's received: the same least-privilege access, encryption, and retention posture as a live customer, not a lighter sales-environment standard. If the prospect declines to share real data, the honest fallback is the synthetic NJ crew fixture in `data/synthetic-crews/` — clearly labeled as illustrative, never presented as if it were theirs.
