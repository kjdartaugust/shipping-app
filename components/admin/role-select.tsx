"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setUserRole } from "@/lib/actions/admin";
import type { UserRole } from "@/lib/types";

export function RoleSelect({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: UserRole;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onChange(value: string) {
    start(async () => {
      const res = await setUserRole(userId, value as UserRole);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Role updated");
        router.refresh();
      }
    });
  }

  return (
    <select
      value={role}
      disabled={disabled || pending}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs capitalize outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/[0.04] disabled:opacity-50"
    >
      <option value="customer">Customer</option>
      <option value="agent">Agent</option>
      <option value="admin">Admin</option>
    </select>
  );
}
