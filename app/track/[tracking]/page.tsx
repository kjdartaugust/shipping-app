import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageX, MapPin, Calendar, Truck } from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { TrackSearch } from "@/components/track-search";
import { StatusBadge } from "@/components/status-badge";
import { StatusProgress } from "@/components/status-progress";
import { TrackingTimeline } from "@/components/tracking-timeline";
import { MapView, type MapPoint } from "@/components/map/map-view";
import { getPublicTracking } from "@/lib/actions/tracking";
import { SERVICE_META } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { tracking: string };
}) {
  return { title: `Tracking ${decodeURIComponent(params.tracking)}` };
}

export default async function TrackResultPage({
  params,
}: {
  params: { tracking: string };
}) {
  const trackingNumber = decodeURIComponent(params.tracking);
  const data = await getPublicTracking(trackingNumber);

  const points: MapPoint[] = [];
  if (data) {
    if (data.origin_lat && data.origin_lng)
      points.push({
        lat: data.origin_lat,
        lng: data.origin_lng,
        label: data.origin_address,
        type: "origin",
      });
    const lastWithCoords = [...(data.events ?? [])]
      .reverse()
      .find((e) => e.lat && e.lng);
    if (
      lastWithCoords?.lat &&
      lastWithCoords?.lng &&
      data.status !== "delivered"
    )
      points.push({
        lat: lastWithCoords.lat,
        lng: lastWithCoords.lng,
        label: lastWithCoords.location || "Current location",
        type: "current",
      });
    if (data.dest_lat && data.dest_lng)
      points.push({
        lat: data.dest_lat,
        lng: data.dest_lng,
        label: data.dest_address,
        type: "destination",
      });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <TrackSearch className="mb-8" />

          {!data ? (
            <div className="card mx-auto max-w-lg p-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-500/10">
                <PackageX className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-xl font-bold">Shipment not found</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                We couldn&apos;t find a shipment with tracking number{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {trackingNumber}
                </span>
                . Double-check the number and try again.
              </p>
              <Link href="/track" className="btn-secondary mt-6">
                Try another number
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="space-y-6 lg:col-span-2">
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Tracking number
                      </p>
                      <p className="text-lg font-bold">{data.tracking_number}</p>
                    </div>
                    <StatusBadge status={data.status} />
                  </div>
                  <div className="mt-5">
                    <StatusProgress status={data.status} />
                  </div>
                  <dl className="mt-6 space-y-3 text-sm">
                    <Row
                      icon={<MapPin className="h-4 w-4 text-brand-500" />}
                      label="Origin"
                      value={data.origin_address}
                    />
                    <Row
                      icon={<MapPin className="h-4 w-4 text-emerald-500" />}
                      label="Destination"
                      value={data.dest_address}
                    />
                    <Row
                      icon={<Truck className="h-4 w-4 text-slate-400" />}
                      label="Service"
                      value={
                        SERVICE_META[
                          data.service_type as keyof typeof SERVICE_META
                        ]?.label ?? data.service_type
                      }
                    />
                    <Row
                      icon={<Calendar className="h-4 w-4 text-slate-400" />}
                      label="Est. delivery"
                      value={
                        data.estimated_delivery
                          ? formatDate(data.estimated_delivery)
                          : "—"
                      }
                    />
                  </dl>
                </div>

                <div className="card p-6">
                  <h3 className="mb-4 font-semibold">Tracking history</h3>
                  <TrackingTimeline events={data.events} />
                </div>
              </div>

              <div className="card overflow-hidden p-1.5 lg:col-span-3">
                <div className="h-[520px] w-full">
                  {points.length > 0 ? (
                    <MapView points={points} />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-slate-400">
                      Map coordinates not available for this shipment.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <dt className="text-xs text-slate-400">{label}</dt>
        <dd className="font-medium text-slate-700 dark:text-slate-200">
          {value}
        </dd>
      </div>
    </div>
  );
}
