import Link from "next/link";
import { PackageX } from "lucide-react";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <Logo className="mx-auto" />
        <span className="mx-auto mt-8 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
          <PackageX className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          The page or shipment you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-secondary">
            Go home
          </Link>
          <Link href="/track" className="btn-primary">
            Track a package
          </Link>
        </div>
      </div>
    </div>
  );
}
