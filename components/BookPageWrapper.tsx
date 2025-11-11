'use client';

import { Dictionary, Locale } from '@/types/i18n';
import NewsletterModal from './NewsletterModal';

interface BookPageWrapperProps {
  children: React.ReactNode;
  dict: Dictionary;
  lang: Locale;
  showModal?: boolean;
}

export default function BookPageWrapper({ children, dict, lang, showModal = true }: BookPageWrapperProps) {
  return (
    <>
      {children}
      {showModal && <NewsletterModal dict={dict} lang={lang} trigger="book-detail" />}
    </>
  );
}
