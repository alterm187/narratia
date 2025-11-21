# Security Remediation Plan - Narratia

**Generated:** 2025-11-19
**Security Review Date:** 2025-11-19
**Total Issues:** 11 (2 Critical, 3 High, 4 Medium, 2 Low)
**Estimated Total Time:** 8-12 hours

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Critical Issues (Immediate)](#phase-1-critical-issues-immediate)
3. [Phase 2: High Severity Issues (Week 1)](#phase-2-high-severity-issues-week-1)
4. [Phase 3: Medium Severity Issues (Week 2)](#phase-3-medium-severity-issues-week-2)
5. [Phase 4: Low Severity Issues (Week 3)](#phase-4-low-severity-issues-week-3)
6. [Testing & Verification](#testing--verification)
7. [Post-Remediation Checklist](#post-remediation-checklist)

---

## Overview

This document provides a comprehensive, step-by-step remediation plan for all security vulnerabilities identified in the Narratia repository. Each issue includes:

- Detailed explanation
- Code fixes ready to implement
- Testing procedures
- Estimated time to fix

**Implementation Strategy:**
- Fix issues in priority order
- Test each fix before moving to the next
- Create a new branch: `security-fixes`
- Commit fixes in logical groups
- Run full test suite after each phase

---

## Phase 1: Critical Issues (Immediate)

**Timeline:** Day 1
**Total Estimated Time:** 2-3 hours

### Issue #1: Path Traversal Vulnerability in PDF Download

**Severity:** 🔴 Critical
**Location:** `app/api/download/[filename]/route.ts`
**Time Estimate:** 30 minutes

#### Current Vulnerable Code:
```typescript
const filePath = path.join(process.cwd(), 'public', 'downloads', filename);
```

#### Fixed Code:

Replace the entire file content:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';
import fs from 'fs';
import path from 'path';

// Whitelist of allowed downloadable files
const ALLOWED_FILES = [
  'odbicie-umyslu.pdf',
  // Add more files here as needed
];

// Handle PDF downloads with async params
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Sanitize filename - remove any path components
  const sanitizedFilename = path.basename(filename);

  // Validate against whitelist
  if (!ALLOWED_FILES.includes(sanitizedFilename)) {
    console.warn('Attempted access to non-whitelisted file:', filename);
    return new NextResponse('File not found', { status: 404 });
  }

  // Validate file extension
  if (!sanitizedFilename.endsWith('.pdf')) {
    console.warn('Attempted access to non-PDF file:', filename);
    return new NextResponse('Invalid file type', { status: 400 });
  }

  // Track the download event
  await track('pdf_download', {
    filename: sanitizedFilename,
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
  });

  // Construct the path to the PDF file
  const filePath = path.join(process.cwd(), 'public', 'downloads', sanitizedFilename);

  // Check if file exists (should always be true due to whitelist)
  if (!fs.existsSync(filePath)) {
    console.error('Whitelisted file not found on disk:', sanitizedFilename);
    return new NextResponse('File not found', { status: 404 });
  }

  // Read the file
  const fileBuffer = fs.readFileSync(filePath);

  // Return the PDF file with appropriate headers
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
    },
  });
}
```

#### Testing:
```bash
# Test valid file
curl http://localhost:3000/api/download/odbicie-umyslu.pdf -I

# Test path traversal attempt (should fail)
curl http://localhost:3000/api/download/../../../etc/passwd -I

# Test non-whitelisted file (should fail)
curl http://localhost:3000/api/download/malicious.pdf -I

# Test non-PDF file (should fail)
curl http://localhost:3000/api/download/script.js -I
```

---

### Issue #2: XSS in Contact Form Email Template

**Severity:** 🔴 Critical
**Location:** `app/api/contact/route.ts`
**Time Estimate:** 1 hour

#### Step 1: Install Sanitization Library

```bash
npm install isomorphic-dompurify
npm install --save-dev @types/dompurify
```

#### Step 2: Update Contact Route

Replace the content of `app/api/contact/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input presence
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        { error: 'Email is too long' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Sanitize inputs for HTML context
    const sanitizedName = DOMPurify.sanitize(name, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    const sanitizedEmail = DOMPurify.sanitize(email, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    const sanitizedMessage = DOMPurify.sanitize(message, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });

    // Send email notification to owner
    const emailResult = await sendEmail({
      to: process.env.OWNER_EMAIL || 'sebastian.narratia@gmail.com',
      subject: `New Contact Form Message from ${sanitizedName}`,
      text: `
You have received a new contact form submission:

Name: ${sanitizedName}
Email: ${sanitizedEmail}

Message:
${sanitizedMessage}

---
Sent from Narratia Contact Form
${new Date().toISOString()}
      `.trim(),
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>New Contact Form Submission</h2>

  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Name:</strong> ${sanitizedName}</p>
    <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
  </div>

  <div style="margin: 20px 0;">
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
  </div>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  <p style="color: #666; font-size: 12px;">
    Sent from Narratia Contact Form<br>
    ${new Date().toISOString()}
  </p>
</div>
      `.trim(),
    });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    console.log('Contact form email sent successfully:', {
      name: sanitizedName,
      email: sanitizedEmail,
      messageId: emailResult.messageId,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Testing:
```bash
# Test with XSS payload
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"XSS\")</script>",
    "email": "test@example.com",
    "message": "<img src=x onerror=alert(1)>"
  }'

# Verify email received without script tags
```

---

### Issue #3: XSS in Welcome Email Template

**Severity:** 🔴 Critical
**Location:** `lib/sendgrid.ts`
**Time Estimate:** 45 minutes

#### Updated SendGrid Library

Replace the content of `lib/sendgrid.ts`:

```typescript
import sgMail from '@sendgrid/mail';
import DOMPurify from 'isomorphic-dompurify';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(params: EmailParams) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }

    const msg = {
      to: {
        email: params.to,
        name: params.toName,
      },
      from: {
        email: 'sebastian@narratia.pl',
        name: 'Sebastian Proba - Narratia',
      },
      subject: params.subject,
      text: params.text,
      html: params.html,
    };

    const response = await sgMail.send(msg);

    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
      statusCode: response[0].statusCode,
    };
  } catch (error: any) {
    console.error('SendGrid error:', error);

    if (error.response) {
      console.error('SendGrid error body:', error.response.body);
    }

    return {
      success: false,
      error: error.message || 'Failed to send email',
      details: error.response?.body,
    };
  }
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string | undefined,
  language: 'pl' | 'en',
  leadMagnet: 'essay' | 'chapters'
) {
  // Sanitize firstName to prevent XSS
  const safeName = firstName
    ? DOMPurify.sanitize(firstName, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    : (language === 'pl' ? 'Czytelnik' : 'Reader');

  const isPl = language === 'pl';

  // Link to download API route for tracking
  const downloadLink = leadMagnet === 'essay'
    ? `https://narratia.pl/api/download/odbicie-umyslu.pdf`
    : `https://narratia.pl/${language}/download/chapters`;

  const subject = isPl
    ? `${leadMagnet === 'essay' ? 'Dla Ciebie: esej "Odbicie umysłu"' : 'Dla Ciebie: fragmenty książek'} - dziękuję za zainteresowanie! Przyjemnego czytania 😉`
    : `Your ${leadMagnet === 'essay' ? 'Essay "Reflection of the Mind"' : 'Chapter Samples'} - Thank You! Happy Reading 😉`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2a332a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="background: linear-gradient(135deg, #f1ede9 0%, #fff 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="color: #2a332a; margin-top: 0;">${isPl ? `Cześć ${safeName}!` : `Hello ${safeName}!`}</h1>
    <p style="font-size: 18px; color: #2a332a;">
      ${isPl
        ? 'Dziękuję za zapis! Oto Twoje materiały do pobrania:'
        : 'Thank you for signing up! Here are your materials:'}
    </p>
  </div>

  <div style="background: #fff; border: 2px solid #ffbd59; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #2a332a; margin-top: 0;">
      ${leadMagnet === 'essay'
        ? (isPl ? 'Odbicie umysłu' : 'Reflection of the Mind')
        : (isPl ? 'Fragmenty książek' : 'Chapter Samples')}
    </h2>
    <p style="color: #2a332a;">
      ${leadMagnet === 'essay'
        ? (isPl
          ? 'Esej o współpracy człowieka i AI w tłumaczeniu poezji Wordswortha.'
          : 'An essay about human-AI collaboration in translating Wordsworth\'s poetry.')
        : (isPl
          ? 'Pierwsze rozdziały z moich książek - zapoznaj się przed zakupem!'
          : 'First chapters from my books - try before you buy!')}
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadLink}"
         style="display: inline-block; background: #ffbd59; color: #191919; padding: 15px 40px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 18px;">
        ${isPl ? '📥 Pobierz materiały' : '📥 Download Materials'}
      </a>
    </div>
    <p style="font-size: 14px; color: #666; text-align: center;">
      ${isPl
        ? 'Nie widzisz przycisku? Kliknij tutaj:'
        : 'Can\'t see the button? Click here:'}
      <br>
      <a href="${downloadLink}" style="color: #ffbd59; word-break: break-all;">${downloadLink}</a>
    </p>
  </div>

  <div style="background: #fffbf0; border-left: 4px solid #ffbd59; padding: 20px; margin-bottom: 20px;">
    <p style="color: #2a332a; margin: 0; font-size: 15px;">
      <strong>${isPl ? '📬 O newsletterze:' : '📬 About the newsletter:'}</strong><br>
      ${isPl
        ? 'Maksymalnie kilka razy w roku wyślę Ci informacje o promocjach i nowych treściach. Żadnego spamu, obiecuję!'
        : 'I\'ll send you updates a few times a year about promotions and new content. No spam, I promise!'}
    </p>
  </div>


  <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
    <p style="margin-bottom: 10px;">
      Sebastian Proba - Narratia
    </p>
    <p style="margin-bottom: 20px;">
      <a href="https://narratia.pl/${language}/books" style="color: #ffbd59; text-decoration: none;">
        ${isPl ? 'Zobacz wszystkie książki' : 'View All Books'}
      </a>
    </p>
    <p style="margin-top: 20px; font-size: 12px; color: #999;">
      ${isPl
        ? 'Otrzymujesz tę wiadomość, ponieważ zapisałeś się na listę Narratia.'
        : 'You\'re receiving this email because you signed up for Narratia.'}
    </p>
  </div>
</body>
</html>`;

  const textContent = `
${isPl ? `Cześć ${safeName}!` : `Hello ${safeName}!`}

${isPl
  ? 'Dziękuję za zapis! Oto Twoje materiały do pobrania:'
  : 'Thank you for signing up! Here are your materials:'}

${leadMagnet === 'essay'
  ? (isPl ? 'Odbicie umysłu' : 'Reflection of the Mind')
  : (isPl ? 'Fragmenty książek' : 'Chapter Samples')}

${leadMagnet === 'essay'
  ? (isPl
    ? 'Esej o współpracy człowieka i AI w tłumaczeniu poezji Wordswortha.'
    : 'An essay about human-AI collaboration in translating Wordsworth\'s poetry.')
  : (isPl
    ? 'Pierwsze rozdziały z moich książek - zapoznaj się przed zakupem!'
    : 'First chapters from my books - try before you buy!')}

${isPl ? 'Pobierz tutaj:' : 'Download here:'}
${downloadLink}

${isPl ? 'Co dalej?' : 'What\'s Next?'}

• ${isPl
  ? 'Będę wysyłać Ci informacje o nowych książkach i projektach'
  : 'I\'ll send you updates about new books and projects'}

• ${isPl
  ? 'Otrzymasz ekskluzywne oferty dostępne tylko dla czytelników'
  : 'You\'ll receive exclusive offers available only to readers'}

• ${isPl
  ? 'Możesz odpowiedzieć na ten email - chętnie porozmawiam!'
  : 'You can reply to this email - I\'d love to chat!'}

Sebastian Proba - Narratia
https://narratia.pl/${language}/books

---
${isPl
  ? 'Otrzymujesz tę wiadomość, ponieważ zapisałeś się na listę Narratia.'
  : 'You\'re receiving this email because you signed up for Narratia.'}
`;

  return sendEmail({
    to: email,
    toName: safeName,
    subject,
    html: htmlContent,
    text: textContent,
  });
}
```

#### Testing:
```bash
# Test via the email signup form with malicious name
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "<script>alert(\"XSS\")</script>",
    "language": "en",
    "leadMagnet": "essay",
    "consent": true
  }'

# Check email received - should show sanitized name
```

---

### Issue #4: Update js-yaml Dependency

**Severity:** 🔴 High (from dependencies)
**Time Estimate:** 15 minutes

```bash
# Run npm audit fix
npm audit fix

# If that doesn't work, manually update
npm update gray-matter

# Verify the fix
npm audit

# Check for any breaking changes
npm test
```

---

## Phase 2: High Severity Issues (Week 1)

**Timeline:** Days 2-3
**Total Estimated Time:** 3-4 hours

### Issue #5: Add Rate Limiting

**Severity:** 🟠 High
**Time Estimate:** 2 hours

#### Option A: Using Upstash Redis (Recommended for Production)

**Step 1:** Install dependencies
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Step 2:** Set up Upstash Redis (Free tier available)
1. Go to https://upstash.com/
2. Create a Redis database
3. Add to `.env.local`:
```bash
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

**Step 3:** Create rate limit utility

Create `lib/ratelimit.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Create different rate limiters for different endpoints
export const contactRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '15 m'), // 3 requests per 15 minutes
  analytics: true,
  prefix: 'ratelimit:contact',
});

