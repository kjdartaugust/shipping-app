import { BookingForm } from "@/components/dashboard/booking-form";

export const metadata = { title: "Book a Shipment" };

export default function NewShipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book a shipment</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Get an instant quote and dispatch your package.
        </p>
      </div>
      <BookingForm />
    </div>
  );
}
