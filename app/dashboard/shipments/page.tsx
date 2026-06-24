import Link from "next/link";
import { Package, PlusCircle } from "lucide-react";
import { ShipmentRow } from "@/components/dashboard/shipment-row";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { STATUS_META } from "@/lib/constants";
import type { Shipment, ShipmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata = { title: "My Shipments" };

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const profile = await requireProfile();
  const supabase = createClient();

  let query = supabase
    .from("shipments")
    .select("*")
    .eq("sender_id", profile.id)
    .order("created_at", { ascending: false });

  const filter = searchParams.status as ShipmentStatus | undefined;
  if (filter && STATUS_META[filter]) query = query.eq("status", filter);

  const { data } = await query;
  const list = (data ?? []) as Shipment[];

  const filters: { key: string; label: string }[] = [
    { key: "", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "in_transit", label: "In Transit" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Shipments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {list.length} shipment{list.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> Book shipment
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (filter ?? "") === f.key;
          return (
            <Link
              key={f.key}
              href={f.key ? `/dashboard/shipments?status=${f.key}` : "/dashboard/shipments"}
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
          title="No shipments found"
          description="Try a different filter or book a new shipment."
          action={{ href: "/dashboard/new", label: "Book a shipment" }}
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
