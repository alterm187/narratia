# Narratia - Email Acquisition & Lead Magnet Implementation Plan
**Complete Technical Roadmap for Email Marketing System**

**Created:** November 2025
**Last Updated:** November 10, 2025
**Timeline:** 8-10 weeks
**Mailchimp:** ✅ Configured (API ready)
**Budget:** $0-13/month (Mailchimp free → Essentials)

## 🎯 Implementation Status

- ✅ **Phase 1: Email Infrastructure** - COMPLETED (Nov 8, 2025)
- ✅ **Phase 2: Lead Magnet Pages** - COMPLETED (Nov 8, 2025)
- ✅ **Phase 3: Blog & Excerpts** - COMPLETED (Nov 10, 2025)
- ✅ **Phase 4: Book Enhancements** - COMPLETED (Nov 10, 2025)
- ❌ **Phase 5: ARC System** - SKIPPED (Handled externally)
- ⏳ **Phase 6: Email Automation** - OPTIONAL (Mailchimp configuration)
- ⏳ **Phase 7: Analytics** - OPTIONAL (Future enhancement)

---

## 📋 Table of Contents

1. [Quick Start Summary](#quick-start-summary)
2. [Technical Prerequisites](#technical-prerequisites)
3. [Phase 1: Email Infrastructure](#phase-1-email-infrastructure-week-1-2)
4. [Phase 2: Lead Magnet Pages](#phase-2-lead-magnet-pages-week-3)
5. [Phase 3: Blog & Excerpts](#phase-3-blog--excerpts-week-4-5)
6. [Phase 4: Book Enhancements](#phase-4-book-enhancements-week-6)
7. [Phase 5: ARC System](#phase-5-arc-system-week-7)
8. [Phase 6: Email Automation](#phase-6-email-automation-week-8)
9. [Phase 7: Analytics](#phase-7-analytics--optimization-week-9)
10. [Complete File List](#complete-file-list)
11. [Deployment Checklist](#deployment-checklist)

---

## Quick Start Summary

### What We're Building

**Goal:** Transform narratia.pl into email-generating author platform with:

✅ **Multiple lead magnets:**
- Free essay "Odbicie umysłu"
- Chapter samples from all books
- Audio chapter samples (future)

✅ **Non-invasive email capture:**
- Footer signup (persistent)
- Lead magnet download pages
- No annoying popups

✅ **Content expansion:**
- Blog for imported Facebook posts
- Visual excerpts gallery (Fragmenty)
- Enhanced book pages with reviews

✅ **Reader engagement:**
- ARC (Advanced Review Copy) program
- Automated welcome email sequences
- Book promotion campaigns (25% off for subscribers)

### Email vs Substack Strategy

**Narratia Email (narratia.pl):**
- Lead generation & book promotion
- Automated welcome sequences
- ARC program coordination
- Special offers (e.g., "25% off for subscribers")
- Transactional & promotional

**Substack (separate):**
- Long-form essays & thought leadership
- Monthly/bi-monthly cadence
- Deeper philosophical content
- Not competing with narratia.pl email

### Key Numbers (6-month targets)

- 300-500 email subscribers
- 15%+ signup conversion rate
- 25%+ email open rate
- 10-20 ARC readers recruited
- 15-20 new book reviews
- 2,000+ monthly visitors

---

## Technical Prerequisites

### ✅ Environment Already Configured

```env
# .env.local (already configured in your project)
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=us10
MAILCHIMP_AUDIENCE_ID=your_audience_id
```

### Dependencies to Install

```bash
cd /home/seba/narratia

# Email & content dependencies
npm install @mailchimp/mailchimp_marketing
npm install react-markdown remark-gfm rehype-raw
npm install date-fns
npm install gray-matter  # For markdown frontmatter

# Development
npm install -D @types/node
```

### Mailchimp Audience Structure

**Single Audience:** "Narratia Community" (ID: 830feaa011)

**Tags:**
- `essay-download` - Downloaded "Odbicie umysłu"
- `chapters-download` - Downloaded chapter samples
- `audio-download` - Downloaded audio samples (future)
- `newsletter-signup` - General newsletter
- `arc-reader` - ARC program participant
- `purchased` - Bought a book
- `lang-pl` - Polish speaker
- `lang-en` - English speaker

**Merge Fields:**
- `FNAME` - First name
- `LNAME` - Last name
- `LEADMAG` - Lead magnet type
- `LANGUAGE` - Preferred language (pl/en)

---

## Phase 1: Email Infrastructure (Week 1-2)

### Week 1: Core Integration

#### Step 1.1: Install Dependencies

```bash
npm install @mailchimp/mailchimp_marketing date-fns
```

#### Step 1.2: Create Mailchimp Library

**File:** `lib/mailchimp.ts`

```typescript
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export interface SubscriberData {
  email: string;
  firstName?: string;
  lastName?: string;
  language?: 'pl' | 'en';
  leadMagnet?: string;
  tags?: string[];
}

export async function addSubscriber(data: SubscriberData) {
  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      {
        email_address: data.email,
        status: 'subscribed', // or 'pending' for double opt-in
        merge_fields: {
          FNAME: data.firstName || '',
          LNAME: data.lastName || '',
          LEADMAG: data.leadMagnet || '',
          LANGUAGE: data.language || 'pl',
        },
        tags: data.tags || [],
      }
    );

    return { success: true, data: response };
  } catch (error: any) {
    // Handle duplicate email gracefully
    if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
      return { success: true, alreadySubscribed: true };
    }

    console.error('Mailchimp error:', error);
    return { success: false, error: error.message };
  }
}

export async function addTagsToSubscriber(email: string, tags: string[]) {
  try {
    const subscriberHash = require('crypto')
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    await mailchimp.lists.updateListMemberTags(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      subscriberHash,
      {
        tags: tags.map(tag => ({ name: tag, status: 'active' }))
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Add tags error:', error);
    return { success: false, error: error.message };
  }
}

export async function getSubscriberInfo(email: string) {
  try {
    const subscriberHash = require('crypto')
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const response = await mailchimp.lists.getListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      subscriberHash
    );

    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAudienceStats() {
  try {
    const response = await mailchimp.lists.getList(
      process.env.MAILCHIMP_AUDIENCE_ID!
    );

    return {
      success: true,
      stats: {
        memberCount: response.stats.member_count,
        openRate: response.stats.open_rate,
        clickRate: response.stats.click_rate,
      }
    };
  } catch (error: any) {
    console.error('Get stats error:', error);
    return { success: false, error: error.message };
  }
}
```

#### Step 1.3: Create API Route

**File:** `app/api/subscribe/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/mailchimp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, language, leadMagnet, consent } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate GDPR consent
    if (!consent) {
      return NextResponse.json(
        { error: 'Consent is required' },
        { status: 400 }
      );
    }

    // Determine tags based on lead magnet
    const tags: string[] = [];

    if (leadMagnet === 'essay') {
      tags.push('essay-download', 'lead-magnet');
    } else if (leadMagnet === 'chapters') {
      tags.push('chapters-download', 'lead-magnet');
    } else if (leadMagnet === 'audio') {
      tags.push('audio-download', 'lead-magnet');
    } else if (leadMagnet === 'newsletter') {
      tags.push('newsletter-signup');
    }

    if (language) {
      tags.push(`lang-${language}`);
    }

    // Add to Mailchimp
    const result = await addSubscriber({
      email,
      firstName,
      lastName,
      language: language as 'pl' | 'en',
      leadMagnet,
      tags,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.alreadySubscribed
          ? 'You are already subscribed!'
          : 'Successfully subscribed!',
        alreadySubscribed: result.alreadySubscribed || false,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to subscribe' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const { getSubscriberInfo } = await import('@/lib/mailchimp');
  const result = await getSubscriberInfo(email);

  if (result.success) {
    return NextResponse.json({
      subscribed: true,
      data: result.data,
    });
  } else {
    return NextResponse.json({
      subscribed: false,
    });
  }
}
```

### Week 2: Email Signup Components

#### Step 2.1: Create Reusable Email Form Component

**File:** `components/EmailSignupForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Dictionary } from '@/types/i18n';

interface EmailSignupFormProps {
  dict: Dictionary;
  variant?: 'inline' | 'footer' | 'hero' | 'lead-magnet';
  leadMagnet?: 'essay' | 'chapters' | 'audio' | 'newsletter';
  language: 'pl' | 'en';
  onSuccess?: () => void;
  className?: string;
}

export default function EmailSignupForm({
  dict,
  variant = 'inline',
  leadMagnet = 'newsletter',
  language,
  onSuccess,
  className = '',
}: EmailSignupFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          language,
          leadMagnet,
          consent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
        setFirstName('');
        setConsent(false);

        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: language === 'pl'
          ? 'Wystąpił błąd. Spróbuj ponownie.'
          : 'An error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Variant-specific styles
  const containerStyles = {
    inline: 'bg-white/80 backdrop-blur-sm p-6 border border-[#2a332a]/10',
    footer: 'bg-[#2a332a] p-6 text-white',
    hero: 'bg-white/10 backdrop-blur-md p-6 border border-white/20 text-white',
    'lead-magnet': 'bg-gradient-to-br from-[#ffbd59]/10 to-[#f1ede9]/10 p-8 border-2 border-[#ffbd59]/30',
  };

  const buttonStyles = {
    inline: 'bg-[#191919] text-white hover:bg-[#ffbd59]',
    footer: 'bg-[#ffbd59] text-[#191919] hover:bg-white',
    hero: 'bg-white text-[#191919] hover:bg-[#ffbd59] hover:text-white',
    'lead-magnet': 'bg-[#ffbd59] text-[#191919] hover:bg-[#191919] hover:text-white',
  };

  const inputStyles = variant === 'footer' || variant === 'hero'
    ? 'bg-white/90 text-[#191919]'
    : 'bg-white';

  return (
    <div className={`${containerStyles[variant]} ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            {language === 'pl' ? 'Imię' : 'First Name'}
            <span className="text-xs opacity-70 ml-1">
              ({language === 'pl' ? 'opcjonalne' : 'optional'})
            </span>
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-4 py-2 border border-[#2a332a]/20 focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59] outline-none transition-all ${inputStyles}`}
            placeholder={language === 'pl' ? 'Jan' : 'John'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border border-[#2a332a]/20 focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59] outline-none transition-all ${inputStyles}`}
            placeholder={language === 'pl' ? 'twoj@email.pl' : 'your@email.com'}
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="consent"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 cursor-pointer"
          />
          <label htmlFor="consent" className="text-sm cursor-pointer">
            {language === 'pl'
              ? 'Wyrażam zgodę na otrzymywanie wiadomości email od Narratia. Mogę się wypisać w każdej chwili.'
              : 'I agree to receive emails from Narratia. I can unsubscribe at any time.'}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 font-semibold transition-all duration-300 ${buttonStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading
            ? (language === 'pl' ? 'Zapisywanie...' : 'Subscribing...')
            : (language === 'pl' ? 'Zapisz się' : 'Subscribe')}
        </button>

        {message && (
          <div className={`p-3 text-sm rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
```

#### Step 2.2: Add Email Signup to Footer

**File:** `components/Footer.tsx` (modify existing)

Add before the copyright section:

```typescript
import EmailSignupForm from './EmailSignupForm';

// Inside Footer component, before copyright:
<div className="border-t border-[#2a332a]/10 pt-12 mt-12">
  <div className="max-w-md mx-auto">
    <h3 className="text-xl font-bold text-[#2a332a] mb-2 text-center">
      {lang === 'pl' ? 'Dołącz do społeczności' : 'Join the Community'}
    </h3>
    <p className="text-sm text-[#2a332a]/70 mb-6 text-center">
      {lang === 'pl'
        ? 'Otrzymuj wiadomości o nowych książkach, ekskluzywne treści i specjalne oferty.'
        : 'Get updates about new books, exclusive content, and special offers.'}
    </p>
    <EmailSignupForm
      dict={dict}
      variant="inline"
      language={lang}
      leadMagnet="newsletter"
    />
  </div>
</div>
```

#### Step 2.3: Test Email Integration

```bash
# Start dev server
npm run dev

# Test API endpoint
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "language": "pl",
    "leadMagnet": "newsletter",
    "consent": true
  }'

# Expected response:
# {"success":true,"message":"Successfully subscribed!","alreadySubscribed":false}
```

Check Mailchimp dashboard → Audience → View contacts → Should see new subscriber with tags.

---

## Phase 2: Lead Magnet Pages (Week 3)

### Essay Download Page

**File:** `app/[lang]/download/essay/page.tsx`

```typescript
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailSignupForm from '@/components/EmailSignupForm';
import { generateMetaTags } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  return generateMetaTags({
    title: lang === 'pl'
      ? 'Pobierz darmowy esej - Odbicie umysłu'
      : 'Download Free Essay - Reflection of the Mind',
    description: lang === 'pl'
      ? 'Pobierz darmowy esej "Odbicie umysłu" o współpracy człowieka i AI w tłumaczeniu poezji Wordswortha.'
      : 'Download free essay "Reflection of the Mind" about human-AI collaboration in translating Wordsworth\'s poetry.',
    locale: lang,
    pathname: '/download/essay',
  });
}

export default async function EssayDownloadPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Book Cover & Info */}
            <div>
              <div className="relative mb-6">
                <div className="absolute -top-4 -right-4 bg-[#ffbd59] text-[#191919] px-4 py-2 font-bold text-sm shadow-lg rotate-3 z-10">
                  {lang === 'pl' ? 'DARMOWY ESEJ' : 'FREE ESSAY'}
                </div>
                <img
                  src="/books/Odbicie - ebook cover.png"
                  alt={lang === 'pl' ? 'Odbicie umysłu' : 'Reflection of the Mind'}
                  className="w-full max-w-sm mx-auto shadow-2xl"
                />
              </div>

              <h1 className="text-4xl font-bold text-[#2a332a] mb-4">
                {lang === 'pl' ? 'Odbicie umysłu' : 'Reflection of the Mind'}
              </h1>

              <p className="text-xl text-[#2a332a]/70 mb-6 italic">
                {lang === 'pl'
                  ? 'Jak człowiek i AI przetłumaczyli razem wiersz Wordswortha'
                  : 'How human and AI translated Wordsworth\'s poem together'}
              </p>

              <p className="text-lg text-[#2a332a]/80 mb-6 leading-relaxed">
                {lang === 'pl'
                  ? 'Krótki esej o współpracy człowieka i AI w tłumaczeniu "Ody o przeczuciach nieśmiertelności" Williama Wordswortha. Fascynująca podróż przez granice kreatywności i technologii.'
                  : 'A short essay about human-AI collaboration in translating William Wordsworth\'s "Ode: Intimations of Immortality". A fascinating journey through the boundaries of creativity and technology.'}
              </p>

              <div className="bg-[#2a332a]/5 p-6 space-y-3 rounded-lg">
                <h3 className="font-bold text-[#2a332a]">
                  {lang === 'pl' ? 'Co otrzymasz:' : 'What you\'ll get:'}
                </h3>
                <ul className="space-y-2 text-[#2a332a]/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Pełny esej w formacie PDF' : 'Full essay in PDF format'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Wgląd w proces twórczy autora' : 'Insight into the author\'s creative process'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Ekskluzywne aktualizacje o nowych książkach' : 'Exclusive updates about new books'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Specjalne oferty dla czytelników' : 'Special offers for readers'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Możliwość zostania członkiem ARC team' : 'Opportunity to join ARC review team'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Signup Form */}
            <div>
              <div className="sticky top-6">
                <h2 className="text-2xl font-bold text-[#2a332a] mb-4">
                  {lang === 'pl' ? 'Pobierz za darmo' : 'Download for Free'}
                </h2>
                <p className="text-[#2a332a]/70 mb-6">
                  {lang === 'pl'
                    ? 'Zapisz się, aby otrzymać esej bezpośrednio na swój email. Żadnego spamu, tylko wartościowe treści.'
                    : 'Subscribe to receive the essay directly to your inbox. No spam, only valuable content.'}
                </p>
                <EmailSignupForm
                  dict={dict}
                  variant="lead-magnet"
                  language={lang}
                  leadMagnet="essay"
                  onSuccess={() => {
                    window.location.href = `/${lang}/download/thank-you?type=essay`;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer dict={dict} />
    </>
  );
}
```

### Chapters Download Page

**File:** `app/[lang]/download/chapters/page.tsx`

Similar structure, but:
- Title: "Free Chapter Samples" / "Darmowe fragmenty książek"
- Description: Download first chapters from all books
- `leadMagnet="chapters"`
- Show multiple book covers in a grid

### Thank You Page

**File:** `app/[lang]/download/thank-you/page.tsx`

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ThankYouPage({ params }: any) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'essay' or 'chapters'
  const [lang, setLang] = useState<'pl' | 'en'>('pl');

  useEffect(() => {
    // Get language from params
    params.then((p: any) => setLang(p.lang));
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#2a332a] mb-4">
            {lang === 'pl' ? 'Dziękuję!' : 'Thank You!'}
          </h1>
          <p className="text-xl text-[#2a332a]/80">
            {lang === 'pl'
              ? 'Sprawdź swoją skrzynkę email - właśnie wysłałem Ci materiały do pobrania.'
              : 'Check your inbox - I just sent you the download materials.'}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-lg border border-[#2a332a]/10 mb-8">
          <h2 className="text-xl font-bold text-[#2a332a] mb-4">
            {lang === 'pl' ? 'Co dalej?' : 'What\'s Next?'}
          </h2>
          <ul className="space-y-3 text-left text-[#2a332a]/80">
            <li className="flex items-start gap-3">
              <span className="text-[#ffbd59] mt-1">1.</span>
              <span>
                {lang === 'pl'
                  ? 'Sprawdź folder "Spam" jeśli email nie dotarł w ciągu kilku minut'
                  : 'Check your spam folder if the email doesn\'t arrive within a few minutes'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#ffbd59] mt-1">2.</span>
              <span>
                {lang === 'pl'
                  ? 'W ciągu najbliższych dni otrzymasz więcej informacji o moich książkach'
                  : 'In the coming days you\'ll receive more information about my books'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#ffbd59] mt-1">3.</span>
              <span>
                {lang === 'pl'
                  ? 'Możesz odpowiedzieć na każdy email - chętnie porozmawiam!'
                  : 'You can reply to any email - I\'d love to chat!'}
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${lang}/books`}
            className="inline-block bg-[#191919] text-white px-8 py-3 font-semibold hover:bg-[#ffbd59] transition-all duration-300"
          >
            {lang === 'pl' ? 'Zobacz wszystkie książki' : 'View All Books'}
          </Link>
          <Link
            href={`/${lang}`}
            className="inline-block border-2 border-[#191919] text-[#191919] px-8 py-3 font-semibold hover:bg-[#191919] hover:text-white transition-all duration-300"
          >
            {lang === 'pl' ? 'Wróć na stronę główną' : 'Back to Homepage'}
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 3: Blog & Excerpts (Week 4-5)

### Blog System

See complete blog implementation in separate section below due to length.

**Key files:**
- `lib/blog.ts` - Blog post functions
- `content/blog/posts/*.json` - Individual posts
- `app/[lang]/blog/page.tsx` - Blog listing
- `app/[lang]/blog/[slug]/page.tsx` - Individual post
- `components/BlogPostCard.tsx` - Post preview card

### Excerpts Gallery (Fragmenty)

**File:** `app/[lang]/fragmenty/page.tsx`

Pinterest-style masonry grid with visual quote cards.

---

## Phase 4: Book Enhancements (Week 6) ✅ COMPLETED

Add to existing book pages:
- ✅ Reviews section (from JSON files) - Created review system with 3 books
- ✅ "Read first chapter" expandable - Added chapter samples to all books
- ✅ Email signup for book-specific updates - BookEmailSignup component created

**Implementation Date:** November 10, 2025
**Files Created:**
- `lib/reviews.ts` - Review data loading and utilities
- `components/ReviewsSection.tsx` - Review display with ratings
- `components/ExpandableSection.tsx` - Collapsible UI component
- `components/BookEmailSignup.tsx` - Book-specific email capture
- `content/books/reviews/*.json` - Review data for all books

---

## Phase 5: ARC System (Week 7) ❌ SKIPPED

**Reason:** ARC (Advanced Review Copy) program will be handled via external services, not on website.

~~**File:** `app/[lang]/arc/page.tsx`~~

~~Landing page explaining ARC program + signup form with tag `arc-reader`.~~

---

## Phase 6: Email Automation (Week 8) ⏳ OPTIONAL

### Mailchimp Templates to Create

**In Mailchimp Dashboard → Campaigns → Email templates**

Create 8 templates (4 PL + 4 EN):

1. **essay-welcome-pl** - Welcome + essay PDF link
2. **essay-welcome-en** - Welcome + essay PDF link
3. **welcome-day3-pl** - "What makes us human?" intro
4. **welcome-day3-en** - "What makes us human?" intro
5. **book-story-pl** - Behind-the-scenes of a book
6. **book-story-en** - Behind-the-scenes of a book
7. **help-author-pl** - How to help (reviews + ARC)
8. **help-author-en** - How to help (reviews + ARC)

### Journey Builder Setup

**In Mailchimp → Automations → Customer Journeys**

**Journey 1: Essay Download Sequence**
```
Trigger: Tag "essay-download" is added
├─ Send immediately: essay-welcome-[lang]
├─ Wait 3 days
├─ Send: welcome-day3-[lang]
├─ Wait 4 days
├─ Send: book-story-[lang]
├─ Wait 7 days
└─ Send: help-author-[lang]
```

**Journey 2: Chapters Download Sequence**
```
Trigger: Tag "chapters-download" is added
├─ Send immediately: chapters-welcome-[lang]
├─ Wait 2 days
├─ Condition: Clicked book link?
│   ├─ Yes: Send special-offer-[lang]
│   └─ No: Send enjoyed-sample-[lang]
├─ Wait 5 days
└─ Send: arc-invitation-[lang]
```

---

## Complete File List

### New Files to Create

```
narratia/
├── lib/
│   ├── mailchimp.ts                      ✅ NEW
│   └── blog.ts                            ✅ NEW
│
├── components/
│   ├── EmailSignupForm.tsx                ✅ NEW
│   ├── BlogPostCard.tsx                   ✅ NEW
│   └── ExcerptCard.tsx                    ✅ NEW
│
├── app/
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts                   ✅ NEW
│   │
│   └── [lang]/
│       ├── download/
│       │   ├── essay/
│       │   │   └── page.tsx               ✅ NEW
│       │   ├── chapters/
│       │   │   └── page.tsx               ✅ NEW
│       │   └── thank-you/
│       │       └── page.tsx               ✅ NEW
│       │
│       ├── blog/
│       │   ├── page.tsx                   ✅ NEW
│       │   └── [slug]/
│       │       └── page.tsx               ✅ NEW
│       │
│       ├── fragmenty/
│       │   └── page.tsx                   ✅ NEW
│       │
│       └── arc/
│           └── page.tsx                   ✅ NEW
│
└── content/
    ├── blog/
    │   ├── posts/
    │   │   ├── 2025-01-06-laska-i-kij.json
    │   │   └── ...
    │   └── categories.json
    │
    ├── excerpts/
    │   └── excerpts.json
    │
    └── books/
        ├── lustra-ktorych-nie-mamy-reviews.json
        └── ...
```

### Files to Modify

```
├── components/
│   └── Footer.tsx                         🔄 MODIFY (add email signup)
│
├── dictionaries/
│   ├── pl.json                            🔄 MODIFY (add translations)
│   └── en.json                            🔄 MODIFY (add translations)
│
└── .env.local                             ✅ DONE (Mailchimp configured)
```

---

## Deployment Checklist

### Pre-Launch (Testing)

- [ ] Test API endpoint locally
- [ ] Verify Mailchimp integration
- [ ] Test email signup flow (all variants)
- [ ] Test lead magnet download pages
- [ ] Verify GDPR compliance (consent checkbox)
- [ ] Test on mobile devices
- [ ] Check email deliverability
- [ ] Test all email templates

### Launch Day

- [ ] Deploy to Vercel production
- [ ] Verify environment variables in Vercel
- [ ] Test production API endpoints
- [ ] Send test email to yourself
- [ ] Check Mailchimp automation triggers
- [ ] Monitor error logs
- [ ] Post announcement on social media

### Week 1 Post-Launch

- [ ] Monitor email signup rate
- [ ] Check email open rates in Mailchimp
- [ ] Respond to any subscriber questions
- [ ] Fix any bugs discovered
- [ ] A/B test subject lines
- [ ] Gather initial feedback

---

## Success Metrics

### Track Weekly:
- New email subscribers
- Email capture conversion rate
- Email open rate
- Click-through rate
- Website traffic

### Track Monthly:
- Total subscribers vs goal
- Lead magnet performance (which converts best)
- Email engagement trends
- Book link clicks from emails
- ARC reader signups

---

**Next Steps:** Start with Phase 1, Week 1 - Install dependencies and create Mailchimp library.

Ready to implement! 🚀
