#!/bin/sh
# Thin launcher for capture.py. Hook processes inherit the app's environment,
# not an interactive shell's, so find a python3 explicitly rather than trusting PATH.
DIR="$(cd "$(dirname "$0")" && pwd)"
for p in python3 /opt/homebrew/bin/python3 /usr/local/bin/python3 /usr/bin/python3; do
  if command -v "$p" >/dev/null 2>&1; then
    exec "$p" "$DIR/capture.py" "$@"
  fi
done
echo "$(date -u +%FT%TZ) capture.sh: no python3 found" >> "$DIR/capture-errors.log"
exit 0