export const subscribeRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
  analytics: true,
  prefix: 'ratelimit:subscribe',
});

export const downloadRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 requests per hour
  analytics: true,
  prefix: 'ratelimit:download',
});

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : real;

  return ip || 'anonymous';
}

// Helper to check rate limit
export async function checkRateLimit(
  ratelimit: Ratelimit,
  identifier: string
): Promise<{ success: boolean; response?: NextResponse }> {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.floor((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
            'Retry-After': Math.floor((reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}
```

**Step 4:** Apply rate limiting to contact endpoint

Update `app/api/contact/route.ts` - add at the top of POST function:
```typescript
import { contactRateLimit, getClientIdentifier, checkRateLimit } from '@/lib/ratelimit';

export async function POST(request: Request) {
  // Rate limiting check
  const identifier = getClientIdentifier(request as NextRequest);
  const rateLimitResult = await checkRateLimit(contactRateLimit, identifier);

  if (!rateLimitResult.success) {
    console.warn('Rate limit exceeded for contact form:', identifier);
    return rateLimitResult.response!;
  }

  try {
    // ... rest of the existing code
```

**Step 5:** Apply rate limiting to subscribe endpoint

Update `app/api/subscribe/route.ts` - add at the top of POST function:
```typescript
import { subscribeRateLimit, getClientIdentifier, checkRateLimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(subscribeRateLimit, identifier);

  if (!rateLimitResult.success) {
    console.warn('Rate limit exceeded for subscribe:', identifier);
    return rateLimitResult.response!;
  }

  try {
    // ... rest of the existing code
```

**Step 6:** Apply rate limiting to download endpoint

Update `app/api/download/[filename]/route.ts` - add at the top of GET function:
```typescript
import { downloadRateLimit, getClientIdentifier, checkRateLimit } from '@/lib/ratelimit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Rate limiting check
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(downloadRateLimit, identifier);

  if (!rateLimitResult.success) {
    console.warn('Rate limit exceeded for download:', identifier);
    return rateLimitResult.response!;
  }

  // ... rest of the existing code
```

#### Option B: Simple In-Memory Rate Limiting (Development/Testing)

Create `lib/ratelimit-simple.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function simpleRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; response?: NextResponse } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true };
  }

  if (entry.count >= maxRequests) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      ),
    };
  }

  entry.count++;
  return { success: true };
}

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : real;
  return ip || 'anonymous';
}
```

#### Testing Rate Limits:
```bash
# Test contact form rate limit (should block after 3 requests)
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test"}'
  echo "Request $i"
