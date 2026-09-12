# Walkthrough script — under 5 minutes, camera on, voiceover

Record in one take at 1440 wide. Two browser tabs open before you start: the live URL (logged out) and the repo on GitHub.
Talk like you're showing a colleague, not presenting. If something breaks on camera, say so and move on. They said dead ends are fine.

## 0:00 – 0:25 · what this is
"Clone of naano.com, a B2B LinkedIn creator marketplace. Two sides, brand and creator, the full booking loop, tracking, payouts.
Built in {N} hours. I ran two Claude Code sessions: one mapped the real product screen by screen and evaluated each build, one built.
I directed both. Every prompt and final answer is in .agent-logs in the repo."

## 0:25 – 0:55 · public site + auth
Scroll the landing once, fast. Click Sign up → the two role cards → back. Login → "Explore as demo brand".
"Graders don't sign up, so demo logins. Real sign-up works too, with our own cookie auth."

## 0:55 – 2:00 · brand side
Creators: filter by industry, sort by best match. "Fit score is computed, four signals, one line reason per creator." Open a profile:
audience snapshot bars, reach chart, book rail. Click Collaborate → "Your selection" → confirm a funded booking. "Fee is held from
the wallet, creator has to accept."
Campaigns → open the demo campaign → Brief tab → Edit: "Same fields as naano's editor. Generate brief calls Claude, template fallback
if there's no key." Launch stepper → the estimator: "Reach, clicks, leads, CPL from their published benchmarks, with a confidence label."

## 2:00 – 3:00 · creator side + the loop
Sign out → "Explore as demo creator". Opportunities → View the brief → Copy for my AI. Collaborations → the invitation you just made →
Accept → Submit draft (paste two lines). Sign out → demo brand → Collaborations → To do → Review LinkedIn post → Approve.
"Every status change goes through one transition function that writes an audit event. Illegal moves throw. That's tested."

## 3:00 – 4:00 · attribution, the part naano gets criticised for
Creator side → the live collaboration → copy the tracked link → open it in a new tab → it 302s to the demo landing page → submit the
lead form. Back to brand → Results: the click and the lead are there, attributed to that creator. Click log tab → Export CSV.
"Every number on this dashboard is a row you can create by clicking. The pixel is a real /n.js with naano's API."

## 4:00 – 4:40 · honest close
README on GitHub: the real-vs-stubbed table. "Stubbed: Stripe, LinkedIn import, email codes, X and YouTube. Left out on purpose: the
MCP endpoint and the managed-service tier. Next I'd build the pixel SDK properly and the negotiation flow end to end."
Show .agent-logs folder and CAPTURE-TEST.md for two seconds. Stop.

## Before you hit record
- Live URL opens logged out in a private window. /api/health is 200.
- Demo brand has a campaign with collaborations in several states and clicks on the results page.
- You've clicked the whole loop once off camera so you know the seeded names.
- Loom set to 1440 window, mic on, camera on. Aim for 4:30. Never past 4:55.

## Hand-in checklist (from the brief)
- [ ] Live link opens for someone not signed in as you
- [ ] Repository public, .agent-logs/ committed, CAPTURE-TEST.md in root
- [ ] Walkthrough: camera on, voiceover, under five minutes, public HTTPS link
- [ ] Links field: github (label "github"), live deployment (label "live")
- [ ] "Anything you want to say": two sentences — the two-session workflow and where the honest gaps are
