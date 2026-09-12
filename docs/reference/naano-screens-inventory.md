# naano — clickable inventory (dialogs, popovers, sub-flows). Companion to naano-product-map.md.

Everything here was clicked on the live product on 2026-09-12. Copy is verbatim. Use with the map: the map has the screens,
this has what opens when you click inside them.

## Brand — top bar
- "NAANO MCP / Connect →" pill (aria "Connect Naano to your AI assistant") → opens the Integrations view.
- Wallet chip "€0.00" → Billing.
- EN | FR segmented toggle (FR is a real locale; visual-only is acceptable in the clone, note it).
- "GET STARTED · Discover the Marketplace · 1/3" ring (aria "Activation progress: 1 of 3") → popover
  "YOUR LAUNCH PLAN / Launch your first creator collaboration / Three guided actions take you from discovery to your first
  creator invitation." progress bar "2 steps left". Rows:
  1. Discover the Marketplace — "Compare your matched creators by sector, reach, performance and price." [Explore →]
  2. Create your first brief — "Open the guided editor and turn your campaign goal into creator-ready instructions." ✓ [Done →]
  3. Book or negotiate with a creator — "Choose an offer, negotiate if needed, and send your first funded invitation." [Choose creator →]
  footer "You can close this checklist and resume it at any time." ✕
- Bell (aria "Notifications") → popover "You're all caught up / New activity on your campaigns will show up here."
- Avatar (aria "Account") → menu: Invite Creators · Book a call · Integrations · Settings · Sign out.

## Brand — sidebar secondary items
- Invite Creators → #marketplace (AI Matching tab).
- Book a call → Google Calendar appointment page (embedded; "Open calendar in a new tab", "Close calendar").

## Brand — Creators
- Marketplace pagination: button "Show more creators (50 / 993)" — 50 per page, append.
- Card "Book" → dialog "Your selection": "CREATOR RATE · Single post · 188 € · Standard rate · Book this option at the listed
  price, or propose a lower price." buttons [↔ Negotiate] [Book · 188 €], "Back", ✕. (Bundle rows appear when the creator has one.)
- "↔ Negotiate" → dialog "Make an offer": avatar · "{Creator} · Single post" · "Current price: 188 € per post" ·
  "Choose a discount": 169.2 € (10% discount) · 150.4 € (20% discount) · 131.6 € (30% discount) · Other (Enter a price) ·
  "Your offer €" input · helper "The creator will see a 20% discount request." · "Post by — 14 days from now — Latest date the
  creator must publish the post. Defaults to 14 days." (date input) · "How should the creator work?" option card
  "Specific brief — Use detailed instructions from one of your campaign briefs." → "Campaign — Pick a campaign that has a brief."
  select · checkbox "I want to approve the content before it is published." (on) · note "The creator receives the offer
  immediately and can accept or decline it within 48 hours." · CTA "Add €500.00 and continue" (wallet must cover the fee;
  minimum top-up €500). → invitations are FUNDED: booking debits/holds the wallet.
- Profile modal → "How pricing is calculated" (popover; explains typical reach × CPM), "Collaborate with {Name}" → same
  "Your selection" dialog as Book.
- AI Matching result rows have the same "Book" + bookmark + "→" (opens profile modal).

## Brand — Campaigns
- "Get started" / "New campaign" → chooser "How do you want to launch your campaign? Choose your method. You can change
  everything before launch." three cards (see map). "Create with AI" → #campaign-new: heading "Generate your campaign in one
  click", one textarea "Let's build this campaign together…" with a round send button, left rail "HISTORY — No discussion yet.
  Your next AI-generated campaign will appear here.", back chevron top-left. It is a chat that produces a draft campaign
  (brief in the editor shape) and lists past generations in HISTORY.
- Campaign detail tabs: Collaborations (#…/pipeline) · Brief (#…/brief) · Shortlist (#…/shortlist: "Shortlist — Save creators
  from the marketplace to build your shortlist." [Find creators]) · Analytics (#…/analytics/analytics: same layout as Results
  scoped to the campaign — Est. reach "No published posts yet" · Qualified clicks "Since the campaign started" · Committed budget
  · "Performance over time — Daily clicks · last 12 days" · Post performance "Without a pixel" · Install the pixel ·
  "Attribution by creator — No attributed activity yet." · "More metrics & attribution details").
- Brief editor: Preview / Cancel / Save (fields in the map).

## Brand — Billing
- "Add budget" (and the +€2,500 / +€10,000 presets) → dialog "SECURE PAYMENT / Add budget / One-time deposit to your Naano
  balance. Use it across all campaigns — no subscription." ✕ · (when opened from a selection: "Suggested for your selection —
  Covers the creators you picked. Adjust below if needed.") · "CHOOSE AN AMOUNT" €2,500 · €5,000 · €10,000 · €25,000 · custom
  "€" input · "Minimum €500 · credited right after payment" · "You will credit €5,000" · "Current balance €0" · three
  reassurance lines: "Card payment — entered only on Stripe's secure checkout (PCI DSS)." / "No subscription — funds stay in
  your Naano balance until used." / "Pay on delivery — creators are charged only after the post is delivered." · CTA
  "Add €5,000" · "End-to-end encrypted · powered by Stripe". Clone: same dialog, the CTA credits the ledger (no Stripe), README says so.

## Brand — Integrations
- "View setup" (Claude) → dialog "Set up Naano in Claude — Claude supports a custom remote connector with automatic OAuth
  registration." steps: "Copy the secure Naano connection URL. No API key is required." / "In Claude, open Settings → Connectors
  → Add custom connector. Leave Client ID and Client Secret empty." / "Sign in to Naano, review the requested access and approve
  it." buttons [Copy MCP URL] [Open Claude settings].
- "View setup" (ChatGPT) → "Set up Naano in ChatGPT — ChatGPT requires a supported workspace and developer mode for a custom MCP
  app." steps: copy URL / "In ChatGPT, enable developer mode, then open Settings → Apps → Create and add this URL with OAuth." /
  sign in and approve. [Copy MCP URL] [Open ChatGPT].
- "View setup" (Any MCP client) → "Set up another AI tool — Use a trusted client that supports remote Streamable HTTP and OAuth
  2.1." steps: copy URL / "Add this URL as a remote Streamable HTTP server, keep authentication on OAuth and review every
  requested action." / sign in and approve. [Copy MCP URL] [Browse MCP clients].

## Brand — Settings
- Team & access (#settings/team): "Invite a colleague — They'll receive a secure link that expires after 14 days." Work email
  input + "Send invitation"; "New users create their account from the private email link. Existing Naano users get access
  immediately." "People with access — 1 people — Active members and invitations awaiting acceptance" rows avatar · name · email
  · "You" · Owner badge. Footer "Members receive administrator access. Only you, the owner, can invite or remove people."

## Creator — captured earlier (see map + screens creator-10…36)
- Sidebar views, tour (5 steps), Settings (Profile / Payments / Account, delete account with confirm), Integrations grid
  (Claude · ChatGPT · Gemini CLI · Cursor · GitHub Copilot · Other MCP client), brief drawer, opportunity cards.

## Creator — still to capture (needs a creator login; the saved session was revoked)
- My card → Edit panel fields; Preview; "Copy or share my Deal Link" dialog; Overview "Open card" / "Share my card"; card back.
- Opportunities → "Apply" confirmation dialog (what it asks: price? message? terms?).
- Earnings → withdraw dialog; Settings → Payments tab (bank/Stripe Connect fields); Integrations → "Connect Claude" dialog
  (expected: same three-step OAuth text as the brand side); notifications popover; Community and Affiliate page contents.
