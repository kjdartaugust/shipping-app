import Link from "next/link";
import { Logo } from "./logo";
import { BRAND } from "@/lib/constants";

export function SiteFooter() {
  const cols = [
    {
      title: "Product",
      links: [
        { href: "/#features", label: "Features" },
        { href: "/#services", label: "Services" },
        { href: "/track", label: "Track a package" },
        { href: "/#pricing", label: "Pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/#", label: "About" },
        { href: "/#", label: "Careers" },
        { href: "/#", label: "Press" },
        { href: "/#", label: "Contact" },
      ],
    },
    {
      title: "Account",
      links: [
        { href: "/login", label: "Sign in" },
        { href: "/register", label: "Create account" },
        { href: "/dashboard", label: "Dashboard" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              {BRAND.tagline} Book, track and manage shipments across the globe
              with a courier platform built for speed.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row dark:border-white/10 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p>Built with Next.js, Supabase &amp; Leaflet.</p>
        </div>
      </div>
    </footer>
  );
}
