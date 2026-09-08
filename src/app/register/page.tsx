import Link from "next/link";
import type { Metadata } from "next";
import { AuthSectionOne } from "@/components/ui/auth-section-1";
import RegisterForm from "@/components/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new YelpCamp account.",
};

export default function RegisterPage() {
  return (
    <AuthSectionOne
      title="Create an account"
      subtitle="Join YelpCamp to add campgrounds and write reviews."
      panelHeadline={["Share your favorite", "campgrounds"]}
      panelCta={{ label: "See what's out there", href: "/campgrounds" }}
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-700 font-medium hover:underline dark:text-emerald-400">
            Login
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthSectionOne>
  );
}