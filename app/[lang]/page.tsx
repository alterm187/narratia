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
  const books = await getAllBooks();

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main>
        <Hero dict={dict} lang={lang} />

        {/* Books Section - Canva Style with Alternating Backgrounds */}
        <section className="bg-[#f1ede9] py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2a332a] mb-4">
                {dict.home.featuredBooks.title}
              </h2>
              <div className="w-20 h-1 bg-[#ffbd59]" />
            </div>

            <div className="space-y-20">
              {books.map((book, index) => (
                <div
                  key={book.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Book Image */}
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="aspect-[2/3] bg-gradient-to-br from-[#cbc5bd] to-[#9aadb6] shadow-2xl max-w-sm mx-auto">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title[lang]}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-9xl font-bold text-[#2a332a] opacity-20">
                            {book.title[lang].charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <h3 className="text-3xl sm:text-4xl font-bold text-[#2a332a] mb-4">
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

                    <div className="flex flex-wrap gap-3 mb-8">
                      {book.formats.map((format) => (
                        <span
                          key={format}
                          className="px-4 py-2 bg-white text-[#2a332a] text-sm font-medium shadow-sm"
                        >
                          {dict.books.formats[format]}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/${lang}/books/${book.slug[lang]}`}
                      className="inline-block bg-[#191919] text-white px-8 py-3 font-semibold hover:bg-[#ffbd59] transition-all duration-300"
                    >
                      {dict.common.readMore}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider" />

        {/* Author Bio Teaser */}
        <section className="bg-[#cbc5bd] py-20">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <p className="text-2xl sm:text-3xl text-[#2a332a] font-light italic leading-relaxed">
              "{lang === 'pl'
                ? 'Pisanie to nie zawód, to wewnętrzna potrzeba.'
                : 'Writing is not a profession, it\'s an inner need.'}"
            </p>
            <Link
              href={`/${lang}/about`}
              className="inline-block mt-8 text-[#2a332a] font-semibold hover:text-[#ffbd59] transition-colors underline"
            >
              {dict.about.title} →
            </Link>
          </div>
        </section>
      </main>

      <Footer dict={dict} />
    </>
  );
}
