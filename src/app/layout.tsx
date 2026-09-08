import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FlashToast from "@/components/flash-toast";
import "./globals.css";

// Body copy stays on Inter (already the app's default look). Fraunces is a
// serif display face used only for headings on the landing page
// (src/components/landing/) to give it an editorial, premium feel — both
// are exposed as CSS variables and wired up as the `font-sans` / `font-serif`
// utilities in globals.css, so the rest of the app is unaffected.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YelpCamp — Find your next campground",
    template: "%s | YelpCamp",
  },
  description:
    "Browse, review, and share campgrounds around the world. YelpCamp helps you find the perfect spot for your next outdoor adventure.",
  openGraph: {
    title: "YelpCamp",
    description: "Browse, review, and share campgrounds around the world.",
    siteName: "YelpCamp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YelpCamp",
    description: "Browse, review, and share campgrounds around the world.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Suspense fallback={null}>
          <FlashToast />
        </Suspense>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}