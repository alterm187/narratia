# Security Remediation Automation

**Created:** 2025-11-19
**Purpose:** Automated security remediation implementation using Claude AI

---

## Overview

This document describes the automated security remediation system that implements all security fixes from `SECURITY_REMEDIATION_PLAN.md` automatically via a scheduled cron job.

## Files

### 1. Security Remediation Plan
**File:** `SECURITY_REMEDIATION_PLAN.md`
**Purpose:** Complete security remediation plan with all fixes, code examples, and testing procedures
**Phases:**
- Phase 1: Critical vulnerabilities (path traversal, XSS, dependencies)
- Phase 2: High severity (rate limiting, security headers)
- Phase 3: Medium severity (validation, sanitization)
- Phase 4: Low severity (logging, configuration)

### 2. System Prompt
**File:** `security_remediation_prompt.md`
**Purpose:** Detailed instructions for Claude AI on how to implement the remediation plan
**Contents:**
- Implementation requirements
- Phase-by-phase instructions
- Testing requirements
- Success criteria
- Error handling guidelines

### 3. Execution Script
**File:** `claude_run_security_remediation.sh`
**Purpose:** Bash script that orchestrates the security remediation process
**Features:**
- Prerequisites checking
- Git status validation
- Claude AI execution with proper parameters
- Post-execution testing
- Comprehensive logging
- Error handling

### 4. Log Directory
**Location:** `logs/`
**Files:**
- `security_remediation.log` - Main execution log
- `security_remediation_cron.log` - Cron execution wrapper log
- `npm_audit_YYYYMMDD_HHMMSS.json` - npm audit results
- `test_results_YYYYMMDD_HHMMSS.log` - Test execution results

---

## Cron Schedule

### Schedule
**Time:** 3:00 AM daily
**Cron Expression:** `0 3 * * *`

### Cron Entry
```bash
0 3 * * * cd /home/seba/narratia && /home/seba/narratia/claude_run_security_remediation.sh >> /home/seba/narratia/logs/security_remediation_cron.log 2>&1
```

### Execution Flow
1. Cron triggers at 3:00 AM
2. Changes to `/home/seba/narratia` directory
3. Executes `claude_run_security_remediation.sh`
4. Redirects all output to `logs/security_remediation_cron.log`

---

## How It Works

### 1. Pre-execution Checks
The script verifies:
- Current working directory is correct
- `SECURITY_REMEDIATION_PLAN.md` exists
- `security_remediation_prompt.md` exists
- Claude CLI is installed and available
- npm is available
- git is available
- Git repository status

### 2. Claude AI Execution
```bash
/usr/local/bin/claude \
  --append-system-prompt "$(cat security_remediation_prompt.md)" \
  -p "Implement the complete security remediation plan..." \
  --tools default \
  --permission-mode acceptEdits \
  --max-turns 150 \
  --verbose
```

**Parameters:**
- `--append-system-prompt`: Loads detailed instructions from prompt file
- `--tools default`: Enables all standard tools (Read, Write, Edit, Bash, etc.)
- `--permission-mode acceptEdits`: Auto-accepts file edits
- `--max-turns 150`: Allows up to 150 AI turns (sufficient for all phases)
- `--verbose`: Detailed logging

### 3. Implementation Process
Claude AI will:
1. Read `SECURITY_REMEDIATION_PLAN.md`
2. Create `security-fixes` branch (if needed)
3. **Phase 1**: Fix critical vulnerabilities
   - Path traversal protection
   - XSS protection in emails
   - Dependency updates
4. **Phase 2**: Fix high severity issues
   - Rate limiting implementation
   - Security headers configuration
5. **Phase 3**: Fix medium severity issues
   - Email validation improvements
   - Input length limits
   - Markdown sanitization
6. **Phase 4**: Fix low severity issues
   - Security logging
   - Environment variable configuration
7. Test each change
8. Commit changes with descriptive messages

### 4. Post-execution
The script:
- Logs git status
- Shows recent commits
- Runs `npm audit`
- Executes test suite
- Captures all results in logs

---

## Monitoring

### Checking Execution Status

**View latest log:**
```bash
tail -f logs/security_remediation.log
```

**View cron wrapper log:**
```bash
tail -f logs/security_remediation_cron.log
```

**Check if it ran today:**
```bash
ls -lht logs/security_remediation.log | head -1
```

**View test results:**
```bash
ls -lt logs/test_results_*.log | head -1 | xargs cat
```

**View npm audit results:**
```bash
ls -lt logs/npm_audit_*.json | head -1 | xargs cat | jq
```

### Success Indicators

✅ **Successful run:**
- Log shows "Security Remediation Script Finished"
- Exit code is 0
- Tests PASSED ✓
- npm audit shows no critical issues
- Commits created on `security-fixes` branch

❌ **Failed run:**
- Log shows errors
- Exit code is non-zero
- Tests FAILED ✗
- No new commits

---

## Manual Execution

### Run immediately (for testing):
```bash
cd /home/seba/narratia
./claude_run_security_remediation.sh
```

### Run with specific phase:
Edit the prompt in the script to focus on specific phases.

### Dry run (check without executing):
```bash
# Verify script syntax
bash -n claude_run_security_remediation.sh

# Verify prerequisites
cd /home/seba/narratia
if [ -f SECURITY_REMEDIATION_PLAN.md ]; then echo "Plan exists"; fi
if [ -f security_remediation_prompt.md ]; then echo "Prompt exists"; fi
```