done

# Should see 429 error on requests 4 and 5
```

---

### Issue #6: Add Security Headers

**Severity:** 🟠 High
**Time Estimate:** 1 hour

#### Update next.config.ts

Replace the entire content:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
        ],
      },
      {
        // More permissive CSP for pages with inline scripts
        source: '/:lang/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://vercel.live https://*.vercel-insights.com https://*.mailchimp.com https://api.sendgrid.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // Stricter CSP for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

#### Testing:
```bash
# Start the dev server
npm run dev

# Test security headers
curl -I http://localhost:3000/en

# Or use online tool after deployment:
# https://securityheaders.com
# https://observatory.mozilla.org
```

---

## Phase 3: Medium Severity Issues (Week 2)

**Timeline:** Days 4-5
**Total Estimated Time:** 2-3 hours

### Issue #7: Improve Email Validation

**Severity:** 🟡 Medium
**Time Estimate:** 30 minutes

#### Step 1: Install validator library
```bash
npm install validator
npm install --save-dev @types/validator
```

#### Step 2: Update app/api/subscribe/route.ts

Replace the email validation section:

```typescript
import validator from 'validator';

// Replace the existing email validation (line 10-16) with:
if (!email || !validator.isEmail(email, {
  allow_display_name: false,
  require_tld: true,
  allow_utf8_local_part: false
})) {
  return NextResponse.json(
    { error: 'Invalid email address' },
    { status: 400 }
  );
}

