import Link from 'next/link';
import { Dictionary, Locale } from '@/types/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  dict: Dictionary;
  lang: Locale;
}

export default function Header({ dict, lang }: HeaderProps) {
  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/books`, label: dict.nav.books },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href={`/${lang}`}
          className="text-xl font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
        >
          Narratia
        </Link>

        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <LanguageSwitcher currentLang={lang} />
        </div>

        {/* Mobile menu button - will implement later if needed */}
      </nav>
    </header>
  );
}
