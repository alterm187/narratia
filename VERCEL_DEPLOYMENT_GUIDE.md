# Vercel Deployment Guide - Narratia

## Quick Start (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free) - sign up at https://vercel.com

---

## Step 1: Push Code to GitHub

Your code needs to be on GitHub for Vercel to deploy it.

```bash
# Make sure all changes are committed
git status

# Push to GitHub (if you haven't already)
git push origin master
```

If you don't have a GitHub repository yet:
1. Go to https://github.com/new
2. Create a new repository called "narratia"
3. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/narratia.git
git push -u origin master
```

---

## Step 2: Deploy to Vercel

### Option A: Via Web Dashboard (Recommended for first time)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub account
   - Find and select "narratia" repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables** (IMPORTANT!)
   Click "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   MAILCHIMP_API_KEY=your_mailchimp_api_key_from_env_local
   MAILCHIMP_SERVER_PREFIX=us10
   MAILCHIMP_AUDIENCE_ID=your_audience_id_from_env_local
   SENDGRID_API_KEY=your_sendgrid_api_key_from_env_local
   ```

   **Get the actual values from your `.env.local` file** (don't commit this file to Git!)

   **Note**: For NEXT_PUBLIC_SITE_URL, you can:
   - Use `https://your-project.vercel.app` initially
   - Update it to `https://narratia.pl` after domain setup

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like `https://narratia-xxx.vercel.app`

### Option B: Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /home/seba/narratia
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? narratia
# - Directory? ./
# - Override settings? N

# Add environment variables via CLI or dashboard
```

---

## Step 3: Configure Environment Variables

After deployment, you need to add environment variables:

### Via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your "narratia" project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://narratia-xxx.vercel.app` (your Vercel URL) | Production, Preview, Development |
| `MAILCHIMP_API_KEY` | Copy from `.env.local` file | Production, Preview, Development |
| `MAILCHIMP_SERVER_PREFIX` | `us10` | Production, Preview, Development |
| `MAILCHIMP_AUDIENCE_ID` | Copy from `.env.local` file | Production, Preview, Development |
| `SENDGRID_API_KEY` | Copy from `.env.local` file | Production, Preview, Development |

**Important**: Check all three environments (Production, Preview, Development) for each variable.

5. After adding variables, go to **Deployments**
6. Click the three dots on the latest deployment → **Redeploy**

---

## Step 4: Set Up Custom Domain (narratia.pl)

Once your DNS propagates:

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Click "Add"
   - Enter: `narratia.pl`
   - Click "Add"

2. **Configure DNS** (at your domain registrar):

   Vercel will show you DNS records to add. Typically:

   **For root domain (narratia.pl)**:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain**:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

   **Or alternative (both work)**:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

3. **Update NEXT_PUBLIC_SITE_URL**:
   - Go back to Environment Variables
   - Update `NEXT_PUBLIC_SITE_URL` to `https://narratia.pl`
   - Redeploy

4. **Wait for DNS propagation** (can take 24-48 hours)
   - Check status: https://www.whatsmydns.net/

---

## Step 5: Update Email Links

After deploying with your domain:

1. **Update SendGrid Email Templates**:
   - Edit `lib/sendgrid.ts` line 68-70
   - Change from `https://narratia.pl` to your actual domain
   - Already correct if using `narratia.pl`!

2. **Test Email Links**:
   - Sign up for newsletter
   - Check email
   - Verify all links work

---

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `master`** → Production deployment (narratia.pl)
- **Push to other branches** → Preview deployment (unique URL)
- **Pull requests** → Preview deployment (for testing)

```bash
# After making changes:
git add .
git commit -m "Your changes"
git push origin master

# Vercel deploys automatically in 2-3 minutes
```

---

## Monitoring & Logs

### View Deployment Logs:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Deployments**
4. Click on any deployment to see logs

### View Runtime Logs:
1. In your project dashboard
2. Go to **Logs** tab
3. See API calls, errors, etc. in real-time

### Analytics:
- Go to **Analytics** tab (free tier includes basic analytics)
- See page views, top pages, etc.

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Locally test the build:
npm run build

# Fix any errors, then push
git add .
git commit -m "fix: build errors"
git push
```

**Error: "Environment variable missing"**
- Check Environment Variables in Vercel dashboard
- Make sure all 5 variables are added
- Redeploy after adding

### Newsletter Not Working

**Emails not sending:**
1. Check SendGrid API key is added to Vercel
2. Verify sender email in SendGrid (seba@narratia.pl)
3. Check deployment logs for errors

**Mailchimp errors:**
1. Verify API key is correct
2. Check audience ID matches
3. Test signup flow

### Modal Not Showing

**localStorage not working:**
- Should work fine on Vercel
- Clear browser localStorage to test again:
  - Open DevTools (F12)
  - Go to Application → Local Storage
  - Delete `narratia-newsletter-modal-shown`
  - Refresh page

---

## Performance Optimization

Vercel automatically handles:
- ✅ CDN distribution (global edge network)
- ✅ Image optimization
- ✅ Automatic caching
- ✅ Brotli/Gzip compression
- ✅ HTTP/2 & HTTP/3

Your site will be FAST! 🚀

---

## Cost

**Vercel Free Tier includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Preview deployments
- Analytics (basic)

**You're well within free tier limits** for a personal author site.

---

## Post-Deployment Checklist

After your first deployment:

- [ ] Visit your Vercel URL - does the site load?
- [ ] Test navigation - all pages work?
- [ ] Test newsletter modal - appears on book pages?
- [ ] Test email signup - form submits?
- [ ] Check email inbox - welcome email received?
- [ ] Click email link - goes to download page?
- [ ] Test on mobile - responsive design works?
- [ ] Check browser console - no errors?
- [ ] Test Polish and English versions
- [ ] Verify all book pages load correctly

---

## Updating Your Site

Simple workflow:

```bash
# 1. Make changes locally
# Edit files...

# 2. Test locally
npm run dev
# Visit http://localhost:3000

# 3. Build locally to catch errors
npm run build

# 4. Commit and push
git add .
git commit -m "feat: add new blog post"
git push origin master

# 5. Vercel deploys automatically!
# Check https://vercel.com/dashboard for status
```

---

## Custom Domain Setup (Detailed)

When your SendGrid DNS is ready:

### At Your Domain Registrar (e.g., GoDaddy, Namecheap):

1. **Log in to your domain registrar**
2. **Find DNS settings** for narratia.pl
3. **Add these records**:

**Option 1: A Record (recommended)**
```
Type: A
Host: @
Points to: 76.76.21.21
TTL: 3600
```

**Option 2: CNAME Record (alternative)**
```
Type: CNAME
Host: @
Points to: cname.vercel-dns.com
TTL: 3600
```

**For www subdomain**:
```
Type: CNAME
Host: www
Points to: cname.vercel-dns.com
TTL: 3600
```

4. **Save changes**
5. **Wait** (24-48 hours for full propagation)

### In Vercel Dashboard:

1. **Add Domain**:
   - Project → Settings → Domains
   - Enter: `narratia.pl` and `www.narratia.pl`
   - Vercel will verify DNS automatically

2. **SSL Certificate**:
   - Vercel automatically provisions SSL (HTTPS)
   - No action needed - it's automatic!

3. **Redirect www to root** (optional):
   - In Vercel, set `www.narratia.pl` to redirect to `narratia.pl`
   - Or vice versa (your preference)

---

## SendGrid DNS Records

You mentioned waiting for SendGrid DNS to propagate. These are separate from Vercel:

**For email sending (at your domain registrar)**:

```
Type: TXT
Host: @
Value: v=spf1 include:sendgrid.net ~all

Type: CNAME
Host: em1234 (SendGrid will provide exact value)
Value: u1234567.wl.sendgrid.net

Type: CNAME
Host: s1._domainkey
Value: s1.domainkey.u1234567.wl.sendgrid.net

Type: CNAME
Host: s2._domainkey
Value: s2.domainkey.u1234567.wl.sendgrid.net
```

**These are for email authentication, not website hosting.**

---

## Quick Commands Reference

```bash
# Deploy to Vercel (first time)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm deployment-url

# Pull environment variables locally
vercel env pull
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/next.js/discussions

---

## Security Notes

1. **Never commit `.env.local`** - already in `.gitignore` ✅
2. **Rotate API keys** if accidentally exposed
3. **Enable 2FA** on Vercel account (Settings → Security)
4. **Use environment variables** for all secrets ✅

---

**You're all set! Your site is ready to deploy to Vercel.** 🎉

**Estimated time**: 10-15 minutes for first deployment
**Result**: Live website at `https://narratia-xxx.vercel.app` (and `narratia.pl` after DNS)
