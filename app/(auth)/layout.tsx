import Link from "next/link";
import { Truck, ShieldCheck, MapPin, Bell } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-slate-400">
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 lg:block">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-100">
            <Truck className="h-5 w-5" /> SwiftShip Logistics Cloud
          </div>
          <div>
            <h2 className="max-w-sm text-3xl font-bold leading-tight">
              The control center for your entire delivery operation.
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                { icon: MapPin, text: "Real-time map tracking on every parcel" },
                { icon: ShieldCheck, text: "Role-based access for agents & admins" },
                { icon: Bell, text: "Automated milestone notifications" },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span className="text-brand-50">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/" className="text-sm text-brand-200 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
