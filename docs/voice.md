# Voice

A voice command layer on the floating assistant pill in both apps. Tap the mic,
say what you want, hear the answer. Everything runs through the same server
actions the buttons use — same session cookie, same CSRF token, same ownership
checks — so voice cannot do anything the signed-in user could not click.

## Providers

| | Web Speech (default) | Vapi |
| --- | --- | --- |
| When | no Vapi keys | `NEXT_PUBLIC_VAPI_PUBLIC_KEY` **and** `VAPI_PRIVATE_KEY` set |
| Mic + transcription | browser `SpeechRecognition` (Chrome, Safari; Firefox shows a disabled mic) | Vapi call (`@vapi-ai/web`, loaded on demand) |
| Voice out | browser `speechSynthesis` | Vapi's voice |
| Intent → action | client POSTs to `/api/voice/intent` | Vapi calls `/api/voice/vapi` (the assistant's server URL), which forwards to `/api/voice/intent` with a one-hour headless session for that user |
| Navigation | the page follows `navigate` from the response | spoken only — the webhook has no page |

`GET /api/voice/session` tells the client which provider to use. With Vapi it
also creates/updates the assistant from code on first use (`ensureAssistant`,
one passthrough tool `command({ transcript, confirmed })`, server URL secret
derived from the private key) and mints the headless session token.

## Intent parsing

`POST /api/voice/intent` `{ transcript, pending?, confirmed? }` → one tool from
`src/features/voice/schemas.ts`:

- Claude (`claude-sonnet-5`, structured output) when `ANTHROPIC_API_KEY` is set
- otherwise, or on any failure, the regex grammar in `src/lib/voice-grammar.ts`
  (`source: "grammar"` in the response)

## Confirmation gate

`bookCreator`, `approveDraft`, `requestChanges`, `topUp`, `applyToCampaign`,
`submitDraft` never run on the first pass. The route answers with the resolved
action and `"… Confirm?"` plus a `pending` intent; the pill switches to
"Say yes or no" and listens again. A yes sends `{ transcript: "yes", pending }`
and the action runs; a no cancels; anything else is treated as a new command.
On the Vapi path the model re-sends the original command with
`confirmed: true` after the user says yes (system prompt forbids setting it on
its own); the server still resolves the target again before acting.

Navigation and searches run immediately.

## Commands that work

Brand:

| Say | Does |
| --- | --- |
| "go to campaigns" · "open billing" · "show me results" · "take me to the marketplace" | navigates (`ROUTES` in `constants.ts`) |
| "find fintech creators in Germany under 800 euros" | `/brand/creators?industry=…&country=…&max=…` |
| "open Sarah Chen" · "show Sarah's profile" | marketplace search for that creator |
| "open the spring campaign" | campaign detail |
| "show results for spring" | campaign analytics |
| "top up 700 euros" → "yes" | ledger top-up via `topUpWallet` (min €500) |
| "book Sarah for 3 posts" → "yes" | funded invitation on the newest active campaign (`bookCreator`, bundle when posts > 1) |
| "approve Sarah's draft" → "yes" | `reviewDraft` approve on the draft waiting from that creator |
| "request changes on Sarah's draft: shorter hook" → "yes" | `reviewDraft` request_changes with the note |

Creator:

| Say | Does |
| --- | --- |
| "open my opportunities" · "open my card" · "show earnings" | navigates |
| "apply to product teams" → "yes" | `applyToCampaign` on the open campaign matching that name |
| "submit my draft: …" → "yes" | `submitDraft` on your collaboration waiting for a draft (min chars apply) |

Anything else: "Sorry, I didn't get that." Brand-only tools as a creator (and
vice versa) are refused before the confirm step.

## Pill states

`src/lib/voice-state.ts` — idle → listening (waveform, streaming transcript) →
thinking → speaking (reply text) → confirming (gated) → … → idle; error shows
the message and the mic recovers on the next tap. Reduced motion stops the
bars.

## Verified

Locally and on the live URL with a headless Chrome driver: `/api/voice/intent`
(401 anonymous, 403 wrong CSRF, navigate/search/results/unknown, top-up ask →
no → cancelled, ask → yes → wallet moved, role guards) and the pill state
machine with a fake `SpeechRecognition` feeding synthetic transcripts. The Vapi
path is written against Vapi's documented tool-call payload but not exercised
here — no keys in this environment.
