#!/usr/bin/env node
/**
 * Script to migrate blog posts from JSON to Markdown format
 */

const fs = require('fs');
const path = require('path');

const BLOG_POSTS_DIR = path.join(__dirname, '..', 'content', 'blog', 'posts');

function jsonToMarkdown(jsonData) {
  const { content, ...frontmatter } = jsonData;

  // Build YAML frontmatter
  let yaml = '---\n';

  // Add simple fields
  if (frontmatter.slug) yaml += `slug: ${frontmatter.slug}\n`;

  // Add title (bilingual object)
  if (frontmatter.title) {
    yaml += 'title:\n';
    if (frontmatter.title.pl) yaml += `  pl: ${JSON.stringify(frontmatter.title.pl)}\n`;
    if (frontmatter.title.en) yaml += `  en: ${JSON.stringify(frontmatter.title.en)}\n`;
  }

  // Add excerpt (bilingual object)
  if (frontmatter.excerpt) {
    yaml += 'excerpt:\n';
    if (frontmatter.excerpt.pl) yaml += `  pl: ${JSON.stringify(frontmatter.excerpt.pl)}\n`;
    if (frontmatter.excerpt.en) yaml += `  en: ${JSON.stringify(frontmatter.excerpt.en)}\n`;
  }

  // Add date
  if (frontmatter.date) yaml += `date: ${JSON.stringify(frontmatter.date)}\n`;

  // Add category
  if (frontmatter.category) yaml += `category: ${frontmatter.category}\n`;

  // Add tags (array)
  if (frontmatter.tags && frontmatter.tags.length > 0) {
    yaml += 'tags:\n';
    frontmatter.tags.forEach(tag => {
      yaml += `  - ${tag}\n`;
    });
  }

  // Add author
  if (frontmatter.author) yaml += `author: ${frontmatter.author}\n`;

  // Add coverImage
  if (frontmatter.coverImage) yaml += `coverImage: ${frontmatter.coverImage}\n`;

  // Add featured
  if (frontmatter.featured !== undefined) yaml += `featured: ${frontmatter.featured}\n`;

  yaml += '---\n\n';

  // Add content (use Polish version if available, fallback to English)
  const contentText = content?.pl || content?.en || '';

  return yaml + contentText;
}

function migrateFile(jsonFilePath) {
  const fileName = path.basename(jsonFilePath, '.json');
  const mdFilePath = path.join(BLOG_POSTS_DIR, `${fileName}.md`);

  // Skip if markdown file already exists
  if (fs.existsSync(mdFilePath)) {
    console.log(`⏭️  Skipping ${fileName} - markdown file already exists`);
    return;
  }

  try {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(jsonContent);
    const markdownContent = jsonToMarkdown(jsonData);

    fs.writeFileSync(mdFilePath, markdownContent, 'utf8');
    console.log(`✅ Migrated ${fileName}.json → ${fileName}.md`);
  } catch (error) {
    console.error(`❌ Error migrating ${fileName}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting blog post migration from JSON to Markdown...\n');

  const files = fs.readdirSync(BLOG_POSTS_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  console.log(`Found ${jsonFiles.length} JSON files to migrate\n`);

  jsonFiles.forEach(file => {
    const filePath = path.join(BLOG_POSTS_DIR, file);
    migrateFile(filePath);
  });

  console.log('\n✨ Migration completed!');
}

main();
