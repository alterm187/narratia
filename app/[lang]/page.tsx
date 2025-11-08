import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import { getAllBooks } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import BookCard from '@/components/BookCard';
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

        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                {dict.home.featuredBooks.title}
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  dict={dict}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer dict={dict} />
    </>
  );
}
