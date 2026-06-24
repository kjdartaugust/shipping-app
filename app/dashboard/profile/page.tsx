import { ShieldCheck, Mail, Calendar } from "lucide-react";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { requireProfile } from "@/lib/auth";
import { initials, formatDate } from "@/lib/utils";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await requireProfile();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account information.
        </p>
      </div>

      <div className="card flex items-center gap-4 p-6">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 text-xl font-bold text-white">
          {initials(profile.full_name || profile.email)}
        </span>
        <div>
          <p className="text-lg font-bold">
            {profile.full_name || profile.email.split("@")[0]}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {profile.email}
            </span>
            <span className="inline-flex items-center gap-1.5 capitalize">
              <ShieldCheck className="h-3.5 w-3.5" /> {profile.role}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Joined{" "}
              {formatDate(profile.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold">Account details</h2>
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
