import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import { getAllBooks } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateMetaTags } from '@/lib/seo';
import MarkdownContent from '@/components/MarkdownContent';

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

  // Put minds-reflection at the end
  const regularBooks = allBooks.filter(book => book.id !== 'minds-reflection');
  const mindsReflection = allBooks.find(book => book.id === 'minds-reflection');
  const sortedBooks = mindsReflection ? [...regularBooks, mindsReflection] : regularBooks;

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen">
        {/* Hero Section */}
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

        {/* Books Section - Elegant Floating Design */}
        <section className="bg-gradient-to-b from-[#f1ede9] to-[#e5dfd7] py-20">
          <div className="container mx-auto max-w-[800px] px-6">
            <div className="space-y-24">
              {sortedBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="group relative"
                >
                  {book.dualLanguageDisplay ? (
                    // Dual language book - special layout with covers side by side and text below
                    <div className="space-y-8">
                      {/* Two covers side by side */}
                      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        {/* Okładka aktywnego języka po lewej/górze */}
                        <div className={`relative ${lang === 'pl' ? 'w-[60%] sm:w-[35%] max-w-[200px]' : (book.dualLanguage?.enCoverImage ? 'w-[57%] sm:w-[33.25%] max-w-[190px]' : 'w-[60%] sm:w-[35%] max-w-[200px]')}`}>
                          <Link href={`/${lang}/books/${book.slug[lang]}`}>
                            <div className="relative aspect-[2/3] transition-transform duration-700 hover:scale-105" style={{ transform: 'translateY(-10%)' }}>
                              <img
                                src={lang === 'pl' ? book.dualLanguage?.plCoverImage || book.coverImage : book.dualLanguage?.enCoverImage || book.coverImage}
                                alt={book.title[lang]}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2a332a] text-white px-3 py-1 text-xs font-bold">
                            {lang.toUpperCase()}
                          </div>
                        </div>
                        {/* Okładka drugiego języka po prawej/dole (angielska okładka zawsze 10% mniejsza) */}
                        <div className={`relative ${lang === 'pl' ? (book.dualLanguage?.enCoverImage ? 'w-[57%] sm:w-[33.25%] max-w-[190px]' : 'w-[60%] sm:w-[35%] max-w-[200px]') : 'w-[60%] sm:w-[35%] max-w-[200px]'}`}>
                          <Link href={`/${lang}/books/${book.slug[lang]}`}>
                            <div className="relative aspect-[2/3] transition-transform duration-700 hover:scale-105" style={{ transform: 'translateY(-10%)' }}>
                              <img
                                src={lang === 'pl' ? book.dualLanguage?.enCoverImage || book.coverImage : book.dualLanguage?.plCoverImage || book.coverImage}
                                alt={lang === 'pl' ? book.title.en : book.title.pl}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2a332a] text-white px-3 py-1 text-xs font-bold">
                            {lang === 'pl' ? 'EN' : 'PL'}
                          </div>
                        </div>
                      </div>

                      {/* Text content below covers */}
                      <div className="text-center max-w-[600px] mx-auto">
                        <h3 className="text-3xl sm:text-4xl font-bold text-[#2a332a] mb-8 group-hover:text-[#ffbd59] transition-colors duration-300">
                          {book.title[lang]}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                          {book.formats.map((format) => (
                            <span
                              key={format}
                              className="px-4 py-1.5 bg-white/60 backdrop-blur-sm text-[#2a332a] text-sm font-medium border border-[#2a332a]/10 transition-all duration-300 hover:bg-white hover:border-[#ffbd59]"
                            >
                              {dict.books.formats[format]}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/${lang}/books/${book.slug[lang]}`}
                          className="inline-flex items-center gap-2 bg-[#191919] text-white px-6 py-3 font-semibold hover:bg-[#ffbd59] transition-all duration-300 group/btn"
                        >
                          {dict.common.readMore}
                          <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // Standard single-cover layout - direct on background
                    <div className="space-y-8">
                      {/* Single cover centered */}
                      <div className="flex justify-center">
                        <div className={`relative ${book.id === 'minds-reflection' ? 'w-[60%] sm:w-[35%] max-w-[200px]' : 'w-[60%] sm:w-[35%] max-w-[200px]'}`}>
                          <Link href={`/${lang}/books/${book.slug[lang]}`}>
                            <div className="relative aspect-[2/3] transition-transform duration-700 hover:scale-105" style={{ transform: 'translateY(-10%)' }}>
                              <img
                                src={book.coverImage}
                                alt={book.title[lang]}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Text content below cover */}
                      <div className="text-center max-w-[600px] mx-auto">
                        <h3 className="text-3xl sm:text-4xl font-bold text-[#2a332a] mb-8 group-hover:text-[#ffbd59] transition-colors duration-300">
                          {book.title[lang]}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                          {book.formats.map((format) => (
                            <span
                              key={format}
                              className="px-4 py-1.5 bg-white/60 backdrop-blur-sm text-[#2a332a] text-sm font-medium border border-[#2a332a]/10 transition-all duration-300 hover:bg-white hover:border-[#ffbd59]"
                            >
                              {dict.books.formats[format]}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/${lang}/books/${book.slug[lang]}`}
                          className="inline-flex items-center gap-2 bg-[#191919] text-white px-6 py-3 font-semibold hover:bg-[#ffbd59] transition-all duration-300 group/btn"
                        >
                          {dict.common.readMore}
                          <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