// Also validate email length
if (email.length > 254) {
  return NextResponse.json(
    { error: 'Email address is too long' },
    { status: 400 }
  );
}
```

#### Step 3: Update app/api/contact/route.ts

Add the same validation there as well (this is already done in the Phase 1 fix, but verify it's present).

---

### Issue #8: Add Input Length Limits

**Severity:** 🟡 Medium
**Time Estimate:** 30 minutes

This is already included in the Phase 1 fixes for `app/api/contact/route.ts`.

Now add the same to `app/api/subscribe/route.ts`:

```typescript
// Add after consent validation (around line 24)

// Validate input lengths
if (firstName && firstName.length > 100) {
  return NextResponse.json(
    { error: 'First name is too long (max 100 characters)' },
    { status: 400 }
  );
}

if (lastName && lastName.length > 100) {
  return NextResponse.json(
    { error: 'Last name is too long (max 100 characters)' },
    { status: 400 }
  );
}

if (email.length > 254) {
  return NextResponse.json(
    { error: 'Email is too long' },
    { status: 400 }
  );
}
```

---

### Issue #9: Add CSRF Protection (Optional but Recommended)

**Severity:** 🟡 Medium
**Time Estimate:** 1.5 hours

#### Step 1: Install CSRF library
```bash
npm install @edge-csrf/nextjs
```

#### Step 2: Create CSRF middleware

Create `lib/csrf.ts`:
```typescript
import { createCsrfProtect } from '@edge-csrf/nextjs';

