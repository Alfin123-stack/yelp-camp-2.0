"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { registerSchema } from "@/lib/validations/schemas";
import { signIn } from "@/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type RegisterState = {
  error?: string;
};

const REGISTER_LIMIT = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`register:${ip}`, REGISTER_LIMIT, REGISTER_WINDOW_MS);
  if (!rateLimit.allowed) {
    return {
      error: `Too many registration attempts. Try again in ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  const raw = {
    email: String(formData.get("email") || ""),
    username: String(formData.get("username") || ""),
    password: String(formData.get("password") || ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  await connectDB();

  const existing = await User.findOne({
    $or: [{ email: parsed.data.email }, { username: parsed.data.username }],
  });
  if (existing) {
    return { error: "A user with that email or username already exists" };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12);
  await User.create({
    email: parsed.data.email,
    username: parsed.data.username,
    password: hashed,
  });

  // Log the freshly-registered user straight in, mirroring req.login()
  // in the original Express controller.
  await signIn("credentials", {
    username: parsed.data.username,
    password: parsed.data.password,
    redirectTo: "/campgrounds",
  });

  return {};
}
