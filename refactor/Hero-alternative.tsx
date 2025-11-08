import Link from 'next/link';
import { Dictionary, Locale } from '@/types/i18n';

interface HeroProps {
  dict: Dictionary;
  lang: Locale;
}

export default function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#191919] py-20 sm:py-32">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="/books/hero_background1.png"
          alt=""
          className="w-full h-full object-cover object-right"
        />
      </div>

      {/* Gradient overlays for smooth transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#191919]/0 via-[#191919]/30 to-[#191919]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#191919] via-transparent to-[#191919]/80" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                className="inline-block bg-white text-[#191919] px-8 py-4 text-lg font-semibold hover:bg-[#ffbd59] hover:text-white transition-all duration-300 text-center shadow-lg hover:shadow-[#ffbd59]/50"
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

          {/* Integrated Circular Author Portrait - Right Side */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            {/* Portrait wrapper with merge effects */}
            <div className="hero-portrait-wrapper">
              {/* Ambient glow that merges with background */}
              <div className="hero-portrait-glow" />
              
              {/* Main portrait with decorative elements */}
              <div className="hero-portrait">
                {/* Golden gradient ring */}
                <div className="hero-portrait-ring-outer">
                  {/* Dark inner ring for contrast */}
                  <div className="hero-portrait-ring-inner">
                    {/* Actual image */}
                    <div className="hero-portrait-image-wrapper">
                      <img
                        src="/author/author.png"
                        alt="Sebastian Proba"
                        className="hero-portrait-image"
                      />
                      {/* Subtle gradient overlay */}
                      <div className="hero-portrait-overlay" />
                    </div>
                  </div>
                </div>

                {/* Decorative accent elements */}
                <div className="hero-portrait-accent hero-portrait-accent-1" />
                <div className="hero-portrait-accent hero-portrait-accent-2" />
                <div className="hero-portrait-accent hero-portrait-accent-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffbd59] to-transparent opacity-30" />
    </section>
  );
}
