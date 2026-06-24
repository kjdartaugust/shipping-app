import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/constants";
import type { ShipmentStatus } from "@/lib/types";

export function StatusBadge({
  status,
  className,
}: {
  status: ShipmentStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span className={cn("badge", meta.color, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
