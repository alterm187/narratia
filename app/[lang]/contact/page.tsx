import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { generateMetaTags } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateMetaTags({
    title: `${dict.contact.title} - Narratia`,
    description: dict.contact.subtitle,
    locale: lang,
    pathname: '/contact',
    type: 'website',
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-[#f1ede9]">
        <div className="py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2a332a] mb-4">
              {dict.contact.title}
            </h1>
            <div className="w-20 h-1 bg-[#ffbd59] mb-4" />
            <p className="text-xl text-[#667c8b] font-light">{dict.contact.subtitle}</p>
          </div>
        </div>

        <div className="pb-20">
          <div className="container mx-auto max-w-2xl px-6">
            <ContactForm dict={dict} />

            <div className="mt-12 pt-12 border-t border-[#cbc5bd]">
              <h2 className="text-2xl font-bold text-[#2a332a] mb-4">
                {lang === 'pl' ? 'Inne sposoby kontaktu' : 'Other ways to reach me'}
              </h2>
              <div className="space-y-3">
                <p className="text-[#2a332a] font-light">
                  <strong className="font-semibold">Email:</strong>{' '}
                  <a
                    href="mailto:sebastian.narratia@gmail.com"
                    className="text-[#191919] hover:text-[#ffbd59] transition-colors"
                  >
                    sebastian.narratia@gmail.com
                  </a>
                </p>
                <p className="text-[#2a332a] font-light">
                  <strong className="font-semibold">Facebook:</strong>{' '}
                  <a
                    href="https://www.facebook.com/profile.php?id=61571652627363"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#191919] hover:text-[#ffbd59] transition-colors"
                  >
                    Sebastian Proba - Narratia
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
