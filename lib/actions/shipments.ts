"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import {
  calculateQuote,
  generateTrackingNumber,
  haversineKm,
} from "@/lib/utils";
import { SERVICE_META } from "@/lib/constants";
import type {
  PackageType,
  ServiceType,
  ShipmentStatus,
} from "@/lib/types";

export type FormState = { error?: string; success?: string } | null;

function num(v: FormDataEntryValue | null, fallback = 0) {
  const n = parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : fallback;
}

/** Create a new shipment. Price + tracking number are computed server-side. */
export async function createShipment(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const profile = await requireProfile();
  const supabase = createClient();

  const origin_lat = num(formData.get("origin_lat"), NaN);
  const origin_lng = num(formData.get("origin_lng"), NaN);
  const dest_lat = num(formData.get("dest_lat"), NaN);
  const dest_lng = num(formData.get("dest_lng"), NaN);

  const weight_kg = num(formData.get("weight_kg"), 1);
  const service_type = (formData.get("service_type") ||
    "standard") as ServiceType;
  const package_type = (formData.get("package_type") ||
    "parcel") as PackageType;
  const declared_value = num(formData.get("declared_value"), 0);

  const recipient_name = String(formData.get("recipient_name") || "").trim();
  const origin_address = String(formData.get("origin_address") || "").trim();
  const dest_address = String(formData.get("dest_address") || "").trim();

  if (!recipient_name || !origin_address || !dest_address)
    return { error: "Recipient and both addresses are required." };

  const distanceKm =
    Number.isFinite(origin_lat) &&
    Number.isFinite(origin_lng) &&
    Number.isFinite(dest_lat) &&
    Number.isFinite(dest_lng)
      ? haversineKm(
          { lat: origin_lat, lng: origin_lng },
          { lat: dest_lat, lng: dest_lng }
        )
      : 250; // sensible default when geocoding is unavailable

  const price = calculateQuote({
    weightKg: weight_kg,
    distanceKm,
    service: service_type,
    packageType: package_type,
    declaredValue: declared_value,
  });

  const etaDays =
    service_type === "overnight" ? 1 : service_type === "express" ? 2 : 5;
  const estimated_delivery = new Date(
    Date.now() + etaDays * 86400000
  ).toISOString();

  const { data, error } = await supabase
    .from("shipments")
    .insert({
      tracking_number: generateTrackingNumber(),
      sender_id: profile.id,
      recipient_name,
      recipient_phone: String(formData.get("recipient_phone") || "") || null,
      recipient_email: String(formData.get("recipient_email") || "") || null,
      origin_address,
      origin_lat: Number.isFinite(origin_lat) ? origin_lat : null,
      origin_lng: Number.isFinite(origin_lng) ? origin_lng : null,
      dest_address,
      dest_lat: Number.isFinite(dest_lat) ? dest_lat : null,
      dest_lng: Number.isFinite(dest_lng) ? dest_lng : null,
      package_type,
      weight_kg,
      length_cm: num(formData.get("length_cm")) || null,
      width_cm: num(formData.get("width_cm")) || null,
      height_cm: num(formData.get("height_cm")) || null,
      declared_value: declared_value || null,
      service_type,
      price,
      notes: String(formData.get("notes") || "") || null,
      estimated_delivery,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/shipments");
  redirect(`/dashboard/shipments/${data.id}`);
}

/** Advance / set a shipment's status (agent or admin). Trigger logs the event. */
export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  location?: string
) {
  const profile = await requireProfile();
  if (profile.role === "customer")
    return { error: "Not authorized." };

  const supabase = createClient();
  const payload: Record<string, unknown> = { status };
  if (status === "delivered") payload.estimated_delivery = new Date().toISOString();

  const { error } = await supabase
    .from("shipments")
    .update(payload)
    .eq("id", shipmentId);

  if (error) return { error: error.message };

  // Optional richer tracking row with a custom location label.
  if (location) {
    await supabase.from("tracking_events").insert({
      shipment_id: shipmentId,
      status,
      location,
      note: `Scanned at ${location}`,
    });
  }

  revalidatePath(`/dashboard/shipments/${shipmentId}`);
  revalidatePath("/admin/shipments");
  revalidatePath("/dashboard/deliveries");
  return { success: "Status updated." };
}

/** Cancel a shipment (owner only, before pickup). */
export async function cancelShipment(shipmentId: string) {
  const profile = await requireProfile();
  const supabase = createClient();
  const { data: shipment } = await supabase
    .from("shipments")
    .select("sender_id, status")
    .eq("id", shipmentId)
    .single();

  if (!shipment || shipment.sender_id !== profile.id)
    return { error: "Not authorized." };
  if (!["pending", "confirmed"].includes(shipment.status))
    return { error: "This shipment can no longer be cancelled." };

  const { error } = await supabase
    .from("shipments")
    .update({ status: "cancelled" })
    .eq("id", shipmentId);

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/shipments/${shipmentId}`);
  return { success: "Shipment cancelled." };
}

/** Assign a delivery agent to a shipment (admin only). */
export async function assignAgent(shipmentId: string, agentId: string | null) {
  const profile = await requireProfile();
  if (profile.role !== "admin") return { error: "Not authorized." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("shipments")
    .update({
      agent_id: agentId,
      status: agentId ? "confirmed" : "pending",
    })
    .eq("id", shipmentId);

  if (error) return { error: error.message };

  if (agentId) {
    await admin.from("notifications").insert({
      user_id: agentId,
      title: "New delivery assigned",
      message: "You have been assigned a new shipment to deliver.",
      type: "info",
      link: `/dashboard/deliveries`,
    });
  }

  revalidatePath("/admin/shipments");
  revalidatePath(`/admin/shipments/${shipmentId}`);
  return { success: "Agent assigned." };
}

/** Permanently delete a shipment (admin only). */
export async function deleteShipment(shipmentId: string) {
  const profile = await requireProfile();
  if (profile.role !== "admin") return { error: "Not authorized." };
  const admin = createAdminClient();
  const { error } = await admin.from("shipments").delete().eq("id", shipmentId);
  if (error) return { error: error.message };
  revalidatePath("/admin/shipments");
  return { success: "Shipment deleted." };
}
