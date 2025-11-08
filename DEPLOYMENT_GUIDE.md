# Narratia - Deployment Guide

## Quick Start: Deploy to Vercel (Recommended)

Vercel is the recommended hosting platform for this Next.js application. It's **100% free** for this use case and provides excellent performance.

### Prerequisites

- GitHub account
- Vercel account (free) - sign up at https://vercel.com

### Step 1: Push Code to GitHub

```bash
# If you haven't already, create a new repository on GitHub
# Then push your code:

git remote add origin https://github.com/YOUR_USERNAME/narratia.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `narratia` repository from GitHub
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. **Environment Variables** (Optional - add these):
   ```
   NEXT_PUBLIC_SITE_URL=https://narratia.pl
   ```

6. Click **Deploy**

### Step 3: Wait for Deployment

Vercel will:
- Install dependencies
- Build your application
- Deploy to a `*.vercel.app` URL

This takes about 2-3 minutes.

### Step 4: Configure Custom Domain (narratia.pl)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add custom domain: `narratia.pl`
4. Vercel will provide DNS instructions

#### DNS Configuration

You have two options:

**Option A: Use Vercel nameservers (Recommended)**
1. Vercel will provide nameservers (e.g., `ns1.vercel-dns.com`)
2. Go to your domain registrar (where you bought narratia.pl)
3. Update nameservers to Vercel's nameservers
4. Wait 24-48 hours for DNS propagation

**Option B: Add A/CNAME records**
1. Add these records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
2. Wait 1-24 hours for DNS propagation

### Step 5: Verify Deployment

1. Visit `https://narratia.pl` (after DNS propagation)
2. Test language switching (PL/EN)
3. Test all pages:
   - Homepage
   - Books listing
   - Individual book pages
   - About page
   - Contact form
4. Check mobile responsiveness

### Step 6: Enable Analytics (Optional, Free)

1. In Vercel dashboard, go to **Analytics** tab
2. Click **Enable Analytics**
3. Free tier includes:
   - Page views
   - Top pages
   - Top referrers
   - Device/browser stats

## Post-Deployment Tasks

### 1. Add Book Cover Images

Currently using placeholder images. To add real covers:

1. Prepare high-res book cover images (recommended: 600x900px, JPG/PNG)
2. Name them:
   - `mirrors-cover.jpg`
   - `stick-carrot-cover.jpg`
   - `minds-reflection-cover.jpg`
3. Upload to `/public/books/` directory
4. Commit and push:
   ```bash
   git add public/books/*.jpg
   git commit -m "Add book cover images"
   git push
   ```
5. Vercel will auto-deploy

### 2. Configure Contact Form Email

The contact form currently logs to console. To send emails:

**Option A: Use Resend (Recommended, Free)**

1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Get API key
3. Install Resend:
   ```bash
   npm install resend
   ```
4. Add to Vercel environment variables:
   ```
   RESEND_API_KEY=re_xxxxx
   CONTACT_EMAIL=sebastian.narratia@gmail.com
   ```
5. Update [app/api/contact/route.ts](app/api/contact/route.ts) to use Resend

**Option B: Use SendGrid or Gmail SMTP**

Similar process - see Next.js email integration docs.

