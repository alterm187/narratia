# Narratia Testing Strategy

**Version:** 1.0
**Last Updated:** 2025-11-17
**Author:** Testing Strategy Analysis

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Testing Scope Analysis](#testing-scope-analysis)
3. [Testing Types & Coverage](#testing-types--coverage)
4. [Testing Framework Recommendations](#testing-framework-recommendations)
5. [Test Structure & Organization](#test-structure--organization)
6. [Priority Test Cases](#priority-test-cases)
7. [Mocking Strategy](#mocking-strategy)
8. [CI/CD Integration](#cicd-integration)
9. [Implementation Phases](#implementation-phases)
10. [Coverage Targets](#coverage-targets)

---

## Executive Summary

### Project Overview
**Narratia** is a Next.js 16 + React 19 multilingual author platform for Sebastian Proba, featuring:
- Bilingual content (Polish/English) with dynamic routing
- Blog platform with categorization and search
- Book catalog with reviews and testimonials
- Lead magnet system (free essays/chapters for email collection)
- Email marketing integration (Mailchimp + SendGrid)
- Contact forms and newsletter subscriptions
- SEO optimization with schema.org markup
- PDF downloads with analytics tracking

### Current State
- **No existing test infrastructure** - Starting from scratch
- **No test files** present in the repository
- **No testing frameworks** configured
- **Security concern**: `.env.local` contains exposed API keys (should be in `.gitignore`)

### Testing Philosophy
Adopt a **risk-based, pragmatic testing approach** that prioritizes:
1. **Critical user flows** (email signups, contact forms, downloads)
2. **External integrations** (Mailchimp, SendGrid, analytics)
3. **Data integrity** (content loading, i18n, SEO)
4. **Security** (input validation, email sanitization, XSS prevention)

---

## Testing Scope Analysis

### 1. Components (17 Total)

#### Critical Priority (User-Facing Forms)
| Component | Lines | Complexity | Risk Level | Test Priority |
|-----------|-------|------------|------------|---------------|
| `EmailSignupForm.tsx` | 162 | High | **CRITICAL** | 1 |
| `ContactForm.tsx` | 111 | Medium | **CRITICAL** | 1 |
| `ChaptersEmailForm.tsx` | 23 | Low | **HIGH** | 2 |
| `BookEmailSignup.tsx` | 107 | Medium | **HIGH** | 2 |

**Why Critical:**
- Direct revenue/lead generation impact
- External API integration points
- User data handling (GDPR compliance)
- Multiple variants and edge cases

#### High Priority (Navigation & Layout)
| Component | Lines | Complexity | Risk Level | Test Priority |
|-----------|-------|------------|------------|---------------|
| `Header.tsx` | 97 | Medium | **HIGH** | 2 |
| `Footer.tsx` | 86 | Low | **MEDIUM** | 3 |
| `LanguageSwitcher.tsx` | 58 | Medium | **HIGH** | 2 |
| `NewsletterModal.tsx` | 239 | High | **HIGH** | 2 |

**Why High:**
- Core navigation functionality
- i18n routing logic
- Mobile menu state management
- Modal triggering logic

#### Medium Priority (Content Display)
| Component | Lines | Complexity | Risk Level | Test Priority |
|-----------|-------|------------|------------|---------------|
| `MarkdownContent.tsx` | 67 | Medium | **MEDIUM** | 3 |
| `BlogPostCard.tsx` | 114 | Low | **MEDIUM** | 3 |
| `BookCard.tsx` | 70 | Low | **MEDIUM** | 3 |
| `ReviewsSection.tsx` | 130 | Medium | **MEDIUM** | 3 |
| `Hero.tsx` | 102 | Low | **LOW** | 4 |
| `ExcerptCard.tsx` | 95 | Low | **LOW** | 4 |
| `BookPageWrapper.tsx` | 20 | Low | **LOW** | 4 |
| `ExpandableSection.tsx` | 52 | Low | **LOW** | 4 |
| `ScrollToTop.tsx` | 14 | Low | **LOW** | 4 |

---

### 2. Pages (14 Routes)

#### Critical Priority
| Route | File | Risk Level | Test Priority |
|-------|------|------------|---------------|
| `/:lang/download/essay` | `download/essay/page.tsx` | **CRITICAL** | 1 |
| `/:lang/download/chapters` | `download/chapters/page.tsx` | **CRITICAL** | 1 |
| `/:lang/contact` | `contact/page.tsx` | **CRITICAL** | 1 |

**Why Critical:**
- Lead magnet conversion pages
- Email collection endpoints
- Direct business value impact

#### High Priority
| Route | File | Risk Level | Test Priority |
|-------|------|------------|---------------|
| `/:lang` | `[lang]/page.tsx` | **HIGH** | 2 |
| `/:lang/books/:slug` | `books/[slug]/page.tsx` | **HIGH** | 2 |
| `/:lang/blog/:slug` | `blog/[slug]/page.tsx` | **HIGH** | 2 |
| `/:lang/books` | `books/page.tsx` | **MEDIUM** | 3 |
| `/:lang/blog` | `blog/page.tsx` | **MEDIUM** | 3 |

#### Medium Priority
| Route | File | Risk Level | Test Priority |
|-------|------|------------|---------------|
| `/:lang/about` | `about/page.tsx` | **MEDIUM** | 3 |
| `/:lang/fragmenty` | `fragmenty/page.tsx` | **LOW** | 4 |
| `/:lang/download/thank-you` | `download/thank-you/page.tsx` | **LOW** | 4 |

---

### 3. API Routes (4 Endpoints)

#### Critical Priority
| Endpoint | Method | Risk Level | Test Priority |
|----------|--------|------------|---------------|
| `/api/subscribe` | POST | **CRITICAL** | 1 |
| `/api/contact` | POST | **CRITICAL** | 1 |
| `/api/download/[filename]` | GET | **HIGH** | 2 |
| `/api/subscribe?email=...` | GET | **MEDIUM** | 3 |

**Why Critical:**
- External API integrations (Mailchimp, SendGrid)
- Data validation and sanitization
- Email handling and privacy compliance
- Error handling and graceful degradation

---

### 4. Library Functions (8 Modules)

#### Critical Priority
| Module | Functions | Risk Level | Test Priority |
|--------|-----------|------------|---------------|
| `lib/mailchimp.ts` | 4 | **CRITICAL** | 1 |
| `lib/sendgrid.ts` | 2 | **CRITICAL** | 1 |
| `lib/books.ts` | 4 | **HIGH** | 2 |
| `lib/blog.ts` | 8 | **HIGH** | 2 |
| `lib/i18n.ts` | 3 | **HIGH** | 2 |
| `lib/reviews.ts` | 5 | **MEDIUM** | 3 |
| `lib/seo.ts` | 5 | **MEDIUM** | 3 |
| `lib/i18n-client.ts` | 1 | **LOW** | 4 |

---

### 5. External Dependencies

#### Third-Party APIs
| Service | Purpose | Risk | Mocking Required |
|---------|---------|------|------------------|
| **Mailchimp** | List management | **CRITICAL** | Yes |
| **SendGrid** | Transactional email | **CRITICAL** | Yes |
| **Vercel Analytics** | Event tracking | **MEDIUM** | Yes |

#### Content Sources
| Source | Type | Risk | Mocking Required |
|--------|------|------|------------------|
| Markdown files | Blog/Books content | **MEDIUM** | Yes |
| JSON files | Reviews, categories | **LOW** | Yes |
| PDF files | Downloads | **LOW** | Yes |

---

## Testing Types & Coverage

### 1. Unit Tests

**Scope:** Individual functions and utilities in isolation

#### Target Areas:

**A. Library Functions** (`lib/`)
- ✅ **`lib/books.ts`**
  - `getAllBooks()` - Loads and parses all book markdown files
  - `getFeaturedBooks()` - Filters featured books correctly
  - `getBookBySlug()` - Finds book by locale-specific slug
  - `getBookById()` - Finds book by ID
  - Edge cases: Missing files, malformed YAML, bilingual fallbacks

- ✅ **`lib/blog.ts`**
  - `getAllBlogPosts()` - Parses markdown with frontmatter
  - `getBlogPostBySlug()` - Slug matching
  - `getFeaturedBlogPosts()` - Featured filtering
  - `getBlogPostsByCategory()` - Category filtering
  - `searchBlogPosts()` - Full-text search logic
  - `calculateReadingTime()` - Reading time estimation
  - `formatBlogDate()` - Locale-aware date formatting
  - Edge cases: Invalid dates, missing translations, empty content

- ✅ **`lib/reviews.ts`**
  - `getBookReviews()` - Load review JSON
  - `getFeaturedReviews()` - Top-rated filtering
  - `formatReviewDate()` - Locale formatting
  - `getRatingPercentage()` - Percentage calculation
  - `getStarDisplay()` - Star visualization
  - Edge cases: Missing review files, invalid ratings

- ✅ **`lib/i18n.ts`**
  - `getDictionary()` - Async dictionary loading
  - `getLocaleFromPathname()` - Extract locale from URL
  - `getPathnameWithoutLocale()` - Remove locale prefix
  - Edge cases: Invalid locales, missing dictionary keys

- ✅ **`lib/seo.ts`**
  - `generateMetaTags()` - Metadata object generation
  - `generateBookSchema()` - JSON-LD schema validation
  - `generateAuthorSchema()` - Author schema structure
  - `generateArticleSchema()` - Article schema structure
  - `generateHreflangTags()` - Hreflang link generation
  - Edge cases: Missing data, special characters, URL encoding

**B. Utility Functions**
- Email validation regex in `/api/subscribe/route.ts:91`
- Date formatting helpers
- URL slug generation
- Markdown parsing utilities

**C. Data Transformations**
- YAML frontmatter parsing
- JSON-LD schema generation
- Rating aggregations
- Search ranking algorithms

**Coverage Target:** 90% for library functions

---

### 2. Integration Tests

**Scope:** Multiple modules working together, including external APIs

#### Target Areas:

**A. API Routes with External Services**
- ✅ **`/api/subscribe` (POST)**
  - Valid subscription flow (Mailchimp + SendGrid)
  - Duplicate subscriber handling
  - Lead magnet tag assignment
  - Welcome email generation (HTML + text)
  - Email validation failures
  - Missing consent checkbox
  - Mailchimp API errors (429, 500)
  - SendGrid failures (non-blocking)
  - Response formats and status codes

- ✅ **`/api/contact` (POST)**
  - Valid contact form submission
  - Email delivery to owner
  - Missing required fields
  - Email format validation
  - SendGrid API errors
  - HTML/text email generation
  - XSS prevention in message content

- ✅ **`/api/download/[filename]` (GET)**
  - Valid PDF download
  - Analytics event tracking
  - File not found (404)
  - Cache headers validation
  - Content-Type headers
  - User-agent and referer logging

**B. Email Integration Tests**
- ✅ **Mailchimp Integration**
  - Add subscriber with tags
  - Update existing subscriber
  - Handle duplicate emails gracefully
  - Tag segmentation (lang, lead-magnet)
  - Retrieve subscriber info
  - Audience statistics

- ✅ **SendGrid Integration**
  - Send plain text email
  - Send HTML email with template
  - Welcome email with download link
  - Contact form email to owner
  - Error handling (invalid API key, rate limits)

**C. Content Loading with File System**
- Load books from markdown files
- Parse blog posts with gray-matter
- Load reviews from JSON
- Handle missing files gracefully
- Bilingual content merging

**Coverage Target:** 85% for integration tests

---

### 3. Component Tests

**Scope:** React components in isolation with user interaction simulation

#### Target Areas:

**A. Form Components** (Critical)
- ✅ **`EmailSignupForm.tsx`**
  - Render all variants (inline, footer, hero, lead-magnet)
  - Email input validation
  - First name input handling
  - Consent checkbox requirement
  - Form submission flow
  - Success message display
  - Error message handling
  - API error scenarios
  - Loading state management
  - Form reset after success
  - Accessibility (ARIA labels, keyboard navigation)

- ✅ **`ContactForm.tsx`**
  - Render with required fields (name, email, message)
  - Input validation (all fields required)
  - Email format validation
  - Submit button disabled states
  - Success message display
  - Error handling
  - Form reset behavior
  - Character limits
  - Accessibility compliance

- ✅ **`ChaptersEmailForm.tsx`** & **`BookEmailSignup.tsx`**
  - Variant-specific rendering
  - Props passing to EmailSignupForm
  - Lead magnet parameter handling

**B. Navigation Components** (High Priority)
- ✅ **`Header.tsx`**
  - Desktop navigation rendering
  - Mobile menu toggle
  - Active link highlighting
  - Language switcher integration
  - Responsive breakpoints
  - Sticky positioning behavior

- ✅ **`Footer.tsx`**
  - All sections render (company, social, books, newsletter)
  - Newsletter signup integration
  - Social links functionality
  - Copyright display

- ✅ **`LanguageSwitcher.tsx`**
  - Language toggle button
  - URL routing maintenance
  - Active language display
  - Bilingual label rendering

**C. Content Components** (Medium Priority)
- ✅ **`MarkdownContent.tsx`**
  - Render markdown with GFM support
  - Code block highlighting
  - External links open in new tab
  - Heading hierarchy
  - XSS prevention (sanitize HTML)

- ✅ **`BlogPostCard.tsx`**
  - Featured variant styling
  - Date formatting
  - Excerpt truncation
  - Tag display
  - Author information

- ✅ **`ReviewsSection.tsx`**
  - Rating distribution visualization
  - Featured reviews display
  - Star rating rendering
  - Empty state handling

- ✅ **`NewsletterModal.tsx`**
  - Modal open/close state
  - Email signup integration
  - Success message with redirect
  - Backdrop click to close
  - ESC key to close

**D. UI Components** (Low Priority)
- ✅ **`ExpandableSection.tsx`** - Toggle behavior
- ✅ **`ScrollToTop.tsx`** - Scroll detection

**Coverage Target:** 80% for components

---

### 4. End-to-End (E2E) Tests

**Scope:** Critical user flows across pages and API routes

#### Priority E2E Scenarios:

**A. Lead Magnet Flows** (CRITICAL)
1. **Essay Download Flow**
   - Navigate to `/en/download/essay`
   - Fill email signup form
   - Submit with consent
   - Verify API calls (Mailchimp + SendGrid)
   - Confirm thank-you page redirect
   - Verify download link in welcome email (mock)
   - Check Mailchimp tags: `essay-download`, `lead-magnet`, `lang-en`

2. **Chapter Download Flow**
   - Navigate to `/pl/download/chapters`
   - Fill signup form with first name
   - Submit form
   - Verify Mailchimp subscription
   - Verify welcome email sent
   - Confirm thank-you page with download button
   - Track PDF download analytics

**B. Contact Flow** (CRITICAL)
3. **Contact Form Submission**
   - Navigate to `/en/contact`
   - Fill name, email, message
   - Submit form
   - Verify SendGrid email sent to owner
   - Confirm success message displayed
   - Form resets after submission

**C. Newsletter Signup** (HIGH)
4. **Footer Newsletter Signup**
   - Visit any page
   - Scroll to footer
   - Fill email in newsletter form
   - Submit without lead magnet
   - Verify Mailchimp subscription
   - Check tag: `newsletter-signup`

5. **Newsletter Modal Popup**
   - Visit homepage
   - Trigger modal (time delay or exit intent)
   - Submit email
   - Modal closes on success
   - Verify subscription

**D. Navigation & i18n** (HIGH)
6. **Language Switching**
   - Start on `/en/books/minds-reflection`
   - Click language switcher
   - Verify redirect to `/pl/books/odbicie-umyslu`
   - Content displays in Polish
   - Navigation links updated

7. **Blog Reading Flow**
   - Visit `/en/blog`
   - Click featured post
   - Read article with markdown rendering
   - Verify metadata (title, author, date)
   - Related posts display

**E. Book Discovery** (MEDIUM)
8. **Book Detail Page**
   - Navigate to book detail page
   - View cover, description, reviews
   - Check buy links render
   - Email signup form present
   - Ratings display correctly

**F. PDF Download** (MEDIUM)
9. **PDF Download with Analytics**
   - Click download link
   - Verify GET `/api/download/odbicie-umyslu.pdf`
   - Check analytics event fired
   - PDF downloads successfully
   - Cache headers present

**Coverage Target:** 70% of critical user paths

---

### 5. API Tests

**Scope:** Direct HTTP testing of API endpoints

#### Test Cases:

**A. `/api/subscribe` (POST)**
```typescript
// Valid Requests
✅ Subscribe with minimal data (email + consent)
✅ Subscribe with full data (email, firstName, lastName)
✅ Subscribe with lead magnet (essay, chapters, audio)
✅ Subscribe in Polish language
✅ Subscribe in English language
✅ Already subscribed user (idempotent)

// Validation Errors
❌ Missing email
❌ Invalid email format
❌ Missing consent checkbox
❌ Invalid language (not 'en' or 'pl')
❌ Invalid lead magnet type

// External API Errors
⚠️ Mailchimp API timeout
⚠️ Mailchimp 429 rate limit
⚠️ SendGrid failure (should not block subscription)
```

**B. `/api/contact` (POST)**
```typescript
// Valid Requests
✅ Send with all required fields
✅ Send with long message (1000+ chars)
✅ Send with special characters in name
✅ Send with international email domains

// Validation Errors
❌ Missing name
❌ Missing email
❌ Missing message
❌ Invalid email format
❌ XSS attempt in message (<script> tags)

// External API Errors
⚠️ SendGrid API failure (500)
⚠️ SendGrid rate limit
```

**C. `/api/download/[filename]` (GET)**
```typescript
// Valid Requests
✅ Download existing PDF (odbicie-umyslu.pdf)
✅ Verify Content-Type: application/pdf
✅ Verify Content-Disposition header
✅ Verify cache headers (max-age=31536000)
✅ Analytics event tracked

// Error Cases
❌ File not found (404)
❌ Invalid filename (path traversal attempt)
```

**D. `/api/subscribe` (GET)**
```typescript
// Valid Requests
✅ Check subscribed email (returns subscriber data)
✅ Check unsubscribed email (returns not subscribed)

// Validation Errors
❌ Missing email parameter
❌ Invalid email format
```

**Coverage Target:** 95% for API routes

---

### 6. Security Tests

**Scope:** Input validation, XSS prevention, data sanitization

#### Security Test Cases:

**A. Input Validation**
- ✅ Email regex validation rejects malicious patterns
- ✅ SQL injection attempts blocked (N/A - no database)
- ✅ Path traversal prevention in file downloads
- ✅ URL validation in external links
- ✅ CSRF protection (Next.js built-in)

**B. XSS Prevention**
- ✅ Contact form message sanitized before email
- ✅ Markdown content sanitized (no `<script>` injection)
- ✅ User input escaped in HTML rendering
- ✅ Email addresses validated before passing to APIs

**C. GDPR Compliance**
- ✅ Consent checkbox required for email signup
- ✅ No tracking without consent
- ✅ Email data not logged in plaintext

**D. API Key Security**
- ⚠️ **CRITICAL ISSUE**: `.env.local` exposed in repository
- ✅ API keys only accessible server-side (not in client bundle)
- ✅ No API keys in error messages or logs

**E. Rate Limiting**
- ✅ Handle Mailchimp/SendGrid rate limits gracefully
- ⚠️ No rate limiting on own API routes (potential abuse)

**Coverage Target:** 100% for security-critical paths

---

## Testing Framework Recommendations

### 1. Test Runner & Framework

**Recommended: Vitest**

**Rationale:**
- ✅ **Native ESM support** - Aligns with Next.js 16 and modern tooling
- ✅ **Fast execution** - Vite-powered, 10x faster than Jest for TS/ESM projects
- ✅ **Compatible with Jest API** - Easy migration path, familiar syntax
- ✅ **Built-in TypeScript support** - No additional config needed
- ✅ **Watch mode** - Excellent DX for TDD
- ✅ **Coverage** - Integrated with c8/istanbul
- ✅ **Parallel execution** - Fast CI builds

**Installation:**
```bash
npm install -D vitest @vitest/ui c8
```

**Configuration:** `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        'scripts/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Alternative: Jest**
- More mature ecosystem
- Better snapshot testing
- Larger community
- Slower for ESM/TypeScript projects

---

### 2. Component Testing

**Recommended: React Testing Library (@testing-library/react)**

**Rationale:**
- ✅ **User-centric** - Tests interact with components like users do
- ✅ **Accessibility-first** - Encourages semantic HTML and ARIA
- ✅ **Framework-agnostic** - Works with Vitest or Jest
- ✅ **Built-in async utilities** - `waitFor`, `findBy` queries
- ✅ **No implementation details** - Tests stay maintainable

**Installation:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Setup File:** `vitest.setup.ts`
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

**Example Test:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EmailSignupForm from '@/components/EmailSignupForm';

describe('EmailSignupForm', () => {
  it('submits form with valid email', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    render(<EmailSignupForm variant="inline" language="en" />);

    const emailInput = screen.getByLabelText(/email/i);
    const consentCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(consentCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

---

### 3. E2E Testing

**Recommended: Playwright**

**Rationale:**
- ✅ **Modern architecture** - Better than Cypress for Next.js
- ✅ **Multi-browser testing** - Chromium, Firefox, WebKit
- ✅ **Built-in network mocking** - Intercept API calls
- ✅ **Auto-wait** - No flaky tests from timing issues
- ✅ **Parallel execution** - Fast test suite
- ✅ **TypeScript-first** - Native TS support
- ✅ **CI-ready** - Docker images, GitHub Actions integration

**Installation:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Configuration:** `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Example E2E Test:**
```typescript
import { test, expect } from '@playwright/test';

test('essay download flow', async ({ page }) => {
  await page.goto('/en/download/essay');

  // Fill form
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/first name/i).fill('John');
  await page.getByRole('checkbox').check();

  // Intercept API call
  await page.route('**/api/subscribe', (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
  );

  // Submit
  await page.getByRole('button', { name: /download/i }).click();

  // Verify redirect
  await expect(page).toHaveURL(/\/download\/thank-you/);
});
```

---

### 4. API Testing

**Recommended: Vitest + MSW (Mock Service Worker)**

**Rationale:**
- ✅ **Network-level mocking** - Intercepts actual fetch/XHR calls
- ✅ **Reusable mocks** - Same mocks for unit, integration, E2E tests
- ✅ **Type-safe** - TypeScript support
- ✅ **Browser + Node** - Works in both environments

**Installation:**
```bash
npm install -D msw
```

**Setup:** `mocks/handlers.ts`
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/subscribe', async ({ request }) => {
    const body = await request.json();
    if (!body.email) {
      return HttpResponse.json({ error: 'Email required' }, { status: 400 });
    }
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/contact', async ({ request }) => {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return HttpResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    return HttpResponse.json({ success: true });
  }),
];
```

**Vitest Setup:**
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

### 5. Mocking External APIs

**Mailchimp & SendGrid Mocking**

**Recommended: Vitest `vi.mock()` + Test Doubles**

**Example: Mailchimp Mock**
```typescript
// __mocks__/mailchimp.ts
import { vi } from 'vitest';

export const addSubscriber = vi.fn((data) => {
  if (data.email === 'duplicate@example.com') {
    return Promise.reject({ status: 400, title: 'Member Exists' });
  }
  return Promise.resolve({ id: 'mock-id', email_address: data.email });
});

export const addTagsToSubscriber = vi.fn(() => Promise.resolve());
export const getSubscriberInfo = vi.fn(() => Promise.resolve(null));
```

**Usage in Tests:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addSubscriber } from '@/lib/mailchimp';

vi.mock('@/lib/mailchimp');

describe('/api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds subscriber to Mailchimp', async () => {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        consent: true,
        language: 'en',
      }),
    });

    expect(addSubscriber).toHaveBeenCalledWith({
      email: 'test@example.com',
      tags: ['lang-en'],
      merge_fields: {},
    });
  });
});
```

---

### 6. Code Coverage

**Recommended: c8 (Vitest built-in)**

**Configuration in `vitest.config.ts`:**
```typescript
coverage: {
  provider: 'c8',
  reporter: ['text', 'json', 'html', 'lcov'],
  all: true,
  include: ['app/**', 'components/**', 'lib/**'],
  exclude: [
    'node_modules/',
    '.next/',
    'app/layout.tsx', // Root layout (minimal logic)
    '**/*.d.ts',
    '**/*.config.*',
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80,
  },
}
```

**Run Coverage:**
```bash
npm run test:coverage
```

---

## Test Structure & Organization

### Directory Structure

```
narratia/
├── __tests__/                    # Unit & Integration tests
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── books.test.ts
│   │   │   ├── blog.test.ts
│   │   │   ├── reviews.test.ts
│   │   │   ├── i18n.test.ts
│   │   │   ├── seo.test.ts
│   │   │   ├── mailchimp.test.ts    # Mocked
│   │   │   └── sendgrid.test.ts     # Mocked
│   │   └── utils/
│   │       └── email-validation.test.ts
│   │
│   ├── integration/
│   │   ├── api/
│   │   │   ├── subscribe.test.ts
│   │   │   ├── contact.test.ts
│   │   │   └── download.test.ts
│   │   └── email/
│   │       ├── mailchimp-integration.test.ts
│   │       └── sendgrid-integration.test.ts
│   │
│   └── components/
│       ├── forms/
│       │   ├── EmailSignupForm.test.tsx
│       │   ├── ContactForm.test.tsx
│       │   ├── BookEmailSignup.test.tsx
│       │   └── ChaptersEmailForm.test.tsx
│       ├── navigation/
│       │   ├── Header.test.tsx
│       │   ├── Footer.test.tsx
│       │   └── LanguageSwitcher.test.tsx
│       ├── content/
│       │   ├── MarkdownContent.test.tsx
│       │   ├── BlogPostCard.test.tsx
│       │   ├── BookCard.test.tsx
│       │   └── ReviewsSection.test.tsx
│       └── modals/
│           └── NewsletterModal.test.tsx
│
├── e2e/                          # End-to-End tests
│   ├── lead-magnets/
│   │   ├── essay-download.spec.ts
│   │   └── chapters-download.spec.ts
│   ├── contact/
│   │   └── contact-form.spec.ts
│   ├── newsletter/
│   │   ├── footer-signup.spec.ts
│   │   └── modal-signup.spec.ts
│   ├── navigation/
│   │   ├── language-switching.spec.ts
│   │   └── mobile-menu.spec.ts
│   ├── blog/
│   │   └── blog-reading.spec.ts
│   └── books/
│       └── book-detail.spec.ts
│
├── mocks/                        # Mock data & handlers
│   ├── handlers.ts              # MSW request handlers
│   ├── mailchimp.ts             # Mailchimp mock responses
│   ├── sendgrid.ts              # SendGrid mock responses
│   ├── content/                 # Mock content files
│   │   ├── books.ts
│   │   ├── blog-posts.ts
│   │   └── reviews.ts
│   └── fixtures/                # Test data
│       ├── valid-emails.json
│       └── invalid-emails.json
│
├── vitest.setup.ts              # Vitest global setup
├── vitest.config.ts             # Vitest configuration
├── playwright.config.ts         # Playwright configuration
└── package.json                 # Test scripts
```

---

### Naming Conventions

#### Test Files
- **Unit tests**: `{module-name}.test.ts`
- **Component tests**: `{ComponentName}.test.tsx`
- **Integration tests**: `{feature}.test.ts`
- **E2E tests**: `{feature}.spec.ts`

#### Test Suites & Cases
```typescript
describe('ComponentName', () => {
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

**Examples:**
```typescript
describe('EmailSignupForm', () => {
  describe('when submitting valid data', () => {
    it('should call API with correct payload', async () => {});
    it('should display success message', async () => {});
    it('should reset form fields', async () => {});
  });

  describe('when validation fails', () => {
    it('should show error for invalid email', async () => {});
    it('should require consent checkbox', async () => {});
  });
});
```

---

### Test Organization Patterns

#### 1. AAA Pattern (Arrange-Act-Assert)
```typescript
it('should subscribe user to newsletter', async () => {
  // Arrange
  const mockEmail = 'test@example.com';
  vi.mock('@/lib/mailchimp');

  // Act
  const result = await addSubscriber({ email: mockEmail });

  // Assert
  expect(result.email_address).toBe(mockEmail);
});
```

#### 2. Given-When-Then (BDD Style)
```typescript
describe('Contact Form', () => {
  describe('Given user is on contact page', () => {
    describe('When user submits valid form', () => {
      it('Then should send email to owner', async () => {});
      it('Then should display success message', async () => {});
    });
  });
});
```

#### 3. Test Factories
```typescript
// __tests__/factories/user.ts
export const createMockSubscriber = (overrides = {}) => ({
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  language: 'en',
  consent: true,
  ...overrides,
});

// Usage
const subscriber = createMockSubscriber({ email: 'custom@example.com' });
```

---

### Setup and Teardown

#### Global Setup (`vitest.setup.ts`)
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// MSW server setup
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.MAILCHIMP_API_KEY = 'test-api-key';
process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
```

#### Per-Test Setup
```typescript
describe('EmailSignupForm', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  it('should submit form', async () => {
    // Test implementation
  });
});
```

---

## Priority Test Cases

### Phase 1: Critical Tests (Must-Have)

#### 1.1 Email Signup Form (`components/EmailSignupForm.tsx`)

**File:** `__tests__/components/forms/EmailSignupForm.test.tsx`

**Test Cases:**
```typescript
describe('EmailSignupForm', () => {
  // Rendering
  ✅ renders inline variant with correct styling
  ✅ renders footer variant with compact layout
  ✅ renders hero variant with large CTA
  ✅ renders lead-magnet variant with custom copy

  // Form Validation
  ✅ shows error for empty email
  ✅ shows error for invalid email format (missing @)
  ✅ shows error for invalid email domain
  ✅ shows error when consent checkbox not checked
  ✅ accepts valid email formats (unicode, subdomains)

  // Form Submission
  ✅ submits form with email only (minimal data)
  ✅ submits form with email + first name
  ✅ calls /api/subscribe with correct payload
  ✅ includes language parameter (en/pl)
  ✅ includes lead magnet type if provided
  ✅ shows loading state during submission
  ✅ disables submit button while loading

  // Success Flow
  ✅ displays success message after subscription
  ✅ calls onSuccess callback if provided
  ✅ resets form fields after success
  ✅ unchecks consent checkbox after success

  // Error Handling
  ✅ displays error message on API failure
  ✅ handles network errors gracefully
  ✅ handles duplicate subscriber (shows friendly message)
  ✅ allows retry after error

  // Accessibility
  ✅ has proper ARIA labels on all inputs
  ✅ has accessible error messages (aria-invalid)
  ✅ supports keyboard navigation (Tab, Enter)
  ✅ focuses first input on mount (optional)
});
```

**Priority:** P0 (Blocking)
**Estimated Effort:** 4 hours
**Dependencies:** MSW setup, @testing-library/react

---

#### 1.2 Contact Form (`components/ContactForm.tsx`)

**File:** `__tests__/components/forms/ContactForm.test.tsx`

**Test Cases:**
```typescript
describe('ContactForm', () => {
  // Rendering
  ✅ renders all required fields (name, email, message)
  ✅ renders submit button

  // Validation
  ✅ shows error when name is empty
  ✅ shows error when email is empty
  ✅ shows error when message is empty
  ✅ shows error for invalid email format
  ✅ validates message minimum length (optional)

  // Submission
  ✅ submits form with valid data
  ✅ calls /api/contact with correct payload
  ✅ shows loading state during submission
  ✅ disables submit button while loading

  // Success Flow
  ✅ displays success message after send
  ✅ resets form after successful submission
  ✅ clears all fields

  // Error Handling
  ✅ displays error on API failure
  ✅ handles SendGrid errors
  ✅ allows retry after error

  // Security
  ✅ sanitizes message content (no <script> tags)
  ✅ prevents XSS in name field

  // Accessibility
  ✅ has proper labels for all inputs
  ✅ supports keyboard navigation
  ✅ announces errors to screen readers
});
```

**Priority:** P0 (Blocking)
**Estimated Effort:** 3 hours

---

#### 1.3 API Route: `/api/subscribe` (POST)

**File:** `__tests__/integration/api/subscribe.test.ts`

**Test Cases:**
```typescript
describe('POST /api/subscribe', () => {
  // Valid Requests
  ✅ subscribes user with minimal data (email + consent)
  ✅ subscribes with first name
  ✅ subscribes with first + last name
  ✅ subscribes with essay lead magnet
  ✅ subscribes with chapters lead magnet
  ✅ subscribes with audio lead magnet
  ✅ subscribes with newsletter-only (no lead magnet)
  ✅ subscribes in Polish language
  ✅ subscribes in English language
  ✅ returns 200 with success message
  ✅ calls Mailchimp with correct tags
  ✅ calls SendGrid for welcome email (lead magnet only)
  ✅ includes download link in welcome email

  // Duplicate Handling
  ✅ handles already subscribed email gracefully
  ✅ returns success (idempotent behavior)
  ✅ sets alreadySubscribed flag in response

  // Validation Errors
  ❌ returns 400 when email is missing
  ❌ returns 400 when email is invalid format
  ❌ returns 400 when consent is false
  ❌ returns 400 when consent is missing
  ❌ returns 400 when language is invalid
  ❌ rejects SQL injection attempts

  // External API Errors
  ⚠️ handles Mailchimp API timeout
  ⚠️ handles Mailchimp 500 error
  ⚠️ handles Mailchimp 429 rate limit
  ⚠️ continues if SendGrid fails (non-blocking)
  ⚠️ logs errors for monitoring

  // Security
  ✅ sanitizes email before passing to Mailchimp
  ✅ escapes special characters in name fields
  ✅ validates MIME types in requests
});
```

**Priority:** P0 (Blocking)
**Estimated Effort:** 5 hours
**Dependencies:** Mailchimp mock, SendGrid mock

---

#### 1.4 API Route: `/api/contact` (POST)

**File:** `__tests__/integration/api/contact.test.ts`

**Test Cases:**
```typescript
describe('POST /api/contact', () => {
  // Valid Requests
  ✅ sends email with all required fields
  ✅ sends email with long message (1000+ chars)
  ✅ sends email with special characters in name
  ✅ sends email with international domains (.co.uk, .de)
  ✅ returns 200 with success message
  ✅ calls SendGrid with correct recipient
  ✅ includes sender email in reply-to header
  ✅ generates HTML and plain text versions

  // Validation Errors
  ❌ returns 400 when name is missing
  ❌ returns 400 when email is missing
  ❌ returns 400 when message is missing
  ❌ returns 400 when email is invalid
  ❌ rejects empty strings in fields

  // Security
  ✅ sanitizes message content (HTML escaping)
  ✅ prevents XSS in message body
  ✅ prevents header injection in name/email
  ✅ limits message length (10,000 chars)

  // External API Errors
  ⚠️ handles SendGrid API failure (500)
  ⚠️ handles SendGrid rate limit (429)
  ⚠️ logs errors with request metadata
});
```

**Priority:** P0 (Blocking)
**Estimated Effort:** 3 hours

---

#### 1.5 Mailchimp Integration (`lib/mailchimp.ts`)

**File:** `__tests__/unit/lib/mailchimp.test.ts`

**Test Cases:**
```typescript
describe('Mailchimp Integration', () => {
  describe('addSubscriber', () => {
    ✅ adds new subscriber with email only
    ✅ adds subscriber with merge fields (firstName, lastName)
    ✅ adds subscriber with tags (lang, lead-magnet)
    ✅ updates existing subscriber (upsert behavior)
    ✅ handles duplicate email gracefully
    ✅ returns subscriber ID on success

    ❌ throws error for invalid API key
    ❌ throws error for invalid audience ID
    ⚠️ retries on network timeout
    ⚠️ handles rate limit (429) with backoff
  });

  describe('addTagsToSubscriber', () => {
    ✅ adds tags to existing subscriber
    ✅ handles multiple tags in one call
    ✅ ignores duplicate tags

    ❌ throws error if subscriber not found
  });

  describe('getSubscriberInfo', () => {
    ✅ retrieves subscriber by email
    ✅ returns null if not found
    ✅ includes tags in response
  });
});
```

**Priority:** P0 (Blocking)
**Estimated Effort:** 3 hours

---

#### 1.6 SendGrid Integration (`lib/sendgrid.ts`)

**File:** `__tests__/unit/lib/sendgrid.test.ts`

**Test Cases:**
```typescript
describe('SendGrid Integration', () => {
  describe('sendEmail', () => {
    ✅ sends plain text email
    ✅ sends HTML email
    ✅ sends email with attachments (optional)
    ✅ sets from address correctly
    ✅ sets reply-to header if provided
    ✅ returns message ID on success

    ❌ throws error for invalid API key
    ❌ throws error for missing recipient
    ⚠️ handles API timeout
    ⚠️ handles rate limit
  });

  describe('sendWelcomeEmail', () => {
    ✅ generates essay download email in English
    ✅ generates essay download email in Polish
    ✅ generates chapters download email in English
    ✅ generates chapters download email in Polish
    ✅ includes download link in email body
    ✅ includes newsletter opt-in notice
    ✅ generates both HTML and plain text versions
    ✅ personalizes with first name if provided
    ✅ uses generic greeting if no name
  });
});
```

**Priority:** P0 (Blocking)
**Estimated Effort:** 3 hours

---

### Phase 2: High-Priority Tests

#### 2.1 Book Loading (`lib/books.ts`)

**File:** `__tests__/unit/lib/books.test.ts`

**Test Cases:**
```typescript
describe('Book Library', () => {
  describe('getAllBooks', () => {
    ✅ loads all book markdown files
    ✅ parses YAML frontmatter correctly
    ✅ merges bilingual content (en + pl files)
    ✅ returns array of Book objects
    ✅ includes all required fields
    ✅ handles missing optional fields
    ✅ sorts by publishedDate (newest first)

    ⚠️ handles missing .en.md file gracefully
    ⚠️ handles missing .pl.md file gracefully
    ⚠️ handles malformed YAML frontmatter
  });

  describe('getFeaturedBooks', () => {
    ✅ filters books where featured === true
    ✅ returns empty array if no featured books
    ✅ respects original sort order
  });

  describe('getBookBySlug', () => {
    ✅ finds book by English slug
    ✅ finds book by Polish slug
    ✅ returns undefined if not found
    ✅ handles slug case-insensitively (optional)
  });

  describe('getBookById', () => {
    ✅ finds book by ID
    ✅ returns undefined if not found
  });
});
```

**Priority:** P1 (High)
**Estimated Effort:** 3 hours

---

#### 2.2 Blog Loading (`lib/blog.ts`)

**File:** `__tests__/unit/lib/blog.test.ts`

**Test Cases:**
```typescript
describe('Blog Library', () => {
  describe('getAllBlogPosts', () => {
    ✅ loads all blog markdown files
    ✅ parses frontmatter with gray-matter
    ✅ extracts bilingual titles/excerpts
    ✅ parses ISO date strings
    ✅ sorts by date (newest first)
    ✅ includes all fields (slug, category, tags)

    ⚠️ handles malformed YAML
    ⚠️ handles invalid dates
    ⚠️ handles missing translations
  });

  describe('getBlogPostBySlug', () => {
    ✅ finds post by slug
    ✅ returns null if not found
    ✅ handles case sensitivity
  });

  describe('getFeaturedBlogPosts', () => {
    ✅ filters featured posts
    ✅ limits results to specified count
    ✅ returns most recent if limit exceeded
  });

  describe('getBlogPostsByCategory', () => {
    ✅ filters posts by category ID
    ✅ returns empty array for unknown category
  });

  describe('searchBlogPosts', () => {
    ✅ searches in title (case-insensitive)
    ✅ searches in excerpt
    ✅ searches in tags
    ✅ filters by language
    ✅ returns ranked results (title > excerpt > tags)
  });

  describe('calculateReadingTime', () => {
    ✅ estimates reading time for short content (< 500 words)
    ✅ estimates reading time for long content (> 2000 words)
    ✅ assumes 200 words/minute
  });

  describe('formatBlogDate', () => {
    ✅ formats date in Polish (dd MMMM yyyy)
    ✅ formats date in English (MMMM dd, yyyy)
    ✅ handles invalid dates gracefully
  });
});
```

**Priority:** P1 (High)
**Estimated Effort:** 4 hours

---

#### 2.3 i18n (`lib/i18n.ts`)

**File:** `__tests__/unit/lib/i18n.test.ts`

**Test Cases:**
```typescript
describe('i18n Library', () => {
  describe('getDictionary', () => {
    ✅ loads English dictionary
    ✅ loads Polish dictionary
    ✅ returns object with all keys
    ✅ throws error for unsupported locale
  });

  describe('getLocaleFromPathname', () => {
    ✅ extracts "en" from "/en/books"
    ✅ extracts "pl" from "/pl/blog"
    ✅ returns defaultLocale for "/"
    ✅ returns defaultLocale for "/unknown"
  });

  describe('getPathnameWithoutLocale', () => {
    ✅ removes "/en" from "/en/books" → "/books"
    ✅ removes "/pl" from "/pl/contact" → "/contact"
    ✅ returns "/" for "/en"
    ✅ handles trailing slashes
  });
});
```

**Priority:** P1 (High)
**Estimated Effort:** 2 hours

---

#### 2.4 SEO (`lib/seo.ts`)

**File:** `__tests__/unit/lib/seo.test.ts`

**Test Cases:**
```typescript
describe('SEO Library', () => {
  describe('generateMetaTags', () => {
    ✅ generates title meta tag
    ✅ generates description meta tag
    ✅ generates Open Graph tags (og:title, og:image, og:url)
    ✅ generates Twitter card tags
    ✅ generates canonical URL
    ✅ includes locale in metadata
    ✅ handles missing optional fields
  });

  describe('generateBookSchema', () => {
    ✅ generates valid Book schema.org JSON-LD
    ✅ includes ISBN (ebook, print, ASIN)
    ✅ includes author information
    ✅ includes aggregateRating if present
    ✅ includes offers (buy links)
    ✅ validates against schema.org spec
  });

  describe('generateAuthorSchema', () => {
    ✅ generates valid Person schema.org JSON-LD
    ✅ includes name, url, jobTitle
  });

  describe('generateArticleSchema', () => {
    ✅ generates valid BlogPosting schema.org JSON-LD
    ✅ includes headline, author, datePublished
    ✅ includes image if present
  });

  describe('generateHreflangTags', () => {
    ✅ generates hreflang link for English
    ✅ generates hreflang link for Polish
    ✅ includes x-default link
    ✅ uses correct URL format
  });
});
```

**Priority:** P1 (High)
**Estimated Effort:** 3 hours

---

#### 2.5 E2E: Essay Download Flow

**File:** `e2e/lead-magnets/essay-download.spec.ts`

**Test Cases:**
```typescript
describe('Essay Download Flow', () => {
  test('complete essay download flow in English', async ({ page }) => {
    ✅ navigates to /en/download/essay
    ✅ page displays essay description
    ✅ email signup form is visible
    ✅ fills email input
    ✅ fills first name input
    ✅ checks consent checkbox
    ✅ clicks submit button
    ✅ shows loading state during submission
    ✅ redirects to /en/download/thank-you
    ✅ thank you page displays success message
    ✅ download link is present
    ✅ verifies Mailchimp API called (via mock)
    ✅ verifies SendGrid API called (via mock)
  });

  test('complete essay download flow in Polish', async ({ page }) => {
    ✅ navigates to /pl/download/essay
    ✅ content displays in Polish
    ✅ form labels in Polish
    ✅ completes signup flow
    ✅ redirects to Polish thank you page
  });

  test('handles validation errors', async ({ page }) => {
    ✅ shows error for empty email
    ✅ shows error for invalid email
    ✅ shows error for unchecked consent
    ✅ prevents form submission when invalid
  });

  test('handles API errors', async ({ page }) => {
    ✅ displays error message on API failure
    ✅ allows retry after error
  });
});
```

**Priority:** P1 (High)
**Estimated Effort:** 3 hours

---

#### 2.6 E2E: Contact Form

**File:** `e2e/contact/contact-form.spec.ts`

**Test Cases:**
```typescript
describe('Contact Form Flow', () => {
  test('sends contact message successfully', async ({ page }) => {
    ✅ navigates to /en/contact
    ✅ displays contact form
    ✅ displays alternative contact methods (email, social)
    ✅ fills name field
    ✅ fills email field
    ✅ fills message field
    ✅ clicks send button
    ✅ shows loading state
    ✅ displays success message
    ✅ form resets after success
    ✅ verifies SendGrid API called
  });

  test('validates required fields', async ({ page }) => {
    ✅ shows error when name is empty
    ✅ shows error when email is empty
    ✅ shows error when message is empty
    ✅ prevents submission when invalid
  });
});
```

**Priority:** P1 (High)
**Estimated Effort:** 2 hours

---

### Phase 3: Comprehensive Coverage

#### 3.1 Header Component

**File:** `__tests__/components/navigation/Header.test.tsx`

**Test Cases:**
```typescript
describe('Header', () => {
  // Desktop
  ✅ renders all navigation links
  ✅ highlights active link
  ✅ displays language switcher
  ✅ links have correct hrefs

  // Mobile
  ✅ renders mobile menu toggle button
  ✅ opens mobile menu on click
  ✅ closes mobile menu on link click
  ✅ closes mobile menu on outside click
  ✅ traps focus in mobile menu when open

  // Accessibility
  ✅ has proper ARIA labels
  ✅ supports keyboard navigation
  ✅ announces menu state to screen readers
});
```

**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours

---

#### 3.2 MarkdownContent Component

**File:** `__tests__/components/content/MarkdownContent.test.tsx`

**Test Cases:**
```typescript
describe('MarkdownContent', () => {
  ✅ renders markdown text as HTML
  ✅ renders headings (h1-h6)
  ✅ renders links with correct href
  ✅ opens external links in new tab
  ✅ renders code blocks with syntax highlighting
  ✅ renders inline code
  ✅ renders lists (ul, ol)
  ✅ renders blockquotes
  ✅ renders tables (GFM)
  ✅ renders strikethrough (GFM)
  ✅ sanitizes HTML (prevents XSS)
  ✅ handles empty content gracefully
});
```

**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours

---

#### 3.3 Language Switcher

**File:** `__tests__/components/navigation/LanguageSwitcher.test.tsx`

**Test Cases:**
```typescript
describe('LanguageSwitcher', () => {
  ✅ displays current language
  ✅ displays alternate language link
  ✅ maintains pathname when switching
  ✅ switches /en/books to /pl/books
  ✅ switches /pl/blog to /en/blog
  ✅ handles slugs that differ per language
  ✅ accessible to screen readers
  ✅ keyboard navigable
});
```

**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours

---

#### 3.4 Reviews Section

**File:** `__tests__/components/content/ReviewsSection.test.tsx`

**Test Cases:**
```typescript
describe('ReviewsSection', () => {
  ✅ displays average rating
  ✅ displays total review count
  ✅ renders rating distribution chart
  ✅ displays featured reviews
  ✅ renders star ratings correctly
  ✅ shows verified badge for verified reviews
  ✅ displays review date in correct locale
  ✅ handles empty reviews gracefully
  ✅ handles missing rating distribution
});
```

**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours

---

#### 3.5 Newsletter Modal

**File:** `__tests__/components/modals/NewsletterModal.test.tsx`

**Test Cases:**
```typescript
describe('NewsletterModal', () => {
  ✅ renders when isOpen is true
  ✅ does not render when isOpen is false
  ✅ calls onClose when backdrop clicked
  ✅ calls onClose when ESC key pressed
  ✅ calls onClose when close button clicked
  ✅ displays email signup form
  ✅ shows success message after signup
  ✅ closes modal after successful signup
  ✅ traps focus within modal
  ✅ restores focus to trigger element on close
});
```

**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours

---

#### 3.6 API Route: Download PDF

**File:** `__tests__/integration/api/download.test.ts`

**Test Cases:**
```typescript
describe('GET /api/download/[filename]', () => {
  ✅ downloads PDF file successfully
  ✅ returns Content-Type: application/pdf
  ✅ returns Content-Disposition: attachment
  ✅ sets cache headers (max-age=31536000)
  ✅ tracks analytics event (pdf_download)
  ✅ includes filename in analytics
  ✅ includes user-agent in analytics
  ✅ includes referer in analytics

  ❌ returns 404 for non-existent file
  ❌ prevents path traversal attacks (../../../etc/passwd)
  ❌ rejects requests for non-PDF files
});
```

**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours

---

#### 3.7 E2E: Language Switching

**File:** `e2e/navigation/language-switching.spec.ts`

**Test Cases:**
```typescript
describe('Language Switching', () => {
  test('switches language on book detail page', async ({ page }) => {
    ✅ navigates to /en/books/minds-reflection
    ✅ verifies content is in English
    ✅ clicks language switcher
    ✅ URL changes to /pl/books/odbicie-umyslu
    ✅ content displays in Polish
    ✅ navigation links updated to Polish
  });

  test('maintains page context when switching', async ({ page }) => {
    ✅ starts on blog post page
    ✅ switches language
    ✅ stays on same blog post (different slug)
  });
});
```

**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours

---

### Phase 4: Performance & Accessibility

#### 4.1 Performance Tests

**File:** `e2e/performance/page-load.spec.ts`

**Test Cases:**
```typescript
describe('Performance', () => {
  test('homepage loads within 3 seconds', async ({ page }) => {
    ✅ measures time to interactive (TTI)
    ✅ measures largest contentful paint (LCP)
    ✅ measures cumulative layout shift (CLS)
    ✅ verifies Core Web Vitals thresholds
  });

  test('images are optimized', async ({ page }) => {
    ✅ all images have width/height attributes
    ✅ uses next/image for optimization
    ✅ lazy loads below-the-fold images
  });

  test('fonts load efficiently', async ({ page }) => {
    ✅ uses font-display: swap
    ✅ preloads critical fonts
  });
});
```

**Priority:** P3 (Low)
**Estimated Effort:** 3 hours

---

#### 4.2 Accessibility Tests

**File:** `e2e/accessibility/wcag.spec.ts`

**Test Cases:**
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

describe('Accessibility', () => {
  test('homepage meets WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/en');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('forms are accessible', async ({ page }) => {
    await page.goto('/en/contact');

    ✅ all inputs have labels
    ✅ error messages have aria-invalid
    ✅ submit button has descriptive text
    ✅ focus indicators are visible

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    ✅ can tab through all interactive elements
    ✅ can submit forms with Enter key
    ✅ can close modals with ESC key
    ✅ focus order is logical
  });
});
```

**Priority:** P3 (Low)
**Estimated Effort:** 4 hours

---

## Mocking Strategy

### 1. External API Mocking

#### A. Mailchimp API Mock

**File:** `mocks/mailchimp.ts`

```typescript
import { vi } from 'vitest';

// Mock responses
export const mockSubscriberResponse = {
  id: 'mock-subscriber-id-123',
  email_address: 'test@example.com',
  unique_email_id: 'unique-123',
  status: 'subscribed',
  merge_fields: {
    FNAME: 'John',
    LNAME: 'Doe',
  },
  tags: [
    { id: 1, name: 'lang-en' },
    { id: 2, name: 'essay-download' },
  ],
};

export const mockDuplicateError = {
  status: 400,
  title: 'Member Exists',
  detail: 'test@example.com is already a list member.',
};

// Mock functions
export const mockMailchimpClient = {
  lists: {
    addListMember: vi.fn((audienceId, data) => {
      if (data.email_address === 'duplicate@example.com') {
        throw mockDuplicateError;
      }
      return Promise.resolve(mockSubscriberResponse);
    }),
    updateListMemberTags: vi.fn(() => Promise.resolve()),
    getListMember: vi.fn(() => Promise.resolve(mockSubscriberResponse)),
  },
};
```

**Usage in Tests:**
```typescript
vi.mock('@mailchimp/mailchimp_marketing', () => ({
  default: mockMailchimpClient,
}));
```

---

#### B. SendGrid API Mock

**File:** `mocks/sendgrid.ts`

```typescript
import { vi } from 'vitest';

export const mockSendGridResponse = [
  {
    statusCode: 202,
    headers: {
      'x-message-id': 'mock-message-id-123',
    },
  },
  {},
];

export const mockSendGridError = {
  code: 400,
  message: 'Invalid email address',
  response: {
    body: {
      errors: [{ message: 'Invalid email' }],
    },
  },
};

export const mockSendGridClient = {
  setApiKey: vi.fn(),
  send: vi.fn((msg) => {
    if (msg.to === 'invalid@') {
      throw mockSendGridError;
    }
    return Promise.resolve(mockSendGridResponse);
  }),
};
```

**Usage:**
```typescript
vi.mock('@sendgrid/mail', () => ({
  default: mockSendGridClient,
}));
```

---

#### C. Vercel Analytics Mock

**File:** `mocks/analytics.ts`

```typescript
import { vi } from 'vitest';

export const mockTrack = vi.fn((event, data) => {
  console.log(`[Analytics] ${event}`, data);
});

export const mockAnalytics = {
  track: mockTrack,
};
```

**Usage:**
```typescript
vi.mock('@vercel/analytics', () => ({
  track: mockTrack,
}));
```

---

### 2. File System Mocking

#### Mock Content Files

**File:** `mocks/content/books.ts`

```typescript
export const mockBooks = [
  {
    id: 'minds-reflection',
    slug: { en: 'minds-reflection', pl: 'odbicie-umyslu' },
    title: { en: 'Reflection of the Mind', pl: 'Odbicie Umysłu' },
    description: {
      en: 'A philosophical exploration...',
      pl: 'Filozoficzne odkrycie...',
    },
    coverImage: '/books/odbicie-cover.png',
    formats: ['ebook', 'print'],
    publishedDate: { en: '2024', pl: '2024' },
    genre: ['Essay', 'Philosophy'],
    featured: true,
    rating: { average: 4.5, count: 150 },
  },
  // More mock books...
];
```

**Usage:**
```typescript
vi.mock('fs/promises', () => ({
  readdir: vi.fn(() => Promise.resolve(['minds-reflection.en.md', 'minds-reflection.pl.md'])),
  readFile: vi.fn((path) => {
    if (path.includes('minds-reflection.en.md')) {
      return Promise.resolve(`---
id: minds-reflection
title: Reflection of the Mind
---
Book content here...`);
    }
  }),
}));
```

---

### 3. Network Request Mocking (MSW)

**File:** `mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Subscribe API
  http.post('/api/subscribe', async ({ request }) => {
    const body = await request.json();

    // Validation
    if (!body.email) {
      return HttpResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!body.consent) {
      return HttpResponse.json(
        { error: 'Consent is required' },
        { status: 400 }
      );
    }

    // Simulate duplicate
    if (body.email === 'duplicate@example.com') {
      return HttpResponse.json(
        { success: true, alreadySubscribed: true },
        { status: 200 }
      );
    }

    // Success
    return HttpResponse.json(
      { success: true, message: 'Subscription successful' },
      { status: 200 }
    );
  }),

  // Contact API
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return HttpResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  }),

  // Download API
  http.get('/api/download/:filename', ({ params }) => {
    const { filename } = params;

    if (filename === 'non-existent.pdf') {
      return HttpResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Return mock PDF buffer
    return HttpResponse.arrayBuffer(new ArrayBuffer(1024), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }),
];
```

---

### 4. Environment Variable Mocking

**File:** `vitest.setup.ts`

```typescript
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Mock environment variables
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  process.env.MAILCHIMP_API_KEY = 'test-mailchimp-key-us10';
  process.env.MAILCHIMP_SERVER_PREFIX = 'us10';
  process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';
  process.env.SENDGRID_API_KEY = 'SG.test-sendgrid-key';
});
```

---

### 5. Date/Time Mocking

**For Consistent Testing:**

```typescript
import { beforeEach, afterEach, vi } from 'vitest';

describe('Date-dependent tests', () => {
  beforeEach(() => {
    // Mock Date to 2025-01-15 12:00:00 UTC
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats date correctly', () => {
    const now = new Date();
    expect(formatDate(now, 'en')).toBe('January 15, 2025');
  });
});
```

---

## CI/CD Integration

### 1. GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-and-integration:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit and integration tests
        run: npm run test:coverage
        env:
          NEXT_PUBLIC_SITE_URL: http://localhost:3000
          MAILCHIMP_API_KEY: ${{ secrets.MAILCHIMP_API_KEY_TEST }}
          MAILCHIMP_SERVER_PREFIX: us10
          MAILCHIMP_AUDIENCE_ID: ${{ secrets.MAILCHIMP_AUDIENCE_ID_TEST }}
          SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY_TEST }}

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          flags: unit,integration
          fail_ci_if_error: true

  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build Next.js app
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_SITE_URL: http://localhost:3000
          MAILCHIMP_API_KEY: ${{ secrets.MAILCHIMP_API_KEY_TEST }}
          SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY_TEST }}

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run dependency check
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

### 2. Pre-Commit Hooks (Husky + Lint-Staged)

**Installation:**
```bash
npm install -D husky lint-staged
npx husky init
```

**File:** `.husky/pre-commit`
```bash
#!/bin/sh
npx lint-staged
```

**File:** `package.json`
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "vitest related --run"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  }
}
```

---

### 3. NPM Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",

    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:unit": "vitest run --testPathPattern=__tests__/unit",
    "test:integration": "vitest run --testPathPattern=__tests__/integration",
    "test:components": "vitest run --testPathPattern=__tests__/components",

    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",

    "test:all": "npm run test:coverage && npm run test:e2e",

    "prepare": "husky install"
  }
}
```

---

### 4. Coverage Thresholds

**Enforce in CI:**

**File:** `vitest.config.ts`
```typescript
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80,
  },
  // Fail CI if coverage drops below thresholds
  check: {
    global: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
}
```

---

### 5. Performance Budgets

**File:** `playwright.config.ts`

```typescript
use: {
  // Performance budgets
  timings: {
    timeToFirstByte: 800, // ms
    timeToInteractive: 3000, // ms
    largestContentfulPaint: 2500, // ms
  },
}
```

---

## Implementation Phases

### Phase 1: Foundation & Critical Tests (Week 1-2)

**Goal:** Establish testing infrastructure and cover critical business logic

**Tasks:**
1. ✅ Setup Vitest + React Testing Library
   - Install dependencies
   - Create `vitest.config.ts`
   - Create `vitest.setup.ts`
   - Configure path aliases

2. ✅ Setup MSW (Mock Service Worker)
   - Install MSW
   - Create mock handlers
   - Configure in Vitest setup

3. ✅ Create mock modules
   - Mailchimp mock (`mocks/mailchimp.ts`)
   - SendGrid mock (`mocks/sendgrid.ts`)
   - Analytics mock (`mocks/analytics.ts`)

4. ✅ Write Critical Tests (Priority P0)
   - EmailSignupForm component tests
   - ContactForm component tests
   - `/api/subscribe` integration tests
   - `/api/contact` integration tests
   - Mailchimp integration unit tests
   - SendGrid integration unit tests

5. ✅ Configure CI/CD
   - Create GitHub Actions workflow
   - Setup coverage reporting
   - Add status badges to README

**Deliverables:**
- 50% test coverage
- All critical paths tested
- CI/CD running on every PR

**Estimated Effort:** 40 hours

---

### Phase 2: High-Priority Coverage (Week 3-4)

**Goal:** Cover core business logic and key user flows

**Tasks:**
1. ✅ Setup Playwright for E2E tests
   - Install Playwright
   - Create `playwright.config.ts`
   - Setup test fixtures

2. ✅ Write High-Priority Tests (Priority P1)
   - Book loading unit tests (`lib/books.ts`)
   - Blog loading unit tests (`lib/blog.ts`)
   - i18n unit tests (`lib/i18n.ts`)
   - SEO unit tests (`lib/seo.ts`)
   - E2E: Essay download flow
   - E2E: Contact form submission
   - E2E: Chapters download flow

3. ✅ Add Component Tests
   - Header component
   - Footer component
   - LanguageSwitcher component

**Deliverables:**
- 70% test coverage
- All high-priority paths tested
- E2E tests for lead magnets

**Estimated Effort:** 35 hours

---

### Phase 3: Comprehensive Coverage (Week 5-6)

**Goal:** Achieve broad test coverage across all features

**Tasks:**
1. ✅ Write Medium-Priority Tests (Priority P2)
   - MarkdownContent component
   - BlogPostCard component
   - ReviewsSection component
   - NewsletterModal component
   - Reviews library unit tests
   - Download API integration tests

2. ✅ Write E2E Tests
   - Language switching flow
   - Blog reading flow
   - Book detail page
   - Newsletter modal
   - PDF download

3. ✅ Expand Mock Library
   - Mock content files (books, blog posts)
   - Mock review data
   - Mock PDF files

**Deliverables:**
- 80% test coverage
- All major features tested
- Comprehensive E2E suite

**Estimated Effort:** 30 hours

---

### Phase 4: Optimization & Maintenance (Week 7-8)

**Goal:** Optimize test performance and add advanced tests

**Tasks:**
1. ✅ Performance Tests
   - Page load performance
   - Core Web Vitals monitoring
   - Image optimization checks

2. ✅ Accessibility Tests
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader compatibility
   - Axe-core integration

3. ✅ Security Tests
   - XSS prevention validation
   - Input sanitization tests
   - API security tests
   - Rate limiting tests (optional)

4. ✅ Test Optimization
   - Parallelize test execution
   - Reduce test duplication
   - Improve mock efficiency
   - Add test utilities

5. ✅ Documentation
   - Update README with test instructions
   - Document mock strategy
   - Create testing guidelines
   - Add JSDoc comments to test helpers

**Deliverables:**
- 85%+ test coverage
- Performance monitoring
- Accessibility compliance
- Complete documentation

**Estimated Effort:** 25 hours

---

### Total Implementation Estimate

| Phase | Duration | Effort (hours) | Coverage Target |
|-------|----------|----------------|-----------------|
| Phase 1 | Week 1-2 | 40 | 50% |
| Phase 2 | Week 3-4 | 35 | 70% |
| Phase 3 | Week 5-6 | 30 | 80% |
| Phase 4 | Week 7-8 | 25 | 85%+ |
| **Total** | **8 weeks** | **130 hours** | **85%+** |

---

## Coverage Targets

### Overall Coverage Goals

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Final Target |
|--------|---------|---------|---------|---------|--------------|
| **Lines** | 50% | 70% | 80% | 85% | **85%** |
| **Functions** | 50% | 70% | 80% | 85% | **85%** |
| **Branches** | 45% | 65% | 75% | 80% | **80%** |
| **Statements** | 50% | 70% | 80% | 85% | **85%** |

---

### Module-Specific Coverage Targets

| Module | Type | Coverage Target | Priority |
|--------|------|-----------------|----------|
| **API Routes** | Integration | **95%** | P0 |
| **lib/mailchimp.ts** | Unit | **95%** | P0 |
| **lib/sendgrid.ts** | Unit | **95%** | P0 |
| **lib/books.ts** | Unit | **90%** | P1 |
| **lib/blog.ts** | Unit | **90%** | P1 |
| **lib/i18n.ts** | Unit | **90%** | P1 |
| **lib/seo.ts** | Unit | **85%** | P1 |
| **lib/reviews.ts** | Unit | **85%** | P2 |
| **Form Components** | Component | **90%** | P0 |
| **Navigation Components** | Component | **85%** | P1 |
| **Content Components** | Component | **80%** | P2 |
| **Pages** | E2E | **70%** | P1-P2 |
| **Middleware** | Integration | **85%** | P1 |

---

### Critical Path Coverage (Must Be 100%)

The following paths MUST have 100% coverage (no exceptions):

1. ✅ Email validation logic in `/api/subscribe`
2. ✅ Consent checkbox validation
3. ✅ Mailchimp duplicate email handling
4. ✅ SendGrid error handling (non-blocking)
5. ✅ Contact form input sanitization
6. ✅ XSS prevention in user inputs
7. ✅ API route authentication/authorization (if added)
8. ✅ File download path traversal prevention

---

### Exclusions from Coverage

The following files/patterns should be excluded from coverage requirements:

```typescript
coverage: {
  exclude: [
    'node_modules/',
    '.next/',
    'coverage/',
    '**/*.d.ts',
    '**/*.config.*',
    'types/**',
    'scripts/**',
    'app/layout.tsx',           // Minimal logic, mostly Next.js boilerplate
    'app/globals.css',          // CSS file
    'middleware.ts',            // Tested via E2E
    'vitest.setup.ts',
    'playwright.config.ts',
    'next.config.ts',
    'mocks/**',                 // Mock files don't need tests
    '__tests__/**',             // Test files themselves
    'e2e/**',                   // E2E test files
  ],
}
```

---

## Security Considerations

### 1. Immediate Security Issue

**CRITICAL: `.env.local` Exposed in Repository**

**Current State:**
```bash
# File is tracked in git
git ls-files | grep .env.local
# Returns: .env.local
```

**Risk:**
- API keys exposed in public repository
- Mailchimp API key: `91b27b57e2a44f11bf1a85474e751836-us10`
- SendGrid API key: `SG.MZ1RDf3ORpOYuMwrEuZyJA...`

**Immediate Actions Required:**
1. ✅ Add `.env.local` to `.gitignore`
2. ✅ Remove from git history:
   ```bash
   git rm --cached .env.local
   git commit -m "Remove .env.local from version control"
   ```
3. ✅ Rotate API keys immediately:
   - Generate new Mailchimp API key
   - Generate new SendGrid API key
4. ✅ Use environment variables in CI/CD (GitHub Secrets)
5. ✅ Create `.env.example` with placeholder values

---

### 2. Test Environment Isolation

**Strategy:**
- Use separate Mailchimp test audience (not production list)
- Use SendGrid test mode or separate API key
- Never use production data in tests
- Mock all external APIs by default

**Example `.env.test`:**
```bash
MAILCHIMP_API_KEY=test-key-us10
MAILCHIMP_SERVER_PREFIX=us10
MAILCHIMP_AUDIENCE_ID=test-audience-id
SENDGRID_API_KEY=SG.test-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### 3. Test Data Privacy

