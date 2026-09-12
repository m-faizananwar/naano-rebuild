# naano.com — product map (pre-flight, clock off)

Pulled 2026-09-12 from naano.com, /llms.txt, /pricing.md, /creators, /register, homepage JSON-LD FAQ, blog.
Paris-based, founded 2025. Founders: Thomas Marcelle (CEO), Alexis Jarre (CMO), Justine Namour (CTO).

## One sentence
Two-sided marketplace: B2B brands book vetted LinkedIn creators for sponsored posts at a fixed price per post
set by the creator; naano tracks clicks → leads → pipeline per post and pays the creator.

## The two sides (register asks "First, who are you here as?")
- I'm a creator — "Get paid to create LinkedIn content for B2B brands you actually use."
- I'm a brand — "Find creators, launch campaigns, and trace real pipeline back to each post."
Sign up with LinkedIn / Google / email. Right panel copy: "One platform. Two sides." / "Creators. Brands. Results."

## Brand flow (homepage "How it works", 5 steps, verbatim labels)
01 Find creators your buyers trust — creator cards with a Fit % (Eric 92%, Robin 88%, Aya 84%)
02 Build a campaign brief in minutes — "Campaign brief · AI": Objectives and key messages / Creator guidelines / Tracking links ready
03 Manage every collaboration — per-creator status: Draft ready / Scheduled / Live
04 Track reach, clicks, and leads — "Attributed pipeline €48.2K +24% · 124K views · 418 leads"
05 Pay creators without the admin — "Payment scheduled · Handled by Naano · Creator payout €1,240 · Contract / Invoice / Payout"

## Creator flow (/creators)
- Apply ("Takes 2 minutes. No commitment."), 1,000–500,000 followers.
- Set own rate per post (examples €800–€1,500; marketplace floor "from €20 per published post").
- "Centralized opportunities": brands send collaboration requests ("Attio sent a collaboration request") → Accept / Decline.
- "Contract & payout handled. You just close it." Deliver content in own voice, no exclusivity.
- Track views, clicks, engagement in real time. "Get paid within 24h" — Instant · SEPA (Stripe Connect).

## Matching / marketplace
- 2,000–3,000+ vetted creators, ~100 countries, organised by industry vertical.
- "Matching engine scores every creator on audience fit, category relevance and engagement quality across LinkedIn, X and YouTube."
- "Audience fit comes before follower count." Audience tags shown: Founders / Sales leaders / GTM teams; "AI & SaaS creator 96%".
- Networks: LinkedIn, X, YouTube.

## Attribution
- "Naano places a tracking pixel at every stage of the funnel, so each click, lead, pipeline and revenue is tied back to the exact creator and post."
- Unique tracked link per creator per post. Metrics: impressions, clicks, leads, pipeline (€), revenue.
- Benchmarks they publish (Q1 2026, 312 campaigns): CPL €18 avg (vs €55–90 LinkedIn Ads), CTR 12% vs 0.8%.

## Money
- Self-Serve: €0/month, pay per published post (from €20), no CPC/CPM, no retainer. Brand pays creators through the platform.
- Managed Campaigns: €700/month flat + post spend; naano team does strategy, sourcing, briefs, reporting.
- "Approve content and pay every creator in one click, securely via Stripe Connect, invoices and approvals are handled."
- Month-to-month, upgrade/downgrade/cancel anytime.

## Campaign states seen in copy
Collaboration request → Accepted / Declined → Draft ready → (Approved) → Scheduled → Live → Paid.
Brief fields: objective(s), key messages, creator guidelines, tracking link, disclosure requirements, publication window, fee per post, revision rounds.

