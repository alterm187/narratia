#!/bin/bash
# Security Remediation Implementation Script
# This script implements all security fixes from SECURITY_REMEDIATION_PLAN.md
# Scheduled to run at 3 AM via cron

# Exit on any error
set -e

# Script configuration
SCRIPT_DIR="/home/seba/narratia"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/security_remediation.log"
PLAN_FILE="$SCRIPT_DIR/SECURITY_REMEDIATION_PLAN.md"
PROMPT_FILE="$SCRIPT_DIR/security_remediation_prompt.md"

# Ensure we're running in the correct directory
cd "$SCRIPT_DIR" || {
  echo "ERROR: Cannot change to directory $SCRIPT_DIR"
  exit 1
}

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to log messages
log_message() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Start logging
{
  log_message "=========================================="
  log_message "Security Remediation Script Started"
  log_message "=========================================="
  log_message "Working directory: $(pwd)"
  log_message "Plan file: $PLAN_FILE"
  log_message "Prompt file: $PROMPT_FILE"

  # Check prerequisites
  log_message "Checking prerequisites..."

  if [ ! -f "$PLAN_FILE" ]; then
    log_message "ERROR: $PLAN_FILE not found!"
    log_message "Cannot proceed without the security remediation plan."
    exit 1
  fi

  if [ ! -f "$PROMPT_FILE" ]; then
    log_message "ERROR: $PROMPT_FILE not found!"
    log_message "Cannot proceed without the system prompt."
    exit 1
  fi

  # Check if Claude CLI is available (use full path for cron)
  if [ ! -f "/usr/local/bin/claude" ]; then
    log_message "ERROR: Claude CLI not found at /usr/local/bin/claude!"
    log_message "Please install claude-cli first."
    exit 1
  fi

  # Check if npm is available (use full path for cron)
  if [ ! -f "/usr/bin/npm" ]; then
    log_message "ERROR: npm not found at /usr/bin/npm!"
    exit 1
  fi

  # Check if git is available (use full path for cron)
  if [ ! -f "/usr/bin/git" ]; then
    log_message "ERROR: git not found at /usr/bin/git!"
    exit 1
  fi

  # Check git status
  log_message "Checking git status..."
  if [ -n "$(/usr/bin/git status --porcelain)" ]; then
    log_message "WARNING: Working directory has uncommitted changes"
    log_message "Git status:"
    /usr/bin/git status --short
  fi

  # Get current branch
  CURRENT_BRANCH=$(/usr/bin/git branch --show-current)
  log_message "Current branch: $CURRENT_BRANCH"

  # Check if security-fixes branch already exists
  if /usr/bin/git show-ref --verify --quiet refs/heads/security-fixes; then
    log_message "WARNING: security-fixes branch already exists"
    log_message "Will continue on existing branch"
  fi

  log_message "Prerequisites check completed successfully"
  log_message ""
  log_message "=========================================="
  log_message "Starting Claude AI Security Remediation"
  log_message "=========================================="
  log_message ""

  # Run Claude with the security remediation prompt
  /usr/local/bin/claude \
    --append-system-prompt "$(cat "$PROMPT_FILE")" \
    -p "Implement the complete security remediation plan as defined in SECURITY_REMEDIATION_PLAN.md. Work through all 4 phases systematically:

Phase 1 (Critical): Fix path traversal, XSS vulnerabilities, and update dependencies
Phase 2 (High): Implement rate limiting and security headers
Phase 3 (Medium): Improve validation and sanitization
Phase 4 (Low): Add logging and environment variable configuration

Follow the exact code examples from the plan. Test thoroughly after each phase. Commit changes in logical groups. Ensure all tests pass before concluding.

Start by creating the security-fixes branch if it doesn't exist, then proceed with Phase 1." \
    --tools default \
    --permission-mode acceptEdits \
    --max-turns 150 \
    --verbose

  CLAUDE_EXIT_CODE=$?

  log_message ""
  log_message "=========================================="
  log_message "Claude AI Security Remediation Completed"
  log_message "Exit code: $CLAUDE_EXIT_CODE"
  log_message "=========================================="

  # Post-execution summary
  log_message ""
  log_message "Post-execution summary:"
  log_message "Current branch: $(/usr/bin/git branch --show-current)"
  log_message ""
  log_message "Recent commits:"
  /usr/bin/git log --oneline -5
  log_message ""
  log_message "Git status:"
  /usr/bin/git status --short
  log_message ""

  # Check npm audit
  log_message "Running npm audit..."
  if /usr/bin/npm audit --json > "$LOG_DIR/npm_audit_$(date +%Y%m%d_%H%M%S).json"; then
    log_message "npm audit completed - see log file for details"
  else
    log_message "npm audit found issues - see log file for details"
  fi

  # Run tests to verify everything works
  log_message ""
  log_message "Running test suite to verify changes..."
  if /usr/bin/npm test 2>&1 | tee "$LOG_DIR/test_results_$(date +%Y%m%d_%H%M%S).log"; then
    log_message "Tests PASSED ✓"
  else
    log_message "Tests FAILED ✗"
    log_message "Check test logs for details"
  fi

  log_message ""
  log_message "=========================================="
  log_message "Security Remediation Script Finished"
  log_message "Total execution time: $SECONDS seconds"
  log_message "=========================================="

  exit $CLAUDE_EXIT_CODE

} 2>&1 | tee -a "$LOG_FILE"
