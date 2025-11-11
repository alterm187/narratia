// NOTE: This page is currently disabled as all books are displayed on the main page.
// The page is kept for potential SEO benefits - to be decided.
// If re-enabled, uncomment the code below.

/*
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import { getAllBooks } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateMetaTags } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateMetaTags({
    title: `${dict.books.title} - Narratia`,
    description: dict.books.subtitle,
    locale: lang,
    pathname: '/books',
    type: 'website',
  });
}

export default async function BooksPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const allBooks = await getAllBooks();

  // Separate lead magnet from regular books
  const leadMagnet = allBooks.find(book => book.id === 'minds-reflection');
  const regularBooks = allBooks.filter(book => book.id !== 'minds-reflection');

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen">
        {/* Hero Section *\/}
        <section className="bg-gradient-to-br from-[#191919] to-[#2a332a] py-16 sm:py-20">
          <div className="container mx-auto max-w-[800px] px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                {dict.books.title}
              </h1>
              <p className="text-xl text-[#f1ede9] font-light leading-relaxed">
                {dict.books.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Lead Magnet - Featured Prominently *\/}
        {leadMagnet && (
          <section className="bg-[#ffbd59] py-16">
            <div className="container mx-auto max-w-[800px] px-6">
              <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                <div className="relative max-w-[213px] mx-auto">
                  <div className="relative aspect-[2/3] shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    {leadMagnet.coverImage && (
                      <img
                        src={leadMagnet.coverImage}
                        alt={leadMagnet.title[lang]}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-[#191919] text-white px-4 py-2 font-bold text-sm shadow-lg">
                    {lang === 'pl' ? 'DARMOWY' : 'FREE'}
                  </div>
                </div>

                <div className="text-[#191919]">
                  <div className="inline-block bg-[#191919] text-white px-3 py-1 text-xs font-bold uppercase mb-4">
                    {lang === 'pl' ? 'Lead Magnet' : 'Lead Magnet'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                    {leadMagnet.title[lang]}
                  </h2>
                  {leadMagnet.subtitle?.[lang] && (
                    <p className="text-xl mb-4 font-light italic opacity-90">
                      {leadMagnet.subtitle[lang]}
                    </p>
                  )}
                  <p className="text-lg leading-relaxed mb-6 font-light">
                    {leadMagnet.description[lang]}
                  </p>
                  <Link
                    href={`/${lang}/books/${leadMagnet.slug[lang]}`}
                    className="inline-flex items-center gap-2 bg-[#191919] text-white px-6 py-3 font-bold hover:bg-[#2a332a] transition-all duration-300 shadow-lg group"
                  >
                    {lang === 'pl' ? 'Pobierz za darmo' : 'Download for Free'}
                    <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Books - Grid Layout *\/}
        <section className="bg-gradient-to-b from-[#f1ede9] to-[#e5dfd7] py-20">
          <div className="container mx-auto max-w-[800px] px-6">
            {regularBooks.length > 0 && (
              <>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#2a332a] mb-4">
                    {lang === 'pl' ? 'Wszystkie Książki' : 'All Books'}
                  </h2>
                  <div className="w-16 h-1 bg-[#ffbd59] mx-auto" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-4xl mx-auto">
                  {regularBooks.map((book) => (
                    <Link
                      key={book.id}
                      href={`/${lang}/books/${book.slug[lang]}`}
                      className="group block max-w-[213px] mx-auto"
                    >
                      <div className="relative">
                        {/* Shadow *\/}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a332a]/20 to-transparent blur-xl scale-95 translate-y-4 opacity-40 group-hover:opacity-60 transition-opacity" />

                        {/* Book Cover *\/}
                        <div className={`relative aspect-[2/3] shadow-xl overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl ${
                          book.id !== 'stick-and-carrot' && book.id !== 'lustra-ktorych-nie-mamy' ? 'bg-white' : ''
                        }`}>
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title[lang]}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#cbc5bd] to-[#9aadb6]">
                              <span className="text-8xl font-bold text-[#2a332a] opacity-20">
                                {book.title[lang].charAt(0)}
                              </span>
                            </div>
                          )}

                          {/* Overlay *\/}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#191919]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white font-semibold text-sm flex items-center gap-2">
                              {dict.common.readMore}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Book Info *\/}
                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-[#2a332a] mb-2 group-hover:text-[#ffbd59] transition-colors">
                          {book.title[lang]}
                        </h3>
                        {book.subtitle?.[lang] && (
                          <p className="text-sm text-[#667c8b] font-light italic mb-2">
                            {book.subtitle[lang]}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {book.formats.map((format) => (
                            <span
                              key={format}
                              className="px-2 py-1 bg-white/60 text-[#2a332a] text-xs font-medium border border-[#2a332a]/10"
                            >
                              {dict.books.formats[format]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
*/

// Temporary placeholder - redirect to home
import { redirect } from 'next/navigation';
import { Locale } from '@/types/i18n';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function BooksPage({ params }: PageProps) {
  const { lang } = await params;
  redirect(`/${lang}`);
}
