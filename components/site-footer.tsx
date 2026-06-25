import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Logo } from "./logo";
import { BRAND } from "@/lib/constants";

export function SiteFooter() {
  const cols = [
    {
      title: "Ship",
      links: [
        { href: "/dashboard/new", label: "Book a shipment" },
        { href: "/#pricing", label: "Get a quote" },
        { href: "/#services", label: "Express delivery" },
        { href: "/register", label: "Business account" },
      ],
    },
    {
      title: "Track",
      links: [
        { href: "/track", label: "Track a package" },
        { href: "/#", label: "Delivery updates" },
        { href: "/#", label: "Proof of delivery" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/#", label: "About us" },
        { href: "/#", label: "Careers" },
        { href: "/#", label: "Press" },
        { href: "/#", label: "Sustainability" },
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

  const socials = [Facebook, Twitter, Linkedin, Youtube];

  return (
    <footer className="bg-[#1a1a1a] text-slate-300">
      <div className="h-1 w-full bg-accent-500" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              {BRAND.tagline} Book, track and manage shipments across the globe
              with a courier platform built for speed and reliability.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-accent-500 hover:text-slate-900"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition hover:text-accent-500"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/#" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/#" className="hover:text-white">
              Terms
            </Link>
            <Link href="/#" className="hover:text-white">
              Cookies
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
