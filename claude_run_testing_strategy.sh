#!/bin/bash
# Step 1: Generate comprehensive testing strategy for Narratia
# This will analyze the codebase and create TESTING_STRATEGY.md

claude --append-system-prompt "$(cat testing_strategy_prompt.md)" \
  -p "Analyze the Narratia codebase and create a comprehensive testing strategy document (TESTING_STRATEGY.md) following the guidelines provided. Be thorough in your analysis and specific in your recommendations." \
  --tools default \
  --permission-mode acceptEdits \
  --max-turns 50 \
  --verbose
