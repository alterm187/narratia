import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "../globals.css";
import type { Locale } from "@/types/i18n";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export async function generateStaticParams() {
  return [{ lang: 'en' as const }, { lang: 'pl' as const }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: Locale };

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      >
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
