'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Dictionary, Locale } from '@/types/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  dict: Dictionary;
  lang: Locale;
  slugPl?: string;
  slugEn?: string;
}

export default function Header({ dict, lang, slugPl, slugEn }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/books`, label: dict.nav.books },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/fragmenty`, label: dict.nav.fragmenty },
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
          {/* Desktop Navigation */}
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

          <LanguageSwitcher currentLang={lang} slugPl={slugPl} slugEn={slugEn} />

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              // Close icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <ul className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block text-base font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
