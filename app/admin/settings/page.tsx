import { Settings, DollarSign, Truck, Database } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { PRICING, SERVICE_META, BRAND } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Platform configuration reference.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <DollarSign className="h-4 w-4 text-brand-500" /> Pricing model
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Defined in <code>lib/constants.ts</code> and applied by{" "}
          <code>calculateQuote()</code>.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <Item label="Base fee" value={formatCurrency(PRICING.base)} />
          <Item label="Per kg" value={formatCurrency(PRICING.perKg)} />
          <Item label="Per km" value={formatCurrency(PRICING.perKm)} />
          <Item
            label="Fragile surcharge"
            value={formatCurrency(PRICING.fragileSurcharge)}
          />
          <Item
            label="Insurance rate"
            value={`${(PRICING.insuranceRate * 100).toFixed(1)}%`}
          />
        </dl>
      </div>

      <div className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <Truck className="h-4 w-4 text-brand-500" /> Service levels
        </h2>
        <dl className="mt-4 space-y-2.5">
          {Object.values(SERVICE_META).map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium">{s.label}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {s.eta} · ×{s.multiplier}
              </span>
            </div>
          ))}
        </dl>
      </div>

      <div className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <Database className="h-4 w-4 text-brand-500" /> System
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <Item label="Brand" value={BRAND.name} />
          <Item label="Backend" value="Supabase (Postgres)" />
          <Item label="Framework" value="Next.js 14 App Router" />
          <Item label="Maps" value="Leaflet + OpenStreetMap" />
        </dl>
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
          To change pricing or service levels, edit{" "}
          <code>lib/constants.ts</code> and redeploy. Role management lives under
          Users &amp; Agents.
        </p>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}
