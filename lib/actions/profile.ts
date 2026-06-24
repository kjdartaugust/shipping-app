"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export type ProfileState = { error?: string; success?: string } | null;

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const profile = await requireProfile();
  const supabase = createClient();

  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!full_name) return { error: "Name cannot be empty." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, phone: phone || null })
    .eq("id", profile.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard", "layout");
  return { success: "Profile updated." };
}
