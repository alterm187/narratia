'use client';

import { useState } from 'react';
import { Locale } from '@/types/i18n';

interface BookEmailSignupProps {
  bookId: string;
  bookTitle: string;
  lang: Locale;
  dict: any;
}

export default function BookEmailSignup({
  bookId,
  bookTitle,
  lang,
  dict,
}: BookEmailSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          language: lang,
          leadMagnet: 'book-updates',
          tags: [`book-${bookId}`, 'book-updates'],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: dict.books.emailSignup.success });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: dict.books.emailSignup.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: dict.books.emailSignup.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#ffbd59]/10 to-[#f1ede9]/20 p-8 border-2 border-[#ffbd59]/30">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-[#2a332a] mb-3">
          {dict.books.emailSignup.title}
        </h3>
        <p className="text-[#667c8b] mb-6">{dict.books.emailSignup.description}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.books.emailSignup.placeholder}
            required
            className="flex-1 px-4 py-3 border border-[#2a332a]/20 focus:border-[#ffbd59] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#191919] text-white font-semibold hover:bg-[#ffbd59] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading
              ? lang === 'pl'
                ? 'Wysyłanie...'
                : 'Sending...'
              : dict.books.emailSignup.button}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <p className="text-xs text-[#667c8b] mt-4">
          {lang === 'pl'
            ? 'Twoje dane są bezpieczne. Możesz wypisać się w każdej chwili.'
            : 'Your data is safe. You can unsubscribe at any time.'}
        </p>
      </div>
    </div>
  );
}
