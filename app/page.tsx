import Link from "next/link";
import {
  ArrowRight,
  PackageCheck,
  MapPin,
  Bell,
  FileText,
  ShieldCheck,
  Zap,
  Globe2,
  Boxes,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { TrackSearch } from "@/components/track-search";
import { SERVICE_META, PRICING } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const features = [
  {
    icon: PackageCheck,
    title: "Book in seconds",
    desc: "Create a shipment with instant pricing, pickup scheduling and label generation.",
  },
  {
    icon: MapPin,
    title: "Live map tracking",
    desc: "Follow every package on an interactive map with real-time status updates.",
  },
  {
    icon: Bell,
    title: "Smart notifications",
    desc: "Customers and agents stay in sync with status alerts at every milestone.",
  },
  {
    icon: FileText,
    title: "Waybills & invoices",
    desc: "Auto-generated, print-ready waybills and invoices for every shipment.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    desc: "Row-level security and role-based access protect every record.",
  },
  {
    icon: Zap,
    title: "Agent assignment",
    desc: "Dispatch shipments to delivery agents and track their workload.",
  },
];

const stats = [
  { value: "2.4M+", label: "Parcels delivered" },
  { value: "180+", label: "Countries served" },
  { value: "99.2%", label: "On-time rate" },
  { value: "24/7", label: "Live support" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-600/20" />
            <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="animate-fade-in">
                <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  <Globe2 className="h-3.5 w-3.5" /> Worldwide courier network
                </span>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Ship smarter.
                  <br />
                  <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                    Track everything.
                  </span>
                </h1>
                <p className="mt-5 max-w-lg text-lg text-slate-600 dark:text-slate-300">
                  SwiftShip is the all-in-one logistics platform to book
                  shipments, generate waybills and follow deliveries on a live
                  map — for customers, agents and admins.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/register" className="btn-primary text-base">
                    Start shipping <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/track" className="btn-secondary text-base">
                    Track a package
                  </Link>
                </div>
                <div className="mt-10 grid max-w-md grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                        {s.value}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-fade-in">
                <div className="card p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Boxes className="h-5 w-5 text-brand-600" />
                    Track your shipment
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Enter a tracking number to see live status — no account
                    needed.
                  </p>
                  <TrackSearch className="mt-4" />
                  <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Sample · SS-DEMO12345</span>
                      <span className="font-medium text-brand-600">
                        In Transit
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 1, 1, 1, 0, 0].map((on, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            on
                              ? "bg-brand-500"
                              : "bg-slate-200 dark:bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-brand-500" /> Now near
                      Kumasi Distribution Hub
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-slate-200 py-20 dark:border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything your logistics need
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                A complete operations suite — from first click to final mile.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services / Pricing */}
        <section id="services" className="bg-slate-50 py-20 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center" id="pricing">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Service levels for every deadline
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Transparent pricing from a {formatCurrency(PRICING.base)} base
                rate. Pay for weight, distance and speed.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {(
                Object.entries(SERVICE_META) as [
                  keyof typeof SERVICE_META,
                  (typeof SERVICE_META)[keyof typeof SERVICE_META]
                ][]
              ).map(([key, s], i) => (
                <div
                  key={key}
                  className={`card relative p-7 ${
                    i === 1 ? "ring-2 ring-brand-500" : ""
                  }`}
                >
                  {i === 1 && (
                    <span className="badge absolute -top-3 left-7 bg-brand-600 text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{s.label}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {s.desc}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">
                      ×{s.multiplier}
                    </span>
                    <span className="text-sm text-slate-500">base rate</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-400">
                    {s.eta}
                  </p>
                  <Link
                    href="/register"
                    className={`mt-6 w-full ${
                      i === 1 ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Choose {s.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center text-white shadow-soft sm:px-16">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to move your first package?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-brand-100">
                Create a free account and book a shipment in under two minutes.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link
                  href="/register"
                  className="btn bg-white text-brand-700 hover:bg-brand-50"
                >
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="btn border border-white/40 text-white hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
