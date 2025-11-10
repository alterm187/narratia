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
        className="group block bg-gradient-to-br from-[#ffbd59]/10 to-[#f1ede9]/10 border-2 border-[#ffbd59]/30 hover:border-[#ffbd59] transition-all duration-300 overflow-hidden"
      >
        {post.coverImage && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={post.coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 bg-[#ffbd59] text-[#191919] px-3 py-1 text-sm font-bold">
              {lang === 'pl' ? 'WYRÓŻNIONY' : 'FEATURED'}
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-[#2a332a]/60 mb-3">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>•</span>
            <span>
              {readingTime} {lang === 'pl' ? 'min czytania' : 'min read'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#2a332a] mb-3 group-hover:text-[#ffbd59] transition-colors">
            {title}
          </h2>
          <p className="text-[#2a332a]/80 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[#ffbd59] font-semibold">
            <span>{lang === 'pl' ? 'Czytaj więcej' : 'Read more'}</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
      className="group block bg-white/80 backdrop-blur-sm border border-[#2a332a]/10 hover:border-[#ffbd59] hover:shadow-lg transition-all duration-300 overflow-hidden"
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
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-[#2a332a]/60 mb-3">
          <time dateTime={post.date}>{formattedDate}</time>
          <span>•</span>
          <span>
            {readingTime} {lang === 'pl' ? 'min' : 'min'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#2a332a] mb-2 group-hover:text-[#ffbd59] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-[#2a332a]/70 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-[#2a332a]/5 text-[#2a332a]/70 rounded"
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
