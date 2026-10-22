import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Clock3, Search, XCircle } from "lucide-react";
import { SiteLayout, SectionTitle } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { getBookingStatus } from "@/lib/booking-status.functions";

export const Route = createFileRoute("/booking-status")({
  head: () => ({
    meta: [
      { title: "Check Booking Status | Daystar Globe Tours & Safaris" },
      { name: "description", content: "Check the status of your Daystar Globe Tours booking request with your reference code and email." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingStatus,
});

type Result =
  | { found: false }
  | { found: true; booking: { tour: string; travel_date: string; guests: number; status: string; admin_note: string; confirmed_at: string | null; created_at: string } };

const inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function StatusCard({ booking }: { booking: Extract<Result, { found: true }>["booking"] }) {
  const status = booking.status;
  const icon =
    status === "confirmed" ? <BadgeCheck className="h-8 w-8 text-primary" /> :
    status === "declined" ? <XCircle className="h-8 w-8 text-destructive" /> :
    <Clock3 className="h-8 w-8 text-gold" />;
  const headline =
    status === "confirmed" ? "Your safari is confirmed!" :
    status === "declined" ? "This request was declined" :
    "We're reviewing your request";
  const detail =
    status === "confirmed"
      ? "We look forward to hosting you. We'll be in touch with pick-up details closer to your travel date."
      : status === "declined"
        ? "Unfortunately we couldn't accommodate this request. Please contact us on WhatsApp to discuss alternatives."
        : "Your booking is not confirmed yet — we typically respond within a day. Dates, availability and your quote are agreed with you directly.";
  return (
    <div className="mt-10 rounded-2xl border bg-card p-6 shadow-card sm:p-8" role="status">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">{headline}</h2>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 border-t pt-6 text-sm sm:grid-cols-2">
        <div><dt className="text-muted-foreground">Tour</dt><dd className="font-medium text-foreground">{booking.tour}</dd></div>
        <div><dt className="text-muted-foreground">Travel date</dt><dd className="font-medium text-foreground">{booking.travel_date}</dd></div>
        <div><dt className="text-muted-foreground">Travellers</dt><dd className="font-medium text-foreground">{booking.guests}</dd></div>
        <div><dt className="text-muted-foreground">Requested on</dt><dd className="font-medium text-foreground">{new Date(booking.created_at).toLocaleDateString("en-KE", { dateStyle: "long" })}</dd></div>
        {booking.confirmed_at && (
          <div><dt className="text-muted-foreground">Confirmed on</dt><dd className="font-medium text-foreground">{new Date(booking.confirmed_at).toLocaleDateString("en-KE", { dateStyle: "long" })}</dd></div>
        )}
      </dl>
      {booking.admin_note && (
        <p className="mt-6 rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
          <span className="font-semibold">Note from our team:</span> {booking.admin_note}
        </p>
      )}
    </div>
  );
}

function BookingStatus() {
  const lookup = useServerFn(getBookingStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await lookup({ data: { reference: String(values.reference ?? ""), email: String(values.email ?? "") } });
      setResult(res as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-16">
        <SectionTitle eyebrow="Booking confirmation" title="Check your booking status">
          Enter the 8-character reference from your booking confirmation and the email you booked with.
        </SectionTitle>
        <form onSubmit={submit} className="mt-10 space-y-5">
          <label className="block text-sm font-medium">
            Booking reference
            <input name="reference" required minLength={8} maxLength={8} placeholder="e.g. A1B2C3D4" className={`${inputClass} uppercase tracking-widest`} />
          </label>
          <label className="block text-sm font-medium">
            Email address
            <input name="email" type="email" autoComplete="email" required maxLength={255} className={inputClass} />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" disabled={busy}>
            <Search />{busy ? "Checking…" : "Check status"}
          </Button>
        </form>
        {result && !result.found && (
          <p role="alert" className="mt-10 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
            We couldn't find a booking with that reference and email. Check the reference in your confirmation message, or contact us on WhatsApp.
          </p>
        )}
        {result?.found && <StatusCard booking={result.booking} />}
      </section>
    </SiteLayout>
  );
}
