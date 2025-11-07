# Narratia Website - Implementation Plan

**Project**: Author Website for Sebastian Proba
**Domain**: narratia.pl
**Timeline**: Start immediately - MVP in 1-2 days
**Budget**: $0/month (Vercel free tier)

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Free)
- **Hosting**: Vercel (Free tier)
- **Analytics**: Vercel Analytics (Free)
- **CMS**: File-based (MDX for content)

## Multi-language Content Strategy

**Important**: NOT just a language toggle showing/hiding books!

### Approach:
```
All books visible on all language versions
Book metadata (title, description, etc.) in both languages
Language toggle changes:
  - UI language
  - Book descriptions
  - About page content
  - Navigation
```

### Example Structure:
```
English page shows:
  Book 1: "Mirrors We Don't Have" (English description)
  Book 2: "The Stick and the Carrot" (English description)

Polish page shows:
  Book 1: "Lustra, których nie mamy" (Polish description)
  Book 2: "Laska i kij" (Polish description)
```

## Phase 1 - MVP Features (All Required)

### 1. Homepage
- [ ] Professional hero section with author photo
- [ ] Tagline/introduction
- [ ] Featured books showcase
- [ ] Call-to-action buttons (Latest book, About, Contact)
- [ ] Language switcher (PL/EN) - prominent position
- [ ] Responsive design (mobile-first)

### 2. Books Section
- [ ] Grid/card layout for all books
- [ ] Each book displays:
  - Cover image (optimized)
  - Title (in current language)
  - Subtitle/tagline
  - Full description
  - Format available (ebook/print)
  - Reader testimonials/reviews
  - Multiple buy buttons:
    - Amazon (ebook + print)
    - Draft2Digital stores
    - Naffy.io
    - Polish shops (Empik, Bonito, Tania Książka)
- [ ] Smart buy button grouping (by region/format)
- [ ] Sample download links (if available)

### 3. About Page
- [ ] Author biography (PL/EN versions)
- [ ] Writing journey
- [ ] Professional photo(s)
- [ ] Social media links
- [ ] Contact information

### 4. Contact Form
- [ ] Name, Email, Message fields
- [ ] Form validation
- [ ] Email integration (consider Resend.com or similar)
- [ ] Success/error messages in both languages

### 5. Polish/English Toggle
- [ ] Persistent language preference (localStorage)
- [ ] URL-based routing (/pl, /en)
- [ ] Proper hreflang tags for SEO
- [ ] All UI elements translated
- [ ] All content in both languages

### 6. SEO Optimization
- [ ] Meta tags (title, description) per page/language
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] Structured data (Schema.org):
  - Person schema (author)
  - Book schema (each book with ISBN, price, availability)
  - Review schema (aggregate ratings)
- [ ] XML sitemap generation
- [ ] robots.txt
- [ ] Canonical URLs
- [ ] Image optimization

## Content Sources

### Polish Content
**Source**: Current narratia.pl (Canva site)
**Extract**:
- Book titles, descriptions
- Author bio
- Testimonials
- Buy links
- Images (if downloadable)

### English Content
**Source**: Goodreads profiles for each book
**Extract**:
- English book descriptions
- Reviews/ratings
- English metadata
**Note**: May need manual translation for some elements

### Books to Include:
1. **Lustra, których nie mamy** / **Mirrors We Don't Have**
   - Philosophical novel about AI consciousness
   - Available: ebook + print

2. **Laska i kij** / **The Stick and the Carrot**
   - Christmas narrative from shepherds' perspective
   - Available: ebook + print

3. **Odbicie umysłu** / **Mind's Reflection**
   - Essay on human-AI collaboration in poetry translation
   - Available: ebook

## Design Options

### Option A: Template-based Design
- Start with clean Next.js template
- Customize with Canva site colors (beige, black, organic tones)
- Professional typography
- Modern, minimalist approach

