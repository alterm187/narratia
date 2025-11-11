'use client';

import { useState, useEffect } from 'react';
import { Dictionary, Locale } from '@/types/i18n';

interface NewsletterModalProps {
  dict: Dictionary;
  lang: Locale;
  trigger: 'book-detail' | 'essay-download';
}

export default function NewsletterModal({ dict, lang, trigger }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Check if modal has been shown before
    const hasSeenModal = localStorage.getItem('narratia-newsletter-modal-shown');

    if (hasSeenModal) {
      return; // Don't show if already seen
    }

    // Show modal after a short delay when navigating to book detail
    if (trigger === 'book-detail') {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('narratia-newsletter-modal-shown', 'true');
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }

    // Show immediately for essay download
    if (trigger === 'essay-download') {
      setIsOpen(true);
      localStorage.setItem('narratia-newsletter-modal-shown', 'true');
    }
  }, [trigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setMessage({
        type: 'error',
        text: lang === 'pl'
          ? 'Musisz wyrazić zgodę na przetwarzanie danych osobowych.'
          : 'You must consent to data processing.'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lang,
          leadMagnetType: 'chapters', // Default to chapters download
          source: 'modal-popup',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: dict.newsletter?.modal?.success || 'Dziękujemy za zapis!'
        });

        // Redirect to download page after 2 seconds
        setTimeout(() => {
          window.location.href = `/${lang}/download/chapters`;
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || (lang === 'pl'
            ? 'Coś poszło nie tak. Spróbuj ponownie.'
            : 'Something went wrong. Please try again.')
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: lang === 'pl'
          ? 'Nie udało się połączyć z serwerem.'
          : 'Failed to connect to server.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={lang === 'pl' ? 'Zamknij' : 'Close'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#191919] mb-2">
            {dict.newsletter?.modal?.title || 'Nie żebym się narzucał...'}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {dict.newsletter?.modal?.description ||
              'ale jeśli zapiszesz się na listę mailową to dostaniesz możliwość pobrania darmowych rozdziałów i innych materiałów...'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'pl' ? 'Imię (opcjonalnie)' : 'First Name (optional)'}
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffbd59] focus:border-transparent transition-all"
              placeholder={lang === 'pl' ? 'Jan' : 'John'}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'pl' ? 'Adres email' : 'Email address'} *
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffbd59] focus:border-transparent transition-all"
              placeholder={lang === 'pl' ? 'jan@example.com' : 'john@example.com'}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-[#ffbd59] focus:ring-[#ffbd59]"
            />
            <label htmlFor="consent" className="text-sm text-gray-600">
              {lang === 'pl'
                ? 'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu wysyłki newslettera.'
                : 'I consent to the processing of my personal data for the purpose of sending newsletters.'}
            </label>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || message?.type === 'success'}
            className="w-full bg-[#ffbd59] text-[#191919] py-3 px-6 font-bold rounded-md hover:bg-[#ffa629] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? (lang === 'pl' ? 'Zapisywanie...' : 'Subscribing...')
              : (dict.newsletter?.modal?.button || (lang === 'pl' ? 'Zapisz się' : 'Subscribe'))
            }
          </button>
        </form>

        {/* Privacy note */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          {lang === 'pl'
            ? 'Wyślę aktualizacje kilka razy w roku o promocjach i nowych treściach.'
            : 'I will send updates a few times a year about promotions and new content.'}
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