## Landing page sections (in order)
Nav: For companies / For creators / For agencies / How it works / Resources / Sign in / Sign up
1. Hero: "The B2B LinkedIn Creator Marketplace." + sub + [Launch a campaign] [See how Naano works] + "Trusted by modern B2B teams" logo strip
2. Case-study quote (Zmirov Communication)
3. Marketplace showcase: "Work with all the best creators." — 3,000+ vetted creators / Across 100 countries / Matched to your buyers
4. "Run creator campaigns from one place." — 5-step how-it-works with mini UI mocks
5. "Real teams. Measurable pipeline." — video testimonial (BlogSEO) + case study numbers (9 creators, 2,940 clicks, 512 trials)
6. Logo wall "Trusted by teams at" (+30)
7. Results: 5M+ impressions / 30K+ leads / 2,000+ creators / 5K+ posts
8. Post examples: 4 creator posts with impressions / clicks / leads + "View post"
9. Pricing: Self-serve €0 vs Managed custom
10. FAQ (8 Q/A, in JSON-LD)
11. CTA: "Your next creator campaign starts here." — book a 30-min campaign strategy call
12. Footer: Product / Company / For AI agents (llms.txt, pricing.md) / Press / Resources
Also: floating AI assistant widget bottom-centre ("What would you like to know?"). Cookie banner (Google Analytics).

## Visual
Light blue-white gradient hero, dark navy text, rounded pill buttons (black primary), clean sans (Inter-like), cloud imagery,
avatar clusters, mini UI-mock cards in the how-it-works. Register page: split layout, left white form, right #3B5BFF-ish blue panel.

## Creator onboarding, observed live (2026-09-12) — 4 steps, split layout, live "marketplace card" preview on the right
Right panel on every step: "YOUR MARKETPLACE CARD / Build a card brands can trust. / It updates live with your profile, analytics,
positioning and price." The card: blue header with naano wordmark, LinkedIn badge top-left, country flag top-right once known,
avatar initial, name, industries line, headline (truncated), a "Data ——— Pending" progress bar, three stats
(Followers · Est. impressions · Potential cost), and a "More details →" pill. It updates as you type.

- Step 1 of 4 "Join Naano": sign up with LinkedIn / Google / email. Email form: first name, last name, email, password,
  "How did you hear about us?" chips (LinkedIn · Another creator · Word of mouth · Google search · Other), Continue.
  Then "Check your email": 6-digit code input, "Verify & continue", "Resend code in 54s", "Edit email".
- Step 2 of 4 "Add your public LinkedIn profile": one input, public LinkedIn URL. Copy: "No extension is needed. We'll retrieve
  only the minimum public information required to create your Basic card." Consent box: "you authorize Naano to read your
  public profile once: name, photo, headline, country and follower count. We do not import your posts, engagement or private
  analytics." Button becomes "Reading your profile…" and the card shows a "Reading your profile…" chip.
  Under the hood: card back says "Public LinkedIn profile data from Apify (Basic card)". They scrape via Apify.
- Step 3 of 4 "Complete your creator card": followers + headline auto-filled from LinkedIn. Country confirm (select).
  "Your industries (pick up to 3)" chips: B2B, B2C, AI, SaaS, Sales, Marketing, SEO, Outreach, CRM, Creative, Productivity,
  Fintech, HealthTech, EdTech, Cybersecurity, Growth / GTM, HR, E-commerce, Developer Tools, Data / Analytics,
  Customer Support, Design, Real Estate / PropTech, LegalTech. Continue.
- Step 4 of 4 "Complete your creator card" → "OUR RECOMMENDATION: Naano recommends this starting price from the public audience
  and performance information currently available. You can change it now or later." Big "€ 315 / post".
  "This is your net price per post. You can change it at any time from your Naano profile." Buttons: "Create my marketplace
  profile" and "Add a bundle (optional)". Bundle: "PRIMARY BUNDLE — Number of posts [5] · Total net price [€1340]" →
  "€268/post · brand saves €235", "+ Add another bundle", "Confirm my offer and create my profile". Card gets a
  "5-post bundle · €1,340" pill. Observed: 2,070 followers, AI/Software/Productivity → €315 recommended.
- Card back ("More details", flip animation): "Performance & ICP — Public LinkedIn profile data from Apify (Basic card)".
  Tiles: Followers, Reactions per post (avg), Typical impressions per post, Comments per post (avg), Engagement rate.
  Badge "Public LinkedIn data estimated by Naano". "About" (bio). "Who you target (est.) — Estimated from your public posts +
  bio (dominant themes)": INDUSTRY AI 71% · LOCATION Pakistan 100%. "View profile" button.