const csrfProtect = createCsrfProtect({
  cookie: {
    name: '_narratia.csrf',
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
});

export default csrfProtect;
```

#### Step 3: Apply CSRF to API routes

This is optional for public forms, but recommended. For now, document it for future implementation if needed.

**Note:** Given this is a public author website without authentication, CSRF protection is less critical. The SameSite cookie policy provides adequate protection for now.

---

### Issue #10: Sanitize Markdown Rendering

**Severity:** 🟡 Medium (Low current risk, High future risk)
**Time Estimate:** 30 minutes

#### Step 1: Install rehype-sanitize
```bash
npm install rehype-sanitize
```

#### Step 2: Update components/MarkdownContent.tsx

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// ... rest of the file stays the same except:

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  // Create a custom sanitize schema that allows some safe HTML
  const customSchema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      a: [
        ...(defaultSchema.attributes?.a || []),
        ['target', '_blank'],
        ['rel', 'noopener', 'noreferrer'],
      ],
    },
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, customSchema], // Add sanitization
        ]}
        components={{
          // ... existing components stay the same
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

---

## Phase 4: Low Severity Issues (Week 3)

**Timeline:** Days 6-7
**Total Estimated Time:** 1-2 hours

### Issue #11: Add Security Logging

**Severity:** 🟢 Low
**Time Estimate:** 1 hour

#### Create logging utility

Create `lib/security-logger.ts`:
```typescript
import { track } from '@vercel/analytics/server';

export type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'invalid_input'
  | 'path_traversal_attempt'
  | 'xss_attempt_blocked'
  | 'file_not_whitelisted'
  | 'email_validation_failed'
  | 'suspicious_request';

interface SecurityEventData {
  type: SecurityEventType;
  endpoint: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export async function logSecurityEvent(data: SecurityEventData) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', {
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  // Track with Vercel Analytics
  try {
    await track('security_event', {
      type: data.type,
      endpoint: data.endpoint,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track security event:', error);
  }

  // In production, you might want to send to a logging service
  // Examples: Sentry, LogRocket, Datadog, etc.
  if (process.env.NODE_ENV === 'production') {
    // Add your logging service here
    // Example: Sentry.captureMessage(...)
  }
}
```

#### Apply logging to endpoints

Add to relevant places in your API routes:

```typescript
import { logSecurityEvent } from '@/lib/security-logger';

// In download route when file not whitelisted:
if (!ALLOWED_FILES.includes(sanitizedFilename)) {
  await logSecurityEvent({
    type: 'file_not_whitelisted',
    endpoint: '/api/download',
    ip: request.headers.get('x-forwarded-for') || undefined,
    details: { requestedFile: filename },
  });
  return new NextResponse('File not found', { status: 404 });
}

// In rate limit checks:
if (!rateLimitResult.success) {
  await logSecurityEvent({
    type: 'rate_limit_exceeded',
    endpoint: request.url,
    ip: identifier,
  });
  return rateLimitResult.response!;
}
```

---

### Issue #12: Use Environment Variable for Owner Email

**Severity:** 🟢 Low
**Time Estimate:** 15 minutes

This is already fixed in Phase 1 updates for `app/api/contact/route.ts`.

Verify it's present:
```typescript
to: process.env.OWNER_EMAIL || 'sebastian.narratia@gmail.com',
```

Add to `.env.local`:
```bash
OWNER_EMAIL=sebastian.narratia@gmail.com
```

Add to `.env.example` (create if doesn't exist):
```bash
# Email Configuration
OWNER_EMAIL=your-email@example.com

# External Services
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=us10
MAILCHIMP_AUDIENCE_ID=your_audience_id
SENDGRID_API_KEY=your_sendgrid_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Rate Limiting (if using Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

---

## Testing & Verification

### Unit Tests

Update existing tests to cover security features:

Create `__tests__/security/path-traversal.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Path Traversal Protection', () => {
  it('should block path traversal attempts', async () => {
    const maliciousFilenames = [
      '../../../etc/passwd',
      '..\\..\\windows\\system32\\config\\sam',
      'odbicie-umyslu.pdf/../../../etc/passwd',
      '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
    ];

    for (const filename of maliciousFilenames) {
      const response = await fetch(
        `http://localhost:3000/api/download/${encodeURIComponent(filename)}`
      );
      expect(response.status).toBe(404);
    }
  });

  it('should allow valid whitelisted files', async () => {
    const response = await fetch(
      'http://localhost:3000/api/download/odbicie-umyslu.pdf'
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
  });
});
```

Create `__tests__/security/xss-protection.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('XSS Protection', () => {
  it('should sanitize contact form inputs', async () => {
    const xssPayload = {
      name: '<script>alert("XSS")</script>',
      email: 'test@example.com',
      message: '<img src=x onerror=alert(1)>',
    };

    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(xssPayload),
    });

    expect(response.status).toBe(200);
    // Email should be sent with sanitized content (verify logs)
  });

  it('should sanitize subscribe form firstName', async () => {
    const xssPayload = {
      email: 'test@example.com',
      firstName: '<script>alert("XSS")</script>',
      language: 'en',
      leadMagnet: 'newsletter',
      consent: true,
    };

    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(xssPayload),
    });

    expect(response.status).toBe(200);
  });
});
```

Create `__tests__/security/rate-limiting.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Rate Limiting', () => {
  it('should block excessive contact form submissions', async () => {
    const payload = {
      name: 'Test',
      email: 'test@example.com',
      message: 'Test message',
    };

    // Make 4 requests (limit is 3 per 15 minutes)
    const responses = await Promise.all([
      fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
      fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
      fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
      fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    ]);

    const statuses = responses.map(r => r.status);
    expect(statuses.filter(s => s === 429).length).toBeGreaterThan(0);
  });
});
```

### Manual Testing Checklist

```bash
# 1. Path Traversal
curl http://localhost:3000/api/download/../../../etc/passwd
# Expected: 404

