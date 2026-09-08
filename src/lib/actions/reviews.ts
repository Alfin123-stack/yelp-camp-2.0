"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Campground from "@/lib/models/campground";
import Review from "@/lib/models/review";
import { reviewSchema } from "@/lib/validations/schemas";
import { auth } from "@/auth";

export type ReviewFormState = {
  error?: string;
};

export async function addReview(
  campgroundId: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to leave a review!" };
  }

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid review" };
  }

  await connectDB();
  const campground = await Campground.findById(campgroundId);
  if (!campground) {
    return { error: "Campground not found!" };
  }

  const review = new Review({ ...parsed.data, owner: session.user.id });
  campground.reviews.push(review._id);
  await review.save();
  await campground.save();

  revalidatePath(`/campgrounds/${campgroundId}`);
  redirect(`/campgrounds/${campgroundId}?success=Created new review!`);
}

export async function deleteReview(campgroundId: string, reviewId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();
  const review = await Review.findById(reviewId);
  if (review && review.owner?.equals(session.user.id)) {
    await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
  }

  revalidatePath(`/campgrounds/${campgroundId}`);
  redirect(`/campgrounds/${campgroundId}?success=Successfully deleted review`);
}
