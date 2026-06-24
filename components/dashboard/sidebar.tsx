"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Bell,
  User,
  Users,
  Truck,
  Map,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import type { UserRole } from "@/lib/types";

const customerNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/shipments", label: "My Shipments", icon: Package },
  { href: "/dashboard/new", label: "Book Shipment", icon: PlusCircle },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const agentNav = [
  { href: "/dashboard/deliveries", label: "My Deliveries", icon: Truck },
];

const adminNav = [
  { href: "/admin", label: "Admin Overview", icon: ShieldCheck, exact: true },
  { href: "/admin/shipments", label: "All Shipments", icon: Map },
  { href: "/admin/users", label: "Users & Agents", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  role,
  onNavigate,
}: {
  role: UserRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  function Section({
    title,
    items,
  }: {
    title?: string;
    items: typeof customerNav;
  }) {
    return (
      <div className="space-y-1">
        {title && (
          <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
        )}
        {items.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand-600 text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white px-3 py-5 dark:border-white/10 dark:bg-[#0b0f1f]">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto">
        <Section items={customerNav} />
        {(role === "agent" || role === "admin") && (
          <Section title="Agent" items={agentNav} />
        )}
        {role === "admin" && <Section title="Administration" items={adminNav} />}
      </nav>
      <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
        <p className="text-sm font-semibold">Need help?</p>
        <p className="mt-1 text-xs text-brand-100">
          Visit our help center for guides and support.
        </p>
        <Link
          href="/track"
          className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
        >
          Track a package
        </Link>
      </div>
    </aside>
  );
}
