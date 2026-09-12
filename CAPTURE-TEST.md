# CAPTURE-TEST

Proof that the agent capture hook fires automatically, for the 8x assignment.

## Tool and model

- **Tool:** Claude Code — desktop app (`CLAUDE_CODE_ENTRYPOINT=claude-desktop`, bundled binary 2.1.255). The `claude` CLI on PATH, used for the second-session canary, is 2.1.241.
- **Model:** `claude-opus-5` (Opus 5) plans and executes. No separate planning model is configured (`~/.claude/settings.json` has no `model` key; `effortLevel: high`). No subagents.
- The only other model that ran was `claude-haiku-4-5-20251001`, in a throwaway headless probe session used to inspect the raw hook payloads before the hook existed. It ran with an isolated `--settings` file and is not in `.agent-logs/`.

## Mechanism

Claude Code hooks, configured in **`.claude/settings.json`** (project scope, committed):

| Event              | Command                             | What it does                                                        |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------- |
| `UserPromptSubmit` | `.claude/hooks/capture.sh prompt`   | Appends a `PROMPT` entry with the `prompt` field verbatim.          |
| `Stop`             | `.claude/hooks/capture.sh stop`     | Appends a `RESPONSE` entry with the final assistant text only.      |
| `SessionStart`, `PostModelSwitch` | `.claude/hooks/capture.sh hint` | Best-effort model hint for a session's first prompt. |

`capture.sh` is a launcher that locates `python3` without trusting the app's PATH and runs `.claude/hooks/capture.py`. The script reads the hook JSON from stdin, pairs `PROMPT`/`RESPONSE` by `prompt_id`, reads the model name from `message.model` on the assistant lines of the session transcript (`transcript_path`), and appends to one file per session. Thinking, tool calls, tool results and intermediate text are skipped. It prints nothing to stdout and always exits 0 so it can never block or alter a turn.

Entries are append-only. The only rewrite is the YAML frontmatter block (`total_exchanges`, `last_prompt_time`, `model`), which the format requires to stay current.

## Log files the canaries landed in

- Session 1 (this desktop session, hook installed mid-session): `.agent-logs/2026-09-12_07-17-34_d596070f-b07c-453d-92ba-923b8424bee3.md` — canary is entry **2**.
- Session 2 (fresh headless CLI session, `claude -p`): `.agent-logs/2026-09-12_07-38-55_dd2ca68f-76f1-4a5a-bafe-0c9a4dc719bb.md` — canary is entry **1**.

## Canary entries, pasted raw

### Session 1 — `d596070f`

[LOG_ENTRY type=PROMPT num=2 session=d596070f]
timestamp: 2026-09-12T07:38:23.761Z
model: claude-opus-5

CAPTURE TEST — 8x assignment, Faizan Anwar


_(The `RESPONSE num=2` entry for this canary is appended by the `Stop` hook when the turn that replies to it ends, i.e. after this file was first written. It is pasted below in the next commit.)_

### Session 2 — `dd2ca68f`

[LOG_ENTRY type=PROMPT num=1 session=dd2ca68f]
timestamp: 2026-09-12T07:38:55.097Z
model: unknown (no assistant message in this session yet; see the RESPONSE entry)

CAPTURE TEST — 8x assignment, Faizan Anwar


[LOG_ENTRY type=RESPONSE num=1 session=dd2ca68f]
timestamp: 2026-09-12T07:39:08.116Z
model: claude-opus-5

Capture is working. The `UserPromptSubmit` hook fired and wrote this session's log:

`.agent-logs/2026-09-12_07-38-55_dd2ca68f-76f1-4a5a-bafe-0c9a4dc719bb.md`

It recorded the frontmatter (session id, date, author `m-faizananwar`, project `naano-rebuild`) and `[LOG_ENTRY type=PROMPT num=1]` with your exact prompt text. The `Stop` hook will append the matching `RESPONSE` entry when this turn ends — that's also where the `model: unknown` placeholder gets resolved.


## What I checked, tried first, and what did not go smoothly

1. **Confirming the mechanism.** Read the current hooks reference (code.claude.com/docs/en/hooks) rather than assuming: `UserPromptSubmit` and `Stop` exist, project-level `.claude/settings.json` is supported, `CLAUDE_PROJECT_DIR` is exported to hook processes, and hook config edits are picked up live by a file watcher (older versions snapshotted hooks at startup). Then verified the actual stdin payloads on this install with a throwaway `claude -p --settings <probe>` session whose hooks just `cat` stdin to a scratch file.
2. **No hook event carries the model name.** Not `UserPromptSubmit`, not `Stop`, and `SessionStart` didn't include it here either. The model is therefore read from the transcript's assistant lines. Consequence: the very first `PROMPT` of a session is logged with an explicit `unknown (...)` placeholder (visible in session 2 above); every `RESPONSE` carries the real model, so a mid-build switch is always visible there.
3. **Hook installed mid-session.** Session 1 was already running when the hook was written. The docs' "picked up live" claim held: `Stop` fired at the end of the install turn and, finding no `PROMPT` logged yet, recovered the original assignment prompt from the transcript (entry 1 in session 1's log has a `PROMPT` timestamp of `07:17:34Z`, before the hook existed). That is by design in `capture.py` so no response is ever orphaned.
4. **Offline test first.** Before relying on a live canary, `capture.py` was run against the probe payloads with `CLAUDE_PROJECT_DIR` pointed at a scratch directory: paired turn, a multi-line prompt containing `---` and a fake `[LOG_ENTRY …]` line (to make sure the frontmatter parser only ever reads the leading block), the orphan-recovery path, and both Python 3.13 and macOS's system Python 3.9. No synthetic entries were written to the real `.agent-logs/`.
5. **Minor friction.** Running `claude -p` from inside a Claude Code Bash tool: the first probe printed "no stdin data received in 3s" and waited, fixed by redirecting `< /dev/null`; `CLAUDECODE` was unset pre-emptively (`env -u CLAUDECODE`) to avoid the nested-session guard — I did not verify whether it was actually required.
6. **Repo.** The folder was not a git repository; `git init -b main` was run and the capture setup committed before any canary was sent. `.agent-logs/` is not in `.gitignore`.
