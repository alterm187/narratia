'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Locale } from '@/types/i18n';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

function ThankYouContent({ params }: PageProps) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'essay' or 'chapters'
  const [lang, setLang] = useState<Locale>('pl');

  useEffect(() => {
    params.then((p) => setLang(p.lang));
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#2a332a] mb-4">
            {lang === 'pl' ? 'Dziękuję!' : 'Thank You!'}
          </h1>
          <p className="text-xl text-[#2a332a]/80">
            {lang === 'pl'
              ? 'Sprawdź swoją skrzynkę email - właśnie wysłałem Ci materiały do pobrania.'
              : 'Check your inbox - I just sent you the download materials.'}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-lg border border-[#2a332a]/10 mb-8">
          <h2 className="text-xl font-bold text-[#2a332a] mb-4">
            {lang === 'pl' ? 'Co dalej?' : 'What\'s Next?'}
          </h2>
          <ul className="space-y-3 text-left text-[#2a332a]/80">
            <li className="flex items-start gap-3">
              <span className="text-[#ffbd59] mt-1 font-bold">1.</span>
              <span>
                {lang === 'pl'
                  ? 'Sprawdź folder "Spam" jeśli email nie dotarł w ciągu kilku minut'
                  : 'Check your spam folder if the email doesn\'t arrive within a few minutes'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#ffbd59] mt-1 font-bold">2.</span>
              <span>
                {lang === 'pl'
                  ? 'W ciągu najbliższych dni otrzymasz więcej informacji o moich książkach'
                  : 'In the coming days you\'ll receive more information about my books'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#ffbd59] mt-1 font-bold">3.</span>
              <span>
                {lang === 'pl'
                  ? 'Możesz odpowiedzieć na każdy email - chętnie porozmawiam!'
                  : 'You can reply to any email - I\'d love to chat!'}
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${lang}/books`}
            className="inline-block bg-[#191919] text-white px-8 py-3 font-semibold hover:bg-[#ffbd59] transition-all duration-300"
          >
            {lang === 'pl' ? 'Zobacz wszystkie książki' : 'View All Books'}
          </Link>
          <Link
            href={`/${lang}`}
            className="inline-block border-2 border-[#191919] text-[#191919] px-8 py-3 font-semibold hover:bg-[#191919] hover:text-white transition-all duration-300"
          >
            {lang === 'pl' ? 'Wróć na stronę główną' : 'Back to Homepage'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white flex items-center justify-center">
        <div className="text-[#2a332a]">Loading...</div>
      </div>
    }>
      <ThankYouContent params={params} />
    </Suspense>
  );
}
