"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type LoginState } from "@/lib/actions/login";
import { isSafeRelativePath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthField } from "@/components/ui/auth-field";

const initialState: LoginState = {};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const requestedReturnTo = searchParams.get("returnTo");
  // returnTo comes from the URL, so it's attacker-controlled — a crafted
  // link like /login?returnTo=//evil.example must not be honored as a
  // redirect target after login.
  const returnTo =
    requestedReturnTo && isSafeRelativePath(requestedReturnTo) ? requestedReturnTo : "/campgrounds";
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="returnTo" value={returnTo} />

      {state.error && (
        <p className="rounded-md border border-forest-300 bg-forest-50 px-3 py-2 text-sm text-forest-800">
          {state.error}
        </p>
      )}

      <AuthField label="Username" id="username" name="username" required autoFocus />
      <AuthField label="Password" id="password" name="password" type="password" required />

      <Button
        type="submit"
        className="mt-2 h-12 w-full bg-forest-700 text-base text-cream-50 hover:bg-forest-600"
        disabled={pending}
      >
        {pending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}