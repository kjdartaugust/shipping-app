import { redirect } from "next/navigation";
import { Truck, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ShipmentRow } from "@/components/dashboard/shipment-row";
import { EmptyState } from "@/components/empty-state";
import { RealtimeRefresh } from "@/components/dashboard/realtime-refresh";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Shipment } from "@/lib/types";

export const metadata = { title: "My Deliveries" };

export default async function DeliveriesPage() {
  const profile = await requireProfile();
  if (profile.role === "customer") redirect("/dashboard");

  const supabase = createClient();
  const { data } = await supabase
    .from("shipments")
    .select("*")
    .eq("agent_id", profile.id)
    .order("created_at", { ascending: false });

  const list = (data ?? []) as Shipment[];
  const active = list.filter(
    (s) => !["delivered", "cancelled"].includes(s.status)
  );
  const delivered = list.filter((s) => s.status === "delivered");

  return (
    <div className="space-y-6">
      <RealtimeRefresh table="shipments" filter={`agent_id=eq.${profile.id}`} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Deliveries</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Shipments assigned to you for delivery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned" value={list.length} icon={Truck} />
        <StatCard label="Active" value={active.length} icon={Clock} accent="amber" />
        <StatCard
          label="Completed"
          value={delivered.length}
          icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No deliveries assigned"
          description="When an admin assigns you a shipment, it will show up here."
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
