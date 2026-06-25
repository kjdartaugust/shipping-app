import Link from "next/link";
import {
  ArrowRight,
  PackageCheck,
  MapPin,
  Bell,
  FileText,
  ShieldCheck,
  Zap,
  Truck,
  Calculator,
  Building2,
  Plane,
  Ship,
  Clock,
  Globe2,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { TrackSearch } from "@/components/track-search";
import { Reveal, RevealGroup, RevealItem, HoverLift } from "@/components/motion";
import { SERVICE_META, PRICING } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const HERO_IMG =
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=80";
const WHY_IMG =
  "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1400&q=80";

const quickActions = [
  {
    icon: Truck,
    title: "Ship Now",
    desc: "Create a shipment and print a label in minutes.",
    href: "/dashboard/new",
  },
  {
    icon: Calculator,
    title: "Get a Quote",
    desc: "Instant pricing by weight, distance and speed.",
    href: "/#pricing",
  },
  {
    icon: Building2,
    title: "Business Account",
    desc: "Volume rates, invoicing and a dispatch dashboard.",
    href: "/register",
  },
];

const features = [
  { icon: PackageCheck, title: "Book in seconds", desc: "Instant pricing, pickup scheduling and label generation." },
  { icon: MapPin, title: "Live map tracking", desc: "Follow every package on an interactive map in real time." },
  { icon: Bell, title: "Smart notifications", desc: "Status alerts at every milestone for sender and agent." },
  { icon: FileText, title: "Waybills & invoices", desc: "Auto-generated, print-ready documents for every shipment." },
  { icon: ShieldCheck, title: "Secure by design", desc: "Row-level security and role-based access on every record." },
  { icon: Zap, title: "Agent dispatch", desc: "Assign shipments to delivery agents and track workload." },
];

const modes = [
  { icon: Plane, title: "Air Express", eta: "1–2 days" },
  { icon: Truck, title: "Road Freight", eta: "3–5 days" },
  { icon: Ship, title: "Ocean Cargo", eta: "Economy" },
  { icon: Clock, title: "Same Day", eta: "Local" },
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
        {/* ============================ HERO ============================ */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMG}
              alt="Cargo logistics"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />
            <div className="absolute inset-x-0 top-0 h-1.5 bg-accent-500" />
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-44 pt-20 sm:px-6 lg:px-8 lg:pb-52 lg:pt-28">
            <div className="max-w-2xl">
              <Reveal>
                <span className="badge bg-accent-500 text-slate-900">
                  <Globe2 className="h-3.5 w-3.5" /> Worldwide courier network
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Excellence.
                  <br />
                  <span className="text-accent-500">Simply delivered.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-xl text-lg text-slate-200">
                  Book shipments, generate waybills and follow every delivery on
                  a live map — the all-in-one logistics platform for customers,
                  agents and admins.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-8 rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur">
                  <div className="mb-2 px-2 pt-1 text-sm font-bold text-white">
                    Track your shipment
                  </div>
                  <TrackSearch variant="hero" />
                </div>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-accent-500" /> No
                    account needed to track
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-accent-500" /> Real-time
                    location
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== FLOATING QUICK ACTIONS ===================== */}
        <section className="relative z-10 mx-auto -mt-32 max-w-7xl px-4 sm:px-6 lg:-mt-36 lg:px-8">
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {quickActions.map((a) => (
              <RevealItem key={a.title}>
                <HoverLift>
                  <Link
                    href={a.href}
                    className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70 transition dark:bg-[#11131c] dark:ring-white/10"
                  >
                    <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                      <span className="absolute inset-x-0 top-0 h-1 bg-accent-500" />
                      <a.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{a.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">
                      {a.desc}
                    </p>
                    <span className="link-arrow mt-4 text-sm">
                      Get started <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </HoverLift>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ============================ STATS ============================ */}
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid grid-cols-2 gap-6 rounded-2xl bg-slate-50 p-8 dark:bg-white/[0.03] lg:grid-cols-4">
            {stats.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 lg:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {s.label}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ============================ FEATURES ============================ */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="accent-rule text-3xl font-extrabold tracking-tight sm:text-4xl">
                Everything your logistics need
              </h2>
              <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                A complete operations suite — from first click to final mile.
              </p>
            </Reveal>
            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <RevealItem key={f.title}>
                  <HoverLift className="h-full">
                    <div className="group h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition hover:border-accent-500 dark:border-white/10 dark:bg-white/[0.02]">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white transition group-hover:bg-accent-500 group-hover:text-slate-900">
                        <f.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                        {f.desc}
                      </p>
                    </div>
                  </HoverLift>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ============================ MODES ============================ */}
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {modes.map((m) => (
                <RevealItem key={m.title}>
                  <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-accent-500">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent-500 text-slate-900">
                      <m.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="font-bold text-white">{m.title}</div>
                      <div className="text-sm text-slate-400">{m.eta}</div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ============================ WHY US ============================ */}
        <section className="py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Reveal>
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-2xl bg-accent-500/30" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={WHY_IMG}
                  alt="Warehouse operations"
                  className="relative w-full rounded-2xl object-cover shadow-lift"
                />
                <div className="absolute -bottom-6 -right-4 rounded-xl bg-brand-600 px-5 py-4 text-white shadow-lift">
                  <div className="text-2xl font-extrabold">99.2%</div>
                  <div className="text-xs text-brand-100">on-time delivery</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="accent-rule text-3xl font-extrabold tracking-tight sm:text-4xl">
                Built for speed, trusted for reliability
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                From a single parcel to enterprise freight, SwiftShip gives you
                the visibility and control of a global carrier with the
                simplicity of a modern app.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Real-time tracking across road, air and ocean",
                  "Automated waybills, invoices and proof of delivery",
                  "Dedicated agent dispatch and delivery management",
                  "Bank-grade security with role-based access",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-500 text-slate-900">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{t}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary mt-8">
                Open an account <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============================ PRICING ============================ */}
        <section id="services" className="bg-slate-50 py-24 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div id="pricing" className="mx-auto max-w-2xl text-center">
              <Reveal>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Service levels for every deadline
                </h2>
                <p className="mt-4 text-slate-600 dark:text-slate-300">
                  Transparent pricing from a {formatCurrency(PRICING.base)} base
                  rate. Pay for weight, distance and speed.
                </p>
              </Reveal>
            </div>
            <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
              {(
                Object.entries(SERVICE_META) as [
                  keyof typeof SERVICE_META,
                  (typeof SERVICE_META)[keyof typeof SERVICE_META]
                ][]
              ).map(([key, s], i) => (
                <RevealItem key={key}>
                  <HoverLift className="h-full">
                    <div
                      className={`relative flex h-full flex-col rounded-2xl bg-white p-8 shadow-soft transition dark:bg-[#11131c] ${
                        i === 1
                          ? "ring-2 ring-brand-600"
                          : "ring-1 ring-slate-200 dark:ring-white/10"
                      }`}
                    >
                      {i === 1 && (
                        <span className="badge absolute -top-3 left-8 bg-accent-500 text-slate-900">
                          Most popular
                        </span>
                      )}
                      <h3 className="text-xl font-bold">{s.label}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {s.desc}
                      </p>
                      <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold">
                          ×{s.multiplier}
                        </span>
                        <span className="text-sm text-slate-500">base rate</span>
                      </div>
                      <p className="mt-2 font-semibold text-brand-600 dark:text-brand-400">
                        {s.eta}
                      </p>
                      <Link
                        href="/register"
                        className={`mt-8 w-full ${
                          i === 1 ? "btn-primary" : "btn-secondary"
                        }`}
                      >
                        Choose {s.label}
                      </Link>
                    </div>
                  </HoverLift>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ============================ CTA ============================ */}
        <section className="relative overflow-hidden bg-brand-600 py-20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-accent-500" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to move your first package?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-brand-100">
                Create a free account and book a shipment in under two minutes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/register" className="btn-accent text-base">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/track"
                  className="btn border border-white/40 text-white hover:bg-white/10"
                >
                  Track a package
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
