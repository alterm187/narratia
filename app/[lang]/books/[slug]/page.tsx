import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import { getAllBooks, getBookBySlug } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateMetaTags, generateBookSchema } from '@/lib/seo';
import BookEmailSignup from '@/components/BookEmailSignup';
import BookPageWrapper from '@/components/BookPageWrapper';
import MarkdownContent from '@/components/MarkdownContent';

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

  // Don't show modal for lead magnet (free essay)
  const showModal = book.id !== 'minds-reflection';

  return (
    <BookPageWrapper dict={dict} lang={lang} showModal={showModal}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />

      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-[#f1ede9] relative">
        {/* Subtle background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
          style={{ backgroundImage: 'url(/books/hero_background2.png)' }}
        />

        <div className="container mx-auto max-w-6xl px-6 py-20 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            {/* Book cover - visible on all screen sizes */}
            <div className="relative aspect-[2/3] w-full max-w-[280px] mx-auto lg:mx-0">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title[lang]}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 60vw, (max-width: 1024px) 280px, 280px"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#cbc5bd] to-[#9aadb6]">
                  <span className="text-9xl font-bold text-[#2a332a] opacity-20">
                    {book.title[lang].charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Book details */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-[#2a332a] sm:text-5xl">
                {book.title[lang]}
              </h1>

              {book.subtitle?.[lang] && (
                <p className="mt-4 text-xl text-[#667c8b] font-light italic">{book.subtitle[lang]}</p>
              )}

              <div className="mt-6">
                <MarkdownContent
                  content={book.description[lang]}
                  className="text-lg leading-relaxed text-[#2a332a] font-light [&_p]:mb-4"
                />
              </div>

              {/* Buy Links */}
              <div className="mt-8 space-y-6">
                {ebookLinks.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-[#2a332a]">
                      {dict.books.formats.ebook}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {book.id === 'minds-reflection' ? (
                        // For the essay, redirect to signup page
                        <Link
                          href={`/${lang}/download/essay`}
                          className="inline-flex items-center bg-[#ffbd59] px-6 py-3 text-sm font-semibold text-[#191919] transition-all hover:bg-[#191919] hover:text-white"
                        >
                          {lang === 'pl' ? 'Pobierz za darmo' : 'Download for Free'}
                        </Link>
                      ) : (
                        // For regular books, show external links
                        ebookLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-[#191919] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ffbd59]"
                          >
                            {link.displayName || link.platform}
                            {link.price && ` - ${link.price}`}
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {printLinks.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-[#2a332a]">
                      {dict.books.formats.print}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {printLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center border-2 border-[#191919] bg-white px-6 py-3 text-sm font-semibold text-[#191919] transition-all hover:bg-[#191919] hover:text-white"
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
                  <h3 className="mb-6 text-2xl font-bold text-[#2a332a] handwritten">
                    {lang === 'pl' ? 'Opinie czytelników' : 'Reader Reviews'}
                  </h3>
                  <div className="space-y-6">
                    {book.testimonials
                      .filter((t) => t.language === lang)
                      .map((testimonial, index) => (
                        <blockquote
                          key={index}
                          className="bg-white/70 p-6 shadow-sm relative handwritten"
                        >
                          <div className="absolute top-4 left-4 text-6xl text-[#ffbd59] opacity-30 leading-none">"</div>
                          <p className="text-xl text-[#2a332a] leading-relaxed ml-8">
                            {testimonial.quote}
                          </p>
                          {testimonial.author && (
                            <footer className="mt-4 text-lg text-[#2a332a] text-right">
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

          {/* Email Signup Section */}
          <div className="mt-16">
            <BookEmailSignup
              bookId={book.id}
              bookTitle={book.title[lang]}
              lang={lang}
              dict={dict}
            />
          </div>

          <div className="mt-16">
            <Link
              href={`/${lang}/books`}
              className="inline-flex items-center text-sm font-semibold text-[#2a332a] hover:text-[#ffbd59] transition-colors"
            >
              ← {dict.common.backToHome}
            </Link>
          </div>
        </div>
      </main>

      <Footer dict={dict} lang={lang} />
    </BookPageWrapper>
  );
}