### 3. Set Up Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: `narratia.pl`
3. Verify ownership (Vercel makes this easy with TXT record)
4. Submit sitemap: `https://narratia.pl/sitemap.xml` (you'll need to generate this - see below)

### 4. Generate Sitemap (Future Enhancement)

Create `/app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';
import { getAllBooks } from '@/lib/books';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getAllBooks();
  const baseUrl = 'https://narratia.pl';

  const bookUrls = books.flatMap((book) => [
    {
      url: `${baseUrl}/en/books/${book.slug.en}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pl/books/${book.slug.pl}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...bookUrls,
    // Add more pages...
  ];
}
```

### 5. Add robots.txt

Create `/public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://narratia.pl/sitemap.xml
```

## Updating Content

### Add a New Book

1. Create JSON file in `/content/books/new-book.json`:
   ```json
   {
     "id": "new-book",
     "slug": { "en": "new-book", "pl": "nowa-ksiazka" },
     "title": { "en": "New Book", "pl": "Nowa Książka" },
     "description": { "en": "...", "pl": "..." },
     "coverImage": "/books/new-book-cover.jpg",
     "formats": ["ebook", "print"],
     "genre": ["Fiction"],
     "buyLinks": { "ebook": [], "print": [] }
   }
   ```

2. Update `/lib/books.ts`:
   ```typescript
   import newBookData from '@/content/books/new-book.json';

   const books: Book[] = [
     mirrorsData as Book,
     stickCarrotData as Book,
     mindsReflectionData as Book,
     newBookData as Book, // Add this
   ];
   ```

3. Add cover image to `/public/books/new-book-cover.jpg`

4. Commit and push - Vercel auto-deploys!

### Update Translations

Edit files in `/dictionaries/`:
- `/dictionaries/en.json` - English
- `/dictionaries/pl.json` - Polish

Commit and push to deploy.

## Monitoring & Maintenance

### Check Build Status

- Vercel dashboard shows all deployments
- Green checkmark = successful
- Red X = failed (check logs)

### View Logs

In Vercel dashboard:
1. Go to **Deployments**
2. Click on any deployment
3. View **Build Logs** and **Function Logs**

### Rollback Deployment

If something breaks:
1. Go to **Deployments**
2. Find last working deployment
3. Click **•••** menu
4. Select **Promote to Production**

## Cost Breakdown

### Current Setup (Free)

- **Vercel Hosting**: $0/month (Hobby plan)
  - Unlimited bandwidth
  - 100GB storage
  - Automatic HTTPS
  - Global CDN

- **Domain**: ~$10-15/year (narratia.pl)
  - Already owned by you

**Total: $0/month + domain renewal**

### If You Need More (Optional)

- **Resend (email)**: Free tier (100 emails/day)
- **Vercel Analytics**: Free tier included
- **Vercel Pro**: $20/month (if you need):
  - Team collaboration
  - Advanced analytics
  - Password protection
  - More bandwidth

**You don't need Pro tier for this website.**

## Troubleshooting

### Build Fails

Check Vercel logs. Common issues:
- TypeScript errors → run `npm run build` locally first
- Missing dependencies → ensure `package.json` is committed
- Environment variables → check they're set in Vercel

### Images Don't Load

- Ensure images are in `/public/` directory
- Check paths start with `/` (e.g., `/books/cover.jpg`)
- Verify images are committed to git

### Language Switching Doesn't Work

- Clear browser cache
- Check middleware is deployed
- Verify both `/en` and `/pl` routes exist

### Contact Form Not Working

- Check API route logs in Vercel
- Verify email service is configured
- Test with browser DevTools Network tab

## Next Steps

### Phase 2 Features (1-2 months)

- [ ] Blog/News section for book updates
- [ ] Newsletter signup (Mailchimp integration)
- [ ] Reading samples (first chapter PDFs)
- [ ] Media kit page for press
- [ ] Events calendar

### Phase 3 Features (2-3 months)

- [ ] CMS integration (Sanity/Contentful)
- [ ] Review aggregation from Amazon/Goodreads
- [ ] Enhanced analytics dashboard
- [ ] Social media auto-sharing
- [ ] Book sales tracking

## Support

### Documentation

- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Getting Help

1. Check Vercel dashboard logs
2. Review Next.js documentation
3. Ask in Vercel Discord: https://vercel.com/discord

## Success Checklist

After deployment, verify:

- ✅ Site loads at narratia.pl
- ✅ Both languages work (PL/EN)
- ✅ All 3 books display correctly
- ✅ Buy links work
- ✅ Contact form submits
- ✅ Mobile responsive
- ✅ Fast page loads (<2s)
- ✅ HTTPS works (green lock)

**Congratulations! Your author website is live! 🎉**
