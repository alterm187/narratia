import { Book } from '@/types/book';
import { Locale } from '@/types/i18n';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://narratia.pl';

export interface BookSchema {
  '@context': string;
  '@type': string;
  name: string;
  author: {
    '@type': string;
    name: string;
    url: string;
  };
  description: string;
  inLanguage: string;
  genre: string[];
  bookFormat?: string;
  isbn?: string;
  url: string;
  image?: string;
  offers?: Array<{
    '@type': string;
    price?: string;
    priceCurrency?: string;
    availability: string;
    url: string;
    seller: {
      '@type': string;
      name: string;
    };
  }>;
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

export interface AuthorSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  sameAs: string[];
  worksFor?: {
    '@type': string;
    name: string;
  };
}

export function generateBookSchema(book: Book, locale: Locale): BookSchema {
  const bookUrl = `${siteUrl}/${locale}/books/${book.slug[locale]}`;

  const schema: BookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title[locale],
    author: {
      '@type': 'Person',
      name: 'Sebastian Proba',
      url: siteUrl,
    },
    description: book.description[locale],
    inLanguage: locale === 'pl' ? 'pl-PL' : 'en-US',
    genre: book.genre,
    url: bookUrl,
  };

  // Add cover image if available
  if (book.coverImage) {
    schema.image = `${siteUrl}${book.coverImage}`;
  }

  // Add ISBN if available
  if (book.isbn?.ebook || book.isbn?.print) {
    schema.isbn = book.isbn.ebook || book.isbn.print;
  }

  // Add book format
  if (book.formats.includes('ebook')) {
    schema.bookFormat = 'EBook';
  } else if (book.formats.includes('print')) {
    schema.bookFormat = 'Paperback';
  }

  // Add offers/buy links
  const allOffers = [...book.buyLinks.ebook, ...book.buyLinks.print];
  if (allOffers.length > 0) {
    schema.offers = allOffers.map(link => ({
      '@type': 'Offer',
      price: link.price?.replace(/[^\d.]/g, ''),
      priceCurrency: link.price?.includes('PLN') ? 'PLN' : undefined,
      availability: 'https://schema.org/InStock',
      url: link.url,
      seller: {
        '@type': 'Organization',
        name: link.displayName || link.platform,
      },
    }));
  }

  // Add aggregate rating if testimonials exist
  if (book.testimonials && book.testimonials.length > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: book.testimonials.length.toString(),
    };
  }

  return schema;
}

export function generateAuthorSchema(): AuthorSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sebastian Proba',
    url: siteUrl,
    sameAs: [
      'https://www.facebook.com/profile.php?id=61571652627363',
      // Add more social profiles as needed
    ],
  };
}

export function generateHreflangTags(pathname: string): Array<{ hrefLang: string; href: string }> {
  const locales: Locale[] = ['en', 'pl'];

  return locales.map(locale => ({
    hrefLang: locale,
    href: `${siteUrl}/${locale}${pathname}`,
  }));
}

export interface MetaTagsOptions {
  title: string;
  description: string;
  locale: Locale;
  pathname: string;
  image?: string;
  type?: 'website' | 'article' | 'book';
}

export function generateMetaTags(options: MetaTagsOptions) {
  const { title, description, locale, pathname, image, type = 'website' } = options;
  const url = `${siteUrl}/${locale}${pathname}`;
  const imageUrl = image ? `${siteUrl}${image}` : `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Narratia - Sebastian Proba',
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteUrl}/en${pathname}`,
        'pl': `${siteUrl}/pl${pathname}`,
        'x-default': `${siteUrl}/pl${pathname}`,
      },
    },
  };
}
