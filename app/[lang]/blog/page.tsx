import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/BlogPostCard';
import { getAllBlogPosts, getFeaturedBlogPosts, getBlogCategories } from '@/lib/blog';
import { generateMetaTags } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  return generateMetaTags({
    title: lang === 'pl' ? 'Blog - Narratia' : 'Blog - Narratia',
    description: lang === 'pl'
      ? 'Myśli o pisaniu, książkach, filozofii i sztucznej inteligencji.'
      : 'Thoughts on writing, books, philosophy, and artificial intelligence.',
    locale: lang,
    pathname: '/blog',
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedBlogPosts(1);
  const regularPosts = allPosts.filter(post => !post.featured);

  return (
    <>
      <Header dict={dict} lang={lang} />

      <main className="min-h-screen bg-gradient-to-b from-[#f1ede9] via-white to-[#f1ede9]/30">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-[#191919] mb-6 tracking-tight">
              {lang === 'pl' ? 'Blog' : 'Blog'}
            </h1>
            <p className="text-xl md:text-2xl text-[#2a332a]/80 max-w-3xl mx-auto leading-relaxed">
              {lang === 'pl'
                ? 'Myśli o pisaniu, książkach, filozofii i sztucznej inteligencji'
                : 'Thoughts on writing, books, philosophy, and artificial intelligence'}
            </p>
          </div>

          {/* Featured Post */}
          {featuredPosts.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-[#ffbd59]"></div>
                <h2 className="text-3xl font-bold text-[#191919]">
                  {lang === 'pl' ? 'Wyróżniony wpis' : 'Featured Post'}
                </h2>
              </div>
              <BlogPostCard post={featuredPosts[0]} lang={lang} featured />
            </div>
          )}

          {/* All Posts Grid */}
          {regularPosts.length > 0 ? (
            <>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-[#ffbd59]"></div>
                <h2 className="text-3xl font-bold text-[#191919]">
                  {lang === 'pl' ? 'Wszystkie wpisy' : 'All Posts'}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} lang={lang} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-[#2a332a]/10">
              <p className="text-lg text-[#2a332a]/60">
                {lang === 'pl'
                  ? 'Wkrótce pojawią się nowe wpisy...'
                  : 'New posts coming soon...'}
              </p>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-br from-[#2a332a] to-[#191919] text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              {lang === 'pl'
                ? 'Nie przegap nowych wpisów'
                : "Don't Miss New Posts"}
            </h2>
            <p className="text-lg text-white/80 mb-6">
              {lang === 'pl'
                ? 'Dołącz do społeczności i otrzymuj powiadomienia o nowych artykułach.'
                : 'Join the community and get notified about new articles.'}
            </p>
            <a
              href={`/${lang}/download/essay`}
              className="inline-block bg-[#ffbd59] text-[#191919] px-8 py-4 font-bold hover:bg-white transition-all duration-300"
            >
              {lang === 'pl' ? 'Zapisz się i otrzymaj darmowy esej' : 'Subscribe & Get Free Essay'}
            </a>
          </div>
        </section>
      </main>

      <Footer dict={dict} lang={lang} />
    </>
  );
}
