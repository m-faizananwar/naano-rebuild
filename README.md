# naano-rebuild

Rebuild of the naano creator marketplace. Next.js 16 (App Router), TypeScript,
Tailwind v4, shadcn (neutral), Drizzle + Postgres on Supabase, deployed on Vercel.

## Run

```bash
pnpm install
cp .env.example .env.local   # fill in the values (see comments in the file)
pnpm dev                     # http://localhost:3000
```

| Command            | What                                              |
| ------------------ | ------------------------------------------------- |
| `pnpm typecheck`   | `tsc --noEmit`                                    |
| `pnpm lint`        | ESLint (rules in `eslint.config.mjs`)             |
| `pnpm test`        | Vitest, unit tests for pure logic                 |
| `pnpm build`       | Production build                                  |
| `pnpm db:generate` | Drizzle migration from `src/db/schema.ts`         |
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

Supabase clients live in `src/features/auth/supabase/`: `browser.ts` (client
components), `server.ts` (cookie-backed, RLS applies), `service.ts` (service
role, `server-only`).

## What's real vs stubbed

| Area                                   | Status                                         |
| -------------------------------------- | ---------------------------------------------- |
| Deploy pipeline, `/api/health`, CI     | real                                           |
| Drizzle wiring, migrations, seed       | wired, schema empty, seed is a no-op           |
| Supabase clients                       | wired, no auth flows yet                       |
| Home page                              | placeholder hello world                        |
| Marketplace, campaigns, collaborations, tracking, payouts | not started              |
