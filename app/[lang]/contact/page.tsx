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

      <main className="min-h-screen bg-white">
        <div className="border-b bg-zinc-50 py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              {dict.contact.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600">{dict.contact.subtitle}</p>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto max-w-2xl px-4">
            <ContactForm dict={dict} />

            <div className="mt-12 border-t pt-12">
              <h2 className="text-lg font-semibold text-zinc-900">
                {lang === 'pl' ? 'Inne sposoby kontaktu' : 'Other ways to reach me'}
              </h2>
              <div className="mt-4 space-y-2">
                <p className="text-zinc-600">
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:sebastian.narratia@gmail.com"
                    className="text-zinc-900 hover:underline"
                  >
                    sebastian.narratia@gmail.com
                  </a>
                </p>
                <p className="text-zinc-600">
                  <strong>Facebook:</strong>{' '}
                  <a
                    href="https://www.facebook.com/profile.php?id=61571652627363"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-900 hover:underline"
                  >
                    Sebastian Proba - Narratia
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer dict={dict} />
    </>
  );
}