# 2. XSS in Contact Form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com","message":"test"}'
# Expected: 200, sanitized in email

# 3. Rate Limiting
for i in {1..5}; do curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"test"}'; done
# Expected: 429 on 4th and 5th requests

# 4. Security Headers
curl -I http://localhost:3000/en
# Expected: X-Frame-Options, CSP, etc.

# 5. Email Validation
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","consent":true}'
# Expected: 400

# 6. Input Length Validation
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$(python3 -c 'print("A"*1000)')\",\"email\":\"test@test.com\",\"message\":\"test\"}"
# Expected: 400
```

### Security Scanning Tools

```bash
# Install and run npm audit
npm audit

# Run OWASP ZAP scan (if available)
# docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# Use online tools after deployment:
# - https://securityheaders.com
# - https://observatory.mozilla.org
# - https://www.ssllabs.com/ssltest/ (for production)
```

---

## Post-Remediation Checklist

After completing all phases, verify:

- [ ] All critical vulnerabilities fixed
- [ ] Path traversal protection implemented and tested
- [ ] XSS protection in email templates
- [ ] Rate limiting on all API endpoints
- [ ] Security headers configured
- [ ] Dependencies updated (npm audit clean)
- [ ] Input validation improved
- [ ] Input length limits enforced
- [ ] Markdown sanitization enabled
- [ ] Security logging implemented
- [ ] Environment variables for configuration
- [ ] All tests passing (`npm test`)
- [ ] Manual security tests completed
- [ ] Documentation updated
- [ ] Security headers verified on production
- [ ] Create `.env.example` for reference

---

## Deployment Steps

1. **Create branch:**
   ```bash
   git checkout -b security-fixes
   ```

2. **Commit fixes in logical groups:**
   ```bash
   git add app/api/download/[filename]/route.ts
   git commit -m "fix: add path traversal protection to download endpoint"

   git add app/api/contact/route.ts lib/sendgrid.ts package*.json
   git commit -m "fix: add XSS protection to email templates"

   git add lib/ratelimit.ts app/api/*/route.ts
   git commit -m "feat: implement rate limiting on API endpoints"

   git add next.config.ts
   git commit -m "feat: add security headers"
   ```

3. **Push and create PR:**
   ```bash
   git push origin security-fixes
   ```

4. **Merge to main after review and testing**

5. **Deploy to production and verify:**
   - Test all endpoints
   - Check security headers
   - Verify rate limiting works
   - Monitor logs for any issues

---

## Monitoring & Maintenance

### Ongoing Security Practices

1. **Weekly:**
   - Check Vercel Analytics for suspicious patterns
   - Review security logs

2. **Monthly:**
   - Run `npm audit`
   - Update dependencies: `npm update`
   - Review rate limit logs

3. **Quarterly:**
   - Full security review
   - Update security headers if needed
   - Review and update whitelist of allowed files

4. **Set up Dependabot:**
   Create `.github/dependabot.yml`:
   ```yaml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
   ```

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Vercel Security Documentation](https://vercel.com/docs/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## Support

If you encounter any issues during remediation:
1. Check the error messages carefully
2. Review the test output
3. Verify environment variables are set
4. Check the implementation matches the examples exactly

---

**Document Version:** 1.0
**Last Updated:** 2025-11-19
**Next Review:** After all fixes are implemented
