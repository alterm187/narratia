import { Dictionary, Locale } from '@/types/i18n';
import EmailSignupForm from './EmailSignupForm';

interface FooterProps {
  dict: Dictionary;
  lang?: Locale;
}

export default function Footer({ dict, lang = 'pl' }: FooterProps) {
  return (
    <footer className="border-t bg-zinc-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">Narratia</h3>
            <p className="text-sm text-zinc-600">
              Sebastian Proba
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900">{dict.footer.social}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61571652627363"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="mailto:sebastian.narratia@gmail.com"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900">{dict.nav.books}</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>E-books</li>
              <li>Print</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900">{dict.about.contact}</h4>
            <p className="text-sm text-zinc-600">
              sebastian@narratia.pl
            </p>
          </div>
        </div>

        {/* Email Newsletter Signup */}
        <div className="border-t border-zinc-200 pt-12 mt-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-[#2a332a] mb-2 text-center">
              {lang === 'pl' ? 'Dołącz do społeczności' : 'Join the Community'}
            </h3>
            <p className="text-sm text-[#2a332a]/70 mb-6 text-center">
              {dict.newsletter?.cta?.footer || (lang === 'pl'
                ? 'Dołącz do fanów nawet jeśli jeszcze nie jesteś fanem :) Zapisz się na listę mailową a otrzymasz dodatkowe możliwości...'
                : 'Join the fans even if you\'re not a fan yet :) Sign up for the mailing list and you\'ll get additional perks...')}
            </p>
            <EmailSignupForm
              variant="inline"
              language={lang}
              leadMagnet="newsletter"
            />
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-zinc-600">
          {dict.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
