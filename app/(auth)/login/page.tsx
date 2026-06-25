"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { signIn, type AuthState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const redirectTo = params.get("redirectedFrom") || "/dashboard";
  const [state, formAction] = useFormState<AuthState, FormData>(signIn, null);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Sign in to manage your shipments and deliveries.
      </p>

      <form action={formAction} className="mt-7 space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
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
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="label mb-0" htmlFor="password">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="input"
            placeholder="••••••••"
          />
        </div>

        {state?.error && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SubmitButton className="w-full" pendingText="Signing in…">
          Sign in
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Create one
        </Link>
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400 dark:border-white/10">
        Demo: create an account, then promote it to admin/agent via the SQL
        editor (set <code>profiles.role</code>).
      </div>
    </div>
  );
}
