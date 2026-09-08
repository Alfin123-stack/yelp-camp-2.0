"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Campground from "@/lib/models/campground";
import { campgroundSchema } from "@/lib/validations/schemas";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary";
import { geocodeLocation } from "@/lib/maptiler";
import { auth } from "@/auth";
import type { CampgroundData } from "@/types/campground";

export type CampgroundFormState = {
  error?: string;
};

const CAMPGROUNDS_PAGE_SIZE = 24;

export async function getCampgrounds(page = 1) {
  await connectDB();
  const currentPage = Math.max(1, Math.floor(page) || 1);
  const skip = (currentPage - 1) * CAMPGROUNDS_PAGE_SIZE;

  const [campgrounds, total] = await Promise.all([
    Campground.find({}).sort({ _id: -1 }).skip(skip).limit(CAMPGROUNDS_PAGE_SIZE).lean(),
    Campground.countDocuments({}),
  ]);

  return {
    campgrounds: JSON.parse(JSON.stringify(campgrounds)) as CampgroundData[],
    total,
    page: currentPage,
    totalPages: Math.max(1, Math.ceil(total / CAMPGROUNDS_PAGE_SIZE)),
  };
}

// Lightweight projection for the cluster map: unlike the paginated grid
// above, the map should always plot every campground. Now also carries
// price + the first image so the map popup can show a real thumbnail and
// price tag instead of just a title/description — still no reviews/author,
// which the popup never needs.
export async function getCampgroundLocations() {
  await connectDB();
  const campgrounds = await Campground.find({}, "title description geometry price images")
    .sort({ _id: -1 })
    .lean();
  return JSON.parse(JSON.stringify(campgrounds)) as Pick<
    CampgroundData,
    "_id" | "title" | "description" | "geometry" | "price" | "images"
  >[];
}

export async function getCampgroundById(id: string) {
  await connectDB();
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("author")
    .lean();
  if (!campground) return null;
  return JSON.parse(JSON.stringify(campground));
}

// "You might also like" on the campground detail page — a handful of other
// listings, cheapest fields only (id/title/location/price/first image), so
// the detail page doesn't have to drag in each candidate's full description
// or review list just to render a thumbnail grid.
export async function getRelatedCampgrounds(excludeId: string, limit = 4) {
  await connectDB();
  const campgrounds = await Campground.find(
    { _id: { $ne: excludeId } },
    "title location price images"
  )
    .sort({ _id: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(campgrounds)) as Pick<
    CampgroundData,
    "_id" | "title" | "location" | "price" | "images"
  >[];
}

export async function createCampground(
  _prevState: CampgroundFormState,
  formData: FormData
): Promise<CampgroundFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in first!" };
  }

  const parsed = campgroundSchema.safeParse({
    title: formData.get("title"),
    price: formData.get("price"),
    location: formData.get("location"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const geometry = await geocodeLocation(parsed.data.location);
  if (!geometry) {
    return { error: "Location not found!" };
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  let uploaded;
  try {
    uploaded = await Promise.all(files.map(uploadImageToCloudinary));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed" };
  }

  await connectDB();
  const campground = new Campground({
    ...parsed.data,
    images: uploaded,
    geometry,
    author: session.user.id,
  });
  await campground.save();

  revalidatePath("/campgrounds");
  redirect(`/campgrounds/${campground._id}?success=Successfully made a new campground!`);
}

export async function updateCampground(
  id: string,
  _prevState: CampgroundFormState,
  formData: FormData
): Promise<CampgroundFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in first!" };
  }

  await connectDB();
  const campground = await Campground.findById(id);
  if (!campground) {
    return { error: "Cannot find that campground!" };
  }
  if (!campground.author?.equals(session.user.id)) {
    return { error: "You do not have permission to do that!" };
  }

  const parsed = campgroundSchema.safeParse({
    title: formData.get("title"),
    price: formData.get("price"),
    location: formData.get("location"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const geometry = await geocodeLocation(parsed.data.location);
  if (!geometry) {
    return { error: "Location not found!" };
  }

  Object.assign(campground, parsed.data);
  campground.geometry = geometry;

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > 0) {
    try {
      const uploaded = await Promise.all(files.map(uploadImageToCloudinary));
      campground.images.push(...uploaded);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed" };
    }
  }

  const deleteImages = formData.getAll("deleteImages").map(String);
  if (deleteImages.length > 0) {
    await Promise.all(deleteImages.map(deleteImageFromCloudinary));
    campground.images = campground.images.filter(
      (img: { filename: string }) => !deleteImages.includes(img.filename)
    );
  }

  await campground.save();

  revalidatePath("/campgrounds");
  revalidatePath(`/campgrounds/${id}`);
  redirect(`/campgrounds/${id}?success=Successfully updated campground!`);
}

export async function deleteCampground(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();
  const campground = await Campground.findById(id);
  if (campground && campground.author?.equals(session.user.id)) {
    // Clean up Cloudinary before removing the document, otherwise these
    // images become orphaned (never deleted, still billed) since nothing
    // else references their public_id afterwards. Seeded placeholder
    // images no-op here (see scripts/seed.ts) since they were never
    // actually uploaded to Cloudinary.
    await Promise.all(
      campground.images.map((img: { filename: string }) =>
        deleteImageFromCloudinary(img.filename).catch(() => {
          // Best-effort cleanup: don't block deleting the campground itself
          // just because Cloudinary is slow/unreachable or the asset is
          // already gone.
        })
      )
    );
    await Campground.findByIdAndDelete(id);
  }

  revalidatePath("/campgrounds");
  redirect("/campgrounds?success=Successfully deleted campground");
}