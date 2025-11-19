#!/bin/bash
# Step 2: Implement the testing strategy
# This will implement all tests according to TESTING_STRATEGY.md
# PREREQUISITE: Run claude_run_testing_strategy.sh first to generate TESTING_STRATEGY.md

# Ensure we're running in the correct directory
cd /home/seba/narratia || exit 1

if [ ! -f "TESTING_STRATEGY.md" ]; then
  echo "ERROR: TESTING_STRATEGY.md not found!"
  echo "Please run claude_run_testing_strategy.sh first to generate the testing strategy."
  exit 1
fi

/usr/local/bin/claude --append-system-prompt "$(cat testing_implementation_prompt.md)" \
  -p "Implement the complete testing strategy as defined in TESTING_STRATEGY.md. Follow the priority phases and implement all tests systematically. Ensure all tests pass and meet coverage targets." \
  --tools default \
  --permission-mode acceptEdits \
  --max-turns 100 \
  --verbose
