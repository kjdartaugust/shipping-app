"use client";

import { useFormState } from "react-dom";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  MapPin,
  Package,
  User,
  Gauge,
  Receipt,
} from "lucide-react";
import { createShipment, type FormState } from "@/lib/actions/shipments";
import { SubmitButton } from "@/components/submit-button";
import { CITIES, findCity } from "@/lib/cities";
import { SERVICE_META, PACKAGE_META } from "@/lib/constants";
import { calculateQuote, formatCurrency, haversineKm } from "@/lib/utils";
import type { PackageType, ServiceType } from "@/lib/types";

export function BookingForm() {
  const [state, formAction] = useFormState<FormState, FormData>(
    createShipment,
    null
  );

  const [origin, setOrigin] = useState("Accra, Ghana");
  const [dest, setDest] = useState("Kumasi, Ghana");
  const [weight, setWeight] = useState(2);
  const [service, setService] = useState<ServiceType>("standard");
  const [pkg, setPkg] = useState<PackageType>("parcel");
  const [declared, setDeclared] = useState(0);

  const oCity = findCity(origin);
  const dCity = findCity(dest);

  const distanceKm = useMemo(() => {
    if (oCity && dCity)
      return Math.round(
        haversineKm(
          { lat: oCity.lat, lng: oCity.lng },
          { lat: dCity.lat, lng: dCity.lng }
        )
      );
    return 250;
  }, [oCity, dCity]);

  const quote = useMemo(
    () =>
      calculateQuote({
        weightKg: weight || 0,
        distanceKm,
        service,
        packageType: pkg,
        declaredValue: declared || 0,
      }),
    [weight, distanceKm, service, pkg, declared]
  );

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-3">
      {/* hidden geocoded coords */}
      <input type="hidden" name="origin_lat" value={oCity?.lat ?? ""} />
      <input type="hidden" name="origin_lng" value={oCity?.lng ?? ""} />
      <input type="hidden" name="dest_lat" value={dCity?.lat ?? ""} />
      <input type="hidden" name="dest_lng" value={dCity?.lng ?? ""} />

      <div className="space-y-6 lg:col-span-2">
        {/* Route */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <MapPin className="h-4 w-4 text-brand-500" /> Route
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Origin city</label>
              <select
                name="origin_address"
                className="input"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Destination city</label>
              <select
                name="dest_address"
                className="input"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Estimated distance: <strong>{distanceKm} km</strong>
          </p>
        </section>

        {/* Recipient */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <User className="h-4 w-4 text-brand-500" /> Recipient
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Full name</label>
              <input
                name="recipient_name"
                required
                className="input"
                placeholder="Kwame Boateng"
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                name="recipient_phone"
                className="input"
                placeholder="+233 20 000 0000"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                name="recipient_email"
                type="email"
                className="input"
                placeholder="recipient@example.com"
              />
            </div>
          </div>
        </section>

        {/* Package */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Package className="h-4 w-4 text-brand-500" /> Package details
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Package type</label>
              <select
                name="package_type"
                className="input"
                value={pkg}
                onChange={(e) => setPkg(e.target.value as PackageType)}
              >
                {Object.entries(PACKAGE_META).map(([key, m]) => (
                  <option key={key} value={key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input
                name="weight_kg"
                type="number"
                min={0.1}
                step={0.1}
                required
                className="input"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <div>
                <label className="label">L (cm)</label>
                <input name="length_cm" type="number" min={0} className="input" />
              </div>
              <div>
                <label className="label">W (cm)</label>
                <input name="width_cm" type="number" min={0} className="input" />
              </div>
              <div>
                <label className="label">H (cm)</label>
                <input name="height_cm" type="number" min={0} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Declared value (USD)</label>
              <input
                name="declared_value"
                type="number"
                min={0}
                step={1}
                className="input"
                value={declared}
                onChange={(e) => setDeclared(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <input
                name="notes"
                className="input"
                placeholder="Handle with care…"
              />
            </div>
          </div>
        </section>

        {/* Service */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Gauge className="h-4 w-4 text-brand-500" /> Service level
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(Object.keys(SERVICE_META) as ServiceType[]).map((key) => {
              const m = SERVICE_META[key];
              const active = service === key;
              return (
                <label
                  key={key}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    active
                      ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500 dark:bg-brand-500/10"
                      : "border-slate-200 hover:border-brand-300 dark:border-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="service_type"
                    value={key}
                    checked={active}
                    onChange={() => setService(key)}
                    className="sr-only"
                  />
                  <span className="font-semibold">{m.label}</span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {m.eta}
                  </span>
                  <span className="mt-2 block text-sm font-medium text-brand-600 dark:text-brand-400">
                    ×{m.multiplier} rate
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="card sticky top-20 p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Receipt className="h-4 w-4 text-brand-500" /> Quote summary
          </h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Line label="Route" value={`${distanceKm} km`} />
            <Line label="Weight" value={`${weight || 0} kg`} />
            <Line
              label="Service"
              value={SERVICE_META[service].label}
            />
            <Line label="Package" value={PACKAGE_META[pkg].label} />
            {declared > 0 && (
              <Line label="Insurance" value={`${formatCurrency(declared)} value`} />
            )}
          </dl>
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
            <div className="flex items-end justify-between">
              <span className="text-sm text-slate-500">Estimated total</span>
              <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                {formatCurrency(quote)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Final price confirmed at checkout.
            </p>
          </div>

          {state?.error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <SubmitButton className="mt-5 w-full" pendingText="Booking…">
            Confirm &amp; book
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
