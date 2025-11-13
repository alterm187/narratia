import { Book } from '@/types/book';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BOOKS_DIR = path.join(process.cwd(), 'content', 'books');

interface BookFrontmatter {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  formats: ('ebook' | 'print' | 'audiobook')[];
  publishedDate: string;
  isbn?: {
    ebook?: string;
    print?: string;
    asin?: string;
  };
  genre: string[];
  buyLinks: {
    ebook: Array<{
      platform: string;
      url: string;
      price?: string;
      region?: 'PL' | 'US' | 'UK' | 'global';
      displayName?: string;
    }>;
    print: Array<{
      platform: string;
      url: string;
      price?: string;
      region?: 'PL' | 'US' | 'UK' | 'global';
      displayName?: string;
    }>;
  };
  featured?: boolean;
  pageCount?: number;
  goodreadsUrl?: string;
  rating?: {
    average: number;
    count: number;
  };
}

function getBookMarkdownFiles(): Map<string, { en?: string; pl?: string }> {
  const bookFiles = new Map<string, { en?: string; pl?: string }>();

  if (!fs.existsSync(BOOKS_DIR)) {
    return bookFiles;
  }

  const files = fs.readdirSync(BOOKS_DIR);

  for (const file of files) {
    if (file.endsWith('.md')) {
      const match = file.match(/^(.+)\.(en|pl)\.md$/);
      if (match) {
        const [, bookId, locale] = match;
        if (!bookFiles.has(bookId)) {
          bookFiles.set(bookId, {});
        }
        const bookEntry = bookFiles.get(bookId)!;
        bookEntry[locale as 'en' | 'pl'] = path.join(BOOKS_DIR, file);
      }
    }
  }

  return bookFiles;
}

function parseBookMarkdown(filePath: string): { frontmatter: BookFrontmatter; content: string } {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  return { frontmatter: data as BookFrontmatter, content };
}

export async function getAllBooks(): Promise<Book[]> {
  try {
    const bookFiles = getBookMarkdownFiles();
    const books: Book[] = [];

    for (const [bookId, files] of bookFiles.entries()) {
      if (!files.en && !files.pl) continue;

      // Parse both language versions
      const enData = files.en ? parseBookMarkdown(files.en) : null;
      const plData = files.pl ? parseBookMarkdown(files.pl) : null;

      // Use the first available frontmatter as base (prefer EN)
      const baseFrontmatter = (enData || plData)!.frontmatter;

      const book: Book = {
        id: baseFrontmatter.id,
        slug: {
          en: enData?.frontmatter.slug || baseFrontmatter.slug,
          pl: plData?.frontmatter.slug || baseFrontmatter.slug,
        },
        title: {
          en: enData?.frontmatter.title || '',
          pl: plData?.frontmatter.title || '',
        },
        description: {
          en: enData?.content.trim() || '',
          pl: plData?.content.trim() || '',
        },
        coverImage: baseFrontmatter.coverImage,
        formats: baseFrontmatter.formats,
        publishedDate: {
          en: enData?.frontmatter.publishedDate,
          pl: plData?.frontmatter.publishedDate || baseFrontmatter.publishedDate,
        },
        genre: baseFrontmatter.genre,
        buyLinks: baseFrontmatter.buyLinks,
        featured: baseFrontmatter.featured,
        pageCount: baseFrontmatter.pageCount,
        goodreadsUrl: baseFrontmatter.goodreadsUrl,
        rating: baseFrontmatter.rating,
        isbn: baseFrontmatter.isbn,
      };

      // Handle subtitle if present
      if (enData?.frontmatter.subtitle || plData?.frontmatter.subtitle) {
        book.subtitle = {
          en: enData?.frontmatter.subtitle,
          pl: plData?.frontmatter.subtitle,
        };
      }

      books.push(book);
    }

    return books;
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter((book) => book.featured);
}

export async function getBookBySlug(slug: string, locale: 'en' | 'pl'): Promise<Book | undefined> {
  const books = await getAllBooks();
  return books.find((book) => book.slug[locale] === slug);
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getAllBooks();
  return books.find((book) => book.id === id);
}
