import Link from "next/link";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

export function Logo({
  href = "/",
  className,
  compact = false,
  tone = "default",
}: {
  href?: string;
  className?: string;
  compact?: boolean;
  tone?: "default" | "light";
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-9 w-11 place-items-center overflow-hidden rounded-md bg-accent-500 text-brand-600 shadow-sm transition group-hover:scale-105">
        <span className="absolute inset-x-0 top-0 h-1 bg-brand-600" />
        <Truck className="h-5 w-5" strokeWidth={2.6} />
      </span>
      {!compact && (
        <span
          className={cn(
            "text-lg font-extrabold uppercase tracking-tight",
            tone === "light" ? "text-white" : "text-slate-900 dark:text-white"
          )}
        >
          Swift<span className="text-brand-600">Ship</span>
        </span>
      )}
      <span className="sr-only">{BRAND.name}</span>
    </Link>
  );
}
