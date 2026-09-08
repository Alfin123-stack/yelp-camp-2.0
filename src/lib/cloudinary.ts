import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Matches the value enforced client-side in campground-form.tsx. Kept here
// too since the client check is only a UX nicety — this is the real
// enforcement, since a request can always skip the browser.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Uploads a single File (from a multipart FormData) to Cloudinary, in the
 * same "YelpCamp" folder used by the original Express app's Multer storage.
 */
export async function uploadImageToCloudinary(file: File) {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`Image "${file.name}" is larger than 5MB.`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<{ url: string; filename: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "YelpCamp",
        allowed_formats: ["jpeg", "png", "jpg", "gif", "webp", "bmp"],
      },
      (error, result) => {
        if (error || !result) {
          // Cloudinary's Node SDK rejects with a plain object
          // (`{ message, http_code, ... }`), not a real `Error` instance.
          // The caller in campgrounds.ts does `err instanceof Error` to
          // decide whether to show err.message or a generic fallback —
          // with the raw object, that check always fails, so the actual
          // reason (bad credentials, unsupported format, etc.) never
          // reaches the user. Wrapping it in a real Error fixes that.
          const message =
            (error as { message?: string } | undefined)?.message ??
            "Cloudinary upload failed with no error details.";
          return reject(new Error(message));
        }
        resolve({ url: result.secure_url, filename: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteImageFromCloudinary(filename: string) {
  return cloudinary.uploader.destroy(filename);
}

export default cloudinary;