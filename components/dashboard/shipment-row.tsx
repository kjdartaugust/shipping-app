import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Shipment } from "@/lib/types";

export function ShipmentRow({
  shipment,
  href,
}: {
  shipment: Shipment;
  href?: string;
}) {
  const link = href ?? `/dashboard/shipments/${shipment.id}`;
  return (
    <Link
      href={link}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-soft dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-brand-500/40"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">
            {shipment.tracking_number}
          </span>
          <StatusBadge status={shipment.status} />
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {shipment.origin_address} → {shipment.dest_address}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          To {shipment.recipient_name} · {formatDate(shipment.created_at)}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="font-semibold">{formatCurrency(shipment.price)}</p>
        <p className="text-xs text-slate-400 capitalize">
          {shipment.service_type}
        </p>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-brand-500" />
    </Link>
  );
}
