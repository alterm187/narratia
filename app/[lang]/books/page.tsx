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

      <main className="min-h-screen bg-white">
        <div className="border-b bg-zinc-50 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              {dict.books.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600">
              {dict.books.subtitle}
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
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
