# naano — outside-in notes (market, criticism, numbers)

Sources: naano.com/benchmarks/q2-2026, naano.com/selection, public LinkedIn posts by/about naano (creator reviews,
milestone posts, Attio recruiting post). First-party numbers are marketing claims, not audited.

## What people say (public LinkedIn)
- Creators like it because they get a brief + angle but write the post in their own voice. No corporate scripts.
- Creators prefer a platform over DMs because direct deals turn into email/contract/payment mess.
- Skepticism: one creator who tested it saw traffic but doubted conversions. On a milestone post: "Very expensive!"
  and questions about how the CPC/CPL claims are verified.
- Demand is real: Attio recruited 50+ LinkedIn creators through naano (min 5k followers; sales/GTM/CRM/RevOps/AI audiences).
- Growth posts: 1,500 → 2,000 creators+brands, 20 → 30 paying B2B SaaS brands, 500+ creators in a WhatsApp group, 25+ signups/day.
- Model shifted from cost-per-qualified-click to fixed price per post (from €20). They iterated on the economics.

## The weakness everyone points at
Not "can creators post" — "can you prove a creator produced business." Attribution and auditability.

## Benchmarks (naano Q2 2026 report, first-party)
- 312 campaigns, 89 brands, 1,847 posts, ~300 active creators
- CPL €18.10 avg · CTR 12.0% avg · CPC €2.30 · median time-to-launch 7 days (p25 5, p90 16)
- CTR by creator size: 1k–3k 13.8% · 3k–7k 12.1% · 7k–10k 10.4% · 10k+ 8.7%   ← smaller = higher CTR
- CPL by vertical (median): mktg-ops €16 · sales-tech €16 · RevOps €17 · product €18 · devtools €19 · fintech €19 · HR-tech €20 · vertical SaaS €21
- Funnel (n=104): click → 30s+ engagement 67% · engagement → demo 8.3% · demo → SQL 41% · cost per SQL ≈ €530
- vs LinkedIn Ads: CPL −67% to −80%, CTR 15× (0.8% baseline). Reply rate to outbound referencing creator post 39.6% vs ~5% cold.

## Selection signals (naano.com/selection)
- job titles in the creator's comment section
- posting consistency
- already writes about the category
- audience genuinely overlaps the buyer
- "audience fit over audience size": 3k niche > 100k generalist
Shortlist output per creator: pricing, audience fit %, average views, "a clear reason why they belong".

## Use in the build
- Seed data: CTR/CPL/price distributions above. Smaller creators get higher CTR. Prices €20–€1,500.
- fitScore components: audience overlap, category match, engagement quality (+ posting consistency as a small term).
- Campaign estimator: selected creators × benchmark CTR by tier × vertical CPL → est. clicks/leads/CPL with a confidence label.
- Dashboard benchmark overlay: "your CTR vs marketplace median 12%".
- Every fit % carries a one-line "why they belong" — naano's own output format.
