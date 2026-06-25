"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { AlertCircle, KeyRound } from "lucide-react";
import { updatePassword, type AuthState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(
    updatePassword,
    null
  );

  return (
    <div className="animate-fade-in">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
        <KeyRound className="h-6 w-6" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">
        Set a new password
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Choose a strong password you don&apos;t use elsewhere.
      </p>

      <form action={formAction} className="mt-7 space-y-4">
        <div>
          <label className="label" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="input"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="label" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="input"
            placeholder="Re-enter your password"
          />
        </div>

        {state?.error && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SubmitButton className="w-full" pendingText="Updating…">
          Update password
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Need a new link?{" "}
        <Link
          href="/forgot-password"
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Request another
        </Link>
      </p>
    </div>
  );
}
