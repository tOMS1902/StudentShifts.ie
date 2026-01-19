# StudentShifts AI Instructions

## Architecture Snapshot
- StudentShifts is split into a Vite/React SPA ([App.tsx](../App.tsx)) and an Express 5 API ([server/index.ts](../server/index.ts)); run them separately (`npm run dev` for the client, `npm run server:dev` for the API) and keep cross-origin calls in mind.
- React mounts through `HashRouter` ([index.tsx](../index.tsx)), so navigation must stay hash-based until the API begins serving HTML routes.
- Styling is delivered entirely through the CDN Tailwind config in [index.html](../index.html); lean on the custom `magenta`/`warm` palette and glassmorphism helpers instead of importing other CSS frameworks.
- The front-end still consumes mock data/localStorage while the backend is production-grade; whenever you add a feature, decide explicitly which side is the source of truth.

## Frontend Conventions
- All React modules use ESM with explicit extensions (e.g., `import Layout from './components/Layout.tsx';`); keep this pattern so Vite + `type: module` Node resolution stays happy.
- Global UI switches, screen routing, and state live in [App.tsx](../App.tsx); new screens should piggy-back on the existing `Screen` union and reuse `Layout` tabs instead of adding new routers.
- Authentication UX is mocked in [components/AuthModal.tsx](../components/AuthModal.tsx) with the `user1`/`user2` credentials; keep those pathways working for demo flows even if you wire in real API calls.
- Profile data is cached under `localStorage` keys (`ss:profile:${email}`) before attempting API sync via [services/apiService.ts](../services/apiService.ts); preserve this offline-first write pattern.
- Job feeds come from `MOCK_JOBS` ([constants.tsx](../constants.tsx)) and are filtered client-side; prefer enriching this array or swapping in fetched data via `apiService` over duplicating filter logic elsewhere.

## Backend Conventions
- Express routes are versionless and mounted off `/auth`, `/profiles`, `/jobs`, and `/messages`; every mutation endpoint already expects JSON bodies and returns Mongo documents.
- JWT auth is centralized in [server/middleware/auth.ts](../server/middleware/auth.ts); attach Bearer tokens and pass required roles (e.g., `requireAuth(['employer'])`) rather than re-validating inside handlers.
- Models live in [server/models](../server/models) and follow simple Mongoose schemas; extend them here and let the auto `timestamps` capture audit data instead of sprinkling manual dates.
- Token signing throws if `JWT_SECRET` is missing ([server/utils/token.ts](../server/utils/token.ts)); always set `JWT_SECRET` alongside `MONGODB_URI` in `.env` before running `server:dev`.
- [database_schema.sql](../database_schema.sql) documents the intended Postgres layout but is not wired up; only touch it when working on the future SQL migration.

## Data & Messaging Flows
- Employers fetch jobs via `GET /jobs` (public) while posting requires an employer token; keep `employerId` sourced from the JWT payload (`req.user.id`).
- Students send messages through `POST /messages` and employers read them via `GET /messages` with optional `jobId`; honor the role guardrails already declared on each route.
- Student profiles are addressed by `/profiles/:userId` with strict ownership checks; when syncing from the UI, re-use the same payload shape currently saved to localStorage to avoid drift.

## Developer Workflows
- Install once with `npm install` at repo root; both client and server share the dependency tree thanks to workspaces not being used.
- Use `npm run dev` for the Vite client (defaults to port 5173) and `npm run server:dev` for the API (port 4000). There is no combined watcher, so run them in parallel terminals.
- `npm run build` targets the client only; the API is meant to be run with `npm run server:start` (tsx) when deploying or testing production-like behavior.
- Keep `.env` out of version control and document any new required variables inside the README after introducing them.

## Integration Tips
- `services/apiService.ts` is a stub that currently logs intent; when you add real fetch logic, mirror the existing method names so the UI change is minimal and localized.
- When adding new data fields, update `types.ts`, the relevant mock objects in [constants.tsx](../constants.tsx), and the matching Mongoose schema to keep the demo mode and API mode in sync.
- Prefer enriching existing shared components (`Layout`, `JobCard`, `AuthModal`) instead of duplicating markup—the design system purposefully centralizes navigation chrome there.
