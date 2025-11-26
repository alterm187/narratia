import 'server-only';
import type { Locale } from '@/types/i18n';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  pl: () => import('@/dictionaries/pl.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

export const defaultLocale: Locale = 'pl';
export const locales: Locale[] = ['en', 'pl'];

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] as Locale;
  return locales.includes(locale) ? locale : defaultLocale;
}

export function getPathnameWithoutLocale(pathname: string, locale: Locale): string {
  // Only remove locale if it's at the start of the pathname
  if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
    return pathname.replace(`/${locale}`, '') || '/';
  }
  return pathname;
}
