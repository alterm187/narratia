import Link from 'next/link';
import { Dictionary, Locale } from '@/types/i18n';

interface HeroProps {
  dict: Dictionary;
  lang: Locale;
}

export default function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-stone-50 to-white py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative accent */}
          <div className="mx-auto mb-6 h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" />

          <h1 className="text-5xl font-bold tracking-tight text-stone-900 sm:text-7xl bg-clip-text">
            {dict.home.hero.title}
          </h1>

          <p className="mt-8 text-xl leading-8 text-stone-600 font-light">
            {dict.home.hero.subtitle}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/books`}
              className="group w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                {dict.home.hero.cta.allBooks}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              href={`/${lang}/about`}
              className="w-full sm:w-auto rounded-xl border-2 border-stone-300 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-semibold text-stone-900 shadow-md hover:bg-white hover:border-amber-500 hover:shadow-lg transition-all duration-300"
            >
              {dict.about.title}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20">
          <div
            className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-amber-300 via-orange-300 to-amber-200"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMy4zMTQtMi42ODYtNi02LTZzLTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2IDYtMi42ODYgNi02ek0zNiA0NGMwLTMuMzE0LTIuNjg2LTYtNi02cy02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>
    </section>
  );
}
