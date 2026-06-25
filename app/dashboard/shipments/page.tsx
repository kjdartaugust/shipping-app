import Link from "next/link";
import { Package, PlusCircle, Search, X } from "lucide-react";
import { ShipmentRow } from "@/components/dashboard/shipment-row";
import { EmptyState } from "@/components/empty-state";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { STATUS_META } from "@/lib/constants";
import type { Shipment, ShipmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata = { title: "My Shipments" };

const RANGES: Record<string, { label: string; days: number }> = {
  "7": { label: "Last 7 days", days: 7 },
  "30": { label: "Last 30 days", days: 30 },
  "90": { label: "Last 90 days", days: 90 },
};

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; range?: string };
}) {
  const profile = await requireProfile();
  const supabase = createClient();

  const status = searchParams.status as ShipmentStatus | undefined;
  const q = (searchParams.q ?? "").trim();
  const range = searchParams.range ?? "";

  let query = supabase
    .from("shipments")
    .select("*")
    .eq("sender_id", profile.id)
    .order("created_at", { ascending: false });

  if (status && STATUS_META[status]) query = query.eq("status", status);

  if (q) {
    const safe = q.replace(/[,()%]/g, " ");
    query = query.or(
      `tracking_number.ilike.%${safe}%,recipient_name.ilike.%${safe}%,dest_address.ilike.%${safe}%`
    );
  }

  if (RANGES[range]) {
    const since = new Date(
      Date.now() - RANGES[range].days * 86400000
    ).toISOString();
    query = query.gte("created_at", since);
  }

  const { data } = await query;
  const list = (data ?? []) as Shipment[];

  // Preserve active q/range while switching status chips.
  const buildHref = (nextStatus: string) => {
    const params = new URLSearchParams();
    if (nextStatus) params.set("status", nextStatus);
    if (q) params.set("q", q);
    if (range) params.set("range", range);
    const qs = params.toString();
    return qs ? `/dashboard/shipments?${qs}` : "/dashboard/shipments";
  };

  const filters: { key: string; label: string }[] = [
    { key: "", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "in_transit", label: "In Transit" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const isFiltered = !!(status || q || range);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Shipments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {list.length} shipment{list.length === 1 ? "" : "s"}
            {isFiltered ? " · filtered" : ""}
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> Book shipment
        </Link>
      </div>

      {/* Search + date range */}
      <form className="flex flex-col gap-2 sm:flex-row">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 dark:border-white/10 dark:bg-white/[0.04]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search tracking #, recipient or destination"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <select
          name="range"
          defaultValue={range}
          className="input sm:w-44"
          aria-label="Date range"
        >
          <option value="">All time</option>
          {Object.entries(RANGES).map(([key, r]) => (
            <option key={key} value={key}>
              {r.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">
          Search
        </button>
        {isFiltered && (
          <Link href="/dashboard/shipments" className="btn-ghost" title="Clear">
            <X className="h-4 w-4" /> Clear
          </Link>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (status ?? "") === f.key;
          return (
            <Link
              key={f.key}
              href={buildHref(f.key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Package}
          title={isFiltered ? "No matching shipments" : "No shipments found"}
          description={
            isFiltered
              ? "Try a different search, status or date range."
              : "Book your first shipment to start tracking deliveries."
          }
          action={
            isFiltered
              ? undefined
              : { href: "/dashboard/new", label: "Book a shipment" }
          }
        />
      ) : (
        <div className="space-y-3">
          {list.map((s) => (
            <ShipmentRow key={s.id} shipment={s} />
          ))}
        </div>
      )}
    </div>
  );
}
