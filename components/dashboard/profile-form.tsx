"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";
import { SubmitButton } from "@/components/submit-button";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useFormState<ProfileState, FormData>(
    updateProfile,
    null
  );

  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label">Full name</label>
        <input
          name="full_name"
          defaultValue={profile.full_name ?? ""}
          required
          className="input"
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          value={profile.email}
          disabled
          className="input opacity-60"
        />
        <p className="mt-1 text-xs text-slate-400">
          Email cannot be changed here.
        </p>
      </div>
      <div>
        <label className="label">Phone</label>
        <input
          name="phone"
          defaultValue={profile.phone ?? ""}
          className="input"
          placeholder="+233 20 000 0000"
        />
      </div>
      <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
    </form>
  );
}
