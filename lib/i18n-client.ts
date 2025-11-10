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