Clone notes: card preview that updates live is cheap and scores UX. recommendPrice(followers, industries) as a pure function.
Bundles = optional volume offers. The "who you target" percentages are the audience-fit inputs on the creator side.

## Creator app ("Creator studio"), observed logged in — SPA at /creator with hash views
Top bar: wallet chip "€0", EN | FR toggle, bell, avatar with green dot. Floating AI assistant pill bottom-centre
("What would you like to do?" / "What would you like to see?") with a mic icon. Left sidebar (collapsible) with icons + labels:
Overview (#home) · My card (#profile) · Opportunities (#opportunities) · Collaborations (#collabs) · Analytics (#analytics) ·
Community (#community) · Earnings (#earnings) · Affiliate program (#referrals) · Messages (#messages).
First run: ?tour=1 shows a 5-step tour popover ("STEP 1 OF 5 — Your Marketplace card — This is your private preview and editor…", Skip / Next).

Optional post-onboarding step "Complete your professional information now?": FR/EU need a registered professional activity to
invoice and withdraw; US/outside EU can continue as individual. Form: registration country, registered business yes/no, legal
name, legal address, checkbox "I confirm that I am solely responsible for declaring and paying taxes…", checkbox "I authorize
Naano to issue invoices in my name…", "Save my information". Or "Go to my workspace — finish later". Required before applying
to paid campaigns, accepting bookings, invoicing or withdrawing.

Overview (#home): "Creator workspace / Good to see you, {first name} / Your creator activity, at a glance."
4 stat tiles: PUBLIC POST REACH (— "Waiting for public post data") · PUBLIC POSTS (0, "Original LinkedIn posts found") ·
PUBLIC ENGAGEMENTS (0, "Reactions, comments and reposts") · LINKEDIN FOLLOWERS (2.1K, "Imported from the public profile").
Left: "Your creator card — This is how brands discover your positioning and collaboration offer." buttons Open card / Copy card
link / Share my card, and the card itself (chip "No post data available", Followers · Est. impressions · Chosen cost, bundle pill).
Right: "Your launch guide — 1 of 1 steps complete — Card and price ready ✓ Complete". Below: "Recommended opportunities — The 3
campaigns that best match your audience" (rows: logo, campaign, "Main campaign · strong match", →, "Explore") and
"Active collaborations — Everything currently moving from brief to publication" table: Brand · Status · Next action · Due · Net,
empty state "No active collaborations." "See all".

My card (#profile): "YOUR CREATOR STOREFRONT / Your Naano card, ready to travel. / Share clear proof of your positioning, audience
and offers." Edit | Preview toggle. Panel "YOUR CARD IS YOUR DEAL LINK — Put it on LinkedIn. Earn when a brand joins through it."
Two tips (Add it as a LinkedIn experience · Send it when a brand contacts you). "YOUR SHARE 25% · REWARD PERIOD 3 months".
Button "Copy or share my Deal Link". The card below with LinkedIn badge, flag, share icon.

Opportunities (#opportunities): "Open brand campaigns - apply, the brand accepts, and the booking is created on your terms."
→ creators APPLY to open campaigns; brands also send requests. Filters: channel tabs (All channels 2 · LinkedIn 2), search
"Search for a campaign or a brand…", All industries, All countries, sort "Relevance (default)". Card: cloud header, channel badge,
"100% match" pill, brand logo, campaign name, "Main campaign", region chip (Europe · North America), "Audience relevance 100/100"
bar, three stats (100/100 MATCH · LinkedIn CHANNEL · 6 days POST DEADLINE), buttons "View the brief" / "Apply".

Brief drawer (right side panel): brand logo, campaign name ("Campagne principale"), "Premium Inboxes · premiuminboxes.com/",
button "Copy as Markdown". Box "Create my post with AI — Copy a clean prompt with the brief, angles and examples. Paste it into
your AI; add 2 or 3 previous posts if it does not know your style yet." button "Copy for my AI".
Sections: CAMPAIGN OBJECTIVES (goal, primary CTA + tracked link, secondary win) · TARGET AUDIENCE (Brand:, Why we exist:,
ICP (who the creator is talking to): list, Proof points to lean on:) · CALL TO ACTION (Do: … Don't: … Tone: …) ·
CONTENT ANGLES · N (numbered angle cards). → this is the AI brief schema for the clone.

Collaborations (#collabs), Analytics (#analytics), Community (#community), Earnings (#earnings), Affiliate program (#referrals
— 25% share, 3 months), Messages (#messages): screenshots creator-23…28, 35, 36.

## Brand app ("Multi-network creator platform"), observed logged in 2026-09-12 — SPA at /brand with hash views
Brand onboarding after email + 6-digit code, 3 steps, same split layout (white form left, blue panel "Creators. Brands. Results."):
- Step 1 of 3 "Your website" — "We'll read your site to understand the product and your 3 main ICPs. This usually takes 20–40 seconds."
  input https://yourcompany.com, button "Analyze my website" (progress animation while it reads the site).
- Step 2 of 3 "Value prop & ICP" — "Review these details once. Naano turns them into a brief for your creators." VALUE PROPOSITION
  textarea ("What the company does, for whom, how — 4 to 6 sentences. Edit if needed.", auto-written from the site). "3 IDEAL
  CUSTOMERS (ICP) — The audiences your creators need to understand." three numbered cards (title + paragraph, e.g. "Founder / CEO of
  Early-Stage SaaS"). "STARTER CREATOR BRIEF — What your creators will receive ✓ Ready": PRODUCT / AUDIENCE, note "Creators can adapt
  the angle to their expertise, while keeping every product claim factual.", "Every creator you invite will receive this brief. You
  can edit it later from Campaigns." Buttons Back / "Continue to AI Matching" (→ "Opening AI Matching…").
- Step 3 = lands in the app on AI Matching with a coach mark: "Nao is using your campaign brief — Your starter brief is attached.
  Tell Nao what matters most, open profiles, and save the creators you want to invite." Got it / Back to campaign.
  Onboarding auto-creates one Active campaign named "{Company} creator brief" (url ?welcomeCampaign=<uuid>&welcomeStep=creators).

Top bar: pill "NAANO MCP / Connect →", wallet "€0.00", EN | FR, "GET STARTED — Discover the Marketplace 1/3" checklist ring, bell,
avatar. Floating AI pill bottom-centre ("What would you like to do?"). Sidebar icons (collapsible, "Agency mode" toggle at top):
Overview (#home) · Creators (#marketplace) · Campaigns (#campaigns) · Collaborations (#collaborations) · Results (#results) ·
Messages (#messages) · Billing (#billing); text items lower: Invite Creators · Book a call · Integrations (#integrations) ·
Settings (#settings) · Sign out.

Overview (#home): "Hello {first name} 👋 / Here is what is happening for {Company} on Naano." button "New campaign". Stat tiles:
Creators activated · Posts published · Profiles engaged · Impressions. "To do / Priority actions": "Top up your wallet" (Blocked),
"Book a call for your next campaign" (Suggested), "Find new creators for your next campaign" (Suggested). "RECENTLY ENGAGED
COMPANIES — ICP accounts in your target" (empty: "No company has engaged yet."). "Messages — Waiting on your reply". "New creators 8
— Profiles that fit your buyers": rows name · industries · "90% ICP" · "from 1007€/post" · Add. "Naano experts available — Need an
expert eye? Book a free call. 15 minutes with a Naano expert…" "No commitment · Slot available today".

Creators (#marketplace): two tabs at top — "AI Matching" | "Creator Marketplace".
- AI Matching: cloud illustration, "Hey {Company}, let's find the right creators for you." prompt box prefilled "Find 4 creators for
  {Company} creator brief. Use my campaign brief and prioritize strong audience and content fit." SUGGESTED FOR YOU: "Find creators
  who already reach {ICP 1}", "Find creators with credible content about {industry}", "Build a shortlist for this campaign angle: …",
  "Build a balanced creator shortlist for {Company}". The agent is "Nao · Creator intelligence" (rail: New research, Retry this
  search, Undo, Stop, "Apply request"). Response: "Got it — I'm searching for 4 creators that fit your request." then "I found 4
  creators for Zune, ranked by relevance to your brief, then performance and cost." + a paragraph of rationale ending with
  "Trade-off: …", then "Nao's selection — Creators selected for your request" rows: rank · avatar · name · LinkedIn badge ·
  industries · flag · MEDIAN VIEWS · CPM · POST COST · Book · bookmark · →. Feedback icons (copy / 👍 / 👎). Input "Ask Nao a
  question, or find creators…" + "New research". Mentions "the platform limit of €1,500" per post.
- Creator Marketplace: "All creators — All creators are shown from most to least relevant, using sector fit first and verified
  performance statistics to refine the order." Tabs "All creators 993" | "Shortlist 0". Strip "Ranked for your company" + live
  "Naano is improving your shortlist — AI is refining your matches using recent creator performance… Comparing creator evidence with
  your ICP…" progress. Search "Search for a creator…", SORT BY (Best match · Price: low to high · Most followers · Best engagement),
  filter pills Industry (searchable) · Country (searchable) · Price (Min/Max, "Show 993 creators") · Filters (activity: Any time /
  Last 30 / 60 / 90 days, Apply) · Reset. "Top ranked creators — The 40 strongest profiles according to your sector and performance
  signals." Card: bookmark · LinkedIn badge · Book · avatar · name · industries + flag · FOLLOWERS / MEDIAN VIEWS / CPM / POST COST ·
  "View profile →".
- Creator profile modal: header avatar · name · "AI · Marketing · LinkedIn creator" · bookmark · ✕. Tabs Overview | Audience |
  Content. "Creator overview — Review this creator's audience and recent content before booking." chips "48% in observed audience ·
  Marketing", "17.3K typical reach". "Audience snapshot — Estimated from 45 recent public engagers": JOB TITLE bars (Marketing 48%,
  Founders 29%, Engineering 15%, Other 8%) · SENIORITY bars (Founder 58%, Manager 32%, VP 9%, Other 1%). "Content performance":
  "Reach across recent posts" line chart + latest post card (date · "Public LinkedIn post" · Open original · text · "17.3K estimated"
  · reactions · comments · reposts). "Professional profile" accordion. Right rail "Book this creator": Single post 188 € (selected) |
  Bundle · 5 625 €; Typical reach 17.3K · Estimated CPM 11 € · Posts analyzed 5; "How pricing is calculated"; button "Collaborate
  with {Name}"; "Secure booking · Creator approves first".

Campaigns (#campaigns): campaign card "Active · CREATED ON 12 SEPT 2026 · {Company} creator brief" + description, stats Creators ·
Published · Committed budget, links "Open campaign" / "My brief". Card "Create a campaign — Launch a new campaign in 2 minutes — with
AI, the Naano team, or an existing link." → chooser "How do you want to launch your campaign? Choose your method. You can change
everything before launch." three cards: (1) "Launch free with the Naano team — A campaign manager turns your selection into a
ready-to-launch campaign. You validate, they handle the rest." (Today · 14:30 · 15 min, "Book my onboarding →", Google Calendar
embed), (2) "Create with AI — AI asks the right questions and prepares a fully editable brief." (5 min, example prompt "I want to
reach VP Sales in B2B SaaS in France."), (3) "Start from your link — Paste an influence campaign you already ran: Naano reuses the
brief and structure." (1 min, "Brief link (Notion, Docs, PDF…)", "Brief recovered").
Campaign detail (#campaigns/<id>/pipeline): header "← Campaigns · {name} · Active", campaign switcher select, "Invite a creator",
delete. Tabs Collaborations | Brief | Shortlist | Analytics. Collaborations: stats "0 collaborations · €0 committed · 0 to do", tabs
All · Active · Invitations received · Invitations sent · To do · Completed, table Creator · Campaign · Status · Next action · Due
date · Amount · Updated, empty "No collaborations yet, invite a creator from the Marketplace.", rows per page 10/25/50.
Brief tab (#campaigns/<id>/brief): "Campaign brief" + "Edit the brief". Read view sections: Context & objective · Audience & tone
(Tone: "Clear, useful and natural. Keep the creator's own voice rather than following a script.") · Editorial rules (Do / Avoid) ·
Angles & post examples (01 "A practical introduction" — hook + editorial direction + Post example).
Brief EDITOR fields (this is the brief schema): WHAT CREATORS SHOULD TELL (textarea) · TARGET INDUSTRIES · TARGET GEOGRAPHIES ·
TONE · DO · AVOID · LINKS AND EXAMPLES · angles[] { ANGLE, HOOK, EDITORIAL DIRECTION, post example }. Buttons Preview · Cancel · Save.
Default DO: "Use only the confirmed information about {Company}. / Connect the product to a practical audience question. / Disclose
the sponsored partnership clearly." Default AVOID: "Do not invent customers, results, figures or features. / Do not force an
endorsement or promise outcomes."

Collaborations (#collaborations): same table as above across all campaigns, Campaign filter select. Empty state as above.

Results (#results): tiles Est. reach ("No published posts yet") · Qualified clicks (i, "last 30 days") · Committed budget ("0 bookings").
"Performance over time" Week | Month | Year, line chart of Qualified clicks ("Click a card or the legend to zoom"). "Post performance
— Without a pixel — Latest metrics collected from your posts." Posts · reactions · comments, "View posts →". "Measure site conversions
— Connect the pixel to add visits, sign-ups and revenue to your post results." button "Install the pixel". "Attribution by creator"
table Creator · Clicks. "More metrics & attribution details".
Pixel modal "Pixel Naano — Not installed yet — Track visits and conversions from your creators' posts. Installation: 2 minutes. Paste
this snippet before </head> on every page of your site, hardcoded or via Google Tag Manager. Visits attribute themselves; for
sign-ups and purchases, call naano('track', …) in your product only after the corresponding action succeeds. From the first event
received, the status above switches to Active."
    <script> window.naano = window.naano || function(){ (window.naano.q = window.naano.q || []).push(arguments); }; </script>
    <script async src="https://naano.com/n.js" data-site="nn_<32 hex>"></script>
    naano('track', 'signup', { email });   naano('track', 'purchase', { value: 49, order_id });
"Copy the snippet", "See received events →", "Your site key nn_…", "Install it once: it covers all your campaigns, past and future."

Messages (#messages): "All messages", Campaign filter, thread list with "NaanoBot — Have a question or need help? Click here.",
"Threads open with your bookings — Invite a creator - the thread opens as soon as the first booking is accepted." Composer "Write a
message…", quick reactions (12 emojis).

Billing (#billing): "Manage your budget, plan and invoices." AVAILABLE BALANCE €0.00 "Ready to spend across your campaigns." "Add
budget" with presets + €2,500 / + €10,000. Invoices tabs All · Top-ups · Bookings, table Reference · Date · Type · Amount · Status ·
Actions, empty "No invoices or entries yet."

Settings (#settings) "NAANO WORKSPACE — Manage your company profile and the audience you want to reach." Tabs Profile · Audience ·
Team & access · Integrations. Profile: Your company, website, "One-line positioning", features list ("No features yet — enrich from
website or add e.g. AI outbound sequences"). Audience: "Target: ICP" — Target industries (chips, e.g. B2B × SaaS × AI ×, "+ Add an
industry") · Target regions (Europe selected; North America · Latin America · Asia · Africa · Oceania · Middle East · Worldwide) ·
"View the audience analysis" · Save changes. Team & access (#settings/team): "Invite a colleague — They'll receive a secure link that
expires after 14 days." Work email + "Send invitation"; "People with access — 1 people" rows name · email · Owner; "Members receive
administrator access. Only you, the owner, can invite or remove people."

Integrations (#integrations): "NAANO://MCP · ONLINE · REMOTE MCP ENDPOINT https://naano.com/api/mcp · Copy MCP URL · STREAMABLE HTTP ·
OAUTH 2.1 · No API key". "Choose your client — One endpoint, any compatible MCP client." Claude / ChatGPT / Any MCP client, "View
setup". "What it can review — READ ACCESS: Your active workspace, wallet and campaigns · Available creators, posts and campaign fit ·
Applications, bookings and content status." "Actions it can prepare — CONFIRMATION REQUIRED: Draft and launch campaigns · Invite
creators and manage applications · Review submitted content and campaign status." "The assistant only sees the active Naano
workspace your account can access. Naano rechecks identity, workspace permissions, rate limits and every write confirmation on the
server." Creator side has the same page as "Connect your AI assistant" (Claude · ChatGPT · Gemini CLI · Cursor · GitHub Copilot ·
Other MCP client; read: briefs & deadlines, draft history & post status, conversations; confirmed actions: submit a draft for review,
attach an image, reply in a conversation).

Other brand copy seen: "Review LinkedIn post — Read the complete draft before approving or requesting changes." (approval modal).
Brand account menu / settings also has Delete account. Creator settings: Profile (display name, LinkedIn URL + "Refresh profile —
limited to once a week", industries, X handle) · Payments · Account.

## Clone notes from the brand side
- Brief schema = the editor fields above. The AI brief generator should output exactly that shape, with the default DO/AVOID lines.
- Onboarding "analyze your website" → value prop + 3 ICP cards → starter brief is the brand's first-run magic. Cheap with one LLM call.
- CPM (post cost ÷ median views × 1000) and "Median views" on every card. Compute from seed.
- Audience snapshot (job title / seniority %) is the audience-fit evidence. Seed it per creator; fitScore uses it.
- Pixel: serve /n.js from our domain, same API. Demo landing page loads it. Attribution becomes real, not a stand-in.
- Nao-style matching = a chat box that returns a ranked list with a written rationale + trade-off. One LLM call over the fit-scored
  top-N. Optional, after the core loop.
- Stretch (only if everything else is done): /api/mcp with 2–3 read tools. Nobody else will have it.

## Zune — the real onboarding output (use verbatim for the demo brand seed)
VALUE PROPOSITION (naano wrote this from zune's site): "Zune is an AI product studio that designs, builds, and hands over
high-performance websites, web applications, and AI systems for ambitious companies. A senior in-house team—based in Islamabad and
serving UK and EU clients—takes projects from discovery through production launch, with no subcontractors or handoffs. The studio
combines brand strategy, product design, and modern engineering (React, Next.js, RAG pipelines, LLM features) to create scalable
digital products that compound over time. Clients own 100% of the code and infrastructure on day one, avoiding vendor lock-in.
Typical engagements are scoped after discovery and delivered in 6-week fixed-price builds, starting from £4k for websites to £12k+
for web applications and AI systems."
ICP 1 — Founder / CEO of Early-Stage SaaS: "Leads a 10–50 person SaaS company or venture-backed startup that has outgrown its
initial MVP and needs a cohesive product redesign, AI-powered features, or a new customer-facing application. Frustrated by
fragmented agency work, scope creep, and lack of ownership over code and design systems. Zune's fixed-price discovery-to-launch
model, senior team continuity, and full code handover align with the need for speed, quality, and long-term product control."
ICP 2 — Product Director at Mid-Market B2B Company: "Owns digital transformation or product modernization at a 100–500 person
established company (fintech, healthtech, logistics, or enterprise SaaS). Needs to rebuild internal tools, dashboards, or customer
portals with modern UX and AI-driven automation, but internal teams lack design and full-stack engineering capacity. Values a
single accountable partner who can diagnose problems, deliver production-grade code, and train the team to maintain it post-launch."
ICP 3 — Marketing / Growth Leader at B2B Service Firm: "Responsible for brand presence and lead generation at a consulting,
agency, or professional services firm (50–200 people) that has outgrown its website and needs a redesigned marketing site,
SEO-optimized content platform, or AI-powered lead qualification system. Seeks a partner who understands brand strategy, can
deliver a site that reflects studio quality, and can integrate automation (e.g., AI chatbots, retrieval-based search) to improve
conversion and customer experience."
Starter brief "what creators should tell" (naano's generated text): "Zune is described by the company as … [value prop] … The
intended audience is professionals connected to B2B, SaaS, AI in Europe. Introduce the product through your own expertise, adapt
the angle to your audience, and keep every claim grounded in the confirmed company profile."
Settings › Audience after onboarding: target industries B2B · SaaS · AI; target regions Europe.
