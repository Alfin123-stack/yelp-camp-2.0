"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { isSafeRelativePath } from "@/lib/utils";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type LoginState = {
  error?: string;
};

const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!rateLimit.allowed) {
    return {
      error: `Too many login attempts. Try again in ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  // login-form.tsx already validates this, but a Server Action is a public
  // RPC endpoint — it can be called with arbitrary form data that never
  // went through that component, so the redirect target must be
  // re-validated here rather than trusted from the client.
  const requested = String(formData.get("returnTo") || "");
  const returnTo = isSafeRelativePath(requested) ? requested : "/campgrounds";

  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: `${returnTo}${returnTo.includes("?") ? "&" : "?"}success=Welcome back!`,
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid username or password" };
    }
    // NextAuth throws a special redirect error on success — rethrow so
    // Next.js can actually perform the navigation.
    throw err;
  }
}
