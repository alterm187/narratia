import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import { getAllBooks, getBookBySlug } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateMetaTags, generateBookSchema } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const books = await getAllBooks();
  const params: { lang: Locale; slug: string }[] = [];

  books.forEach((book) => {
    params.push({ lang: 'en', slug: book.slug.en });
    params.push({ lang: 'pl', slug: book.slug.pl });
  });

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  const book = await getBookBySlug(slug, lang);

  if (!book) {
    return {};
  }

  return generateMetaTags({
    title: `${book.title[lang]} - Sebastian Proba`,
    description: book.description[lang],
    locale: lang,
    pathname: `/books/${slug}`,
    image: book.coverImage,
    type: 'book',
  });
}

export default async function BookPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const book = await getBookBySlug(slug, lang);

  if (!book) {
    notFound();
  }

  const bookSchema = generateBookSchema(book, lang);
  const ebookLinks = book.buyLinks.ebook;
  const printLinks = book.buyLinks.print;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />

      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-white">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Book cover */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-100">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title[lang]}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                  <span className="text-9xl font-bold text-zinc-400">
                    {book.title[lang].charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Book details */}
            <div className="flex flex-col">
              <div className="mb-4 flex flex-wrap gap-2">
                {book.formats.map((format) => (
                  <span
                    key={format}
                    className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600"
                  >
                    {dict.books.formats[format]}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                {book.title[lang]}
              </h1>

              {book.subtitle?.[lang] && (
                <p className="mt-2 text-xl text-zinc-600">{book.subtitle[lang]}</p>
              )}

              <p className="mt-6 text-lg leading-8 text-zinc-600">
                {book.description[lang]}
              </p>

              {/* Buy Links */}
              <div className="mt-8 space-y-6">
                {ebookLinks.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                      {dict.books.formats.ebook}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {ebookLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                        >
                          {link.displayName || link.platform}
                          {link.price && ` - ${link.price}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {printLinks.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                      {dict.books.formats.print}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {printLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
                        >
                          {link.displayName || link.platform}
                          {link.price && ` - ${link.price}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Testimonials */}
              {book.testimonials && book.testimonials.length > 0 && (
                <div className="mt-12">
                  <h3 className="mb-6 text-2xl font-semibold text-zinc-900">
                    {lang === 'pl' ? 'Opinie czytelników' : 'Reader Reviews'}
                  </h3>
                  <div className="space-y-4">
                    {book.testimonials
                      .filter((t) => t.language === lang)
                      .map((testimonial, index) => (
                        <blockquote
                          key={index}
                          className="border-l-4 border-zinc-200 pl-4 italic text-zinc-600"
                        >
                          "{testimonial.quote}"
                          {testimonial.author && (
                            <footer className="mt-2 text-sm font-medium text-zinc-900">
                              — {testimonial.author}
                            </footer>
                          )}
                        </blockquote>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16">
            <Link
              href={`/${lang}/books`}
              className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              ← {dict.common.backToHome}
            </Link>
          </div>
        </div>
      </main>

      <Footer dict={dict} />
    </>
  );
}
