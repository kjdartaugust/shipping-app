import { Check } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { STATUS_META } from "@/lib/constants";
import type { TrackingEvent } from "@/lib/types";

export function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  const ordered = [...events].sort(
    (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
  );

  if (ordered.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No tracking updates yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-6 pl-2">
      {ordered.map((ev, i) => {
        const meta = STATUS_META[ev.status];
        const isLast = i === ordered.length - 1;
        return (
          <li key={ev.id} className="relative flex gap-4">
            {!isLast && (
              <span className="absolute left-[11px] top-7 h-full w-px bg-slate-200 dark:bg-white/10" />
            )}
            <span
              className={cn(
                "z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                isLast
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-400 dark:bg-white/[0.06]"
              )}
            >
              <Check className="h-3.5 w-3.5" />
            </span>
            <div className="-mt-0.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{meta.label}</span>
                <span className={cn("badge", meta.color)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                  Update
                </span>
              </div>
              {ev.location && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {ev.location}
                </p>
              )}
              {ev.note && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {ev.note}
                </p>
              )}
              <p className="mt-0.5 text-xs text-slate-400">
                {formatDate(ev.created_at, true)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
