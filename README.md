# naano-rebuild

Rebuild of the naano creator marketplace. Next.js 16 (App Router), TypeScript,
Tailwind v4, shadcn (neutral), Drizzle + Postgres on Supabase, deployed on Vercel.

## Run

```bash
pnpm install
cp .env.example .env.local   # DATABASE_URL already points at the docker db
pnpm db:up                   # postgres 16 in docker (needs Docker running)
pnpm db:migrate && pnpm db:seed
pnpm dev                     # http://localhost:3000 → /login → "Explore as demo brand / creator"
```

Demo accounts (seeded): `brand@demo.naano` and `creator@demo.naano`, password `demo1234`.
`pnpm db:reset` drops the volume and rebuilds everything from the seed.

| Command            | What                                              |
| ------------------ | ------------------------------------------------- |
| `pnpm typecheck`   | `tsc --noEmit`                                    |
| `pnpm lint`        | ESLint (rules in `eslint.config.mjs`)             |
| `pnpm test`        | Vitest, unit tests for pure logic                 |
| `pnpm build`       | Production build                                  |
| `pnpm db:up`       | Start Postgres 16 in docker-compose               |
| `pnpm db:generate` | Drizzle migration from `src/db/schema/`           |
| `pnpm db:migrate`  | Apply migrations to `DATABASE_URL`                |
| `pnpm db:seed`     | Seed data (`scripts/seed.ts`)                     |

CI (`.github/workflows/ci.yml`) runs typecheck + lint + test on every push.
Smoke test after every deploy: `GET /api/health` → `{ ok, db, commit }`.

## Architecture

```
src/app                      routes only; page.tsx calls a query, renders a view
src/features/<domain>/
  components/                views
  server/queries.ts          reads  (DTOs out, never drizzle rows)
  server/actions.ts          writes (server actions, zod validated, { ok, ... })
  schemas.ts                 zod: single source of truth for form/action/dto
  constants.ts
src/db                       drizzle client + schema; only features/*/server imports it
src/lib                      pure functions only (money, dates, fit score)
src/components/ui            shadcn output, not edited
src/components               shared composites
```

Domains: `auth`, `marketplace`, `campaigns`, `collaborations`, `tracking`, `payouts`.
Full rules: `CLAUDE.md` → "Engineering rules". Layer boundaries are lint-enforced.

Auth is our own: `users` (bcrypt password hash), `sessions` (hashed token,
httpOnly cookie, CSRF token per session checked on mutating actions),
`src/proxy.ts` guards `/brand/*` and `/creator/*`, the layouts check the role.
Registration copies naano's flow minus the 6-digit email code — there is no
email provider in this build, so the step is skipped on purpose.

Without `DATABASE_URL` every workspace screen renders a "database not
configured" state instead of failing; `/api/health` is the only thing that
reports it as an error (503).

## What's real vs stubbed

| Area                                   | Status                                         |
| -------------------------------------- | ---------------------------------------------- |
| Deploy pipeline, `/api/health`, CI     | real                                           |
| Postgres schema, migration, seed       | real — 300 creators, 3 brands, every collaboration state, clicks, ledger |
| Auth, sessions, demo login, register   | real (no email verification step)              |
| Collaboration state machine            | real, unit-tested; `transition()` is the only status writer |
| Brand + creator shells, every tab      | real routes; most screens are still header + empty state |
| Landing page                           | placeholder                                    |
| Marketplace, campaigns, collaboration screens, tracking, billing | next build steps |
