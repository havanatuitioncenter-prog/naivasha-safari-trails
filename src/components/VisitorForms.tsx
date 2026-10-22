import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link, useRouter } from "@tanstack/react-router";
import { CheckCircle, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tours } from "@/lib/site";
import { bookingSchema, reviewSchema } from "@/lib/submission-schemas";
import { submitBooking, submitReview } from "@/lib/submissions.functions";

const inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function VisitorForm({ kind, selectedTour = "Custom Kenya itinerary" }: { kind: "booking" | "review"; selectedTour?: string }) {
  const booking = kind === "booking";
  const saveBooking = useServerFn(submitBooking);
  const saveReview = useServerFn(submitReview);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setError("");
    setBusy(true);
    try {
      if (booking) {
        const result = bookingSchema.safeParse(values);
        if (!result.success) { setError(result.error.issues[0]?.message ?? "Check your details."); return; }
        const saved = await saveBooking({ data: result.data });
        if (!saved.success) { setError(saved.message); return; }
        setSuccess(`Request received. Reference: ${saved.id.slice(0,8).toUpperCase()}. Your booking is not yet confirmed; dates, availability and a quote will be agreed with you.`);
      } else {
        const result = reviewSchema.safeParse({ ...values, rating, consent: values['consent'] === "on" });
        if (!result.success) { setError(result.error.issues[0]?.message ?? "Check your details."); return; }
        const saved = await saveReview({ data: result.data });
        if (!saved.success) { setError(saved.message); return; }
        setSuccess("Thank you — your review has been shared.");
        await router.invalidate();
      }
      form.reset();
    } catch { setError("We couldn't save your submission. Please try again."); }
    finally { setBusy(false); }
  }
  if (success) return <div role="status" className="border-l-4 border-primary bg-secondary p-6"><CheckCircle className="mb-3 h-7 w-7 text-primary" /><p>{success}</p><div className="mt-4 flex flex-wrap gap-3">{booking && <Button asChild><Link to="/booking-status">Track your booking</Link></Button>}<Button variant="outline" onClick={() => setSuccess("")}>{booking ? "Send another request" : "Write another review"}</Button></div></div>;
  return <form onSubmit={submit} className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Your name<input name="name" autoComplete="name" required maxLength={100} className={inputClass} /></label>
      {booking ? <label className="text-sm font-medium">Email address<input name="email" type="email" autoComplete="email" required maxLength={255} className={inputClass} /></label> : <label className="text-sm font-medium">Country (optional)<input name="country" maxLength={100} className={inputClass} /></label>}
      {booking && <label className="text-sm font-medium">Phone / WhatsApp<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} pattern="[+0-9 ()\-]+" className={inputClass} /></label>}
      <label className="text-sm font-medium">{booking ? "Preferred tour" : "Your trip"}<select name="tour" defaultValue={selectedTour} className={inputClass}><option>Custom Kenya itinerary</option>{tours.map(t => <option key={t.name}>{t.name}</option>)}</select></label>
      {booking && <><label className="text-sm font-medium">Preferred travel date<input name="travel_date" type="date" required className={inputClass} /></label><label className="text-sm font-medium">Number of travellers<input name="guests" type="number" min={1} max={100} defaultValue={2} required className={inputClass} /></label></>}
    </div>
    {!booking && <fieldset><legend className="text-sm font-medium">Your rating</legend><div className="mt-2 flex gap-1">{[1,2,3,4,5].map(n => <Button key={n} type="button" variant="ghost" size="icon" aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={rating === n} onClick={() => setRating(n)} title={`${n} stars`}><Star className={n <= rating ? "fill-gold text-gold" : "text-muted-foreground"} /></Button>)}</div></fieldset>}
    <label className="block text-sm font-medium">{booking ? "Tell us about your plans (optional)" : "Your review"}<textarea name={booking ? "message" : "review"} rows={5} required={!booking} minLength={booking ? undefined : 10} maxLength={2000} className={inputClass} /></label>
    <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {!booking && <label className="flex items-start gap-3 text-sm text-muted-foreground"><input type="checkbox" name="consent" required className="mt-1" />I agree to publish my name, country, rating and review on this website.</label>}
    {booking && <p className="text-sm text-muted-foreground">Your contact details are used to respond to this request. No payment is taken here.</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" size="lg" disabled={busy}><Send />{busy ? "Sending…" : booking ? "Send booking request" : "Publish review"}</Button>
  </form>;
}