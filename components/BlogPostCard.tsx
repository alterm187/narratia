import Link from 'next/link';
import { BlogPost, formatBlogDate, calculateReadingTime } from '@/lib/blog';
import { Locale } from '@/types/i18n';

interface BlogPostCardProps {
  post: BlogPost;
  lang: Locale;
  featured?: boolean;
}

export default function BlogPostCard({ post, lang, featured = false }: BlogPostCardProps) {
  const title = post.title[lang];
  const excerpt = post.excerpt[lang];
  const content = post.content[lang];
  const formattedDate = formatBlogDate(post.date, lang);
  const readingTime = calculateReadingTime(content);

  if (featured) {
    return (
      <Link
        href={`/${lang}/blog/${post.slug}`}
        className="group block bg-white border-2 border-[#ffbd59] hover:border-[#2a332a] hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-lg"
      >
        {post.coverImage && (
          <div className="relative h-80 overflow-hidden bg-[#f1ede9]">
            <img
              src={post.coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 bg-[#ffbd59] text-[#191919] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-lg">
              {lang === 'pl' ? 'Wyróżniony' : 'Featured'}
            </div>
          </div>
        )}
        <div className="p-8">
          <div className="flex items-center gap-3 text-sm text-[#2a332a]/70 font-medium mb-4">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>•</span>
            <span>
              {readingTime} {lang === 'pl' ? 'min czytania' : 'min read'}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#191919] mb-4 group-hover:text-[#ffbd59] transition-colors leading-tight">
            {title}
          </h2>
          <p className="text-[#2a332a]/90 text-lg leading-relaxed line-clamp-3 mb-6">
            {excerpt}
          </p>
          <div className="flex items-center gap-2 text-[#ffbd59] font-bold text-lg">
            <span>{lang === 'pl' ? 'Czytaj więcej' : 'Read more'}</span>
            <svg
              className="w-6 h-6 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="group block bg-white border border-[#2a332a]/10 hover:border-[#ffbd59] hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg h-full flex flex-col"
    >
      {post.coverImage && (
        <div className="relative h-48 overflow-hidden bg-[#f1ede9]">
          <img
            src={post.coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-xs text-[#2a332a]/70 font-medium mb-3">
          <time dateTime={post.date}>{formattedDate}</time>
          <span>•</span>
          <span>
            {readingTime} {lang === 'pl' ? 'min' : 'min'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#191919] mb-3 group-hover:text-[#ffbd59] transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-[#2a332a]/80 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-auto pt-4 border-t border-[#2a332a]/5 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-[#f1ede9] text-[#2a332a] font-medium rounded-full hover:bg-[#ffbd59]/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
