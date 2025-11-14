import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateMetaTags, generateAuthorSchema } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateMetaTags({
    title: `${dict.about.title} - Narratia`,
    description: dict.home.hero.subtitle,
    locale: lang,
    pathname: '/about',
    type: 'website',
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const authorSchema = generateAuthorSchema();

  const bioContent = {
    pl: {
      question: "Kiedy człowiek może o sobie powiedzieć, że jest pisarzem?",
      content: [
        "Może wtedy, gdy pisanie jest dla niego sposobem na życie albo pracą? Na pewno musi się najpierw przekonać, że nie jest po prostu grafomanem.",
        "Miałem silną wewnętrzną potrzebę opowiadania o tym, co ważne i to stało się dla mnie swego rodzaju pasją. Przekonałem się też, nie bez zdziwienia, że publikacja powieści jest w pewnym sensie pożegnaniem autora z tym co wytworzył. Resztę tworzą czytelnicy. To w nich książka może wywołać reakcję: ziewanie, oburzenie, fascynację, zaciekawienie. To oni mogą dać się wciągnąć przez dobrze napisaną historię albo dać się rozczarować przez tą kiepską. To czytelnicy tworzą pisarza.",
      ],
    },
    en: {
      question: "When can someone say they are a writer?",
      content: [
        "Writing is not a profession, it's an inner need. When a story demands to be told, when characters begin to live their own lives, that's when you know you must write.",
        "Publication is the moment of saying goodbye to a work. From that moment, the book belongs to the readers. They decide on its true meaning and impact.",
        "In my books, I explore the boundaries between what is human and what is artificial. I ask about consciousness, loneliness, and connection. These are questions that fascinate me as a writer and as a human being.",
      ],
    },
  };

  const bio = bioContent[lang];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-[#f1ede9]">
        <div className="py-20">
          <div className="container mx-auto max-w-6xl px-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2a332a] mb-4">
              {dict.about.title}
            </h1>
            <div className="w-20 h-1 bg-[#ffbd59] mb-12" />

            <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
              {/* Author Photo */}
              <div className="relative">
                <div className="aspect-square rounded-lg shadow-xl overflow-hidden max-w-[300px] mx-auto lg:mx-0">
                  <img
                    src="/books/Seba_Narratia.png"
                    alt="Sebastian Proba"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bio Content */}
              <div>
                <h2 className="text-3xl font-bold text-[#2a332a] mb-6">
                  Sebastian Proba
                </h2>

                <p className="text-xl font-light italic text-[#667c8b] mb-6">
                  {bio.question}
                </p>

                {bio.content.map((paragraph, index) => (
                  <p key={index} className="mt-4 text-lg text-[#2a332a] leading-relaxed font-light">
                    {paragraph}
                  </p>
                ))}

                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-[#2a332a] mb-4">
                    {dict.about.contact}
                  </h3>
                  <div className="space-y-3">
                    <p className="text-[#2a332a] font-light">
                      <strong className="font-semibold">Email:</strong>{' '}
                      <a
                        href="mailto:sebastian@narratia.pl"
                        className="text-[#191919] hover:text-[#ffbd59] transition-colors"
                      >
                        sebastian@narratia.pl
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
