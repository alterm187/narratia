'use client';

import { useState } from 'react';

interface EmailSignupFormProps {
  variant?: 'inline' | 'footer' | 'hero' | 'lead-magnet';
  leadMagnet?: 'essay' | 'chapters' | 'audio' | 'newsletter';
  language: 'pl' | 'en';
  onSuccess?: () => void;
  className?: string;
}

export default function EmailSignupForm({
  variant = 'inline',
  leadMagnet = 'newsletter',
  language,
  onSuccess,
  className = '',
}: EmailSignupFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
          firstName,
          language,
          leadMagnet,
          consent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
        setFirstName('');
        setConsent(false);

        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: language === 'pl'
          ? 'Wystąpił błąd. Spróbuj ponownie.'
          : 'An error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Variant-specific styles
  const containerStyles = {
    inline: 'bg-white/80 backdrop-blur-sm p-6 border border-[#2a332a]/10',
    footer: 'bg-[#2a332a] p-6 text-white',
    hero: 'bg-white/10 backdrop-blur-md p-6 border border-white/20 text-white',
    'lead-magnet': 'bg-gradient-to-br from-[#ffbd59]/10 to-[#f1ede9]/10 p-8 border-2 border-[#ffbd59]/30',
  };

  const buttonStyles = {
    inline: 'bg-[#191919] text-white hover:bg-[#ffbd59]',
    footer: 'bg-[#ffbd59] text-[#191919] hover:bg-white',
    hero: 'bg-white text-[#191919] hover:bg-[#ffbd59] hover:text-white',
    'lead-magnet': 'bg-[#ffbd59] text-[#191919] hover:bg-[#191919] hover:text-white',
  };

  const inputStyles = variant === 'footer' || variant === 'hero'
    ? 'bg-white/90 text-[#191919]'
    : 'bg-white';

  return (
    <div className={`${containerStyles[variant]} ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            {language === 'pl' ? 'Imię' : 'First Name'}
            <span className="text-xs opacity-70 ml-1">
              ({language === 'pl' ? 'opcjonalne' : 'optional'})
            </span>
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-4 py-2 border border-[#2a332a]/20 focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59] outline-none transition-all ${inputStyles}`}
            placeholder={language === 'pl' ? 'Jan' : 'John'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border border-[#2a332a]/20 focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59] outline-none transition-all ${inputStyles}`}
            placeholder={language === 'pl' ? 'twoj@email.pl' : 'your@email.com'}
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="consent"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 cursor-pointer"
          />
          <label htmlFor="consent" className="text-sm cursor-pointer">
            {language === 'pl'
              ? 'Wyrażam zgodę na otrzymywanie wiadomości email od Narratia. Mogę się wypisać w każdej chwili.'
              : 'I agree to receive emails from Narratia. I can unsubscribe at any time.'}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 font-semibold transition-all duration-300 ${buttonStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading
            ? (language === 'pl' ? 'Zapisywanie...' : 'Subscribing...')
            : (language === 'pl' ? 'Zapisz się' : 'Subscribe')}
        </button>

        {message && (
          <div className={`p-3 text-sm rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
