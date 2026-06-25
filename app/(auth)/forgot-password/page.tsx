"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { AlertCircle, MailCheck, ArrowLeft } from "lucide-react";
import { requestPasswordReset, type ResetState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState<ResetState, FormData>(
    requestPasswordReset,
    null
  );

  if (state?.sent) {
    return (
      <div className="animate-fade-in text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <MailCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          If an account exists for that email, we&apos;ve sent a link to reset
          your password. The link expires shortly.
        </p>
        <Link href="/login" className="btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

      <form action={formAction} className="mt-7 space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="you@example.com"
          />
        </div>

        {state?.error && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SubmitButton className="w-full" pendingText="Sending link…">
          Send reset link
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
