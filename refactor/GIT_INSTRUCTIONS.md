# GitHub Commit Instructions

## 🎯 Quick Method (Copy & Paste)

Open your terminal in your project root directory and run these commands:

### Step 1: Create Feature Branch
```bash
git checkout -b feature/hero-section-redesign
```

### Step 2: Copy Files
```bash
# Copy the Hero component (recommended version)
cp /path/to/downloaded/Hero.tsx components/Hero.tsx

# Or if you prefer the alternative version:
# cp /path/to/downloaded/Hero-alternative.tsx components/Hero.tsx
# cp /path/to/downloaded/hero-portrait-styles.css app/hero-portrait.css
```

### Step 3: Stage Changes
```bash
git add components/Hero.tsx
```

### Step 4: Commit
```bash
git commit -m "feat: redesign hero section with integrated circular portrait

- Replace rectangular portrait with circular design
- Add multi-layer glow effect that merges with background
- Implement golden gradient ring system
- Add subtle pulse animation and hover effects
- Make portrait visible on all devices (was hidden on mobile)
- Reduce background opacity from 30% to 5%
- Add decorative animated accent dots
- Improve responsive layout (256px mobile → 384px desktop)
- Enhance visual hierarchy and professional polish"
```

### Step 5: Push to GitHub
```bash
git push -u origin feature/hero-section-redesign
```

### Step 6: Create Pull Request
1. Go to your GitHub repository
2. Click "Compare & pull request"
3. Review changes
4. Click "Create pull request"
5. Merge when ready

---

## 📚 Optional: Commit Documentation

If you want to include the documentation files:

```bash
# Create docs directory
mkdir -p docs/hero-redesign

# Copy documentation files
cp /path/to/downloaded/*.md docs/hero-redesign/
cp /path/to/downloaded/effect-visualization.html docs/hero-redesign/

# Add to git
git add docs/hero-redesign/

# Commit
git commit -m "docs: add hero section redesign documentation"
```

---

## 🚀 Alternative: Direct to Main (Not Recommended)

If you want to commit directly to main branch (skip PR):

```bash
# Make sure you're on main
git checkout main

# Copy files
cp /path/to/downloaded/Hero.tsx components/Hero.tsx

# Stage and commit
git add components/Hero.tsx
git commit -m "feat: redesign hero section with integrated circular portrait"

# Push
git push origin main
```

---

## 🔍 Verify Before Pushing

Always review your changes before pushing:

```bash
# See what changed
git diff components/Hero.tsx

# See commit details
git show

# See file status
git status
```

---

## 🆘 Common Issues

### "Permission denied"
```bash
# Make sure you're authenticated with GitHub
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### "Not a git repository"
```bash
# Make sure you're in the project root
cd /path/to/your/narratia-project
```

### "Branch already exists"
```bash
# Switch to existing branch
git checkout feature/hero-section-redesign

# Or delete and recreate
git branch -D feature/hero-section-redesign
git checkout -b feature/hero-section-redesign
```

---

## 📋 Files to Commit

### Essential (Required)
- `components/Hero.tsx` - The redesigned component

### Optional but Recommended
- `docs/hero-redesign/README.md` - Package overview
- `docs/hero-redesign/QUICK_START.md` - Implementation guide
- `docs/hero-redesign/IMPLEMENTATION_GUIDE.md` - Detailed guide

### Optional
- All other documentation files
- `effect-visualization.html` - Visual demo

---

## ✅ Recommended Workflow

1. **Create branch** (isolate changes)
2. **Copy Hero.tsx** (main component)
3. **Test locally** (`npm run dev`)
4. **Commit** (save changes)
5. **Push** (upload to GitHub)
6. **Create PR** (review before merge)
7. **Merge** (when ready)

This ensures you can review changes before they go live!

---

## 🎉 After Committing

1. ✅ Changes are saved in git history
2. ✅ Backed up on GitHub
3. ✅ Can be reviewed in PR
4. ✅ Easy to revert if needed
5. ✅ Team members can review

**Note**: Replace `/path/to/downloaded/` with the actual path where you downloaded the files.
