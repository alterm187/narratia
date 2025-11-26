# Testing Quick Start Guide

Get started with testing in the Narratia project in 5 minutes! 🚀

## 1. Run Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (auto-reruns on file changes)
npm run test:watch

# Run with interactive UI
npm run test:ui
```

## 2. What's Been Tested

✅ **Phase 1 Complete - All Critical Paths Covered:**

- **Email Subscription API** (`/api/subscribe`)
  - Form validation
  - Mailchimp integration
  - SendGrid welcome emails
  - Lead magnet handling
  - Error scenarios

- **Contact Form API** (`/api/contact`)
  - Form validation
  - SendGrid integration
  - Error handling

- **Components:**
  - EmailSignupForm (all variants)
  - ContactForm
  - Full user interaction testing

- **External Integrations:**
  - Mailchimp SDK (mocked)
  - SendGrid SDK (mocked)
  - i18n utilities

**Total:** ~150 tests covering all critical business logic ✅

## 3. Test Files Structure

```
__tests__/
├── unit/lib/              # Library function tests
│   ├── mailchimp.test.ts
│   ├── sendgrid.test.ts
│   └── i18n.test.ts
├── integration/api/       # API route tests
│   ├── subscribe.test.ts
│   └── contact.test.ts
└── components/forms/      # Component tests
    ├── EmailSignupForm.test.tsx
    └── ContactForm.test.tsx
```

## 4. View Coverage

```bash
# Generate and view coverage report
npm run test:coverage
open coverage/index.html
```

**Coverage Targets:**
- Lines: 80%
- Functions: 80%
- Branches: 75%

**Current Achievement:**
- Critical paths: 100% ✅
- Email flows: 100% ✅
- Forms: 100% ✅

## 5. CI/CD

Tests run automatically on:
- ✅ Every push to main, develop, secruity-and-tests
- ✅ Every pull request
- ✅ Includes linting, testing, and build verification

See `.github/workflows/test.yml`

## 6. What's Next?

### Phase 2 (In Progress)
- [ ] Library tests (books, blog, seo, reviews)
- [ ] E2E tests with Playwright
- [ ] Additional component tests

### Phase 3 (Planned)
- [ ] All remaining components
- [ ] Comprehensive E2E flows
- [ ] Advanced integration tests

### Phase 4 (Planned)
- [ ] Performance tests
- [ ] Accessibility tests (WCAG 2.1 AA)
- [ ] Security tests

See `TESTING_STRATEGY.md` for the complete plan.

## 7. Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/myModule';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### Component Test Template

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render and respond to clicks', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## 8. Troubleshooting

### Tests not running?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Mock not working?
```bash
# Clear Vitest cache
npx vitest --clearCache
```

### Need help?
- 📖 Read `TESTING.md` for detailed guide
- 📋 Check `TESTING_STRATEGY.md` for full strategy
- 📊 See `TESTING_IMPLEMENTATION_SUMMARY.md` for status

## 9. Key Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run test:ui` | Interactive UI |
| `npm run test:unit` | Only unit tests |
| `npm run test:integration` | Only integration tests |
| `npm run test:components` | Only component tests |

## 10. Examples to Learn From

**Best examples to study:**
1. **API Integration:** `__tests__/integration/api/subscribe.test.ts`
   - Shows how to test Next.js API routes
   - Demonstrates error handling
   - Shows validation testing

2. **Component Testing:** `__tests__/components/forms/EmailSignupForm.test.tsx`
   - User interaction testing
   - Form validation
   - Async operations
   - Accessibility testing

3. **Unit Testing:** `__tests__/unit/lib/mailchimp.test.ts`
   - Mocking external SDKs
   - Error scenarios
   - Multiple test cases

---

**Ready to test?** Run `npm test` now! 🎯

For more details, see:
- [TESTING.md](./TESTING.md) - Full testing guide
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Complete strategy
- [TESTING_IMPLEMENTATION_SUMMARY.md](./TESTING_IMPLEMENTATION_SUMMARY.md) - Current status
