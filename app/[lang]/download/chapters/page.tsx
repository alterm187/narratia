import { Locale } from '@/types/i18n';
import { getDictionary } from '@/lib/i18n';
import { getAllBooks } from '@/lib/books';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChaptersEmailForm from '@/components/ChaptersEmailForm';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ChaptersDownloadPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const allBooks = await getAllBooks();
  const regularBooks = allBooks.filter(book => book.id !== 'minds-reflection');

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Book Covers & Info */}
            <div>
              <h1 className="text-4xl font-bold text-[#2a332a] mb-4">
                {lang === 'pl' ? 'Darmowe fragmenty książek' : 'Free Chapter Samples'}
              </h1>

              <p className="text-xl text-[#2a332a]/70 mb-6">
                {lang === 'pl'
                  ? 'Pobierz pierwsze rozdziały ze wszystkich książek'
                  : 'Download first chapters from all books'}
              </p>

              <p className="text-lg text-[#2a332a]/80 mb-8 leading-relaxed">
                {lang === 'pl'
                  ? 'Nie jesteś pewien, która książka jest dla Ciebie? Pobierz darmowe fragmenty i przekonaj się sam. Otrzymasz pierwsze rozdziały ze wszystkich książek Narratia.'
                  : 'Not sure which book is for you? Download free samples and see for yourself. You\'ll receive first chapters from all Narratia books.'}
              </p>

              {/* Book Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {regularBooks.map((book) => (
                  <div key={book.id} className="relative group">
                    <img
                      src={book.coverImage}
                      alt={book.title[lang]}
                      className="w-full shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-[#2a332a]/5 p-6 space-y-3 rounded-lg">
                <h3 className="font-bold text-[#2a332a]">
                  {lang === 'pl' ? 'Co otrzymasz:' : 'What you\'ll get:'}
                </h3>
                <ul className="space-y-2 text-[#2a332a]/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Pierwsze rozdziały wszystkich książek (PDF)' : 'First chapters of all books (PDF)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Poznaj styl i tematykę każdej książki' : 'Discover the style and themes of each book'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Ekskluzywne aktualizacje o nowych książkach' : 'Exclusive updates about new books'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Specjalne oferty i promocje' : 'Special offers and promotions'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Możliwość zostania członkiem ARC team' : 'Opportunity to join ARC review team'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Signup Form */}
            <div>
              <div className="sticky top-6">
                <div className="relative mb-6">
                  <div className="absolute -top-4 -right-4 bg-[#ffbd59] text-[#191919] px-4 py-2 font-bold text-sm shadow-lg rotate-3 z-10">
                    {lang === 'pl' ? 'DARMOWE FRAGMENTY' : 'FREE SAMPLES'}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#2a332a] mb-4 mt-8">
                  {lang === 'pl' ? 'Pobierz za darmo' : 'Download for Free'}
                </h2>
                <p className="text-[#2a332a]/70 mb-6">
                  {lang === 'pl'
                    ? 'Zapisz się, aby otrzymać fragmenty bezpośrednio na swój email. Żadnego spamu, tylko wartościowe treści.'
                    : 'Subscribe to receive the samples directly to your inbox. No spam, only valuable content.'}
                </p>
                <ChaptersEmailForm lang={lang} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
