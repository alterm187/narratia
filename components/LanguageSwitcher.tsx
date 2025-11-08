'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/types/i18n';

interface LanguageSwitcherProps {
  currentLang: Locale;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLang: Locale) => {
    if (!pathname) return;

    // Remove current language from pathname
    const pathWithoutLang = pathname.replace(/^\/(en|pl)/, '');

    // Navigate to new language
    router.push(`/${newLang}${pathWithoutLang}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1">
      <button
        onClick={() => switchLanguage('pl')}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
          currentLang === 'pl'
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-600 hover:text-zinc-900'
        }`}
        aria-label="Switch to Polish"
      >
        PL
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
          currentLang === 'en'
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-600 hover:text-zinc-900'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
