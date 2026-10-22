import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, LogOut, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  adminDeleteReview,
  adminListBookings,
  adminListReviews,
  adminLogin,
  adminLogout,
  adminOverview,
  adminSetBookingStatus,
  adminSetReviewHidden,
  getAdminSession,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminSession(),
  head: () => ({
    meta: [
      { title: "Admin | Daystar Globe Tours & Safaris" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

type Booking = {
  id: string; created_at: string; name: string; email: string; phone: string; tour: string;
  travel_date: string; guests: number; message: string; status: string; admin_note: string; confirmed_at: string | null;
};
type Review = {
  id: string; created_at: string; name: string; country: string; tour: string; rating: number; review: string; hidden: boolean;
};

function LoginForm() {
  const login = useServerFn(adminLogin);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    setBusy(true);
    setError(false);
    try {
      const { ok } = await login({ data: { password } });
      if (ok) await router.invalidate();
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-card">
        <Lock className="h-8 w-8 text-gold" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-primary">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Daystar Globe Tours management area.</p>
        <label className="mt-6 block text-sm font-medium">
          Password
          <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
        </label>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">Incorrect password.</p>}
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "confirmed" ? "bg-primary text-primary-foreground" :
    status === "declined" ? "bg-destructive text-destructive-foreground" :
    "bg-gold text-accent-foreground";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}>{status}</span>;
}

function BookingsTab() {
  const queryClient = useQueryClient();
  const fetchBookings = useServerFn(adminListBookings);
  const setStatus = useServerFn(adminSetBookingStatus);
  const { data } = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchBookings });
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function update(id: string, status: "new" | "confirmed" | "declined") {
    await setStatus({ data: { id, status, admin_note: notes[id] ?? "" } });
    await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
  }

  const bookings = (data?.bookings ?? []) as Booking[];
  if (bookings.length === 0) return <p className="py-10 text-center text-muted-foreground">No booking requests yet.</p>;

  return (
    <ul className="space-y-4">
      {bookings.map((b) => (
        <li key={b.id} className="rounded-xl border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-primary">{b.name} · {b.tour}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {b.travel_date} · {b.guests} traveller{b.guests > 1 ? "s" : ""} · requested {new Date(b.created_at).toLocaleDateString("en-KE", { dateStyle: "medium" })}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{b.email} · {b.phone}</p>
            </div>
            <StatusBadge status={b.status} />
          </div>
          {b.message && <p className="mt-3 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">{b.message}</p>}
          <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Note to customer (shown on their status page)
            <textarea
              rows={2}
              className={inputClass}
              placeholder="e.g. Confirmed — we'll pick you up at 7am from your hotel."
              value={notes[b.id] ?? b.admin_note}
              onChange={(e) => setNotes((n) => ({ ...n, [b.id]: e.target.value }))}
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => update(b.id, "confirmed")} disabled={b.status === "confirmed"}>Confirm</Button>
            <Button size="sm" variant="outline" onClick={() => update(b.id, "declined")} disabled={b.status === "declined"}>Decline</Button>
            <Button size="sm" variant="ghost" onClick={() => update(b.id, "new")} disabled={b.status === "new"}>Mark as new</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ReviewsTab() {
  const queryClient = useQueryClient();
  const fetchReviews = useServerFn(adminListReviews);
  const setHidden = useServerFn(adminSetReviewHidden);
  const deleteReview = useServerFn(adminDeleteReview);
  const { data } = useQuery({ queryKey: ["admin-reviews"], queryFn: fetchReviews });

  async function toggle(id: string, hidden: boolean) {
    await setHidden({ data: { id, hidden } });
    await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
  }
  async function remove(id: string) {
    await deleteReview({ data: { id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
  }

  const reviews = (data?.reviews ?? []) as Review[];
  if (reviews.length === 0) return <p className="py-10 text-center text-muted-foreground">No reviews yet.</p>;

  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className={`rounded-xl border bg-card p-5 ${r.hidden ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-primary">
                {r.name}{r.country ? ` · ${r.country}` : ""} · {r.tour}
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-gold" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold" : "text-muted-foreground"}`} />)}
              </p>
            </div>
            {r.hidden && <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hidden</span>}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{r.review}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => toggle(r.id, !r.hidden)}>
              {r.hidden ? <><Eye /> Show on site</> : <><EyeOff /> Hide from site</>}
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(r.id)}>
              <Trash2 /> Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function OverviewTab() {
  const fetchOverview = useServerFn(adminOverview);
  const { data } = useQuery({ queryKey: ["admin-overview"], queryFn: fetchOverview });
  if (!data) return null;
  const stats = [
    { label: "Booking requests", value: data.totalBookings },
    { label: "Awaiting review", value: data.newBookings },
    { label: "Confirmed", value: data.confirmedBookings },
    { label: "Declined", value: data.declinedBookings },
    { label: "Reviews", value: data.totalReviews },
    { label: "Visible reviews", value: data.visibleReviews },
    { label: "Average rating", value: data.averageRating || "—" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border bg-card p-5">
          <p className="font-display text-3xl font-semibold text-primary">{s.value}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const logout = useServerFn(adminLogout);
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "bookings" | "reviews">("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Bookings" },
    { id: "reviews", label: "Reviews" },
  ] as const;

  async function signOut() {
    await logout({});
    await router.invalidate();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Daystar Globe <span className="text-gold">Admin</span></h1>
            <p className="text-xs uppercase tracking-widest opacity-70">Tours · Bookings · Reviews</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut /> Sign out
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex gap-2 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide ${
                tab === t.id ? "border-b-2 border-gold text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "overview" && <OverviewTab />}
        {tab === "bookings" && <BookingsTab />}
        {tab === "reviews" && <ReviewsTab />}
      </div>
    </div>
  );
}

function AdminPage() {
  const { admin } = Route.useLoaderData();
  return admin ? <AdminDashboard /> : <LoginForm />;
}
