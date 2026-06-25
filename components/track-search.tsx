"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrackSearch({
  className,
  autoFocus = false,
  variant = "default",
}: {
  className?: string;
  autoFocus?: boolean;
  variant?: "default" | "hero";
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = value.trim().toUpperCase();
    if (code) router.push(`/track/${encodeURIComponent(code)}`);
  }

  if (variant === "hero") {
    return (
      <form
        onSubmit={submit}
        className={cn(
          "flex w-full flex-col gap-2 rounded-xl bg-white p-2 shadow-lift sm:flex-row sm:items-center",
          className
        )}
      >
        <div className="flex flex-1 items-center gap-2 px-2">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your tracking number"
            className="w-full bg-transparent py-3 text-base text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="btn-primary h-12 justify-center px-7 text-base sm:w-auto"
        >
          Track <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-white/10 dark:bg-white/[0.04]",
        className
      )}
    >
      <Search className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter tracking number e.g. SS-7F3K9A2QX1"
        className="w-full bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400"
      />
      <button type="submit" className="btn-primary shrink-0">
        Track
      </button>
    </form>
  );
}
