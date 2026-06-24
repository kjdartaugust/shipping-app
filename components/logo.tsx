import Link from "next/link";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

export function Logo({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft transition group-hover:scale-105">
        <Truck className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="text-lg font-extrabold tracking-tight">
          Swift<span className="text-brand-600 dark:text-brand-400">Ship</span>
        </span>
      )}
      <span className="sr-only">{BRAND.name}</span>
    </Link>
  );
}
