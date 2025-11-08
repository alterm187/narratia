export type Locale = 'en' | 'pl';

export interface Dictionary {
  nav: {
    home: string;
    books: string;
    about: string;
    contact: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: {
        latestBook: string;
        allBooks: string;
      };
    };
    featuredBooks: {
      title: string;
      viewAll: string;
    };
  };
  books: {
    title: string;
    subtitle: string;
    formats: {
      ebook: string;
      print: string;
      audiobook: string;
    };
    buyNow: string;
    readSample: string;
    availableFormats: string;
  };
  about: {
    title: string;
    contact: string;
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
    };
  };
  footer: {
    copyright: string;
    social: string;
  };
  common: {
    readMore: string;
    learnMore: string;
    backToHome: string;
  };
}
