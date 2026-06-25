"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  MapPin,
  Headphones,
  Globe,
  PackageSearch,
  ChevronRight,
} from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const mainLinks = [
  { href: "/#services", label: "Express" },
  { href: "/#features", label: "Solutions" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/track", label: "Track" },
];

const utilityLinks = [
  { href: "/track", label: "Track", icon: PackageSearch },
  { href: "/#", label: "Locations", icon: MapPin },
  { href: "/#", label: "Customer Service", icon: Headphones },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      {/* Utility bar */}
      <div className="hidden bg-accent-500 text-slate-900 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-end gap-1 px-4 text-xs font-semibold sm:px-6 lg:px-8">
          {utilityLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 transition hover:bg-black/10"
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </Link>
          ))}
          <span className="mx-1 h-3.5 w-px bg-black/20" />
          <button className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 transition hover:bg-black/10">
            <Globe className="h-3.5 w-3.5" /> EN
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#090c18]/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden items-center gap-1 lg:flex">
              {mainLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary hidden sm:inline-flex">
              Get started <ChevronRight className="h-4 w-4" />
            </Link>
            <button
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 lg:hidden dark:border-white/10"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-200 px-4 py-3 lg:hidden dark:border-white/10">
            {[...mainLinks, ...utilityLinks].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="btn-secondary flex-1">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary flex-1">
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
