#!/bin/bash

# Hero Section Redesign - Git Commit Script
# Run this script from your project root directory

echo "🚀 Committing Hero Section Redesign to GitHub..."
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Please run this script from your project root directory"
    exit 1
fi

# Create a feature branch (optional but recommended)
echo "📝 Creating feature branch..."
git checkout -b feature/hero-section-redesign

# Copy the new Hero component (CHOOSE ONE METHOD)
echo ""
echo "Please choose which Hero component to use:"
echo "1) Hero.tsx (Inline Tailwind - Recommended)"
echo "2) Hero-alternative.tsx (Class-based with external CSS)"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    echo "✅ Using Hero.tsx (Inline Tailwind version)"
    cp Hero.tsx components/Hero.tsx
    git add components/Hero.tsx
elif [ "$choice" == "2" ]; then
    echo "✅ Using Hero-alternative.tsx (Class-based version)"
    cp Hero-alternative.tsx components/Hero.tsx
    cp hero-portrait-styles.css app/hero-portrait.css
    echo ""
    echo "⚠️  Don't forget to import the CSS in your layout:"
    echo "    Add to app/layout.tsx or app/[lang]/layout.tsx:"
    echo "    import './hero-portrait.css';"
    echo ""
    git add components/Hero.tsx app/hero-portrait.css
else
    echo "❌ Invalid choice"
    exit 1
fi

# Add all documentation files (optional)
echo ""
read -p "📚 Do you want to commit documentation files? (y/n): " doc_choice

if [ "$doc_choice" == "y" ] || [ "$doc_choice" == "Y" ]; then
    echo "Adding documentation to docs/hero-redesign/..."
    mkdir -p docs/hero-redesign
    cp README.md docs/hero-redesign/
    cp QUICK_START.md docs/hero-redesign/
    cp IMPLEMENTATION_GUIDE.md docs/hero-redesign/
    cp REDESIGN_SUMMARY.md docs/hero-redesign/
    cp CODE_COMPARISON.md docs/hero-redesign/
    cp QUICK_REFERENCE.md docs/hero-redesign/
    cp effect-visualization.html docs/hero-redesign/
    cp INDEX.md docs/hero-redesign/
    git add docs/hero-redesign/
fi

# Show status
echo ""
echo "📋 Files staged for commit:"
git status --short

# Commit the changes
echo ""
echo "💾 Committing changes..."
git commit -m "feat: redesign hero section with integrated circular portrait

- Replace rectangular portrait with circular design
- Add multi-layer glow effect that merges with background
- Implement golden gradient ring system
- Add subtle pulse animation and hover effects
- Make portrait visible on all devices (was hidden on mobile)
- Reduce background opacity from 30% to 5%
- Add decorative animated accent dots
- Improve responsive layout (256px mobile → 384px desktop)
- Enhance visual hierarchy and professional polish

This redesign transforms the author portrait into an integrated
centerpiece with seamless background merge effects, creating
better user engagement and personal brand connection."

# Show the commit
echo ""
echo "✅ Commit created successfully!"
git log -1 --stat

# Push to GitHub
echo ""
read -p "🚀 Push to GitHub? (y/n): " push_choice

if [ "$push_choice" == "y" ] || [ "$push_choice" == "Y" ]; then
    echo "Pushing to GitHub..."
    git push -u origin feature/hero-section-redesign
    echo ""
    echo "✅ Pushed to GitHub!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Go to your GitHub repository"
    echo "2. Create a Pull Request from 'feature/hero-section-redesign' to 'main'"
    echo "3. Review the changes"
    echo "4. Merge when ready"
else
    echo "⏸️  Changes committed locally but not pushed"
    echo "To push later, run:"
    echo "  git push -u origin feature/hero-section-redesign"
fi

echo ""
echo "🎉 Done!"
