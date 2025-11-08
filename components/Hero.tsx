import Link from 'next/link';
import { Dictionary, Locale } from '@/types/i18n';

interface HeroProps {
  dict: Dictionary;
  lang: Locale;
}

export default function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#191919] to-[#23190e] py-16 sm:py-20 lg:py-24 min-h-[75vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-50">
        <img
          src="/books/hero_background2.png"
          alt=""
          className="w-full h-full object-cover object-right-bottom"
        />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#191919]/30" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-left order-2 lg:order-1">
            <div className="decorative-text text-[#ffbd59] text-xl mb-3 font-light tracking-wide">
              Narratia
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {dict.home.hero.title}
            </h1>

            <p className="text-lg sm:text-xl text-[#f1ede9] font-light leading-relaxed mb-8 max-w-2xl">
              {dict.home.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${lang}/books`}
                className="inline-block bg-white text-[#191919] px-6 py-3 text-base font-semibold hover:bg-[#ffbd59] hover:text-white transition-all duration-300 text-center shadow-lg hover:shadow-xl"
              >
                {dict.home.hero.cta.allBooks}
              </Link>

              <Link
                href={`/${lang}/about`}
                className="inline-block border-2 border-white text-white px-6 py-3 text-base font-semibold hover:bg-white hover:text-[#191919] transition-all duration-300 text-center"
              >
                {dict.about.title}
              </Link>
            </div>
          </div>

          {/* Author Portrait - Subtle & Elegant */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Subtle glow - single layer */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffbd59]/15 via-[#ffbd59]/5 to-transparent blur-3xl scale-110" />

              {/* Portrait container */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffbd59] via-[#f1ede9] to-[#cbc5bd] p-1 shadow-2xl">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#191919] to-[#23190e] p-1">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                      <img
                        src="/author/author.png"
                        alt="Sebastian Proba"
                        className="w-full h-full object-cover object-center scale-110 hover:scale-115 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#191919]/20 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-[#ffbd59] opacity-70"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffbd59] to-transparent opacity-30" />
    </section>
  );
}
