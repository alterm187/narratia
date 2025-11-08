import Link from 'next/link';
import { Dictionary, Locale } from '@/types/i18n';

interface HeroProps {
  dict: Dictionary;
  lang: Locale;
}

export default function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#191919] py-20 sm:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="/books/hero_background1.png"
          alt=""
          className="w-full h-full object-cover object-right"
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <div className="text-left">
            <div className="decorative-text text-[#ffbd59] text-2xl mb-4">
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
                className="inline-block bg-white text-[#191919] px-8 py-4 text-lg font-semibold hover:bg-[#ffbd59] hover:text-white transition-all duration-300 text-center"
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

          {/* Author Image - Right Side */}
          <div className="relative hidden lg:block">
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src="/author/author.png"
                alt="Sebastian Proba"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#23190e] opacity-30" />
    </section>
  );
}
