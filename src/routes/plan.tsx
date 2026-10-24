import { useSuspenseQuery } from '@tanstack/react-query';
import { toursQueryOptions } from '@/lib/tours.functions';
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, CalendarDays, ArrowRight } from "lucide-react";
import { SiteLayout, SectionTitle } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";
import { buildPlan, interests, type InterestId, type SafariPlan } from "@/lib/planner";

export const Route = createFileRoute("/plan")({
  loader: ({context}) => context.queryClient.ensureQueryData(toursQueryOptions),
  head: () => ({
    meta: [
      { title: "Plan My Safari | Daystar Globe Tours & Safaris" },
      { name: "description", content: "Answer three quick questions and get a personalised Kenya safari plan built around your days and interests, from Naivasha to the Maasai Mara." },
      { property: "og:title", content: "Plan My Safari | Daystar Globe Tours" },
      { property: "og:description", content: "A personalised Kenya safari plan in under a minute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanPage,
});

const paces = [
  { id: "relaxed", label: "Relaxed", hint: "Plenty of breathing room" },
  { id: "balanced", label: "Balanced", hint: "A bit of everything" },
  { id: "packed", label: "Packed", hint: "See as much as possible" },
] as const;

function PlanPage() {
  const {data:tours}=useSuspenseQuery(toursQueryOptions);
  const [days, setDays] = useState(5);
  const [selected, setSelected] = useState<InterestId[]>(["wildlife"]);
  const [pace, setPace] = useState<"relaxed" | "balanced" | "packed">("balanced");
  const [plan, setPlan] = useState<SafariPlan | null>(null);

  function toggle(id: InterestId) {
    setSelected((current) => (current.includes(id) ? current.filter((i) => i !== id) : [...current, id]));
  }

  return (
    <SiteLayout>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Compass className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Plan your personalised safari</h1>
          <p className="mt-3 text-primary-foreground/80">Three quick questions and we'll sketch a Kenya journey around your time and interests.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="space-y-10 rounded-2xl border bg-card p-6 shadow-card sm:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">1 · How many days do you have?</p>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
                aria-label="Number of days"
              />
              <span className="w-24 shrink-0 rounded-full bg-secondary px-3 py-1 text-center text-sm font-semibold text-secondary-foreground">
                {days} {days === 1 ? "day" : "days"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">2 · What excites you?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggle(interest.id)}
                  aria-pressed={selected.includes(interest.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selected.includes(interest.id) ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:border-primary"
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">3 · What pace suits you?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {paces.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPace(p.id)}
                  aria-pressed={pace === p.id}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    pace === p.id ? "border-primary bg-secondary" : "border-input bg-background hover:border-primary"
                  }`}
                >
                  <span className="block font-semibold text-primary">{p.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{p.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={() => setPlan(buildPlan({ days, interests: selected, pace }, tours))}>
            Build my safari plan <ArrowRight />
          </Button>
        </div>

        {plan && (
          <div className="mt-12">
            <SectionTitle eyebrow="Your suggested journey" title={`${days}-day Kenya safari`}>
              {plan.note} This is a starting sketch — we'll refine every detail with you.
            </SectionTitle>

            <ol className="mt-8 space-y-4">
              {plan.days.map((day) => (
                <li key={day.day} className="flex gap-4 rounded-xl border bg-card p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
                    {day.day}
                  </span>
                  <div>
                    <p className="font-semibold text-primary">{day.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{day.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-2xl bg-secondary p-6 sm:p-8">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold">
                <CalendarDays className="h-4 w-4" /> Recommended tours in this plan
              </p>
              <ul className="mt-4 space-y-2">
                {plan.tours.map((tour) => (
                  <li key={tour.name} className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium text-primary">{tour.name}</span>
                    <span className="text-sm text-muted-foreground">{tour.duration}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/booking" search={{ tour: "Custom Kenya itinerary" }}>Request this safari</Link>
                </Button>
                <Button asChild variant="outline" size="lg"><a href={whatsappLink(`Hello Daystar Globe Tours, I would like a ${days}-day safari. Interests: ${selected.join(", ")}. Pace: ${pace}. Suggested tours: ${plan.tours.map(t=>t.name).join(", ")}.`)} target="_blank" rel="noreferrer">Enquire on WhatsApp</a></Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/tours">Browse all tours</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Mention “my {days}-day plan” in your request and we'll pick it up from here.
              </p>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