### Option B: Canva-inspired Design
- Recreate warm, elegant aesthetic from current site
- Beige/cream backgrounds
- Black text with organic color accents
- More artistic, author-focused feel

### Recommendation:
Start with template, create 2-3 design variations to compare:
1. Modern minimalist (template base)
2. Canva-inspired warm tones
3. Hybrid approach

## Project Structure

```
narratia/
├── src/
│   ├── app/
│   │   ├── [lang]/                    # i18n routing
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── books/
│   │   │   │   ├── page.tsx          # All books
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Individual book
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts          # Contact form handler
│   │   ├── layout.tsx
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── BookCard.tsx              # Book display component
│   │   ├── BuyButton.tsx             # Purchase link button
│   │   ├── BuyButtonGroup.tsx        # Grouped buy buttons
│   │   ├── LanguageSwitcher.tsx      # PL/EN toggle
│   │   ├── Header.tsx                # Navigation
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx                  # Homepage hero
│   │   ├── ContactForm.tsx
│   │   └── Newsletter.tsx            # Future: newsletter signup
│   ├── content/
│   │   └── books/
│   │       ├── mirrors-we-dont-have.json
│   │       ├── stick-and-carrot.json
│   │       └── minds-reflection.json
│   ├── lib/
│   │   ├── i18n.ts                   # Translation utilities
│   │   ├── seo.ts                    # SEO utilities
│   │   ├── analytics.ts              # Analytics setup
│   │   └── books.ts                  # Book data loader
│   ├── types/
│   │   ├── book.ts                   # Book type definitions
│   │   └── i18n.ts
│   └── dictionaries/
│       ├── en.json                   # English translations
│       └── pl.json                   # Polish translations
├── public/
│   ├── books/                        # Book cover images
│   │   ├── mirrors-cover.jpg
│   │   ├── stick-carrot-cover.jpg
│   │   └── minds-reflection-cover.jpg
│   ├── author/                       # Author photos
│   └── images/
├── scripts/
│   ├── generate-seo.js               # From ascendo-analytics
│   ├── generate-sitemap.js           # From ascendo-analytics
│   └── extract-content.js            # Content extraction helper
├── .env.local                        # Environment variables
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Implementation Timeline

### Day 1: Setup & Structure (4-6 hours)
**Morning**:
- [x] Create implementation plan
- [ ] Initialize Next.js 14 project
- [ ] Research and evaluate templates
- [ ] Set up basic project structure
- [ ] Configure TypeScript, Tailwind, ESLint

**Afternoon**:
- [ ] Extract content from narratia.pl
- [ ] Research Goodreads for English content
- [ ] Set up i18n routing structure
- [ ] Copy SEO utilities from ascendo-analytics
- [ ] Create book data structure and types

### Day 2: Core Features (6-8 hours)
**Morning**:
- [ ] Build homepage with hero
- [ ] Create Header with language switcher
- [ ] Implement books listing page
- [ ] Create individual book pages

**Afternoon**:
- [ ] Build About page
- [ ] Implement contact form
- [ ] Add Footer
- [ ] Implement responsive design
- [ ] Test on mobile devices

### Day 3: SEO & Polish (4-6 hours)
**Morning**:
- [ ] Implement all meta tags
- [ ] Add structured data (Schema.org)
- [ ] Generate sitemap
- [ ] Optimize images
- [ ] Add analytics

**Afternoon**:
- [ ] Review all translations
- [ ] Test language switching
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit

### Day 4: Deployment (2-4 hours)
- [ ] Create Vercel project
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy to Vercel
- [ ] Test production build
- [ ] Configure custom domain (narratia.pl)
- [ ] Test domain SSL
- [ ] Final review

## Template Recommendations

Will research and recommend from:
1. **Vercel Templates** - Official Next.js templates
2. **Taxonomy** by shadcn - Modern, TypeScript, Tailwind
3. **Next.js Portfolio Templates** - Author/creator focused
4. **Custom build** - Using ascendo-analytics patterns

## Technical Details

### i18n Implementation
```typescript
// URL structure
narratia.pl/en → English version
narratia.pl/pl → Polish version
narratia.pl → Redirect to browser language or default (PL)

