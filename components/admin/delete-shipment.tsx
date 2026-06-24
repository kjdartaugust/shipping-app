"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { deleteShipment } from "@/lib/actions/shipments";

export function DeleteShipment({ shipmentId }: { shipmentId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onDelete() {
    if (!confirm("Permanently delete this shipment? This cannot be undone."))
      return;
    start(async () => {
      const res = await deleteShipment(shipmentId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Shipment deleted");
        router.push("/admin/shipments");
      }
    });
  }

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className="btn-secondary text-rose-600 dark:text-rose-400"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      Delete
    </button>
  );
}
