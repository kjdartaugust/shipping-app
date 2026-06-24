"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { assignAgent } from "@/lib/actions/shipments";
import type { Profile } from "@/lib/types";

export function AssignAgent({
  shipmentId,
  agentId,
  agents,
}: {
  shipmentId: string;
  agentId: string | null;
  agents: Pick<Profile, "id" | "full_name" | "email">[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onChange(value: string) {
    start(async () => {
      const res = await assignAgent(shipmentId, value || null);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(value ? "Agent assigned" : "Agent unassigned");
        router.refresh();
      }
    });
  }

  return (
    <select
      value={agentId ?? ""}
      disabled={pending}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/[0.04] disabled:opacity-60"
    >
      <option value="">Unassigned</option>
      {agents.map((a) => (
        <option key={a.id} value={a.id}>
          {a.full_name || a.email}
        </option>
      ))}
    </select>
  );
}