// Book data structure
{
  id: "mirrors-we-dont-have",
  slug: {
    en: "mirrors-we-dont-have",
    pl: "lustra-ktorych-nie-mamy"
  },
  title: {
    en: "Mirrors We Don't Have",
    pl: "Lustra, których nie mamy"
  },
  description: {
    en: "English description...",
    pl: "Polish description..."
  },
  // ... other fields
}
```

### SEO Strategy
1. **Separate URLs per language** (better than single URL with toggle)
2. **Hreflang tags** linking PL/EN versions
3. **Book schema** for each book
4. **Author schema** on homepage/about
5. **Review schema** with aggregated ratings
6. **Open Graph images** auto-generated per book
7. **Sitemap** with all PL/EN pages

### Buy Button Strategy
```typescript
// Group buttons logically
- eBook formats:
  - Amazon Kindle
  - Draft2Digital (Apple Books, Kobo, etc.)
  - Naffy.io
  - Polish stores (Empik, etc.)

- Print formats:
  - Amazon Print-on-Demand
  - Polish bookstores

// Future: Geo-detection to highlight local stores
```

## Phase 2 Features (Future)

### Month 1-2:
- [ ] Blog/News section
- [ ] Newsletter signup (Mailchimp integration from ascendo)
- [ ] Reading samples (first chapter PDFs)
- [ ] Media kit page
- [ ] Events calendar
- [ ] Review aggregation from Amazon/Goodreads

### Month 2-3:
- [ ] CMS integration (Sanity/Contentful) for easier updates
- [ ] Advanced analytics dashboard
- [ ] Author dashboard for tracking sales links
- [ ] Automated social media sharing
- [ ] Reading progress tracker for samples

## Success Metrics

### Week 1:
- Site live on narratia.pl
- All books visible with buy links
- Both languages functional
- Mobile-responsive
- Basic SEO implemented

### Month 1:
- Google Search Console verified
- Analytics showing visitor sources
- Social sharing working
- Page speed score >90

### Month 3:
- Organic search traffic growing
- Newsletter subscribers (if added)
- Book page views tracked
- Conversion tracking on buy links

## Notes & Decisions

### Content Presentation Strategy:
✅ **Approved approach**: All books visible in both languages, with language-specific metadata
❌ **Rejected approach**: Hide books based on language (bad UX, bad SEO)

### Design Direction:
⏳ **To decide**: Template vs Canva-inspired (will create options to compare)

### Hosting:
✅ **Confirmed**: Vercel free tier

### Technology:
✅ **Confirmed**: Next.js 14 + TypeScript + Tailwind CSS

## Dependencies & Access Needed

- [ ] Access to high-res book cover images
- [ ] Author photos for About page
- [ ] ISBN numbers for each book
- [ ] Goodreads URLs for English content
- [ ] Email for contact form destination
- [ ] Access to narratia.pl domain DNS settings (for Vercel)

## Risk Mitigation

**Risk**: Content extraction from Canva site difficult
**Mitigation**: Manual content entry if needed, or user provides content

**Risk**: Goodreads doesn't have English content
**Mitigation**: User provides English descriptions, or translate Polish content

**Risk**: Template doesn't fit author aesthetic
**Mitigation**: Multiple design options, easy to switch/customize

**Risk**: Domain configuration issues
**Mitigation**: Detailed Vercel domain setup guide, can use vercel.app subdomain initially

## Getting Started - Next Steps

1. ✅ Implementation plan created
2. ⏩ **NEXT**: Initialize Next.js project
3. ⏩ Research templates (parallel task)
4. ⏩ Extract content from narratia.pl
5. ⏩ Begin development

---

**Status**: Ready to begin implementation
**Created**: 2025-11-07
**Last Updated**: 2025-11-07
