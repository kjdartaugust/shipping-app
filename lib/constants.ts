import type {
  ServiceType,
  ShipmentStatus,
  PackageType,
} from "./types";

export const BRAND = {
  name: "SwiftShip",
  tagline: "Logistics, delivered with precision.",
};

export const STATUS_META: Record<
  ShipmentStatus,
  { label: string; color: string; dot: string; step: number }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
    step: 0,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
    step: 1,
  },
  picked_up: {
    label: "Picked Up",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    dot: "bg-indigo-500",
    step: 2,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
    dot: "bg-brand-500",
    step: 3,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    dot: "bg-violet-500",
    step: 4,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
    step: 5,
  },
  exception: {
    label: "Exception",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    dot: "bg-rose-500",
    step: -1,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-300",
    dot: "bg-gray-400",
    step: -1,
  },
};

/** Ordered "happy path" used by the tracking progress bar. */
export const STATUS_FLOW: ShipmentStatus[] = [
  "pending",
  "confirmed",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export const SERVICE_META: Record<
  ServiceType,
  { label: string; eta: string; multiplier: number; desc: string }
> = {
  standard: {
    label: "Standard",
    eta: "3–5 business days",
    multiplier: 1,
    desc: "Best value for non-urgent shipments.",
  },
  express: {
    label: "Express",
    eta: "1–2 business days",
    multiplier: 1.8,
    desc: "Priority handling and faster transit.",
  },
  overnight: {
    label: "Overnight",
    eta: "Next business day",
    multiplier: 2.6,
    desc: "Guaranteed next-day delivery.",
  },
};

export const PACKAGE_META: Record<PackageType, { label: string }> = {
  document: { label: "Document" },
  parcel: { label: "Parcel" },
  box: { label: "Box" },
  pallet: { label: "Pallet" },
  fragile: { label: "Fragile" },
};

/** Base pricing model (USD). */
export const PRICING = {
  base: 8,
  perKg: 2.5,
  perKm: 0.04,
  fragileSurcharge: 6,
  insuranceRate: 0.01, // 1% of declared value
};
