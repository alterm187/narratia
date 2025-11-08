import Link from 'next/link';
import { Dictionary, Locale } from '@/types/i18n';

interface HeroProps {
  dict: Dictionary;
  lang: Locale;
}

export default function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white py-20 sm:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            {dict.home.hero.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            {dict.home.hero.subtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href={`/${lang}/books`}
              className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 transition-colors"
            >
              {dict.home.hero.cta.allBooks}
            </Link>
            <Link
              href={`/${lang}/about`}
              className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              {dict.about.title}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-zinc-200 to-zinc-400 opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  );
}
