# Aether — Build-Out Map

This folder is the answer to one question: *what folders and files does it actually take to manifest Aether — the "AI Workforce Operating System" described in the four source documents — as a real company and a real product?*

It sits alongside the original planning documents (`Aether_Ambition_Build_Plan.pdf`, `Aether_Workforce_OS_Concept_Deck.pptx`, `Aether_Workforce_OS_Full_Build.pdf`, `Aether_Workforce_OS_Operating_Plan.docx`, `Notes .docx`) one level up, in `Rosters/`. Those five are the concept. Everything below is the start of the build.

Two kinds of work live in this tree, and they are kept in separate top-level branches on purpose, because they require different things from you:

- **Company-operations scaffolding** (`02-Company-Ops/`) — legal, banking, insurance, hiring, fundraising, vendor contracts. This is "Stage I — Sovereignty" from the Ambition Build Plan. None of it can be completed by an AI session: it requires you, a lawyer, a bank, and signatures. What's here are the checklists, trackers, and document templates that make that work executable instead of remembered.
- **Product-OS scaffolding** (`03-Product-OS/`) — the actual software: schemas, rules, sample data, architecture decisions, service boundaries. This is "Stage II — The Living Spec." This part *can* be built now, in an editor, independent of entity formation, bank accounts, or which payroll rail you eventually sign — and a working slice of it already has been (see what's populated, below).

Everything is numbered in the rough order the source plan itself sequences work, though — per the plan's own "six streams, no waiting room" — the intent is to run several of these in parallel, not wait for one to finish before starting the next.

## The full tree

```
Aether-Buildout/
│
├── README.md                          ← you are here
│
├── 01-Feasibility/
│   ├── Aether_Feasibility_Study.docx  ● populated — market/competitive/regulatory/
│   │                                    technical/financial/operational feasibility,
│   │                                    risk register, go/no-go recommendation
│   └── build_feasibility.js            ● populated — source script (docx-js), kept so
│                                          the study can be regenerated after edits
│
├── 02-Company-Ops/                     Stage I — Sovereignty (human/legal action required)
│   ├── 00-entity-and-legal/            entity formation docs, cap table, domain
│   │                                    registration, employment-tax counsel engagement
│   ├── 01-banking-and-finance/         business banking, Stage-I cash-needs model,
│   │                                    runway tracker
│   ├── 02-insurance-and-risk/          cyber, E&O, and crime coverage binders
│   ├── 03-compliance-and-trust/        SOC 2 evidence locker, security policies,
│   │                                    the GRC owner's working files
│   ├── 04-hiring-and-team/             ○ populated — role briefs + a sourcing tracker
│   │                                    for the "spine" hire and the rules engineer
│   ├── 05-fundraising-and-investors/   cap table scenarios, investor pipeline, the
│   │                                    walk-in deck (already exists as the Concept Deck)
│   └── 06-vendor-and-partner-contracts/ rail contract, bank/EWA partner agreement,
│                                        SOC 2 auditor engagement letter — trackers only
│
├── 03-Product-OS/                      Stage II — The Living Spec (buildable now)
│   ├── README.md                       ● populated — the technical map of this repo
│   ├── apps/
│   │   ├── operator-console/           the exception queue + cash position view
│   │   ├── employee-app/               pay stub, earned-balance, coach card
│   │   └── ceo-dashboard/              Health Score, next-3-payrolls, credits in flight
│   ├── services/
│   │   ├── control-plane/              org / workplace / employee / pay-period / roles
│   │   ├── copilot-exceptions/         the exception-detection agent workflow
│   │   ├── compliance-engine/          rules-pack evaluator (reads data/rules-packs)
│   │   ├── tax-credit-scanner/         rules + retrieval credit finder (no LLM-only claims)
│   │   ├── labor-forecast/             predictive labor-cost model
│   │   ├── health-score/               the 0–100 workforce health metric
│   │   └── rail-adapter/               the one thin integration boundary to whichever
│   │                                    embedded payroll rail is chosen — see the ADR
│   ├── packages/
│   │   ├── schemas/                    ● populated — the canonical Exception object
│   │                                    (JSON Schema) and reference-data-model types
│   │   └── ui-kit/                     shared design tokens/components across the 3 apps
│   ├── data/
│   │   ├── reference-data-model/       ● populated — Postgres DDL for the minimum
│   │   │                                 data model specified in the Full Build doc
│   │   ├── rules-packs/                ● populated (NJ) / ○ stubbed (NY, PA) — wage,
│   │   │   ├── construction/{NJ,NY,PA}   overtime, and leave rules per vertical × state
│   │   │   └── home-care/{NJ,NY,PA}
│   │   └── synthetic-crews/            ● populated — a synthetic NJ construction crew
│   │                                    with 5 planted payroll errors, for testing the
│   │                                    copilot without touching real workforce data
│   ├── infra/
│   │   ├── environments/               isolated cloud / separate keys checklist —
│   │                                    "empty production" from Stage I
│   │   └── security/                   least-privilege agent policy, audit-log spec
│   └── docs/
│       ├── architecture-decision-records/
│       │   └── 0001-embedded-payroll-rail.md   ● populated — Check vs. Gusto Embedded
│       │                                          vs. Salsa vs. Zeal, with a recommendation
│       ├── exception-object-spec.md    ● populated — the canonical object, in prose,
│       │                                cross-referenced to the JSON Schema
│       └── api-contracts/              control-plane ⇄ rail-adapter interface, once
│                                        a rail is chosen
│
├── 04-GTM-and-Sales/
│   ├── design-partner-pipeline/        ● populated — tracker template for the 20
│   │                                    Phase-0 design-partner firms
│   ├── pricing-and-unit-economics/     ● populated — the PEPM / credit-share / EWA
│   │                                    calculator, rebuilt on the current-law tax-
│   │                                    credit baseline from the Feasibility Study
│   └── proof-artifact-templates/       ● populated — the "credit scan + dummy
│                                        exception queue" leave-behind template
│
├── 05-Implementation-and-Runbooks/
│   └── 30-day-migration-runbook.md     ● populated — the day-by-day parallel-run
│                                        runbook, expanded from the Full Build table
│
└── 06-Risk-and-Governance/
    ├── risk-register.md                ● populated — consolidated + this session's
    │                                    two new findings (WOTC lapse, copilot parity)
    └── conditions-that-reset-the-board.md   ● populated — the plan's own early-warning
                                              signals, kept as a living checklist
```

`●` = real, substantive content exists there today. `○` = a starter file exists but needs your input to be useful. No marker = a named folder that isn't built yet — every one of these (all fourteen are inside `03-Product-OS/apps`, `services`, `packages/ui-kit`, `infra`, and `docs/api-contracts`) now holds a short `README.md` explaining specifically what belongs there and what it depends on, so opening the folder is never a dead end. The `02-Company-Ops` folders are the exception worth calling out separately: their `README.md` files are checklists, because the artifact that ultimately belongs there is a contract, a bank account, or a signature — not something a file generator can produce in a vacuum.

## Why the split between "Company-Ops" and "Product-OS" matters

The Ambition Build Plan is explicit that Stage I and Stage II can run at once — "no waiting room." In practice, they need different owners. `02-Company-Ops` is mostly checklists and trackers because the actual artifacts (an operating agreement, a business bank account, a SOC 2 audit engagement) come from a lawyer, a bank, and an auditor, not from a document generator. `03-Product-OS` is the part where an AI session and a small engineering effort can produce real, working artifacts today — a schema is a schema whether or not the entity is incorporated yet — which is why that branch is where most of this build cycle's actual output landed.

## What to open first

If you only look at three things: `01-Feasibility/Aether_Feasibility_Study.docx` for the grounded go/no-go, `03-Product-OS/docs/architecture-decision-records/0001-embedded-payroll-rail.md` for the one technical decision that unlocks most of the rest of Stage II, and `06-Risk-and-Governance/risk-register.md` for the two things that changed since the source documents were written this same month.

## What happens next

This is one build cycle, not the last one. The natural next cycles, in the order they unlock the most downstream work: (1) get live answers from Check, Zeal, and Salsa to turn the rail ADR from a research-based recommendation into a signed sandbox; (2) get the EWA legal memo for NJ/NY/PA so `services/rail-adapter` and the employee-app's earned-balance screen can be built against a real design instead of a placeholder; (3) fill out the NY and PA rules packs once NJ's is validated against a real payroll run. None of the three block starting; they block finishing.
