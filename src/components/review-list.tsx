import { StarDisplay } from "@/components/star-rating";
import DeleteReviewButton from "@/components/delete-review-button";
import type { ReviewData } from "@/types/campground";

export default function ReviewList({
  campgroundId,
  reviews,
  currentUserId,
}: {
  campgroundId: string;
  reviews: ReviewData[];
  currentUserId?: string;
}) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-forest-200 bg-white p-6 text-sm text-forest-700/60">
        Belum ada ulasan — jadilah yang pertama!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {reviews.map((review) => (
        <li
          key={review._id}
          className="rounded-2xl border border-forest-100 bg-white p-4 shadow-sm shadow-forest-900/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 font-serif text-sm text-forest-700">
                {(review.owner?.username ?? "A").charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-medium text-forest-950">
                  {review.owner?.username ?? "Anonymous"}
                </p>
                <StarDisplay rating={review.rating} />
              </div>
            </div>
            {currentUserId && review.owner?._id === currentUserId && (
              <DeleteReviewButton campgroundId={campgroundId} reviewId={review._id} />
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-forest-700/80">{review.body}</p>
        </li>
      ))}
    </ul>
  );
}