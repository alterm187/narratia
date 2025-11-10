import { Locale } from '@/types/i18n';
import { getBookReviews, formatReviewDate } from '@/lib/reviews';

interface ReviewsSectionProps {
  bookId: string;
  lang: Locale;
  dict: any;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-[#ffbd59]' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-[#2a332a] font-medium w-8">{rating}★</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#ffbd59] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[#667c8b] w-8 text-right">{count}</span>
    </div>
  );
}

export default function ReviewsSection({ bookId, lang, dict }: ReviewsSectionProps) {
  const bookReviews = getBookReviews(bookId);

  if (!bookReviews || bookReviews.reviews.length === 0) {
    return null;
  }

  const { reviews, summary } = bookReviews;

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-white/80 backdrop-blur-sm p-8 border border-[#2a332a]/10">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-[#2a332a] mb-2">
              {summary.averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(summary.averageRating)} />
            <div className="mt-2 text-sm text-[#667c8b]">
              {lang === 'pl' ? 'Na podstawie' : 'Based on'} {summary.totalReviews}{' '}
              {lang === 'pl'
                ? summary.totalReviews === 1
                  ? 'opinii'
                  : 'opinii'
                : summary.totalReviews === 1
                ? 'review'
                : 'reviews'}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution]}
                total={summary.totalReviews}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white/50 backdrop-blur-sm p-6 border border-[#2a332a]/10 hover:border-[#ffbd59]/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <StarRating rating={review.rating} />
                  {review.verified && (
                    <span className="text-xs bg-[#ffbd59]/20 text-[#2a332a] px-2 py-1 font-semibold">
                      {lang === 'pl' ? 'Zweryfikowany zakup' : 'Verified Purchase'}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-[#2a332a] text-lg mb-1">
                  {review.title[lang]}
                </h4>
                <div className="text-sm text-[#667c8b]">
                  {review.author[lang]} • {formatReviewDate(review.date, lang)}
                </div>
              </div>
            </div>

            <p className="text-[#2a332a] leading-relaxed mb-4">
              {review.content[lang]}
            </p>

            <div className="flex items-center gap-4 text-sm text-[#667c8b]">
              <button className="hover:text-[#ffbd59] transition-colors">
                👍 {lang === 'pl' ? 'Pomocne' : 'Helpful'} ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
