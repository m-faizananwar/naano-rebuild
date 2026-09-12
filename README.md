# naano-rebuild

Rebuild of the naano creator marketplace (B2B brands book LinkedIn creators, track clicks → leads per post, pay
through the platform). Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn, Drizzle + Postgres, Vercel.

Live: https://naano-rebuild-ashy.vercel.app · smoke test: `GET /api/health` → `{ ok, db, commit }`.

## Run

```bash
pnpm install
cp .env.example .env.local   # DATABASE_URL already points at the docker db
pnpm db:up                   # postgres 16 in docker (needs Docker running)
pnpm db:migrate && pnpm db:seed
pnpm dev                     # http://localhost:3000 → /login → "Explore as demo brand / creator"
```

Demo accounts (seeded): `brand@demo.naano` (Zune) and `creator@demo.naano`, password `demo1234`.
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
| `pnpm db:seed`     | Seed data (`scripts/seed/`)                       |

CI (`.github/workflows/ci.yml`) runs typecheck + lint + test on every push.

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
src/lib                      pure functions only (money, fit score, state machine, estimator)
src/components/ui            shadcn output, not edited
src/components/shell, page   app shell and page primitives
```

Domains: `auth`, `marketplace`, `campaigns`, `collaborations`, `tracking`, `payouts`, plus `workspace` (overviews,
settings, integrations, community, affiliate, notifications) and `public` (marketing site). Full rules: `CLAUDE.md` →
"Engineering rules"; layer boundaries are lint-enforced. Plan and data model: `docs/plan.md`.

**Auth** is our own: `users` (bcrypt), `sessions` (hashed token, httpOnly cookie, CSRF token per session),
`src/proxy.ts` guards `/brand/*` and `/creator/*`, the layouts check the role. Registration copies naano's flow minus
the 6-digit email code — no email provider, skipped on purpose. LinkedIn/Google sign-up buttons are visual.

**Without `DATABASE_URL`** every workspace screen renders a "database not configured" state instead of failing, the
public site still renders (with static fallbacks), and `/api/health` is the only thing that reports it (503).

**Collaboration state machine** (`src/lib/collaboration-status.ts`, tested against every combination):
invited/applied → accepted/declined → draft_submitted ⇄ changes_requested → approved → scheduled → live → paid.
`features/collaborations/server/transition.ts` is the only status writer; it also holds/releases the booking fee,
creates the tracking link on accept and records payouts on live/paid. Invitations are funded: the fee is held from
the brand's wallet when sent.

**Brand › Creators** (`src/features/marketplace`). 300 seeded creators ranked by `fitScore()` (audience overlap with
the ICP, category match, engagement vs size benchmark, posting consistency — with a one-line reason) against the
campaign chosen in "Fit for". Filters, sort, search, tab and page live in the URL; bookmarks persist in `shortlist`.
"Book" opens naano's "Your selection" dialog; "Make an offer" (10/20/30% presets, post-by date, campaign brief,
approve-first) creates a funded invitation. AI Matching ("Nao") ranks with the same score and writes a rationale with
Claude when `ANTHROPIC_API_KEY` is set, otherwise a deterministic template — the UI labels which.

**Brand › Campaigns** (`src/features/campaigns`). Cards with creator / published / committed-budget counts from rows.
Chooser: "Create with AI" (prompt + value prop + ICPs → draft brief, Claude or template, labelled), "Start from your
link" (stores the URL, brief from the workspace profile — says so), "Naano team" → book-a-call stub. Drafts go through
the launch stepper (basics → brief editor → pick creators by fit → review with the pre-spend estimator from naano's
Q2 2026 benchmarks, `src/lib/estimator.ts`) and launch sends funded invitations, reporting any the wallet can't cover.
Detail tabs: Collaborations · Brief · Shortlist · Analytics (daily clicks from the clicks table).

**Tracking** (`src/features/tracking`). `/r/{code}` is one insert + one 302; the click id rides on a cookie and a
`?nn=` param. `/n.js` exposes `naano('track', type, props)` exactly like naano's pixel; `/api/pixel` stores the events.
`/demo/landing` is a stand-in customer site with the pixel installed — Zune's seeded links land there, so the whole
loop is clickable. Brand › Results shows reach, clicks, committed budget, clicks over time, attribution by creator with
visits/sign-ups/purchases, and a CSV export of the click log per creator — the audit trail.

**Money** (`src/features/payouts`). One ledger: top-ups, bookings (held on invite/accept), payouts (pending on live,
completed on paid), withdrawals. Brand › Billing and Creator › Earnings are views over it; withdrawal is a real action
against the available balance. No Stripe: the add-budget dialog is deferred and withdrawals use a demo rail.

**Public site** (`src/features/public`): `/`, for-creators, for-agencies, pricing, faq, case-study, about, benchmarks.
Copy and marketing figures are naano's published claims (`constants.ts`, `page-copy.ts`, `benchmarks-data.ts`), not
measurements. The landing page's showcase and "real posts" sections read seeded creators/posts; clicks and leads there
are estimated from the benchmarks and labelled "est.". Video testimonials are poster cards; logos are text wordmarks.

## What's real vs stubbed

| Area | Status |
| --- | --- |
| Auth, sessions, demo login, register | real (no email verification) |
| Seed: 300 creators, 3 brands, every collaboration state, clicks, ledger | real |
| Collaboration state machine + funded bookings | real, tested |
| Brand: overview, creators marketplace, profile modal, booking/offer dialogs, AI matching | real (Claude path needs a key; template otherwise) |
| Brand: campaigns, AI/link/team chooser, brief editor, launch stepper, estimator, detail tabs | real (link flow does not fetch the URL) |
| Brand: results, pixel, click log CSV; billing ledger | real; add-budget dialog deferred |
| Creator: overview, opportunities, collaborations, detail actions; brand collaborations + review/pay; messages | stream C — see git log for status |
| Creator: analytics, earnings + withdrawal, settings, community, affiliate, tour, integrations | real; Slack/Stripe/MCP endpoint not wired |
| Settings (brand profile/audience/team), notifications | real; team invites need email (says so) |
| Public site, register/login visuals | real, static copy |
| Onboarding (website analysis, creator card steps 2–4), Stripe, email codes, LinkedIn import, X/YouTube, FR, agency mode, MCP endpoint, calendar booking | not built |
