"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { MapPoint } from "./tracking-map";

/**
 * SSR-safe wrapper for the Leaflet map. Leaflet touches `window`, so the
 * real map must only load in the browser.
 */
const TrackingMap = dynamic(() => import("./tracking-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[320px] w-full place-items-center rounded-2xl bg-slate-100 dark:bg-white/[0.03]">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
    </div>
  ),
});

export function MapView({ points }: { points: MapPoint[] }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl">
      <TrackingMap points={points} />
    </div>
  );
}

export type { MapPoint };
