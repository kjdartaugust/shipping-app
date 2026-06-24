import { cn } from "@/lib/utils";
import { STATUS_FLOW, STATUS_META } from "@/lib/constants";
import type { ShipmentStatus } from "@/lib/types";

export function StatusProgress({ status }: { status: ShipmentStatus }) {
  const isDerailed = status === "cancelled" || status === "exception";
  const currentStep = STATUS_META[status].step;

  if (isDerailed) {
    return (
      <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
        This shipment is {STATUS_META[status].label.toLowerCase()}.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center">
        {STATUS_FLOW.map((s, i) => {
          const done = STATUS_META[s].step <= currentStep;
          const active = STATUS_META[s].step === currentStep;
          return (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div
                className={cn(
                  "relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold transition",
                  done
                    ? "bg-brand-600 text-white"
                    : "bg-slate-200 text-slate-400 dark:bg-white/10"
                )}
              >
                {active && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/40" />
                )}
                {i + 1}
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full transition",
                    STATUS_META[STATUS_FLOW[i + 1]].step <= currentStep
                      ? "bg-brand-600"
                      : "bg-slate-200 dark:bg-white/10"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between">
        {STATUS_FLOW.map((s) => (
          <span
            key={s}
            className="hidden w-16 text-center text-[10px] font-medium text-slate-500 first:text-left last:text-right sm:block dark:text-slate-400"
          >
            {STATUS_META[s].label}
          </span>
        ))}
      </div>
    </div>
  );
}
