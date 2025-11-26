import { describe, it, expect } from 'vitest';
import { getLocaleFromPathname, getPathnameWithoutLocale, defaultLocale, locales } from '@/lib/i18n';

describe('i18n Library', () => {
  describe('getLocaleFromPathname', () => {
    it('should extract "en" from "/en/books"', () => {
      const result = getLocaleFromPathname('/en/books');
      expect(result).toBe('en');
    });

    it('should extract "pl" from "/pl/blog"', () => {
      const result = getLocaleFromPathname('/pl/blog');
      expect(result).toBe('pl');
    });

    it('should return defaultLocale for "/"', () => {
      const result = getLocaleFromPathname('/');
      expect(result).toBe(defaultLocale);
    });

    it('should return defaultLocale for unknown locale', () => {
      const result = getLocaleFromPathname('/fr/books');
      expect(result).toBe(defaultLocale);
    });

    it('should handle paths without locale', () => {
      const result = getLocaleFromPathname('/books/my-book');
      expect(result).toBe(defaultLocale);
    });

    it('should handle trailing slashes', () => {
      const result = getLocaleFromPathname('/en/');
      expect(result).toBe('en');
    });

    it('should handle complex paths', () => {
      const result = getLocaleFromPathname('/en/blog/my-post/comments');
      expect(result).toBe('en');
    });
  });

  describe('getPathnameWithoutLocale', () => {
    it('should remove "/en" from "/en/books" → "/books"', () => {
      const result = getPathnameWithoutLocale('/en/books', 'en');
      expect(result).toBe('/books');
    });

    it('should remove "/pl" from "/pl/contact" → "/contact"', () => {
      const result = getPathnameWithoutLocale('/pl/contact', 'pl');
      expect(result).toBe('/contact');
    });

    it('should return "/" for "/en"', () => {
      const result = getPathnameWithoutLocale('/en', 'en');
      expect(result).toBe('/');
    });

    it('should handle complex paths', () => {
      const result = getPathnameWithoutLocale('/en/blog/my-post', 'en');
      expect(result).toBe('/blog/my-post');
    });

    it('should not remove locale if not at start', () => {
      const result = getPathnameWithoutLocale('/books/en/something', 'en');
      expect(result).toBe('/books/en/something');
    });
  });

  describe('defaultLocale', () => {
    it('should be "pl"', () => {
      expect(defaultLocale).toBe('pl');
    });
  });

  describe('locales', () => {
    it('should include "en" and "pl"', () => {
      expect(locales).toContain('en');
      expect(locales).toContain('pl');
    });

    it('should have exactly 2 locales', () => {
      expect(locales).toHaveLength(2);
    });
  });
});
