claude --append-system-prompt "$(cat /path/to/cleanup_prompt.md)" \
  -p "Execute the code cleanup and reorganization following the guidelines provided" \
  --tools default \
  --permission-mode acceptEdits \
  --max-turns 50 \
  --verbose