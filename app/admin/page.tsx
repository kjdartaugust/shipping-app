import Link from "next/link";
import {
  Package,
  Users,
  Truck,
  DollarSign,
  ArrowRight,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { STATUS_META } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Shipment, ShipmentStatus } from "@/lib/types";

export const metadata = { title: "Admin Overview" };

export default async function AdminOverview() {
  await requireAdmin();
  const supabase = createAdminClient();

  const [{ data: shipments }, { count: userCount }, { count: agentCount }] =
    await Promise.all([
      supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "agent"),
    ]);

  const list = (shipments ?? []) as Shipment[];
  const revenue = list
    .filter((s) => s.status !== "cancelled")
    .reduce((sum, s) => sum + Number(s.price), 0);
  const inTransit = list.filter((s) =>
    ["picked_up", "in_transit", "out_for_delivery"].includes(s.status)
  ).length;

  // Status distribution
  const byStatus = (Object.keys(STATUS_META) as ShipmentStatus[]).map((st) => ({
    status: st,
    count: list.filter((s) => s.status === st).length,
  }));
  const maxCount = Math.max(1, ...byStatus.map((b) => b.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Operations at a glance across the whole platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total shipments" value={list.length} icon={Package} />
        <StatCard
          label="In transit"
          value={inTransit}
          icon={Truck}
          accent="violet"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard
          label="Users / Agents"
          value={`${userCount ?? 0} / ${agentCount ?? 0}`}
          icon={Users}
          accent="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <h2 className="flex items-center gap-2 font-semibold">
            <Activity className="h-4 w-4 text-brand-500" /> Status breakdown
          </h2>
          <div className="mt-4 space-y-3">
            {byStatus
              .filter((b) => b.count > 0)
              .map((b) => (
                <div key={b.status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <StatusBadge status={b.status} />
                    <span className="font-medium">{b.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(b.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Latest shipments</h2>
            <Link
              href="/admin/shipments"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Manage all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-white/10">
                  <th className="pb-2 font-medium">Tracking</th>
                  <th className="pb-2 font-medium">Route</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, 8).map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 last:border-0 dark:border-white/5"
                  >
                    <td className="py-2.5">
                      <Link
                        href={`/admin/shipments/${s.id}`}
                        className="font-medium text-brand-600 hover:underline dark:text-brand-400"
                      >
                        {s.tracking_number}
                      </Link>
                      <div className="text-xs text-slate-400">
                        {formatDate(s.created_at)}
                      </div>
                    </td>
                    <td className="max-w-[180px] truncate py-2.5 text-slate-500">
                      {s.origin_address} → {s.dest_address}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="py-2.5 text-right font-medium">
                      {formatCurrency(s.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
