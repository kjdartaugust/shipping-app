import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { STATUS_META, SERVICE_META, PACKAGE_META } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Shipment, ShipmentStatus, Profile } from "@/lib/types";

/** Escape a value for CSV (RFC 4180): wrap in quotes, double internal quotes. */
function cell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * GET /admin/shipments/export — streams all shipments (optionally filtered by
 * ?status= and ?q=) as a CSV download. Admin only.
 */
export async function GET(request: NextRequest) {
  await requireAdmin();
  const supabase = createAdminClient();

  let query = supabase
    .from("shipments")
    .select(
      "*, sender:profiles!shipments_sender_id_fkey(full_name, email), agent:profiles!shipments_agent_id_fkey(full_name, email)"
    )
    .order("created_at", { ascending: false });

  const status = request.nextUrl.searchParams.get("status") as
    | ShipmentStatus
    | null;
  const q = request.nextUrl.searchParams.get("q");
  if (status && STATUS_META[status]) query = query.eq("status", status);
  if (q) query = query.ilike("tracking_number", `%${q}%`);

  const { data } = await query;
  const rows = (data ?? []) as (Shipment & {
    sender: Pick<Profile, "full_name" | "email"> | null;
    agent: Pick<Profile, "full_name" | "email"> | null;
  })[];

  const headers = [
    "Tracking Number",
    "Status",
    "Service",
    "Package",
    "Weight (kg)",
    "Sender",
    "Sender Email",
    "Recipient",
    "Recipient Phone",
    "Origin",
    "Destination",
    "Agent",
    "Price (USD)",
    "Declared Value",
    "Created",
    "Est. Delivery",
  ];

  const lines = rows.map((s) =>
    [
      s.tracking_number,
      STATUS_META[s.status].label,
      SERVICE_META[s.service_type].label,
      PACKAGE_META[s.package_type].label,
      s.weight_kg,
      s.sender?.full_name || s.sender?.email || "",
      s.sender?.email || "",
      s.recipient_name,
      s.recipient_phone || "",
      s.origin_address,
      s.dest_address,
      s.agent?.full_name || s.agent?.email || "Unassigned",
      Number(s.price).toFixed(2),
      s.declared_value ?? "",
      formatDate(s.created_at, true),
      s.estimated_delivery ? formatDate(s.estimated_delivery) : "",
    ]
      .map(cell)
      .join(",")
  );

  const csv = [headers.map(cell).join(","), ...lines].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="swiftship-shipments-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
