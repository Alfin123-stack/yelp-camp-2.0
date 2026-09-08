import { z } from "zod";
import sanitizeHtml from "sanitize-html";

// Same anti-XSS behaviour as the original Joi `escapeHTML()` extension:
// reject any string that contains HTML tags/attributes.
function noHtml(message = "Field must not include HTML!") {
  return z.string().refine(
    (value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }) === value,
    { message }
  );
}

export const campgroundSchema = z.object({
  title: noHtml("Title must not include HTML!")
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number").max(1_000_000, "Price is too high"),
  location: noHtml("Location must not include HTML!")
    .min(1, "Location is required")
    .max(200, "Location must be at most 200 characters"),
  description: noHtml("Description must not include HTML!")
    .min(1, "Description is required")
    .max(5000, "Description must be at most 5000 characters"),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  body: noHtml("Review must not include HTML!")
    .min(1, "Review body is required")
    .max(1000, "Review must be at most 1000 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email").max(254, "Email is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username may only contain letters, numbers, - _ and ."),
  password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password is too long"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(30, "Username is too long"),
  password: z.string().min(1, "Password is required").max(72, "Password is too long"),
});

export type CampgroundInput = z.infer<typeof campgroundSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
