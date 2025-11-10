import fs from 'fs';
import path from 'path';
import { Locale } from '@/types/i18n';

export interface Review {
  id: string;
  rating: number;
  author: {
    pl: string;
    en: string;
  };
  date: string;
  verified: boolean;
  title: {
    pl: string;
    en: string;
  };
  content: {
    pl: string;
    en: string;
  };
  helpful: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface BookReviews {
  bookId: string;
  reviews: Review[];
  summary: ReviewSummary;
}

const REVIEWS_DIR = path.join(process.cwd(), 'content', 'books', 'reviews');

/**
 * Get all reviews for a specific book
 */
export function getBookReviews(bookId: string): BookReviews | null {
  try {
    const filePath = path.join(REVIEWS_DIR, `${bookId}-reviews.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as BookReviews;
  } catch (error) {
    console.error(`Error loading reviews for book ${bookId}:`, error);
    return null;
  }
}

/**
 * Get featured reviews (highest rated and most helpful)
 */
export function getFeaturedReviews(bookId: string, limit: number = 3): Review[] {
  const bookReviews = getBookReviews(bookId);

  if (!bookReviews) {
    return [];
  }

  // Sort by rating (desc) and helpful count (desc)
  return bookReviews.reviews
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.helpful - a.helpful;
    })
    .slice(0, limit);
}

/**
 * Format date for display
 */
export function formatReviewDate(dateString: string, lang: Locale): string {
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
 * Get rating percentage for display
 */
export function getRatingPercentage(rating: number): string {
  return `${(rating / 5) * 100}%`;
}

/**
 * Get star display for rating
 */
export function getStarDisplay(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
}
