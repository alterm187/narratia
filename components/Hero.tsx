import Link from 'next/link';
import { Dictionary, Locale } from '@/types/i18n';

interface HeroProps {
  dict: Dictionary;
  lang: Locale;
}

export default function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#191919] to-[#23190e] py-20 sm:py-32">
      {/* Background pattern - more visible */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/books/hero_background1.png"
          alt=""
          className="w-full h-full object-cover object-right"
        />
      </div>

      {/* Lighter radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#191919]/30" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content - Left Side */}
          <div className="text-left order-2 lg:order-1">
            <div className="decorative-text text-[#ffbd59] text-2xl mb-4 font-light tracking-wide">
              Narratia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {dict.home.hero.title}
            </h1>

            <p className="text-xl sm:text-2xl text-[#f1ede9] font-light leading-relaxed mb-10 max-w-2xl">
              {dict.home.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${lang}/books`}
                className="inline-block bg-white text-[#191919] px-8 py-4 text-lg font-semibold hover:bg-[#ffbd59] hover:text-white transition-all duration-300 text-center shadow-lg hover:shadow-xl"
              >
                {dict.home.hero.cta.allBooks}
              </Link>

              <Link
                href={`/${lang}/about`}
                className="inline-block border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-[#191919] transition-all duration-300 text-center"
              >
                {dict.about.title}
              </Link>
            </div>
          </div>

          {/* Circular Author Portrait - Right Side with Merge Effect */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glowing halo effect behind portrait */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffbd59]/30 via-[#ffbd59]/10 to-transparent blur-3xl scale-110" />

              {/* Secondary glow for depth */}
              <div className="absolute inset-0 rounded-full bg-[#ffbd59]/20 blur-2xl scale-105 animate-pulse"
                   style={{ animationDuration: '3s' }} />

              {/* Main circular portrait container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Decorative ring - outer */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffbd59] via-[#f1ede9] to-[#cbc5bd] p-1 shadow-2xl">
                  {/* Inner ring */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#191919] to-[#23190e] p-1">
                    {/* Image container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                      <img
                        src="/author/author.png"
                        alt="Sebastian Proba"
                        className="w-full h-full object-cover object-center scale-110 grayscale-0 hover:scale-115 transition-transform duration-700"
                      />

                      {/* Subtle overlay gradient for better blending */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#191919]/20 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Accent dots/sparkles around the portrait */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#ffbd59] rounded-full animate-pulse"
                     style={{ animationDelay: '0s', animationDuration: '2s' }} />
                <div className="absolute top-8 -right-4 w-2 h-2 bg-[#f1ede9] rounded-full animate-pulse"
                     style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
                <div className="absolute -bottom-2 right-12 w-2.5 h-2.5 bg-[#ffbd59]/60 rounded-full animate-pulse"
                     style={{ animationDelay: '1s', animationDuration: '3s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffbd59] to-transparent opacity-30" />
    </section>
  );
}
