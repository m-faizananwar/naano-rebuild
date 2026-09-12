# naano-rebuild

A working rebuild of [naano](https://naano.com), the B2B LinkedIn creator marketplace: brands book vetted creators at a
fixed price per post, creators write in their own voice, and every post's clicks, sign-ups and purchases are attributed
back to the creator through a tracked link and a pixel. Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn,
Drizzle + Postgres, deployed on Vercel.

**Live: https://naano-rebuild-opal.vercel.app** (auto-deployed from `main`; Postgres on Neon). Demo logins on `/login`:
**Explore as demo brand** (Zune) / **Explore as demo creator** — one click, no typing. Accounts `brand@demo.naano` /
`creator@demo.naano`, password `demo1234`, if you prefer the form. Smoke test: `/api/health`.

## How this was built

Two Claude Code sessions, one repo. One session mapped naano.com screen by screen (`docs/reference/`), wrote the brief for
each build step and evaluated the result; the other built. Every prompt and every final reply of the building session
is captured automatically by a `Stop`/`UserPromptSubmit` hook into `.agent-logs/` (see `CAPTURE-TEST.md`), committed
alongside the code it produced. Two rounds of work were fanned out to parallel subagents in git worktrees; their exact
prompts and reports are in `docs/agent-streams.md`. The plan the build followed is `docs/plan.md`.

## Run

```bash
pnpm install
cp .env.example .env.local        # DATABASE_URL points at the docker postgres below
pnpm db:up                        # postgres 16 in docker
pnpm db:migrate && pnpm db:seed   # 14 tables, 300 creators, 3 brands, demo accounts, ~1,200 clicks
pnpm dev                          # http://localhost:3000
```

| Command            | What                                                              |
| ------------------ | ----------------------------------------------------------------- |
| `pnpm typecheck`   | `tsc --noEmit`                                                    |
| `pnpm lint`        | ESLint — the engineering rules in `eslint.config.mjs`             |
| `pnpm test`        | Vitest, 89 unit tests over the pure logic                         |
| `pnpm build`       | Production build                                                  |
| `pnpm db:up/down`  | Docker Postgres                                                   |
| `pnpm db:generate` | Drizzle migration from `src/db/schema/*`                          |
| `pnpm db:migrate`  | Apply migrations to `DATABASE_URL`                                |
| `pnpm db:seed`     | Reset and reseed (`scripts/seed/*`, fixed faker seed)             |
| `pnpm db:reset`    | down + up + migrate + seed                                        |
| `pnpm db:migrate:remote` / `db:seed:remote` | same, against the `DATABASE_URL` in a gitignored `.env.remote.local` |

CI (`.github/workflows/ci.yml`) runs typecheck + lint + test on every push. Smoke test after every deploy:
`GET /api/health` → `{ ok, db, dbEnv, commit }` (503 with `db: "not configured"` until a database URL is set; `dbEnv` names
the variable it used — `DATABASE_URL` or one of Vercel's Neon-prefixed names, see `.env.example`).

**Without a database** every page still renders: the app shells show an honest "Database not configured" state on every
tab, the public pages fall back to static content, `/api/health` is the only thing that reports the reason. The
deploy never 500s because of a missing env var: `ANTHROPIC_API_KEY` is optional everywhere it is used.

## Architecture

```
src/app                      routes only; page.tsx calls a query and renders a view (< 100 lines)
src/features/<domain>/
  components/                views
  server/queries.ts          reads  (plain DTOs, never drizzle rows)
  server/actions.ts          writes (server actions, zod-validated, { ok, data } | { ok:false, error })
  schemas.ts                 zod: single source of truth for form, action and DTO
  constants.ts
src/db                       drizzle client + schema; only features/*/server imports it (lint-enforced)
src/lib                      pure functions only, unit-tested (fit score, state machine, money, estimator…)
src/components/ui            shadcn output, not edited · src/components/{shell,page,motion}  shared composites
```

Domains: `auth`, `marketplace`, `campaigns`, `collaborations`, `tracking`, `payouts`, plus `workspace` (overviews,
settings, integrations, community, affiliate, notifications), `public` (marketing site), `brand-onboarding`,
`creator-onboarding`. Full rules: `CLAUDE.md` → "Engineering rules". The build was split across parallel agent streams;
their prompts and reports are in `docs/agent-streams.md`, the plan in `docs/plan.md`, the recon in `docs/reference/`.

**The collaboration state machine** (`src/lib/collaboration-status.ts`, tested exhaustively) is the spine: invited or
applied → accepted/declined → draft submitted ⇄ changes requested → approved → scheduled → live → paid. Every status
change goes through `transition()` (`src/features/collaborations/server/transition.ts`), which writes a
`collaboration_events` row and the money side effects: an invitation holds the fee from the brand's wallet, a decline
releases it, acceptance creates the tracked link, going live creates a pending payout, paying settles both.

**Attribution is real.** `/r/{code}` is one insert + one 302; the click id rides on a cookie and a `?nn=` param.
`/n.js` is a pixel with naano's API (`naano('track', 'signup', { email })`); `/api/pixel` stores the event against the
click. `/demo/landing` is a stand-in customer site with the pixel installed — every seeded tracked link lands there (with the
brand's own site key), so on the live site you can click a creator's link, sign up, and watch Results move. Every number on every dashboard is a
query over rows; the click log exports to CSV per creator.

## What's real vs stubbed

| Area | Status |
| --- | --- |
| Auth | Own users/sessions (bcrypt, httpOnly cookie, CSRF token on the session). Register copies naano's flow; the 6-digit email code step is skipped on purpose; LinkedIn/Google buttons are visual. |
| Brand onboarding | Real: reads the website server-side (title, description, headings), writes value prop + 3 ICPs with Claude when `ANTHROPIC_API_KEY` is set, otherwise a template that still uses the fetched text; creates the "{Company} creator brief" campaign; lands in AI Matching with the coach mark. |
| Creator onboarding | Real 4-step flow with the live card; the LinkedIn read is **simulated** deterministically from the URL slug (no Apify); price recommendation from `src/lib/recommend-price.ts` (2,070 followers → €315 like naano). Professional info is stored, not enforced. |
| Marketplace (brand) | Real: 300 creators ranked by `fitScore()` against the selected campaign, the "Top ranked creators" strip (40) over an "All creators" divider, filters incl. the activity window (last public post), sort/search/pagination in the URL, shortlist, profile modal (Overview / Audience / Content tabs, audience bars, reach chart, Professional profile accordion), "Your selection" and "Make an offer" dialogs creating funded invitations. |
| AI Matching (Nao) | Real ranking; rationale written by Claude (`claude-sonnet-5`) when the key is set, otherwise a template built from the fit signals — the UI labels which. Rail: New research, Retry, Undo (previous result set), Stop (discards the run in flight), Apply request; thumbs/copy write a `nao_feedback` row. |
| Campaigns | Real: list, chooser, create-with-AI as a three-question chat (what you sell, the buyer, the goal → draft, with a history rail), start-from-link (URL stored, not fetched — says so), 4-step launch stepper with the pre-spend estimator (`src/lib/estimator.ts`, naano's Q2 2026 benchmarks), brief editor with naano's exact fields, detail tabs (collaborations, brief, shortlist, analytics from rows), delete. |
| Collaborations | Real on both sides: apply, accept/decline, draft, review modal (approve / request changes, capped rounds), schedule, publish with post URL, pay; optimistic UI with rollback; timeline from `collaboration_events`. |
| Messages | Real threads per accepted booking, both sides; NaanoBot is a static placeholder; reactions are visual. |
| Tracking | Real: redirect, pixel, collector, results (with "More metrics & attribution details": clicks by country/referrer, pixel visits/sign-ups/purchases/revenue), per-creator CSV, campaign analytics, creator analytics with an All time / 30 / 90 days period. Post reactions/comments are the creator's recent public-post averages (labelled); naano's own post-metrics import is not built. |
| Billing / earnings | Real ledger: top-ups ("No card — demo top-up"), bookings, payouts, withdrawals (bank transfers sit "In transit" as pending, Stripe settles instantly); wallet chip is a cache of the ledger. Settings › Payments stores the method, account holder and the IBAN's last 4 only. No Stripe Connect, no real bank rail, no invoice PDFs. |
| Settings, team, integrations, community, affiliate, tour | Real screens with real updates (profile incl. X handle, audience, payout details, delete account). Team invites and the Slack community need email/Slack and say so; the MCP endpoint is documented, not served. Affiliate: brands that sign up through a creator's `?ref=` link are attributed; rewards assume a 20% platform commission (naano doesn't publish it) × 25% share for 3 months. Community leaderboard toggles impressions/posts. |
| Voice | Real command layer on the floating pill (`src/features/voice`, `docs/voice.md`): Web Speech API by default, Vapi when both keys are set; intents parsed by Claude with structured output or a regex grammar; every tool runs the same server actions as the UI (session + CSRF); money and status changes ask "Confirm?" and wait for a yes. Navigation from a Vapi reply is spoken, not performed (the webhook has no page). |
| Book a call | Fake slot picker on both the public page and the brand page; writes nothing (no calendar). |
| EN / FR toggle | Visual only: FR re-renders the same English strings. Agency mode toggle: visual only. |
| Public site | Landing page in naano's section order with their copy; for-creators, for-agencies, pricing, faq, case study, about, benchmarks, book-a-call (fake slot picker); a floating assistant pill with links (no chat); marketing figures are naano's published claims, labelled "est." where derived. Video testimonials are poster cards; logos are text. |

Not built: email delivery, Stripe Connect, LinkedIn/Apify import (LinkedIn's own metrics for sponsored posts included),
X/YouTube channels, real FR locale, `/api/mcp`, `llms.txt`, blog, free tools and selection-tool pages, cookie banner.

Motion follows naano's own keyframes and easings (`src/app/globals.css`); every animation shows its end state under
`prefers-reduced-motion`.

## Environment

See `.env.example`. `DATABASE_URL` is required for the product to have rows; `ANTHROPIC_API_KEY` is optional (AI briefs,
Nao rationale and brand-onboarding profile fall back to templates without it). Vercel sets `VERCEL_GIT_COMMIT_SHA`.
