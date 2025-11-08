# Narratia - Sebastian Proba Author Website

A modern, bilingual (Polish/English) author website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ **Bilingual Support**: Full Polish and English translations with language switcher
- ✅ **SEO Optimized**: Schema.org structured data, meta tags, sitemaps
- ✅ **Book Showcase**: Dynamic book pages with buy links to multiple platforms
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Contact Form**: Integrated contact functionality
- ✅ **Performance**: Optimized images, fast page loads
- ✅ **Type-Safe**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Hosting**: Vercel (free tier)
- **Analytics**: Vercel Analytics

## Project Structure

```
narratia/
├── app/
│   ├── [lang]/           # Internationalized routes
│   │   ├── page.tsx      # Homepage
│   │   ├── books/        # Books listing and detail pages
│   │   ├── about/        # About page
│   │   └── contact/      # Contact page
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # React components
├── content/              # Book data (JSON)
├── dictionaries/         # i18n translations
├── lib/                  # Utilities (SEO, i18n, books)
├── public/               # Static assets
└── types/                # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

The site will redirect to `/pl` (Polish) or `/en` (English) based on your browser language.

## Content Management

### Adding a New Book

1. Create a new JSON file in `content/books/`:

\`\`\`json
{
  "id": "book-id",
  "slug": {
    "en": "english-slug",
    "pl": "polish-slug"
  },
  "title": {
    "en": "English Title",
    "pl": "Polski tytuł"
  },
  "description": {
    "en": "English description",
    "pl": "Polski opis"
  },
  "coverImage": "/books/cover.jpg",
  "formats": ["ebook", "print"],
  "genre": ["Fiction"],
  "buyLinks": {
    "ebook": [],
    "print": []
  }
}
\`\`\`

2. Add the import to `lib/books.ts`
3. Place cover image in `public/books/`

### Updating Translations

Edit files in `dictionaries/`:
- `en.json` - English translations
- `pl.json` - Polish translations

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Vercel will auto-detect Next.js and deploy
4. Add custom domain (narratia.pl) in Vercel settings

### Environment Variables

Create `.env.local` for local development:

\`\`\`
NEXT_PUBLIC_SITE_URL=https://narratia.pl
\`\`\`

For production, set this in Vercel dashboard.

## SEO Features

- **Structured Data**: Book schema, Author schema
- **Meta Tags**: OpenGraph, Twitter Cards
- **Hreflang**: Language-specific URLs with proper tags
- **Sitemap**: Auto-generated (coming soon)
- **robots.txt**: Configured for optimal crawling

## Future Enhancements

### Phase 2 (1-2 months):
- Blog/News section
- Newsletter signup
- Reading samples (PDF downloads)
- Media kit page

### Phase 3 (2-3 months):
- CMS integration (Sanity/Contentful)
- Review aggregation from Amazon/Goodreads
- Analytics dashboard
- Social media auto-sharing

## License

Private project - All rights reserved © 2025 Sebastian Proba

## Contact

- Email: sebastian.narratia@gmail.com
- Website: https://narratia.pl
