import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/types/book';
import { Dictionary, Locale } from '@/types/i18n';
import MarkdownContent from '@/components/MarkdownContent';

interface BookCardProps {
  book: Book;
  dict: Dictionary;
  lang: Locale;
}

export default function BookCard({ book, dict, lang }: BookCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:shadow-lg">
      <Link href={`/${lang}/books/${book.slug[lang]}`} className="relative aspect-[2/3] overflow-hidden bg-white max-h-[400px]">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title[lang]}
            fill
            className="object-contain transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 300px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
            <span className="text-4xl font-bold text-zinc-400">
              {book.title[lang].charAt(0)}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/${lang}/books/${book.slug[lang]}`}>
          <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
            {book.title[lang]}
          </h3>
        </Link>

        {book.subtitle?.[lang] && (
          <p className="mt-1 text-sm text-zinc-500">{book.subtitle[lang]}</p>
        )}

        <div className="mt-3 line-clamp-3 text-sm text-zinc-600">
          <MarkdownContent content={book.description[lang]} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {book.formats.map((format) => (
            <span
              key={format}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
            >
              {dict.books.formats[format]}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            href={`/${lang}/books/${book.slug[lang]}`}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            {dict.common.readMore}
          </Link>
        </div>
      </div>
    </div>
  );
}
