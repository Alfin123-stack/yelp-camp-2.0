"use client";

import { useActionState } from "react";
import { registerUser, type RegisterState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { AuthField } from "@/components/ui/auth-field";

const initialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <AuthField label="Email" id="email" name="email" type="email" required />
      <AuthField label="Username" id="username" name="username" required />
      <AuthField label="Password" id="password" name="password" type="password" required minLength={6} />

      {/* Display-only, mirroring the reference design — not tied to any
          backend field, so it doesn't block submission. */}
      <label className="flex items-start gap-3 pt-2 text-sm leading-5 text-black/50 dark:text-white/45">
        <span className="relative mt-0.5 size-3.5 shrink-0">
          <input
            type="checkbox"
            className="peer size-full appearance-none rounded-[2px] border border-black/25 bg-white checked:border-emerald-700 checked:bg-emerald-700 dark:border-white/30 dark:bg-white/5 dark:checked:border-emerald-500 dark:checked:bg-emerald-500"
          />
          <svg
            viewBox="0 0 12 12"
            className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-white peer-checked:block"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 6.2 5 8.1 9 3.9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>
          By creating an account, you agree to our{" "}
          <a href="#" className="font-medium text-black/60 underline underline-offset-2 dark:text-white/55">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-black/60 underline underline-offset-2 dark:text-white/55">
            Privacy Policy
          </a>
        </span>
      </label>

      <Button type="submit" className="mt-2 h-12 w-full text-base" disabled={pending}>
        {pending ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
}