**Guidelines:**
- ✅ Use fake email addresses (`test@example.com`, `user@test.local`)
- ✅ Use mock names (`John Doe`, `Jane Smith`)
- ✅ Never use real user data in tests
- ✅ Scrub logs of sensitive information
- ✅ Exclude `.env.test` from version control

---

## Appendix

### A. Testing Resources

**Documentation:**
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)

**Next.js Specific:**
- [Testing Next.js Apps](https://nextjs.org/docs/app/building-your-application/testing)
- [Next.js + Vitest](https://nextjs.org/docs/app/building-your-application/testing/vitest)

---

### B. Test File Templates

**Unit Test Template:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { functionToTest } from '@/lib/module';

describe('Module Name', () => {
  describe('functionToTest', () => {
    beforeEach(() => {
      // Setup
    });

    it('should [expected behavior]', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

**Component Test Template:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

**E2E Test Template:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('completes user flow', async ({ page }) => {
    await page.goto('/en/page');

    // Interact with page
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /submit/i }).click();

    // Assert
    await expect(page).toHaveURL(/\/success/);
    await expect(page.getByText(/thank you/i)).toBeVisible();
  });
});
```

---

### C. Glossary

| Term | Definition |
|------|------------|
| **Unit Test** | Test of a single function/module in isolation |
| **Integration Test** | Test of multiple modules working together |
| **Component Test** | Test of a React component with user interactions |
| **E2E Test** | End-to-end test of complete user flows |
| **Mock** | Fake implementation of a dependency |
| **Stub** | Simplified implementation returning predefined data |
| **Spy** | Function that records how it was called |
| **Fixture** | Reusable test data |
| **AAA Pattern** | Arrange-Act-Assert test structure |
| **TDD** | Test-Driven Development (write tests first) |
| **Coverage** | Percentage of code executed by tests |
| **MSW** | Mock Service Worker (network-level mocking) |

---

### D. Maintenance Plan

**Weekly:**
- ✅ Review failing tests
- ✅ Update snapshots if UI changed
- ✅ Check coverage trends

**Monthly:**
- ✅ Update dependencies (Vitest, Playwright, RTL)
- ✅ Review test performance (slow tests)
- ✅ Refactor duplicate test code
- ✅ Update mock data to match production

**Quarterly:**
- ✅ Audit test coverage gaps
- ✅ Review and update test strategy
- ✅ Performance optimization
- ✅ Accessibility audit

---

## Summary

This testing strategy provides a comprehensive, phased approach to achieving robust test coverage for the Narratia platform. By prioritizing critical business logic (email signups, contact forms, external integrations) and following industry best practices, the implementation plan balances thoroughness with practicality.

**Key Takeaways:**
1. ✅ Start with critical paths (email flows, API routes)
2. ✅ Use modern, fast tooling (Vitest, Playwright)
3. ✅ Mock external APIs consistently (Mailchimp, SendGrid)
4. ✅ Achieve 85%+ coverage over 8 weeks
5. ✅ Integrate tests into CI/CD pipeline
6. ✅ **Immediately fix security issue** (.env.local exposure)

**Next Steps:**
1. Review and approve this strategy
2. Address `.env.local` security issue
3. Begin Phase 1 implementation
4. Setup CI/CD workflow
5. Iteratively build test suite following phased plan

---

**Document Status:** ✅ Complete
**Review Status:** Pending Approval
**Implementation Status:** Not Started
