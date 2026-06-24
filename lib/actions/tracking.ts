"use server";

import { createAdminClient } from "@/lib/supabase/server";
import type { ShipmentStatus, TrackingEvent } from "@/lib/types";

export interface PublicTracking {
  tracking_number: string;
  status: ShipmentStatus;
  service_type: string;
  origin_address: string;
  origin_lat: number | null;
  origin_lng: number | null;
  dest_address: string;
  dest_lat: number | null;
  dest_lng: number | null;
  recipient_name: string;
  estimated_delivery: string | null;
  created_at: string;
  events: TrackingEvent[];
}

/**
 * Public, unauthenticated tracking lookup. Uses the service-role client but
 * only ever returns a curated, non-sensitive subset of fields.
 */
export async function getPublicTracking(
  trackingNumber: string
): Promise<PublicTracking | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabase = createAdminClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select(
      "id, tracking_number, status, service_type, origin_address, origin_lat, origin_lng, dest_address, dest_lat, dest_lng, recipient_name, estimated_delivery, created_at"
    )
    .eq("tracking_number", trackingNumber.toUpperCase())
    .maybeSingle();

  if (!shipment) return null;

  const { data: events } = await supabase
    .from("tracking_events")
    .select("*")
    .eq("shipment_id", shipment.id)
    .order("created_at", { ascending: true });

  // Mask the recipient name for privacy on the public page.
  const masked = shipment.recipient_name
    ? shipment.recipient_name.replace(/(?<=\S)\S(?=\S)/g, "•")
    : "";

  return {
    ...shipment,
    recipient_name: masked,
    events: events ?? [],
  } as PublicTracking;
}
