# Narratia - Design Guide

## 🎨 Design Philosophy

Your site now has a **warm, elegant design** inspired by your original Canva site:

- **Color Palette**: Warm amber/orange accents with stone/beige backgrounds
- **Typography**: Clean, professional Geist font
- **Style**: Modern minimalism with elegant touches
- **Atmosphere**: Welcoming, literary, sophisticated

---

## ✅ What's Already Beautiful

### Current Design Features:
- ✅ Warm color scheme (amber, orange, stone)
- ✅ Smooth animations and hover effects
- ✅ Gradient backgrounds
- ✅ Professional typography
- ✅ Responsive layout
- ✅ Elegant spacing
- ✅ Decorative accents

### What It Looks Like Now:
- **Hero**: Warm gradient background with amber accents
- **Buttons**: Orange gradient with hover animations
- **Book Cards**: Clean white cards with placeholder letters
- **Layout**: Professional grid system

---

## 📸 Adding Book Cover Images (BIGGEST Impact)

### Step 1: Get Your Book Covers

From your current narratia.pl site or from your publishers, get:
1. **Lustra, których nie mamy** cover image
2. **Łaska i kij** cover image
3. **Odbicie umysłu** cover image

### Step 2: Prepare Images

**Recommended specs:**
- **Size**: 600×900px (2:3 aspect ratio)
- **Format**: JPG or PNG
- **File size**: < 500KB each
- **Quality**: High resolution, clear

**Rename files to:**
```
mirrors-cover.jpg
stick-carrot-cover.jpg
minds-reflection-cover.jpg
```

### Step 3: Add to Project

```bash
# Copy your images to the books directory
cp /path/to/your/covers/*.jpg /home/seba/narratia/public/books/

# Commit and push
cd /home/seba/narratia
git add public/books/*.jpg
git commit -m "Add book cover images"
git push
```

Vercel will auto-deploy and your covers will appear!

---

## 🎨 Color Customization (Optional)

### Current Color Palette:

```css
/* Warm, elegant tones */
--accent: #d97706          /* Amber-600 */
--accent-light: #fef3c7    /* Amber-50 */
--background: #fafaf9      /* Stone-50 */
--foreground: #1c1917      /* Stone-900 */
--muted: #78716c           /* Stone-500 */
```

### Want Different Colors?

Edit `/app/globals.css` and change the `:root` variables:

**Option A: Cooler Tones (Blue/Gray)**
```css
:root {
  --accent: #2563eb;         /* Blue-600 */
  --accent-light: #dbeafe;   /* Blue-100 */
}
```

**Option B: Elegant Purple**
```css
:root {
  --accent: #7c3aed;         /* Purple-600 */
  --accent-light: #ede9fe;   /* Purple-100 */
}
```

**Option C: Forest Green**
```css
:root {
  --accent: #059669;         /* Emerald-600 */
  --accent-light: #d1fae5;   /* Emerald-100 */
}
```

---

## 🖼️ Adding Author Photo

### Where to Add:

1. Save your photo as `/public/author/sebastian-proba.jpg`
2. Update About page to display it

### Quick Fix for About Page:

Add this to `/app/[lang]/about/page.tsx` after line 63:

```tsx
<div className="mx-auto max-w-sm mb-8">
  <Image
    src="/author/sebastian-proba.jpg"
    alt="Sebastian Proba"
    width={300}
    height={300}
    className="rounded-full shadow-xl"
  />
</div>
```

---

## 🎯 Design Comparison

### Before (Basic Scaffold):
- Gray colors only
- No visual interest
- Placeholder everything
- Functional but bland

### Now (Enhanced):
- ✅ Warm color palette
- ✅ Gradient backgrounds
- ✅ Smooth animations
- ✅ Elegant typography
- ✅ Professional appearance
- ⏳ **Needs**: Book covers + author photo

### After Adding Images:
- 🎉 **Fully professional website!**

---

## 📱 Test the New Design

Start the dev server to see the improvements:

```bash
npm run dev
# Open http://localhost:3000
```

You should see:
- Warm amber/orange gradient in hero
- Animated orange buttons
- Smooth hover effects
- Professional color scheme
- Better typography

---

## 🎨 Further Customizations (Later)

### Easy Tweaks:

**1. Change Button Style**
Edit `/components/Hero.tsx` line 27-28 for different button colors

**2. Adjust Spacing**
Tailwind classes like `py-24`, `mt-12` control spacing

**3. Font Size**
Classes like `text-5xl`, `text-xl` control typography

**4. Background Patterns**
Add more decorative elements in Hero component

### Advanced Customizations:

**1. Add Animations**
- Install `framer-motion`
- Add scroll animations
- Animated page transitions

**2. Add More Sections**
- Testimonials carousel
- Press mentions
- Awards section
- Latest blog posts

**3. Enhanced Book Cards**
- Hover effects showing more info
- Quick preview on hover
- Reading progress tracker

---

## 🆚 Template vs Current Design

### Why Current Design is Good:

✅ **Pros:**
- Custom-built for YOU
- Clean, professional
- Fast loading
- Easy to maintain
- SEO optimized
- Unique (not template-like)

❌ **Template Drawbacks:**
- Generic look
- Harder to customize
- More complexity
- Learning curve
- May need to rebuild

### Recommendation:

**Keep current design** + **Add images** = **Professional website!**

You can always add more features later.

---

## 📸 Quick Win: Add Images Today!

This is the **#1 priority** for visual impact:

1. **Get 3 book covers** (from publishers or Canva site)
2. **Resize to 600×900px**
3. **Rename as listed above**
4. **Copy to `/public/books/`**
5. **Commit and deploy**

**Result**: Website goes from "scaffold" to "professional" instantly!

---

## 🎨 Current Design Score

| Aspect | Status | Notes |
|--------|--------|-------|
| **Color Scheme** | ✅ Excellent | Warm, elegant palette |
| **Typography** | ✅ Excellent | Professional fonts |
| **Layout** | ✅ Excellent | Clean, responsive |
| **Animations** | ✅ Good | Smooth transitions |
| **Images** | ⚠️ Missing | Need book covers! |
| **Overall** | ✅ Ready | Just needs images |

**With book covers**: ⭐⭐⭐⭐⭐ (5/5)

---

## 🚀 Next Steps

1. **Today**: Add book cover images
2. **This week**: Add author photo
3. **Later**: Consider additional sections/features
4. **Optional**: Explore templates for inspiration

Your website is already beautiful - it just needs your content to shine! 🎨
