# Walkthrough script — under 5 minutes, camera on, voiceover

One take at 1440 wide. Two tabs open before you start: the live URL in a private window (logged out) and the repo on GitHub.
Talk like you're showing a colleague. If something breaks on camera, say so and move on — dead ends are allowed.

## 0:00 – 0:20 · what this is
"This is Amplio, a clone of naano.com — a B2B LinkedIn creator marketplace. Both sides, brand and creator, the whole booking loop,
click tracking, payouts. Built in 24 hours with Claude Code: one session mapped naano screen by screen and evaluated every build,
three builder sessions shipped in parallel on branches. I directed all of them. Every prompt and reply is in .agent-logs."

## 0:20 – 1:00 · landing, the "better than the original" part
Let the splash run (2 s). Scroll slowly through the hero — the video scrubs with the scroll, the glass card refracts.
"Cinematic landing: scroll-scrubbed hero, glass cards, LED metric cards, compressing nav. Everything below the fold is lazy —
the page is 3 MB total, Lighthouse desktop 83." Hover one post card and one pricing card (they invert to ink). Scroll to say-hey:
move the mouse — the character's eyes follow. "Fun, and it's the call to action." Click the assistant pill, type "how does pricing work".
"That's the assistant — Claude, Gemini fallback. On the dashboard it also runs actions, by voice."

## 1:00 – 1:25 · auth
Sign up → the two role cards → back. Login → "Explore as demo brand".
"Graders don't sign up, so demo logins. Real sign-up works too, own cookie auth, real forgot-password email."

## 1:25 – 2:25 · brand side
Overview: "Hello Demo — four numbers, to-do list, creators that fit." Creators: filter by industry, sort by fit. Open a profile:
"Fit score is computed from four signals — audience overlap, category, engagement, consistency — with a one-line reason." Book rail →
Collaborate → confirm. "Fee held from the wallet, the creator has to accept." Campaigns → the demo campaign → Brief → Launch stepper:
"Estimator: reach, clicks, leads, CPL from naano's published benchmarks." Click the assistant pill: "show me results" → it navigates.

## 2:25 – 3:15 · creator side + the loop
Sign out → "Explore as demo creator". Opportunities → View the brief → Copy for my AI. Collaborations → the invitation you just made →
Accept → Submit draft (two lines). Sign out → demo brand → Collaborations → To do → Review → Approve.
"Every state change goes through one transition function that writes an audit event. Illegal moves throw. That's tested."

## 3:15 – 4:00 · attribution, the part naano gets criticised for
Demo creator → the live collaboration → copy the tracked link → open it in a new tab → it 302s to the demo landing → submit the
lead form. Back to demo brand → Results: the click and the lead are there, attributed to that creator. Click log → Export CSV.
"Every number on this dashboard is a database row you can create by clicking. The pixel is a real /n.js with naano's API."

## 4:00 – 4:40 · honest close
README on GitHub: the real-vs-stubbed table. "Stubbed: Stripe, the LinkedIn import, email codes, X and YouTube, the MCP endpoint.
Next I'd build the pixel SDK properly and negotiation end to end." Show .agent-logs (one file per session) for two seconds. Stop.

## Before you hit record
- Private window, live URL opens logged out, /api/health is 200, favicon shows on the tab.
- Click the whole loop once off camera so you know the seeded names (Faizan Anwar is the demo creator).
- Creators page takes ~1.5 s to stream — say something while the skeleton shows, don't stare at it.
- Loom at 1440, mic on, camera on. Aim for 4:30. Never past 4:55.

## Hand-in
- Links: "github" → https://github.com/m-faizananwar/naano-rebuild · "live" → https://naano-rebuild-opal.vercel.app · Loom link.
- "Anything you want to say", two sentences: "I ran Claude Code as a team — one session mapped naano and evaluated every build,
  three built in parallel on branches; every prompt is in .agent-logs. Stripe, the LinkedIn import and email codes are stubbed
  and say so in the README; everything else is real and seeded."
- After submitting: reset the Neon database password and update naano_clone_DATABASE_URL on Vercel.
