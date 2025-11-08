import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import { getAllBooks } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
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
  const books = await getAllBooks();

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-[#f1ede9]">
        {/* Hero Section with Background */}
        <div className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: 'url(/books/hero_background1.png)' }}
          />

          {/* Content */}
          <div className="container mx-auto max-w-6xl px-6 relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2a332a] mb-4">
              {dict.books.title}
            </h1>
            <div className="w-20 h-1 bg-[#ffbd59] mb-4" />
            <p className="text-xl text-[#667c8b] font-light">
              {dict.books.subtitle}
            </p>
          </div>
        </div>

        <section className="pb-20">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
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
