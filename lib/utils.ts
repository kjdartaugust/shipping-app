import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRICING, SERVICE_META } from "./constants";
import type { PackageType, ServiceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a human-friendly tracking number, e.g. SS-7F3K9A2QX1. */
export function generateTrackingNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SS-${code}`;
}

export function generateInvoiceNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${y}-${rand}`;
}

/** Haversine distance between two lat/lng points in kilometres. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

interface QuoteInput {
  weightKg: number;
  distanceKm: number;
  service: ServiceType;
  packageType: PackageType;
  declaredValue?: number;
}

/** Deterministic shipping quote used on both client and server. */
export function calculateQuote({
  weightKg,
  distanceKm,
  service,
  packageType,
  declaredValue = 0,
}: QuoteInput) {
  const weightCost = weightKg * PRICING.perKg;
  const distanceCost = distanceKm * PRICING.perKm;
  const fragile = packageType === "fragile" ? PRICING.fragileSurcharge : 0;
  const insurance = declaredValue * PRICING.insuranceRate;
  const subtotal = PRICING.base + weightCost + distanceCost + fragile + insurance;
  const total = subtotal * SERVICE_META[service].multiplier;
  return Math.round(total * 100) / 100;
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDate(input: string | Date, withTime = false) {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function initials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
