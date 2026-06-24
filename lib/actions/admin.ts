"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

/** Change a user's role (admin only). */
export async function setUserRole(userId: string, role: UserRole) {
  const me = await requireAdmin();
  if (userId === me.id)
    return { error: "You can't change your own role." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: error.message };

  await admin.from("notifications").insert({
    user_id: userId,
    title: "Account role updated",
    message: `An administrator set your role to ${role}.`,
    type: "info",
  });

  revalidatePath("/admin/users");
  return { success: "Role updated." };
}
