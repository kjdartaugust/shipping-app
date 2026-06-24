import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { StatusProgress } from "@/components/status-progress";
import { TrackingTimeline } from "@/components/tracking-timeline";
import { MapView, type MapPoint } from "@/components/map/map-view";
import { ShipmentActions } from "@/components/dashboard/shipment-actions";
import { AssignAgent } from "@/components/admin/assign-agent";
import { DeleteShipment } from "@/components/admin/delete-shipment";
import { RealtimeRefresh } from "@/components/dashboard/realtime-refresh";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { SERVICE_META, PACKAGE_META } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Shipment, TrackingEvent, Profile } from "@/lib/types";

export default async function AdminShipmentDetail({
  params,
}: {
  params: { id: string };
}) {
  const admin = await requireAdmin();
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("shipments")
    .select(
      "*, tracking_events(*), sender:profiles!shipments_sender_id_fkey(id, full_name, email), agent:profiles!shipments_agent_id_fkey(id, full_name, email)"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();
  const s = data as Shipment & {
    tracking_events: TrackingEvent[];
    sender: Pick<Profile, "id" | "full_name" | "email">;
    agent: Pick<Profile, "id" | "full_name" | "email"> | null;
  };

  const { data: agentRows } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "agent");
  const agents = (agentRows ?? []) as Pick<
    Profile,
    "id" | "full_name" | "email"
  >[];

  const events = s.tracking_events ?? [];
  const points: MapPoint[] = [];
  if (s.origin_lat && s.origin_lng)
    points.push({ lat: s.origin_lat, lng: s.origin_lng, label: s.origin_address, type: "origin" });
  const last = [...events].reverse().find((e) => e.lat && e.lng);
  if (last?.lat && last?.lng && s.status !== "delivered")
    points.push({ lat: last.lat, lng: last.lng, label: last.location || "Current", type: "current" });
  if (s.dest_lat && s.dest_lng)
    points.push({ lat: s.dest_lat, lng: s.dest_lng, label: s.dest_address, type: "destination" });

  return (
    <div className="space-y-6">
      <RealtimeRefresh table="tracking_events" filter={`shipment_id=eq.${s.id}`} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/shipments"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold">
              {s.tracking_number} <StatusBadge status={s.status} />
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              From {s.sender?.full_name || s.sender?.email} ·{" "}
              {formatDate(s.created_at, true)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/shipments/${s.id}/waybill`}
            className="btn-secondary"
          >
            <FileText className="h-4 w-4" /> Waybill
          </Link>
          <DeleteShipment shipmentId={s.id} />
        </div>
      </div>

      <div className="card p-6">
        <StatusProgress status={s.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="card overflow-hidden p-1.5">
            <div className="h-[360px] w-full">
              {points.length > 0 ? (
                <MapView points={points} />
              ) : (
                <div className="grid h-full place-items-center text-sm text-slate-400">
                  No map coordinates.
                </div>
              )}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Tracking history</h2>
            <TrackingTimeline events={events} />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Assignment</h2>
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
              Delivery agent
            </p>
            <AssignAgent
              shipmentId={s.id}
              agentId={s.agent?.id ?? null}
              agents={agents}
            />
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Details</h2>
            <dl className="space-y-2.5 text-sm">
              <Row label="Recipient" value={s.recipient_name} />
              <Row label="Origin" value={s.origin_address} />
              <Row label="Destination" value={s.dest_address} />
              <Row label="Package" value={PACKAGE_META[s.package_type].label} />
              <Row label="Weight" value={`${s.weight_kg} kg`} />
              <Row label="Service" value={SERVICE_META[s.service_type].label} />
              <Row label="Price" value={formatCurrency(s.price)} />
            </dl>
          </div>

          <ShipmentActions
            shipmentId={s.id}
            status={s.status}
            role={admin.role}
            isOwner={false}
          />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-700 dark:text-slate-200">
        {value}
      </dd>
    </div>
  );
}
