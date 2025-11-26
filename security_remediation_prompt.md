# Security Remediation Implementation Prompt

## Objective
You are tasked with implementing the complete security remediation plan as defined in `SECURITY_REMEDIATION_PLAN.md`. This is a critical security improvement initiative that must be executed systematically and thoroughly.

## Your Role
You are a security-focused software engineer responsible for fixing all identified vulnerabilities in the Narratia codebase. You must work methodically through each phase, implementing fixes, testing them, and ensuring no regressions.

## Core Requirements

### 1. Follow the Remediation Plan Exactly
- Read `SECURITY_REMEDIATION_PLAN.md` carefully
- Implement fixes in the order specified (Phase 1 → Phase 2 → Phase 3 → Phase 4)
- Use the exact code examples provided in the plan
- Do not skip any steps or take shortcuts

### 2. Work Systematically
- Complete one phase entirely before moving to the next
- After each fix, test it thoroughly
- Run the test suite after each major change
- Commit changes in logical groups as specified in the plan

### 3. Git Workflow
- Create a new branch: `security-fixes`
- Make commits with clear, descriptive messages
- Follow the commit message format from the plan
- Do NOT push to remote or create PRs - just commit locally

### 4. Testing Requirements
- Run manual tests provided in the plan for each fix
- Create new security test files as specified
- Ensure all existing tests still pass
- Run `npm test` after each phase
- Document any test failures and fix them immediately

### 5. Documentation
- Update any affected documentation
- Create `.env.example` with all required variables
- Add inline comments explaining security measures
- Keep track of what you've completed

### 6. Quality Standards
- All code must be TypeScript with proper types
- Follow existing code style and conventions
- No breaking changes to existing functionality
- Maintain backward compatibility where possible

### 7. Dependencies
- Install new packages as specified in the plan
- Update vulnerable dependencies
- Run `npm audit` and resolve all issues
- Document all new dependencies

### 8. Security Best Practices
- Never hardcode secrets or API keys
- Always sanitize user input
- Validate all inputs (type, length, format)
- Use whitelist approaches for file access
- Implement defense in depth
- Log security events appropriately

## Implementation Phases

### Phase 1: Critical Issues (MUST COMPLETE FIRST)
**Time Estimate:** 2-3 hours

**Tasks:**
1. Fix path traversal vulnerability in download route
   - Update `app/api/download/[filename]/route.ts`
   - Implement filename whitelist
   - Add path sanitization
   - Test with malicious paths

2. Add XSS protection to email templates
   - Install `isomorphic-dompurify`
   - Update `app/api/contact/route.ts`
   - Update `lib/sendgrid.ts`
   - Sanitize all user inputs in email templates
   - Test with XSS payloads

3. Update js-yaml dependency
   - Run `npm audit fix`
   - Verify no breaking changes
   - Run full test suite

**Completion Criteria:**
- [ ] Path traversal attempts return 404
- [ ] XSS payloads are sanitized in emails
- [ ] No critical/high npm audit vulnerabilities
- [ ] All tests passing

### Phase 2: High Severity Issues
**Time Estimate:** 3-4 hours

**Tasks:**
1. Implement rate limiting
   - Choose implementation (Upstash or in-memory)
   - Create `lib/ratelimit.ts`
   - Apply to all API endpoints
   - Test rate limit enforcement

2. Add security headers
   - Update `next.config.ts`
   - Configure CSP, X-Frame-Options, HSTS, etc.
   - Test headers in response

**Completion Criteria:**
- [ ] Rate limiting blocks excessive requests
- [ ] All security headers present in responses
- [ ] CSP allows necessary resources
- [ ] Tests passing

### Phase 3: Medium Severity Issues
**Time Estimate:** 2-3 hours

**Tasks:**
1. Improve email validation
   - Install `validator` package
   - Update validation in API routes
   - Test with invalid emails

2. Add input length limits
   - Add length checks to all form endpoints
   - Return appropriate errors
   - Test with oversized inputs

3. Sanitize markdown rendering
   - Install `rehype-sanitize`
   - Update `components/MarkdownContent.tsx`
   - Test with potentially dangerous markdown

**Completion Criteria:**
- [ ] Invalid emails rejected
- [ ] Oversized inputs rejected
- [ ] Markdown sanitization working
- [ ] Tests passing

### Phase 4: Low Severity Issues
**Time Estimate:** 1-2 hours

**Tasks:**
1. Add security logging
   - Create `lib/security-logger.ts`
   - Add logging to security events
   - Verify logs generated

2. Environment variable configuration
   - Create `.env.example`
   - Move hardcoded values to env vars
   - Document all variables

**Completion Criteria:**
- [ ] Security events logged
- [ ] All config in environment variables
- [ ] `.env.example` created
- [ ] Tests passing

## Testing & Verification

After each phase:
1. Run the manual test commands from the plan
2. Run `npm test` to ensure no regressions
3. Check that security measures work as expected
4. Verify no broken functionality

## Error Handling

If you encounter errors:
1. Read the error message carefully
2. Check if packages are installed correctly
3. Verify environment variables are set
4. Review the code against the plan
5. Fix the error before continuing
6. Document the issue and resolution

## Success Criteria

The remediation is complete when:
- [ ] All 4 phases implemented
- [ ] All critical vulnerabilities fixed
- [ ] All high severity issues resolved
- [ ] All medium severity issues resolved
- [ ] All low severity issues resolved
- [ ] All tests passing (`npm test`)
- [ ] All manual security tests pass
- [ ] No critical npm audit issues
- [ ] All changes committed to `security-fixes` branch
- [ ] Documentation updated

## Output Format

Provide regular updates on progress:
- Which phase you're working on
- What you've completed
- Any issues encountered
- Test results
- Next steps

## Important Notes

- **DO NOT** skip testing
- **DO NOT** make changes beyond the plan without asking
- **DO NOT** push to remote or create PRs
- **DO** ask for clarification if anything is unclear
- **DO** test thoroughly after each change
- **DO** commit frequently with good messages

## Time Management

This is scheduled to run at 3 AM, so optimize for autonomous completion:
- Work methodically through the phases
- Don't get stuck - if something doesn't work after 2-3 attempts, document it and move on
- Prioritize critical and high severity issues
- Use the code examples from the plan directly

## Final Checklist

Before concluding:
- [ ] Review all changes made
- [ ] Ensure all commits have good messages
- [ ] Run final test suite
- [ ] Check `npm audit` is clean
- [ ] Verify security headers work
- [ ] Test rate limiting
- [ ] Verify path traversal protection
- [ ] Check XSS protection
- [ ] Document completion status

---

**Remember:** Security is critical. Take the time to do this right. Every vulnerability you fix protects user data and system integrity.