---

## Managing Cron Jobs

### View current cron schedule:
```bash
crontab -l
```

### Edit cron schedule:
```bash
crontab -e
```

### Disable security remediation (comment out):
```bash
crontab -l | sed 's/^0 3 \* \* \* cd \/home\/seba\/narratia/#&/' | crontab -
```

### Re-enable security remediation (uncomment):
```bash
crontab -l | sed 's/^#0 3 \* \* \* cd \/home\/seba\/narratia/0 3 * * * cd \/home\/seba\/narratia/' | crontab -
```

### Change schedule time:
```bash
# Run at 2 AM instead of 3 AM
crontab -l | sed 's/^0 3 \*/0 2 */' | crontab -
```

---

## Expected Outcomes

### After First Run
- New branch `security-fixes` created
- Multiple commits implementing security fixes
- All critical vulnerabilities fixed
- All high severity issues fixed
- Most or all medium/low severity issues fixed
- Test suite passing
- No critical npm audit vulnerabilities

### Git History
```
security-fixes
  ├─ fix: add path traversal protection to download endpoint
  ├─ fix: add XSS protection to email templates
  ├─ chore: update js-yaml dependency
  ├─ feat: implement rate limiting on API endpoints
  ├─ feat: add security headers
  ├─ feat: improve email validation
  ├─ feat: add input length limits
  ├─ feat: sanitize markdown rendering
  ├─ feat: add security event logging
  └─ chore: move configuration to environment variables
```

### Files Modified
- `app/api/download/[filename]/route.ts`
- `app/api/contact/route.ts`
- `app/api/subscribe/route.ts`
- `lib/sendgrid.ts`
- `lib/ratelimit.ts` (new)
- `lib/security-logger.ts` (new)
- `next.config.ts`
- `components/MarkdownContent.tsx`
- `package.json`, `package-lock.json`
- `.env.example` (new)

---

## Troubleshooting

### Issue: Cron doesn't run
**Check:**
```bash
# Verify cron service is running
sudo service cron status

# Check system logs
grep CRON /var/log/syslog | tail -20

# Verify crontab entry
crontab -l | grep security
```

### Issue: Script fails with "command not found"
**Solution:** The script already uses full paths for cron compatibility:
```bash
/usr/local/bin/claude  # Claude CLI
/usr/bin/npm           # npm
/usr/bin/git           # git
```
This is required because cron has a limited PATH environment.

### Issue: Changes not committed
**Check:**
```bash
cd /home/seba/narratia
git status
git log --oneline -10
```

**Solution:** Check logs for git errors, ensure git user config is set

### Issue: Tests fail
**Check:**
```bash
cd /home/seba/narratia
npm test
```

**Solution:** Review test logs, may need manual intervention

### Issue: Rate limiting fails to install
**Solution:** Check if Upstash Redis credentials are set in `.env.local`
Or use the in-memory fallback option

---

## Notifications (Optional)

### Email on completion:
Add to crontab:
```bash
0 3 * * * cd /home/seba/narratia && /home/seba/narratia/claude_run_security_remediation.sh >> /home/seba/narratia/logs/security_remediation_cron.log 2>&1 && echo "Security remediation completed" | mail -s "Narratia Security Update" your@email.com
```

### Slack notification:
Add to end of script:
```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Security remediation completed on Narratia"}' \
  YOUR_SLACK_WEBHOOK_URL
```

---

## Maintenance

### Weekly:
- Review logs for any errors
- Check if branch `security-fixes` needs to be merged
- Verify tests are passing

### Monthly:
- Review security remediation effectiveness
- Update SECURITY_REMEDIATION_PLAN.md if new vulnerabilities found
- Test manual execution

### After Major Changes:
- Re-run security review
- Update remediation plan
- Consider running script manually

---

## Disabling Automation

If you want to disable the automatic remediation (e.g., during active development):

```bash
# Comment out the cron job
crontab -e
# Add # at the beginning of the security remediation line

# Or remove it entirely
crontab -l | grep -v "claude_run_security_remediation" | crontab -
```

---

## Security Considerations

### Credentials
- Claude AI CLI may store credentials in `~/.config/claude/`
- Ensure proper file permissions: `chmod 600 ~/.config/claude/*`

### Logs
- Logs may contain sensitive information
- Rotate logs regularly
- Consider adding to `.gitignore`:
  ```
  logs/*.log
  logs/*.json
  ```

### Auto-commits
- Script makes commits automatically
- Review commits before merging to main
- Consider requiring manual review via PR

---

## Recovery

### If something goes wrong:

```bash
cd /home/seba/narratia

# 1. Check current branch
git branch --show-current

# 2. If on security-fixes, return to previous branch
git checkout main  # or your previous branch

# 3. If needed, reset security-fixes
git branch -D security-fixes

# 4. Stash any uncommitted changes
git stash

# 5. Re-run from clean state
./claude_run_security_remediation.sh
```

---

## Future Enhancements

- Add success/failure email notifications
- Integrate with CI/CD pipeline
- Automatic PR creation after successful completion
- Slack/Discord notifications
- Metrics tracking (time taken, issues fixed, etc.)
- Retry logic for transient failures

---

## Support

For issues or questions:
1. Check logs first
2. Review SECURITY_REMEDIATION_PLAN.md
3. Test manual execution
4. Check cron is configured correctly

---

**Last Updated:** 2025-11-19
**Next Review:** Weekly (check logs and git history)
