import { MetadataRoute } from 'next';
import { getAllBooks } from '@/lib/books';
import { getAllBlogPosts } from '@/lib/blog';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://narratia.pl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getAllBooks();
  const blogPosts = getAllBlogPosts();

  // Homepage for both languages
  const homePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pl`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Book pages for both languages
  const bookPages: MetadataRoute.Sitemap = books.flatMap((book) => [
    {
      url: `${baseUrl}/pl/books/${book.slug.pl}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/books/${book.slug.en}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]);

  // Books index pages
  const booksIndexPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pl/books`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/books`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Blog posts (currently Polish only, but including both URL variants)
  const blogPostPages: MetadataRoute.Sitemap = blogPosts.flatMap((post) => [
    {
      url: `${baseUrl}/pl/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]);

  // Blog index pages
  const blogIndexPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pl/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // About pages
  const aboutPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pl/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Contact pages
  const contactPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pl/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  // Fragmenty pages (excerpts - Polish only)
  const fragmentyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pl/fragmenty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Download pages (lead magnets)
  const downloadPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pl/download/essay`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/download/essay`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pl/download/chapters`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/download/chapters`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return [
    ...homePages,
    ...booksIndexPages,
    ...bookPages,
    ...blogIndexPages,
    ...blogPostPages,
    ...aboutPages,
    ...contactPages,
    ...fragmentyPages,
    ...downloadPages,
  ];
}
