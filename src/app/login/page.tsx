import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthSectionOne } from "@/components/ui/auth-section-1";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your YelpCamp account.",
};

export default function LoginPage() {
  return (
    <AuthSectionOne
      title="Welcome back"
      subtitle="Log in to manage your campgrounds and reviews."
      panelHeadline={["Find your next", "adventure"]}
      panelCta={{ label: "Browse campgrounds", href: "/campgrounds" }}
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-gold-600 hover:underline dark:text-gold-300">
            Register
          </Link>
        </p>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthSectionOne>
  );
}