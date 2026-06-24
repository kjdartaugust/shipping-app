import Link from "next/link";
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { RealtimeRefresh } from "@/components/dashboard/realtime-refresh";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { markAllRead, markRead } from "@/lib/actions/notifications";
import { formatDate, cn } from "@/lib/utils";
import type { Notification } from "@/lib/types";

export const metadata = { title: "Notifications" };

const typeIcon = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};
const typeColor = {
  info: "text-brand-500 bg-brand-50 dark:bg-brand-500/10",
  success: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  warning: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  error: "text-rose-500 bg-rose-50 dark:bg-rose-500/10",
};

export default async function NotificationsPage() {
  const profile = await requireProfile();
  const supabase = createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (data ?? []) as Notification[];
  const hasUnread = list.some((n) => !n.read);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <RealtimeRefresh table="notifications" filter={`user_id=eq.${profile.id}`} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Updates about your shipments and account.
          </p>
        </div>
        {hasUnread && (
          <form action={markAllRead}>
            <button className="btn-secondary" type="submit">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          </form>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="Notifications about your shipments will appear here."
        />
      ) : (
        <div className="space-y-2">
          {list.map((n) => {
            const Icon = typeIcon[n.type];
            const inner = (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 transition",
                  n.read
                    ? "border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.02]"
                    : "border-brand-200 bg-brand-50/50 dark:border-brand-500/30 dark:bg-brand-500/[0.06]"
                )}
              >
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", typeColor[n.type])}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{n.title}</p>
                    {!n.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(n.created_at, true)}
                  </p>
                </div>
              </div>
            );
            return (
              <form key={n.id} action={markRead.bind(null, n.id)}>
                {n.link ? (
                  <Link href={n.link} className="block">
                    {inner}
                  </Link>
                ) : (
                  <button type="submit" className="block w-full text-left">
                    {inner}
                  </button>
                )}
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}
