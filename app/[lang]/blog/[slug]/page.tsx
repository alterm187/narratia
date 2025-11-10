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
import { generateMetaTags } from '@/lib/seo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import BlogPostCard from '@/components/BlogPostCard';

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

  return (
    <>
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
            <header className="bg-white/95 backdrop-blur-sm p-8 md:p-12 shadow-xl mb-8">
              <div className="flex items-center gap-3 text-sm text-[#2a332a]/60 mb-4">
                <time dateTime={post.date}>{formattedDate}</time>
                <span>•</span>
                <span>
                  {readingTime} {lang === 'pl' ? 'min czytania' : 'min read'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#2a332a] mb-6 leading-tight">
                {title}
              </h1>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 bg-[#ffbd59]/20 text-[#2a332a] rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Body */}
            <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-lg mb-12">
              <div className="prose prose-lg max-w-none prose-headings:text-[#2a332a] prose-p:text-[#2a332a]/80 prose-a:text-[#ffbd59] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#2a332a] prose-ul:text-[#2a332a]/80 prose-ol:text-[#2a332a]/80">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </div>

            {/* Share & Back to Blog */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 p-6 bg-white/60 backdrop-blur-sm border border-[#2a332a]/10">
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

              <div className="text-sm text-[#2a332a]/60">
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
