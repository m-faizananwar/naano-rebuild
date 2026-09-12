# Project notes for Claude Code

## Agent capture (8x assignment) — do not touch

- `.claude/settings.json` wires `UserPromptSubmit` and `Stop` hooks to
  `.claude/hooks/capture.sh`, which appends every prompt and final response to
  `.agent-logs/<date>_<time>_<session-id>.md`. It fires automatically.
- Never edit, tidy, summarise or delete anything in `.agent-logs/`. Never add
  `.agent-logs/` to `.gitignore`.
- Commit the `.agent-logs/` changes together with the code they produced, as you
  go — one commit per unit of work, never one log dump at the end.
