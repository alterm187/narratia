export interface Book {
  id: string;
  slug: {
    en: string;
    pl: string;
  };
  title: {
    en: string;
    pl: string;
  };
  subtitle?: {
    en?: string;
    pl?: string;
  };
  description: {
    en: string;
    pl: string;
  };
  coverImage: string;
  formats: ('ebook' | 'print' | 'audiobook')[];
  publishedDate: {
    en?: string;
    pl?: string;
  };
  isbn?: {
    ebook?: string;
    print?: string;
    asin?: string;
  };
  genre: string[];
  buyLinks: {
    ebook: BuyLink[];
    print: BuyLink[];
  };
  testimonials?: Testimonial[];
  sampleUrl?: string;
  featured?: boolean;
  pageCount?: number;
  goodreadsUrl?: string;
  rating?: {
    average: number;
    count: number;
  };
  chapterSample?: {
    title: {
      pl: string;
      en: string;
    };
  };
  dualLanguageDisplay?: boolean;
  dualLanguage?: {
    plCoverImage: string;
    enCoverImage: string;
    buyLinks?: {
      ebook: BuyLink[];
      print: BuyLink[];
    };
  };
}
}

export interface BuyLink {
  platform: string;
  url: string;
  price?: string;
  region?: 'PL' | 'US' | 'UK' | 'global';
  displayName?: string;
}

export interface Testimonial {
  quote: string;
  author?: string;
  source?: string;
  language: 'en' | 'pl';
}

export type Language = 'en' | 'pl';

export interface BookMetadata {
  totalCount: number;
  languages: Language[];
}
