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
            {/* Left: Book Cover */}
            <div>
              <div className="relative">
                <div className="absolute -top-4 -right-4 bg-[#ffbd59] text-[#191919] px-4 py-2 font-bold text-sm shadow-lg rotate-3 z-10">
                  {lang === 'pl' ? 'DARMOWY ESEJ' : 'FREE ESSAY'}
                </div>
                <img
                  src="/books/Odbicie - ebook cover.png"
                  alt={lang === 'pl' ? 'Odbicie umysłu' : 'Reflection of the Mind'}
                  className="w-full max-w-sm mx-auto shadow-2xl"
                />
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
