# 30-Day Migration Runbook

Source: expanded from the migration table in `Aether_Workforce_OS_Full_Build.pdf`, Section 11 ("30-day migration runbook: migration is the product. HCM companies die here.") This is the operational script for taking one design-partner employer from a signed agreement to a live, filed, paid payroll run on Aether — concierge-supported for at least the first fifty logos, per the Operating Plan's team-shape and pricing sections.

**Owner:** the two vertical-implementation hires named in the Feasibility Study's Section 7 team list, not a generalist customer-success rep. **Do not compress this timeline to win a logo faster** — the exit tests exist because HCM implementations that skip them are the ones that die in front of a customer's CFO.

## Days 1–3 — Ingest

Pull the customer's legal entities, workplaces, bank details, and tax IDs, plus their prior processor's most recent export.

- Confirm every legal entity and workplace against the customer's actual formation documents and worksite addresses — not just what the prior processor had on file.
- Confirm tax IDs (federal EIN, state withholding ID, state unemployment ID) for every jurisdiction the workforce actually touches.
- Import the prior processor's raw export as-is, including its formatting quirks. Per the source doc: *"every real payroll export is uglier than the deck. That ugliness is the work."*

**Exit test:** every legal entity and workplace in Aether matches reality — not the prior system's records, the actual jobsites and entities.

## Days 4–8 — Employees, codes, deductions, time source

- Load every employee, their employment periods, roles, and rates into the control plane.
- Map the prior processor's earning and deduction codes onto Aether's `earning_code` / `deduction_code` tables — do not silently invent new codes that don't reconcile to the prior system's categories.
- Confirm the time source (clock system, paper timesheets, or Aether Time if in scope) and get at least one full cycle of raw time data flowing in.

**Exit test:** headcount and year-to-date totals reconcile to the customer's last stub from the prior processor, employee by employee.

## Days 9–14 — Shadow calculation

- Recalculate the customer's last two already-paid pay runs inside Aether, using the real historical time and rate data, without telling the customer's team the results yet.
- Every variance between Aether's recalculation and what was actually paid gets a named reason: a code mapping gap, a rate that changed mid-period, a rounding difference, or a real error in the prior system.

**Exit test:** the variance list is complete and every line has an owner and a reason — not "close enough."

## Days 15–22 — Parallel run #1

- Run a live upcoming pay period through Aether in parallel with the prior processor, with the AI Payroll Copilot's exception queue turned on for the customer's own office manager to use.
- The office manager clears the exception queue themselves, with concierge support available but not doing the work for them — the exit test is whether *they* can do it, not whether Aether's team can.
- Nothing is filed and nothing is paid from Aether yet. This period's real payroll still runs through the prior processor.

**Exit test:** the office manager completes the exception queue in under two hours, unassisted for at least half of it.

## Days 23–28 — Parallel run #2

- Run a second parallel period. This time, generate a live tax preview and, if EWA is in scope for this customer, set the initial EWA pool cap from the AI cash-flow forecast.
- The tax preview needs to be clean enough that the owner or CFO is willing to write the go-live sentence themselves — per the source doc, that sentence, not a calendar date, is the actual release gate.

**Exit test:** the owner signs off on go-live in their own words, unprompted.

## Days 29–30 — Cutover

- Run the first live pay period on Aether: real filing, real payment, real dollars.
- The prior vendor is placed on a 30-day freeze, not terminated immediately — if anything about the first live run needs the old system as a fallback, that window is what makes reverting a written, practiced act rather than a scramble.

**Exit test:** first live pay run completes, taxes are confirmed filed, and the revert-to-prior-processor path has been walked at least once in a rehearsal, per the Ambition Build Plan's Stage III release criteria (two humans on the release, someone awake around payday, the revert path already exercised).

## After day 30

The runbook's job isn't done when the first live run posts — it's done when this customer stops needing concierge support to run a normal cycle. Track, per customer: hours saved versus the prior system, credits found, EWA take-up if applicable, forecast error on the first published forecast-versus-actual, and — the honest question — whether the office manager would go back to the old system if given the choice. Those five numbers are also exactly what Phase 0's twenty design partners are supposed to produce in aggregate, per the Feasibility Study's GTM section.
