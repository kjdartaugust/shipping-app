"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban, ChevronRight, Loader2 } from "lucide-react";
import {
  cancelShipment,
  updateShipmentStatus,
} from "@/lib/actions/shipments";
import { STATUS_FLOW, STATUS_META } from "@/lib/constants";
import type { ShipmentStatus, UserRole } from "@/lib/types";

export function ShipmentActions({
  shipmentId,
  status,
  role,
  isOwner,
}: {
  shipmentId: string;
  status: ShipmentStatus;
  role: UserRole;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [location, setLocation] = useState("");

  const canManage = role === "agent" || role === "admin";
  const currentIdx = STATUS_FLOW.indexOf(status);
  const nextStatus =
    currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentIdx + 1]
      : null;
  const canCancel =
    isOwner && ["pending", "confirmed"].includes(status);

  function advance(to: ShipmentStatus) {
    start(async () => {
      const res = await updateShipmentStatus(shipmentId, to, location || undefined);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(`Marked as ${STATUS_META[to].label}`);
        setLocation("");
        router.refresh();
      }
    });
  }

  function doCancel() {
    if (!confirm("Cancel this shipment? This cannot be undone.")) return;
    start(async () => {
      const res = await cancelShipment(shipmentId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Shipment cancelled");
        router.refresh();
      }
    });
  }

  if (!canManage && !canCancel) return null;

  return (
    <div className="card space-y-4 p-6">
      <h2 className="font-semibold">Manage shipment</h2>

      {canManage && (
        <div className="space-y-3">
          <div>
            <label className="label">Current location (optional)</label>
            <input
              className="input"
              placeholder="e.g. Kumasi Sorting Hub"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {nextStatus ? (
            <button
              onClick={() => advance(nextStatus)}
              disabled={pending}
              className="btn-primary w-full"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Advance to {STATUS_META[nextStatus].label}
            </button>
          ) : (
            <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              This shipment has reached its final status.
            </p>
          )}
          {status !== "exception" && status !== "delivered" && (
            <button
              onClick={() => advance("exception")}
              disabled={pending}
              className="btn-secondary w-full text-rose-600 dark:text-rose-400"
            >
              Flag exception
            </button>
          )}
        </div>
      )}

      {canCancel && (
        <button
          onClick={doCancel}
          disabled={pending}
          className="btn-secondary w-full text-rose-600 dark:text-rose-400"
        >
          <Ban className="h-4 w-4" /> Cancel shipment
        </button>
      )}
    </div>
  );
}
