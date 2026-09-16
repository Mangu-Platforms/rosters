# Operator Console

Production surface for the office manager: exception queue, cash vs tax deposit, pay-run lock, crew, time, compliance pack, credits, forecast.

The Stage II visual model that implements this surface lives in `../stage-ii-model/` (`/operator/*`). Build the production split against `packages/schemas/exception.schema.json` and the `approval` table in `data/reference-data-model/schema.sql`.
