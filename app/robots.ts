import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://narratia.pl';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/download/thank-you/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
