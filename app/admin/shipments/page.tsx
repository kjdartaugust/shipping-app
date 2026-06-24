import Link from "next/link";
import { Package } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { AssignAgent } from "@/components/admin/assign-agent";
import { EmptyState } from "@/components/empty-state";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { STATUS_META } from "@/lib/constants";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Shipment, ShipmentStatus, Profile } from "@/lib/types";

export const metadata = { title: "Manage Shipments" };

export default async function AdminShipmentsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  let query = supabase
    .from("shipments")
    .select("*, agent:profiles!shipments_agent_id_fkey(id, full_name, email)")
    .order("created_at", { ascending: false });

  const status = searchParams.status as ShipmentStatus | undefined;
  if (status && STATUS_META[status]) query = query.eq("status", status);
  if (searchParams.q)
    query = query.ilike("tracking_number", `%${searchParams.q}%`);

  const [{ data: shipments }, { data: agentRows }] = await Promise.all([
    query,
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "agent"),
  ]);

  const list = (shipments ?? []) as (Shipment & {
    agent: Pick<Profile, "id" | "full_name" | "email"> | null;
  })[];
  const agents = (agentRows ?? []) as Pick<
    Profile,
    "id" | "full_name" | "email"
  >[];

  const filters = [
    { key: "", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "in_transit", label: "In Transit" },
    { key: "delivered", label: "Delivered" },
    { key: "exception", label: "Exception" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Shipments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {list.length} shipment{list.length === 1 ? "" : "s"} across the
          platform.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = (status ?? "") === f.key;
            return (
              <Link
                key={f.key}
                href={f.key ? `/admin/shipments?status=${f.key}` : "/admin/shipments"}
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
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder="Search tracking #"
            className="input max-w-[200px] py-1.5"
          />
          <button className="btn-secondary py-1.5">Search</button>
        </form>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Package} title="No shipments match" />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-white/10">
                <th className="p-4 font-medium">Tracking</th>
                <th className="p-4 font-medium">Route</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Agent</th>
                <th className="p-4 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.02]"
                >
                  <td className="p-4">
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
                  <td className="max-w-[200px] truncate p-4 text-slate-500">
                    {s.origin_address} → {s.dest_address}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="p-4">
                    <AssignAgent
                      shipmentId={s.id}
                      agentId={s.agent?.id ?? null}
                      agents={agents}
                    />
                  </td>
                  <td className="p-4 text-right font-medium">
                    {formatCurrency(s.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
