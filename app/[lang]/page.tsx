import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import { getAllBooks } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { generateMetaTags } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateMetaTags({
    title: `${dict.home.hero.title} - Narratia`,
    description: dict.home.hero.subtitle,
    locale: lang,
    pathname: '/',
    type: 'website',
  });
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const allBooks = await getAllBooks();

  // Separate lead magnet (essay) from regular books
  const leadMagnet = allBooks.find(book => book.id === 'minds-reflection');
  const regularBooks = allBooks.filter(book => book.id !== 'minds-reflection');

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main>
        <Hero dict={dict} lang={lang} />

        {/* Books Section - Elegant Floating Design */}
        <section className="bg-gradient-to-b from-[#f1ede9] to-[#e5dfd7] py-20">
          <div className="container mx-auto max-w-[800px] px-6">
            <div className="mb-16 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2a332a] mb-4">
                {dict.home.featuredBooks.title}
              </h2>
              <div className="w-20 h-1 bg-[#ffbd59] mx-auto" />
            </div>

            <div className="space-y-24">
              {regularBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="group relative"
                >
                  <div className={`grid lg:grid-cols-2 gap-9 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                  }`}>
                    {/* Book Cover - Simple Display */}
                    <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div
                        className="relative max-w-[230px] mx-auto"
                        style={{
                          transform: book.id === 'stick-and-carrot'
                            ? 'translateX(-20%)'
                            : book.id === 'lustra-ktorych-nie-mamy'
                            ? 'translateY(-20%)'
                            : undefined
                        }}
                      >
                        {/* Book cover */}
                        <div className="relative aspect-[2/3]">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title[lang]}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#cbc5bd] to-[#9aadb6]">
                              <span className="text-9xl font-bold text-[#2a332a] opacity-20">
                                {book.title[lang].charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                      <h3 className="text-3xl sm:text-4xl font-bold text-[#2a332a] mb-3 group-hover:text-[#ffbd59] transition-colors duration-300">
                        {book.title[lang]}
                      </h3>

                      {book.subtitle?.[lang] && (
                        <p className="text-xl text-[#667c8b] mb-6 font-light italic">
                          {book.subtitle[lang]}
                        </p>
                      )}

                      <p className="text-lg text-[#2a332a] leading-relaxed mb-6 font-light">
                        {book.description[lang]}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Magnet Section - Special Treatment for Essay */}
        {leadMagnet && (
          <section className="relative bg-gradient-to-br from-[#191919] via-[#2a332a] to-[#191919] py-20 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="container relative z-10 mx-auto max-w-[800px] px-6">
              <div className="grid lg:grid-cols-5 gap-9 items-center">
                {/* Book Cover - Spotlight Effect */}
                <div className="lg:col-span-2">
                  <div className="relative max-w-[160px] mx-auto">
                    {/* Spotlight glow */}
                    <div className="absolute inset-0 bg-[#ffbd59]/20 blur-3xl scale-110 animate-pulse" style={{ animationDuration: '3s' }} />

                    <div className="relative aspect-[2/3] shadow-2xl transform hover:scale-105 transition-transform duration-500">
                      {leadMagnet.coverImage && (
                        <img
                          src={leadMagnet.coverImage}
                          alt={leadMagnet.title[lang]}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-4 -right-4 bg-[#ffbd59] text-[#191919] px-4 py-2 font-bold text-sm shadow-lg rotate-3">
                      {lang === 'pl' ? 'DARMOWY ESEJ' : 'FREE ESSAY'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 text-white">
                  <div className="inline-block bg-[#ffbd59] text-[#191919] px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
                    {lang === 'pl' ? 'Lead Magnet' : 'Lead Magnet'}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    {leadMagnet.title[lang]}
                  </h2>

                  {leadMagnet.subtitle?.[lang] && (
                    <p className="text-xl text-[#f1ede9] mb-6 font-light italic">
                      {leadMagnet.subtitle[lang]}
                    </p>
                  )}

                  <p className="text-lg text-[#f1ede9] leading-relaxed mb-8 font-light">
                    {leadMagnet.description[lang]}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/${lang}/books/${leadMagnet.slug[lang]}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#ffbd59] text-[#191919] px-8 py-4 font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl group"
                    >
                      {lang === 'pl' ? 'Pobierz za darmo' : 'Download for Free'}
                      <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </Link>

                    <Link
                      href={`/${lang}/books/${leadMagnet.slug[lang]}`}
                      className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-[#191919] transition-all duration-300"
                    >
                      {dict.common.readMore}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Author Bio Teaser */}
        <section className="bg-[#cbc5bd] py-20">
          <div className="container mx-auto max-w-[800px] px-6 text-center">
            <p className="text-2xl sm:text-3xl text-[#2a332a] font-light italic leading-relaxed">
              "{lang === 'pl'
                ? 'Pisanie to nie zawód, to wewnętrzna potrzeba.'
                : 'Writing is not a profession, it\'s an inner need.'}"
            </p>
            <Link
              href={`/${lang}/about`}
              className="inline-flex items-center gap-2 mt-8 text-[#2a332a] font-semibold hover:text-[#ffbd59] transition-colors group"
            >
              {dict.about.title}
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer dict={dict} />
    </>
  );
}
