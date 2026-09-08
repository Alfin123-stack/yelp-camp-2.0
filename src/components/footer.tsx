// src/components/footer.tsx
import { cacheLife } from "next/cache";
import {
  Tent,

  Mail,
  MapPin,
  Phone,
  BookAIcon,
  BotIcon,
  BoltIcon,
  TestTube2Icon,
} from "lucide-react";
import Link from "next/link";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

interface FooterLink {
  text: string;
  href: string;
  hasIndicator?: boolean;
}

const data = {
  facebookLink: "https://facebook.com/yelpcamp",
  instaLink: "https://instagram.com/yelpcamp",
  twitterLink: "https://twitter.com/yelpcamp",
  youtubeLink: "https://youtube.com/yelpcamp",
  company: {
    name: "YelpCamp",
    description:
      "Temukan dan bagikan spot camping terbaik di seluruh negeri — dari tepi danau yang tenang sampai puncak bukit berkabut. Petualanganmu berikutnya dimulai di sini.",
  },
  explore: [
    { text: "Jelajahi Campground", href: "/campgrounds" },
    { text: "Peta Lokasi", href: "/map" },
    { text: "Ulasan Terbaru", href: "/campgrounds?sort=reviews" },
    { text: "Paling Populer", href: "/campgrounds?sort=popular" },
  ] as FooterLink[],
  about: [
    { text: "Tentang Kami", href: "/about" },
    { text: "Panduan Camping", href: "/guidelines" },
    { text: "Tips Keamanan", href: "/safety-tips" },
    { text: "Karier", href: "/careers" },
  ] as FooterLink[],
  help: [
    { text: "FAQ", href: "/faqs" },
    { text: "Pusat Bantuan", href: "/support" },
    { text: "Daftarkan Campground", href: "/campgrounds/new", hasIndicator: true },
  ] as FooterLink[],
  contact: {
    email: "hello@yelpcamp.com",
    phone: "+62 812 3456 7890",
    address: "Jakarta, Indonesia",
  },
};

const socialLinks = [
  { icon: BookAIcon, label: "Facebook", href: data.facebookLink },
  { icon: BotIcon, label: "Instagram", href: data.instaLink },
  { icon: BoltIcon, label: "Twitter", href: data.twitterLink },
  { icon: TestTube2Icon, label: "YouTube", href: data.youtubeLink },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="relative w-full overflow-hidden">
      {/* Unsplash background — tenda di bawah bintang, dengan overlay forest gelap */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1600&q=60')",
        }}
      />
      <div className="absolute inset-0 bg-forest-950/92" />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex justify-center gap-2 sm:justify-start">
              <span className="flex size-9 items-center justify-center rounded-full bg-gold-400 text-forest-950">
                <Tent className="size-5" />
              </span>
              <span className="font-serif text-2xl font-semibold text-cream-50">
                {data.company.name}
              </span>
            </div>

            <p className="mt-6 max-w-md text-center text-sm leading-relaxed text-cream-100/70 sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gold-300 transition hover:text-gold-100"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="font-serif text-lg font-medium text-cream-50">
                Jelajahi
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {data.explore.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className="text-cream-100/70 transition hover:text-gold-300"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="font-serif text-lg font-medium text-cream-50">
                Tentang &amp; Bantuan
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[...data.about.slice(0, 2), ...data.help].map(
                  ({ text, href, hasIndicator }) => (
                    <li key={text}>
                      <Link
                        href={href}
                        className="group flex items-center justify-center gap-1.5 text-cream-100/70 transition hover:text-gold-300 sm:justify-start"
                      >
                        {text}
                        {hasIndicator && (
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-gold-400" />
                          </span>
                        )}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="font-serif text-lg font-medium text-cream-50">
                Kontak Kami
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                      href="#"
                    >
                      <Icon className="size-4 shrink-0 text-gold-300" />
                      {isAddress ? (
                        <address className="flex-1 not-italic text-cream-100/70 transition hover:text-gold-300">
                          {text}
                        </address>
                      ) : (
                        <span className="flex-1 text-cream-100/70 transition hover:text-gold-300">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-forest-700/50 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-cream-100/50">Semua hak dilindungi.</p>
            <p className="mt-4 text-sm text-cream-100/50 sm:order-first sm:mt-0">
              &copy; {year} {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}