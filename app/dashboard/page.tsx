import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ShipmentRow } from "@/components/dashboard/shipment-row";
import { EmptyState } from "@/components/empty-state";
import { TrackSearch } from "@/components/track-search";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Shipment } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardHome() {
  const profile = await requireProfile();
  const supabase = createClient();

  const { data: shipments } = await supabase
    .from("shipments")
    .select("*")
    .eq("sender_id", profile.id)
    .order("created_at", { ascending: false });

  const list = (shipments ?? []) as Shipment[];
  const active = list.filter(
    (s) => !["delivered", "cancelled"].includes(s.status)
  );
  const delivered = list.filter((s) => s.status === "delivered");
  const pending = list.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track and manage all your shipments in one place.
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> Book shipment
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total shipments" value={list.length} icon={Package} />
        <StatCard
          label="In transit"
          value={active.length}
          icon={Truck}
          accent="violet"
        />
        <StatCard
          label="Delivered"
          value={delivered.length}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Pending"
          value={pending.length}
          icon={Clock}
          accent="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent shipments</h2>
            <Link
              href="/dashboard/shipments"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {list.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No shipments yet"
              description="Book your first shipment to start tracking deliveries."
              action={{ href: "/dashboard/new", label: "Book a shipment" }}
            />
          ) : (
            <div className="space-y-3">
              {list.slice(0, 5).map((s) => (
                <ShipmentRow key={s.id} shipment={s} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-semibold">Quick track</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Look up any shipment by number.
            </p>
            <TrackSearch className="mt-3 flex-col !items-stretch [&>button]:w-full" />
          </div>
          <div className="card bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
            <h2 className="font-semibold">Ship something new</h2>
            <p className="mt-1 text-sm text-brand-100">
              Get an instant quote and book in under 2 minutes.
            </p>
            <Link
              href="/dashboard/new"
              className="btn mt-4 bg-white text-brand-700 hover:bg-brand-50"
            >
              Start booking <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
