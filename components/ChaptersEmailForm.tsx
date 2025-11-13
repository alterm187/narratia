'use client';

import EmailSignupForm from '@/components/EmailSignupForm';
import { Locale } from '@/types/i18n';

interface ChaptersEmailFormProps {
  lang: Locale;
}

export default function ChaptersEmailForm({ lang }: ChaptersEmailFormProps) {
  return (
    <EmailSignupForm
      variant="lead-magnet"
      language={lang}
      leadMagnet="chapters"
      onSuccess={() => {
        if (typeof window !== 'undefined') {
          window.location.href = `/${lang}/download/thank-you?type=chapters`;
        }
      }}
    />
  );
}
