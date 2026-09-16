# Aether — Workforce OS

Playable Stage II console for Rosters / Aether.

Rent the rail. Own the brain. Check or Zeal files and pays. Aether owns the exception object, NJ rules packs, credits, certified payroll, and a human gate that never auto-applies money.

## Demo companies

- Palisade Builders LLC (NJ construction) — open period 7–20 Sep 2026, pay date 25 Sep. Five planted errors including Tyler under the NJ floor.
- Harbor Home Care LLC — unpaid travel time between clients.

Operator: Dana Chen. Owner: Robert Palisade. Default employee: Maria Delgado.

## Routes

- `/` marketing home
- `/app` operator command
- `/app/exceptions/:id` human gate
- `/app/payroll` pay run (blocked while exceptions pending)
- `/app/people` roster + hire wizard
- `/app/certified` WH-347 + attach NJDOL packet
- `/ceo` owner dashboard
- `/me` employee clock + earned balance (EWA gated)

## Run locally

```bash
cd apps/aether
npm install
npm run dev
```

## Vercel

Root directory: `apps/aether`. Framework: Vite. SPA rewrites in `vercel.json`.
Auth off. DB off. In-memory Zustand. No dollars move.
