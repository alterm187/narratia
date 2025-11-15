import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExcerptCard, { Excerpt } from '@/components/ExcerptCard';
import { generateMetaTags } from '@/lib/seo';
import fs from 'fs';
import path from 'path';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  return generateMetaTags({
    title: lang === 'pl' ? 'Fragmenty - Narratia' : 'Excerpts - Narratia',
    description: lang === 'pl'
      ? '... po prostu'
      : '... simply',
    locale: lang,
    pathname: '/fragmenty',
  });
}

function getExcerpts(): Excerpt[] {
  try {
    const excerptsPath = path.join(process.cwd(), 'content', 'excerpts', 'excerpts.json');
    if (!fs.existsSync(excerptsPath)) {
      return [];
    }
    const fileContent = fs.readFileSync(excerptsPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading excerpts:', error);
    return [];
  }
}

export default async function FragmentyPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const excerpts = getExcerpts();

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2a332a] mb-6">
              {lang === 'pl' ? 'Fragmenty' : 'Excerpts'}
            </h1>
            <p className="text-xl text-[#2a332a]/70 max-w-2xl mx-auto leading-relaxed">
              {lang === 'pl'
                ? '... po prostu'
                : '... simply'}
            </p>
          </div>

          {/* Masonry Grid */}
          {excerpts.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {excerpts.map((excerpt) => (
                <ExcerptCard key={excerpt.id} excerpt={excerpt} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#2a332a]/60">
              <p className="text-lg">
                {lang === 'pl'
                  ? 'Wkrótce pojawią się fragmenty z książek...'
                  : 'Excerpts from books coming soon...'}
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#2a332a] to-[#191919] text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {lang === 'pl' ? 'Spodobały Ci się te fragmenty?' : 'Did You Like These Excerpts?'}
              </h2>
              <p className="text-lg text-white/80">
                {lang === 'pl'
                  ? 'Odkryj pełne historie w moich książkach.'
                  : 'Discover the full stories in my books.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/${lang}/books`}
                className="inline-block bg-[#ffbd59] text-[#191919] px-8 py-4 font-bold text-center hover:bg-white transition-all duration-300"
              >
                {lang === 'pl' ? 'Zobacz wszystkie książki' : 'View All Books'}
              </a>
              <a
                href={`/${lang}/download/essay`}
                className="inline-block border-2 border-white text-white px-8 py-4 font-bold text-center hover:bg-white hover:text-[#191919] transition-all duration-300"
              >
                {lang === 'pl' ? 'Pobierz darmowy esej' : 'Download Free Essay'}
              </a>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="bg-white/80 backdrop-blur-sm p-8 border border-[#2a332a]/10 text-center">
            <h3 className="text-2xl font-bold text-[#2a332a] mb-4">
              {lang === 'pl' ? 'Chcesz więcej?' : 'Want More?'}
            </h3>
            <p className="text-[#2a332a]/70 mb-6">
              {lang === 'pl'
                ? 'Zapisz się na newsletter, aby otrzymywać nowe fragmenty, aktualizacje o książkach i ekskluzywne treści.'
                : 'Subscribe to the newsletter to receive new excerpts, book updates, and exclusive content.'}
            </p>
            <a
              href={`/${lang}/download/essay`}
              className="inline-block bg-[#191919] text-white px-8 py-3 font-semibold hover:bg-[#ffbd59] hover:text-[#191919] transition-all duration-300"
            >
              {lang === 'pl' ? 'Zapisz się teraz' : 'Subscribe Now'}
            </a>
          </div>
        </section>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
