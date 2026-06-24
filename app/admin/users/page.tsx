import { RoleSelect } from "@/components/admin/role-select";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { initials, formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Users & Agents" };

export default async function AdminUsersPage() {
  const me = await requireAdmin();
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as Profile[];

  // Count shipments per user for context.
  const { data: counts } = await supabase.from("shipments").select("sender_id");
  const byUser = new Map<string, number>();
  (counts ?? []).forEach((c: { sender_id: string }) =>
    byUser.set(c.sender_id, (byUser.get(c.sender_id) ?? 0) + 1)
  );

  const roleStats = {
    customer: users.filter((u) => u.role === "customer").length,
    agent: users.filter((u) => u.role === "agent").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users &amp; Agents</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {users.length} accounts · {roleStats.customer} customers,{" "}
          {roleStats.agent} agents, {roleStats.admin} admins
        </p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-white/10">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Shipments</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-100 last:border-0 dark:border-white/5"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-xs font-bold text-white">
                      {initials(u.full_name || u.email)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {u.full_name || "—"}
                        {u.id === me.id && (
                          <span className="ml-1.5 text-xs text-brand-500">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-500">{u.phone || "—"}</td>
                <td className="p-4 text-slate-500">{byUser.get(u.id) ?? 0}</td>
                <td className="p-4 text-slate-500">
                  {formatDate(u.created_at)}
                </td>
                <td className="p-4">
                  <RoleSelect
                    userId={u.id}
                    role={u.role}
                    disabled={u.id === me.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
