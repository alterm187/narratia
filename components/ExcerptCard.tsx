import Link from 'next/link';
import { Locale } from '@/types/i18n';

export interface Excerpt {
  id: string;
  text: {
    pl: string;
    en: string;
  };
  book: string;
  bookTitle: {
    pl: string;
    en: string;
  };
  image?: string;
  color?: string;
}

interface ExcerptCardProps {
  excerpt: Excerpt;
  lang: Locale;
}

export default function ExcerptCard({ excerpt, lang }: ExcerptCardProps) {
  const text = excerpt.text[lang];
  const bookTitle = excerpt.bookTitle[lang];
  const bgColor = excerpt.color || '#2a332a';

  // If there's no text, display as a full image card (for Instagram/Facebook posts)
  if (!text || text.trim() === '') {
    return (
      <Link
        href={`/${lang}/books/${excerpt.book}`}
        className="group block break-inside-avoid mb-6"
      >
        <div className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg">
          <img
            src={excerpt.image}
            alt={bookTitle}
            className="w-full h-auto object-contain"
          />
          {/* Hover effect overlay */}
          <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#ffbd59] transition-all duration-300 pointer-events-none rounded-lg" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}/books/${excerpt.book}`}
      className="group block break-inside-avoid mb-6"
    >
      <div
        className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        style={{ backgroundColor: bgColor }}
      >
        {/* Optional background image with overlay */}
        {excerpt.image && (
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <img
              src={excerpt.image}
              alt={bookTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative p-8">
          {/* Quote Icon */}
          <div className="text-white/30 text-6xl font-serif mb-4 leading-none">&ldquo;</div>

          {/* Quote Text */}
          <blockquote className="text-white text-lg md:text-xl leading-relaxed font-serif italic mb-6">
            {text}
          </blockquote>

          {/* Book Attribution */}
          <footer className="border-t border-white/20 pt-4">
            <cite className="text-white/80 text-sm not-italic block">
              {lang === 'pl' ? 'Fragment z książki:' : 'Excerpt from:'}
            </cite>
            <cite className="text-white font-semibold text-base not-italic block mt-1 group-hover:text-[#ffbd59] transition-colors">
              {bookTitle}
            </cite>
          </footer>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#ffbd59] transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
