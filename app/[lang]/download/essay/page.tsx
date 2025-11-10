'use client';

import { useEffect, useState } from 'react';
import { Locale, Dictionary } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailSignupForm from '@/components/EmailSignupForm';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default function EssayDownloadPage({ params }: PageProps) {
  const [lang, setLang] = useState<Locale>('pl');
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const { getDictionary } = await import('@/lib/i18n-client');
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary);
    });
  }, [params]);

  if (!dict) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white flex items-center justify-center">
        <div className="text-[#2a332a]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Book Cover & Info */}
            <div>
              <div className="relative mb-6">
                <div className="absolute -top-4 -right-4 bg-[#ffbd59] text-[#191919] px-4 py-2 font-bold text-sm shadow-lg rotate-3 z-10">
                  {lang === 'pl' ? 'DARMOWY ESEJ' : 'FREE ESSAY'}
                </div>
                <img
                  src="/books/Odbicie - ebook cover.png"
                  alt={lang === 'pl' ? 'Odbicie umysłu' : 'Reflection of the Mind'}
                  className="w-full max-w-sm mx-auto shadow-2xl"
                />
              </div>

              <h1 className="text-4xl font-bold text-[#2a332a] mb-4">
                {lang === 'pl' ? 'Odbicie umysłu' : 'Reflection of the Mind'}
              </h1>

              <p className="text-xl text-[#2a332a]/70 mb-6 italic">
                {lang === 'pl'
                  ? 'Jak człowiek i AI przetłumaczyli razem wiersz Wordswortha'
                  : 'How human and AI translated Wordsworth\'s poem together'}
              </p>

              <p className="text-lg text-[#2a332a]/80 mb-6 leading-relaxed">
                {lang === 'pl'
                  ? 'Krótki esej o współpracy człowieka i AI w tłumaczeniu "Ody o przeczuciach nieśmiertelności" Williama Wordswortha. Fascynująca podróż przez granice kreatywności i technologii.'
                  : 'A short essay about human-AI collaboration in translating William Wordsworth\'s "Ode: Intimations of Immortality". A fascinating journey through the boundaries of creativity and technology.'}
              </p>

              <div className="bg-[#2a332a]/5 p-6 space-y-3 rounded-lg">
                <h3 className="font-bold text-[#2a332a]">
                  {lang === 'pl' ? 'Co otrzymasz:' : 'What you\'ll get:'}
                </h3>
                <ul className="space-y-2 text-[#2a332a]/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Pełny esej w formacie PDF' : 'Full essay in PDF format'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Wgląd w proces twórczy autora' : 'Insight into the author\'s creative process'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Ekskluzywne aktualizacje o nowych książkach' : 'Exclusive updates about new books'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffbd59] mt-1">✓</span>
                    <span>{lang === 'pl' ? 'Specjalne oferty dla czytelników' : 'Special offers for readers'}</span>
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
                <h2 className="text-2xl font-bold text-[#2a332a] mb-4">
                  {lang === 'pl' ? 'Pobierz za darmo' : 'Download for Free'}
                </h2>
                <p className="text-[#2a332a]/70 mb-6">
                  {lang === 'pl'
                    ? 'Zapisz się, aby otrzymać esej bezpośrednio na swój email. Żadnego spamu, tylko wartościowe treści.'
                    : 'Subscribe to receive the essay directly to your inbox. No spam, only valuable content.'}
                </p>
                <EmailSignupForm
                  variant="lead-magnet"
                  language={lang}
                  leadMagnet="essay"
                  onSuccess={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/${lang}/download/thank-you?type=essay`;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
