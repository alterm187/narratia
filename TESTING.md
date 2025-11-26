# Testing Guide for Narratia

This document provides comprehensive instructions for running and writing tests for the Narratia project.

## Table of Contents

- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Mocking Strategy](#mocking-strategy)
- [CI/CD](#cicd)
- [Coverage](#coverage)

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Running Tests

### All Tests

```bash
npm test
```

### Specific Test Suites

```bash
# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only component tests
npm run test:components
```

### Watch Mode

```bash
# Watch mode (reruns tests on file changes)
npm run test:watch
```

### Coverage

```bash
# Run tests with coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

### UI Mode

```bash
# Run tests with Vitest UI
npm run test:ui
```

This opens an interactive UI at http://localhost:51204/__vitest__/

## Test Structure

```
narratia/
├── __tests__/                      # All test files
│   ├── unit/                       # Unit tests
│   │   ├── lib/                    # Library function tests
│   │   │   ├── mailchimp.test.ts
│   │   │   ├── sendgrid.test.ts
│   │   │   ├── books.test.ts
│   │   │   ├── blog.test.ts
│   │   │   ├── i18n.test.ts
│   │   │   └── seo.test.ts
│   │   └── utils/                  # Utility function tests
│   │
│   ├── integration/                # Integration tests
│   │   ├── api/                    # API route tests
│   │   │   ├── subscribe.test.ts
│   │   │   ├── contact.test.ts
│   │   │   └── download.test.ts
│   │   └── email/                  # Email integration tests
│   │
│   └── components/                 # Component tests
│       ├── forms/
│       │   ├── EmailSignupForm.test.tsx
│       │   └── ContactForm.test.tsx
│       ├── navigation/
│       ├── content/
│       └── modals/
│
├── mocks/                          # Mock data and handlers
│   ├── handlers.ts                 # MSW request handlers
│   ├── mailchimp.ts                # Mailchimp mocks
│   └── sendgrid.ts                 # SendGrid mocks
│
├── vitest.config.ts                # Vitest configuration
└── vitest.setup.ts                 # Test setup file
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { myFunction } from '@/lib/myModule';

describe('myFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Component Test Example

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/my-route/route';

describe('POST /api/my-route', () => {
  it('should handle valid request', async () => {
    const request = new Request('http://localhost:3000/api/my-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## Mocking Strategy

### External APIs

We use Vitest's `vi.mock()` to mock external APIs:

```typescript
import { mockMailchimpClient } from '@/mocks/mailchimp';

vi.mock('@mailchimp/mailchimp_marketing', () => ({
  default: mockMailchimpClient,
}));
```

### HTTP Requests (MSW)

We use Mock Service Worker (MSW) for mocking HTTP requests:

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/subscribe', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true });
  }),
];
```

### Environment Variables

Environment variables are mocked in `vitest.setup.ts`:

```typescript
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.MAILCHIMP_API_KEY = 'test-key';
// ... etc
```

## CI/CD

Tests run automatically on:
- Push to `main`, `develop`, or `secruity-and-tests` branches
- Pull requests to `main` or `develop`

### GitHub Actions Workflow

The workflow:
1. Runs linting
2. Runs all unit and integration tests
3. Generates coverage report
4. Uploads coverage to Codecov
5. Builds the Next.js app

See `.github/workflows/test.yml` for details.

### Local CI Simulation

```bash
# Run the same checks as CI
npm run lint && npm run test:coverage && npm run build
```

## Coverage

### Coverage Targets

| Metric | Target |
|--------|--------|
| Lines | 80% |
| Functions | 80% |
| Branches | 75% |
| Statements | 80% |

### Module-Specific Targets

| Module | Target |
|--------|--------|
| API Routes | 95% |
| lib/mailchimp.ts | 95% |
| lib/sendgrid.ts | 95% |
| lib/books.ts | 90% |
| lib/blog.ts | 90% |
| Form Components | 90% |
| Other Components | 80% |

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report in browser
open coverage/index.html
```

### Coverage Exclusions

The following are excluded from coverage:
- `node_modules/`
- `.next/`
- Configuration files (`*.config.*`)
- Type definitions (`*.d.ts`)
- Test files themselves
- Mock files

## Best Practices

### 1. Test Naming

- Use descriptive test names that explain what is being tested
- Follow the pattern: "should [expected behavior] when [condition]"
- Use `describe` blocks to group related tests

### 2. AAA Pattern

Structure tests using Arrange-Act-Assert:

```typescript
it('should do something', () => {
  // Arrange - set up test data
  const input = 'test';

  // Act - execute the code being tested
  const result = myFunction(input);

  // Assert - verify the result
  expect(result).toBe('expected');
});
```

### 3. Test Isolation

- Each test should be independent
- Use `beforeEach` to reset state
- Clear mocks between tests

### 4. Async Testing

- Use `async/await` for async operations
- Use `waitFor` for async UI updates
- Set appropriate timeouts for slow operations

### 5. Accessibility Testing

- Use Testing Library's accessible queries (`getByRole`, `getByLabelText`)
- Test keyboard navigation
- Verify ARIA attributes

## Troubleshooting

### Tests Failing Locally

1. **Clear node_modules and reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Clear Vitest cache**
   ```bash
   npx vitest --clearCache
   ```

### Tests Failing in CI

1. **Check environment variables** - Ensure all required env vars are set in GitHub Secrets
2. **Check Node version** - CI uses Node 20, ensure compatibility
3. **Review CI logs** - Look for specific error messages

### Mock Issues

1. **Mock not being called** - Ensure mock is set up before import
2. **Mock persisting between tests** - Use `vi.clearAllMocks()` in `beforeEach`
3. **MSW not intercepting** - Check handler URL patterns

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

If you encounter issues:
1. Check this documentation
2. Review existing tests for examples
3. Check CI/CD logs for errors
4. Review the testing strategy document (TESTING_STRATEGY.md)
