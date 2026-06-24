import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { TrackSearch } from "@/components/track-search";
import { PackageSearch } from "lucide-react";

export const metadata = { title: "Track a shipment" };

export default function TrackLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <PackageSearch className="h-7 w-7" />
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Track your shipment
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Enter your SwiftShip tracking number to see real-time status and
              location on the map.
            </p>
          </div>
          <TrackSearch className="mt-8" autoFocus />
          <p className="mt-4 text-center text-sm text-slate-400">
            Tip: tracking numbers look like{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-white/10">
              SS-7F3K9A2QX1
            </code>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
