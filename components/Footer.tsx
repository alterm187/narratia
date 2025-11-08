import { Dictionary } from '@/types/i18n';

interface FooterProps {
  dict: Dictionary;
}

export default function Footer({ dict }: FooterProps) {
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
              sebastian.narratia@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-zinc-600">
          {dict.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
