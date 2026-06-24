import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck } from "lucide-react";
import Barcode from "@/components/barcode";
import { PrintButton } from "@/components/print-button";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BRAND, SERVICE_META, PACKAGE_META, PRICING } from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  generateInvoiceNumber,
  haversineKm,
} from "@/lib/utils";
import type { Shipment, Profile } from "@/lib/types";

export const metadata = { title: "Waybill" };

export default async function WaybillPage({
  params,
}: {
  params: { id: string };
}) {
  await requireProfile();
  const supabase = createClient();

  const { data } = await supabase
    .from("shipments")
    .select("*, sender:profiles!shipments_sender_id_fkey(*)")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();
  const s = data as Shipment & { sender: Profile };

  const distanceKm =
    s.origin_lat && s.origin_lng && s.dest_lat && s.dest_lng
      ? Math.round(
          haversineKm(
            { lat: s.origin_lat, lng: s.origin_lng },
            { lat: s.dest_lat, lng: s.dest_lng }
          )
        )
      : 250;

  // Reconstruct the invoice line items from the same pricing model.
  const weightCost = s.weight_kg * PRICING.perKg;
  const distanceCost = distanceKm * PRICING.perKm;
  const fragile = s.package_type === "fragile" ? PRICING.fragileSurcharge : 0;
  const insurance = (s.declared_value ?? 0) * PRICING.insuranceRate;
  const multiplier = SERVICE_META[s.service_type].multiplier;

  const lineItems = [
    { label: "Base handling fee", amount: PRICING.base },
    { label: `Weight (${s.weight_kg} kg × ${formatCurrency(PRICING.perKg)})`, amount: weightCost },
    { label: `Distance (${distanceKm} km × ${formatCurrency(PRICING.perKm)})`, amount: distanceCost },
    ...(fragile ? [{ label: "Fragile surcharge", amount: fragile }] : []),
    ...(insurance ? [{ label: "Insurance (1% of declared value)", amount: insurance }] : []),
  ];
  const subtotal = lineItems.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/dashboard/shipments/${s.id}`}
          className="btn-ghost"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shipment
        </Link>
        <PrintButton label="Print / Save PDF" />
      </div>

      <div className="card overflow-hidden bg-white p-0 text-slate-900 dark:bg-white">
        {/* Header */}
        <div className="flex items-start justify-between bg-brand-700 p-8 text-white">
          <div>
            <div className="flex items-center gap-2 text-xl font-extrabold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                <Truck className="h-5 w-5" />
              </span>
              {BRAND.name}
            </div>
            <p className="mt-2 text-sm text-brand-100">
              {BRAND.tagline}
              <br />
              support@swiftship.example · +233 30 000 0000
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">WAYBILL</h1>
            <p className="mt-1 text-sm text-brand-100">
              Invoice {generateInvoiceNumber()}
            </p>
            <p className="text-sm text-brand-100">
              Date {formatDate(s.created_at)}
            </p>
          </div>
        </div>

        {/* Tracking barcode */}
        <div className="flex flex-col items-center gap-2 border-b border-slate-200 py-6">
          <Barcode value={s.tracking_number} />
          <p className="text-lg font-bold tracking-widest">
            {s.tracking_number}
          </p>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-6 p-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sender
            </h2>
            <p className="mt-2 font-semibold">
              {s.sender?.full_name || s.sender?.email}
            </p>
            <p className="text-sm text-slate-600">{s.origin_address}</p>
            {s.sender?.phone && (
              <p className="text-sm text-slate-600">{s.sender.phone}</p>
            )}
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recipient
            </h2>
            <p className="mt-2 font-semibold">{s.recipient_name}</p>
            <p className="text-sm text-slate-600">{s.dest_address}</p>
            {s.recipient_phone && (
              <p className="text-sm text-slate-600">{s.recipient_phone}</p>
            )}
          </div>
        </div>

        {/* Package + service grid */}
        <div className="mx-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
          {[
            { k: "Service", v: SERVICE_META[s.service_type].label },
            { k: "Package", v: PACKAGE_META[s.package_type].label },
            { k: "Weight", v: `${s.weight_kg} kg` },
            {
              k: "Est. delivery",
              v: s.estimated_delivery ? formatDate(s.estimated_delivery) : "—",
            },
          ].map((c) => (
            <div key={c.k} className="bg-white p-4">
              <p className="text-xs text-slate-400">{c.k}</p>
              <p className="font-semibold">{c.v}</p>
            </div>
          ))}
        </div>

        {/* Charges */}
        <div className="p-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Charges
          </h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {lineItems.map((li) => (
                <tr key={li.label} className="border-b border-slate-100">
                  <td className="py-2 text-slate-600">{li.label}</td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(li.amount)}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-600">Subtotal</td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(subtotal)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-600">
                  {SERVICE_META[s.service_type].label} multiplier
                </td>
                <td className="py-2 text-right font-medium">×{multiplier}</td>
              </tr>
              <tr>
                <td className="py-3 text-base font-bold">Total due</td>
                <td className="py-3 text-right text-base font-bold text-brand-700">
                  {formatCurrency(s.price)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-8 py-5 text-center text-xs text-slate-400">
          Thank you for shipping with {BRAND.name}. This is a computer-generated
          document and is valid without signature.
        </div>
      </div>
    </div>
  );
}
