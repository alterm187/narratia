import { Book } from '@/types/book';
import mirrorsData from '@/content/books/mirrors-we-dont-have.json';
import stickCarrotData from '@/content/books/stick-and-carrot.json';
import mindsReflectionData from '@/content/books/minds-reflection.json';

const books: Book[] = [
  mirrorsData as Book,
  stickCarrotData as Book,
  mindsReflectionData as Book,
];

export async function getAllBooks(): Promise<Book[]> {
  return books;
}

export async function getFeaturedBooks(): Promise<Book[]> {
  return books.filter((book) => book.featured);
}

export async function getBookBySlug(slug: string, locale: 'en' | 'pl'): Promise<Book | undefined> {
  return books.find((book) => book.slug[locale] === slug);
}

export async function getBookById(id: string): Promise<Book | undefined> {
  return books.find((book) => book.id === id);
}
