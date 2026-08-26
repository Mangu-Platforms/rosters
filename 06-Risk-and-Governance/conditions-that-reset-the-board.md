# Conditions That Reset the Board

Verbatim in spirit from `Aether_Ambition_Build_Plan.pdf`: *"Not moral failure. Signal."* These are not KPIs to hit — they're tripwires. If one fires, the response is to change the plan, not to push through it. Kept here as a living checklist rather than left inside the static PDF, so it can actually be checked against reality on a cadence, and so this session's two additions sit next to the originals instead of in a separate document nobody re-reads.

## From the source plan

- [ ] A live run you owned is late, and the revert path is not used at once.
- [ ] Admins learn to ignore the exception queue.
- [ ] The embedded rail will not let Aether own the customer relationship.
- [ ] The EWA design cannot be made clean in a launch state — the response is to change the design, not to abandon the company.
- [ ] Design partners shadow forever and never write the go-live sentence themselves — the product is not yet believed.
- [ ] Someone proposes building an in-house tax/filing engine because the rail "feels small" — check whether that's strategy or pride before acting on it.

## Added this session, given the Feasibility Study's findings

- [ ] **Congress renews WOTC retroactively, but the tax-savings engine's pitch and unit economics were never rebuilt on the current-law baseline in the meantime.** If this happens, the response isn't relief — it's a check that the credit-inventory diversification (state credits + R&D offset) actually happened rather than being deferred while waiting for a renewal that might not have come.
- [ ] **A design partner or investor asks "what do you have that Gusto's Cofounder doesn't," and the honest answer is still just "we also have a copilot."** If the bundle differentiation (vertical compliance depth, credit engine, employer-funded EWA) isn't landing as the actual pitch by the time this question comes up in Phase 1, that's a positioning failure worth fixing before the next ten conversations, not after.
- [ ] **A target state (beyond Maryland/Connecticut) reclassifies employer-funded EWA as lending, or the federal EWA bill passes in a form that changes the compliance map.** Either event should trigger an immediate re-review of `services/rail-adapter`'s EWA design and every rules pack with an `overtime` or `paid_leave` category touching that state — not a wait-and-see.

## How to use this

Check this list on a fixed cadence (monthly is reasonable pre-revenue; weekly once live payroll is running) rather than only when something already feels wrong — the point of a tripwire is that it fires before the obvious symptom does.
