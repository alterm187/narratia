import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  formatBlogDate,
  calculateReadingTime,
  getRecentBlogPosts,
} from '@/lib/blog';
import { generateMetaTags, generateArticleSchema } from '@/lib/seo';
import Link from 'next/link';
import BlogPostCard from '@/components/BlogPostCard';
import MarkdownContent from '@/components/MarkdownContent';

interface PageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();

  const params = posts.flatMap((post) => [
    { lang: 'pl' as Locale, slug: post.slug },
    { lang: 'en' as Locale, slug: post.slug },
  ]);

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return generateMetaTags({
      title: lang === 'pl' ? 'Wpis nie znaleziony' : 'Post not found',
      description: '',
      locale: lang,
      pathname: `/blog/${slug}`,
    });
  }

  return generateMetaTags({
    title: `${post.title[lang]} - Blog - Narratia`,
    description: post.excerpt[lang],
    locale: lang,
    pathname: `/blog/${slug}`,
    image: post.coverImage,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <>
        <Header dict={dict} lang={lang} />
        <main className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white py-20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-[#2a332a] mb-4">
              {lang === 'pl' ? 'Wpis nie znaleziony' : 'Post not found'}
            </h1>
            <p className="text-[#2a332a]/70 mb-8">
              {lang === 'pl'
                ? 'Przepraszamy, ale ten wpis nie istnieje.'
                : 'Sorry, this post does not exist.'}
            </p>
            <Link
              href={`/${lang}/blog`}
              className="inline-block bg-[#191919] text-white px-6 py-3 font-semibold hover:bg-[#ffbd59] transition-all duration-300"
            >
              {lang === 'pl' ? 'Wróć do bloga' : 'Back to Blog'}
            </Link>
          </div>
        </main>
        <Footer dict={dict} lang={lang} />
      </>
    );
  }

  const title = post.title[lang];
  const content = post.content[lang];
  const formattedDate = formatBlogDate(post.date, lang);
  const readingTime = calculateReadingTime(content);
  const recentPosts = getRecentBlogPosts(4).filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = generateArticleSchema(
    title,
    post.excerpt[lang],
    post.date,
    lang,
    `/blog/${slug}`,
    post.coverImage
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-gradient-to-b from-[#f1ede9] to-white">
        {/* Hero Section with Cover Image */}
        {post.coverImage && (
          <div className="relative h-[400px] bg-[#2a332a] overflow-hidden">
            <img
              src={post.coverImage}
              alt={title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a332a] to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <article className="container mx-auto px-6 max-w-4xl">
          <div className={`${post.coverImage ? '-mt-32' : 'pt-20'} relative z-10`}>
            {/* Article Header */}
            <header className="bg-white p-8 md:p-12 shadow-xl mb-8 rounded-lg">
              <div className="flex items-center gap-3 text-sm text-[#2a332a]/70 font-medium mb-4">
                <time dateTime={post.date}>{formattedDate}</time>
                <span>•</span>
                <span>
                  {readingTime} {lang === 'pl' ? 'min czytania' : 'min read'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#191919] mb-6 leading-tight">
                {title}
              </h1>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 bg-[#ffbd59]/30 text-[#2a332a] font-medium rounded-full hover:bg-[#ffbd59]/50 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Body */}
            <div className="bg-white p-8 md:p-12 shadow-lg mb-12 rounded-lg">
              <div className="!text-[#191919]
                [&_h1]:!text-[#191919] [&_h1]:!font-bold
                [&_h2]:!text-[#2a332a] [&_h2]:!font-bold
                [&_h3]:!text-[#2a332a] [&_h3]:!font-bold
                [&_p]:!text-[#191919] [&_p]:!leading-relaxed
                [&_a]:!text-[#ffbd59] [&_a]:!font-semibold [&_a]:!no-underline hover:[&_a]:!underline
                [&_strong]:!text-[#191919] [&_strong]:!font-bold
                [&_ul]:!text-[#191919] [&_ol]:!text-[#191919]
                [&_li]:!text-[#191919] [&_li]:!leading-relaxed
                [&_blockquote]:!border-l-4 [&_blockquote]:!border-[#ffbd59] [&_blockquote]:!bg-[#f1ede9]/50 [&_blockquote]:!py-2 [&_blockquote]:!px-4 [&_blockquote]:!text-[#191919]
                [&_code]:!text-[#2a332a] [&_code]:!bg-[#f1ede9] [&_code]:!px-2 [&_code]:!py-1 [&_code]:!rounded
                [&_pre]:!bg-[#2a332a] [&_pre]:!text-white [&_pre_code]:!text-white">
                <MarkdownContent content={content} />
              </div>
            </div>

            {/* Share & Back to Blog */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 p-6 bg-white rounded-lg border border-[#2a332a]/10 shadow-sm">
              <Link
                href={`/${lang}/blog`}
                className="flex items-center gap-2 text-[#2a332a] hover:text-[#ffbd59] font-semibold transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {lang === 'pl' ? 'Wróć do bloga' : 'Back to Blog'}
              </Link>

              <div className="text-sm text-[#2a332a]/70">
                {lang === 'pl'
                  ? 'Udostępnij ten wpis swoim znajomym'
                  : 'Share this post with your friends'}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {recentPosts.length > 0 && (
          <section className="bg-[#f1ede9]/50 py-16">
            <div className="container mx-auto px-6 max-w-6xl">
              <h2 className="text-3xl font-bold text-[#2a332a] mb-8">
                {lang === 'pl' ? 'Inne wpisy' : 'Other Posts'}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recentPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.slug} post={relatedPost} lang={lang} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#ffbd59]/20 to-[#f1ede9]/20 py-16">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-[#2a332a] mb-4">
              {lang === 'pl' ? 'Podobał Ci się ten wpis?' : 'Did You Like This Post?'}
            </h2>
            <p className="text-lg text-[#2a332a]/80 mb-8">
              {lang === 'pl'
                ? 'Zapisz się na newsletter i otrzymaj darmowy esej "Odbicie umysłu"'
                : 'Subscribe to the newsletter and get a free essay "Reflection of the Mind"'}
            </p>
            <a
              href={`/${lang}/download/essay`}
              className="inline-block bg-[#191919] text-white px-8 py-4 font-bold hover:bg-[#ffbd59] hover:text-[#191919] transition-all duration-300"
            >
              {lang === 'pl' ? 'Pobierz darmowy esej' : 'Download Free Essay'}
            </a>
          </div>
        </section>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
