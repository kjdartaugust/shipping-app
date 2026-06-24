"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Bell } from "lucide-react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { signOut } from "@/lib/actions/auth";
import { initials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function Topbar({
  profile,
  unread,
}: {
  profile: Profile;
  unread: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#090c18]/80 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 lg:hidden dark:border-white/10"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back,
            </p>
            <p className="-mt-0.5 font-semibold">
              {profile.full_name || profile.email.split("@")[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/notifications"
            className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 py-1 pl-1 pr-2 dark:border-white/10">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              {initials(profile.full_name || profile.email)}
            </span>
            <span className="hidden text-xs font-medium capitalize text-slate-500 sm:block dark:text-slate-400">
              {profile.role}
            </span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:text-slate-300 dark:hover:bg-rose-500/10"
              aria-label="Sign out"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <div className="relative h-full">
              <button
                className="absolute right-3 top-4 z-10 grid h-9 w-9 place-items-center rounded-xl text-slate-500"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar role={profile.role} onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
