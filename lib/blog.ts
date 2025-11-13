import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Locale } from '@/types/i18n';

export interface BlogPost {
  slug: string;
  title: {
    pl: string;
    en: string;
  };
  excerpt: {
    pl: string;
    en: string;
  };
  content: {
    pl: string;
    en: string;
  };
  date: string; // ISO format: 2025-01-06
  category: string;
  tags?: string[];
  coverImage?: string;
  author?: string;
  featured?: boolean;
}

export interface BlogCategory {
  id: string;
  name: {
    pl: string;
    en: string;
  };
}

const BLOG_POSTS_DIR = path.join(process.cwd(), 'content', 'blog', 'posts');
const BLOG_CATEGORIES_FILE = path.join(process.cwd(), 'content', 'blog', 'categories.json');

/**
 * Get all blog posts
 */
export function getAllBlogPosts(): BlogPost[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(BLOG_POSTS_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BLOG_POSTS_DIR);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(BLOG_POSTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // For markdown files, content is the main text
        // We can store content in both languages or just one
        const post: BlogPost = {
          slug: data.slug,
          title: data.title || { pl: '', en: '' },
          excerpt: data.excerpt || { pl: '', en: '' },
          content: {
            pl: content.trim(),
            en: content.trim(),
          },
          date: data.date,
          category: data.category,
          tags: data.tags,
          coverImage: data.coverImage,
          author: data.author,
          featured: data.featured,
        };
        posts.push(post);
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const posts = getAllBlogPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}

/**
 * Get featured blog posts
 */
export function getFeaturedBlogPosts(limit: number = 3): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter(post => post.featured).slice(0, limit);
}

/**
 * Get blog posts by category
 */
export function getBlogPostsByCategory(categoryId: string): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter(post => post.category === categoryId);
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag: string): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter(post => post.tags?.includes(tag));
}

/**
 * Get all blog categories
 */
export function getBlogCategories(): BlogCategory[] {
  try {
    if (!fs.existsSync(BLOG_CATEGORIES_FILE)) {
      return [];
    }

    const fileContent = fs.readFileSync(BLOG_CATEGORIES_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading blog categories:', error);
    return [];
  }
}

/**
 * Get all unique tags from blog posts
 */
export function getAllBlogTags(): string[] {
  const posts = getAllBlogPosts();
  const tagsSet = new Set<string>();

  posts.forEach(post => {
    post.tags?.forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get recent blog posts
 */
export function getRecentBlogPosts(limit: number = 5): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.slice(0, limit);
}

/**
 * Search blog posts by query
 */
export function searchBlogPosts(query: string, lang: Locale): BlogPost[] {
  const posts = getAllBlogPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter(post => {
    const title = post.title[lang].toLowerCase();
    const excerpt = post.excerpt[lang].toLowerCase();
    const content = post.content[lang].toLowerCase();

    return (
      title.includes(lowerQuery) ||
      excerpt.includes(lowerQuery) ||
      content.includes(lowerQuery)
    );
  });
}

/**
 * Format date for display
 */
export function formatBlogDate(dateString: string, lang: Locale): string {
  const date = new Date(dateString);

  if (lang === 'pl') {
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
