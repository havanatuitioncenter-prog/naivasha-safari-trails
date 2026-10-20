import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { SiteLayout, SectionTitle } from "@/components/SiteLayout";
import { testimonials, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials | Daystar Globe Tours & Safaris" },
      { name: "description", content: "What travellers say about their Naivasha tours and Kenya safaris with Daystar Globe Tours." },
      { property: "og:title", content: "Guest Testimonials | Daystar Globe Tours" },
      { property: "og:description", content: "Reviews from our safari guests." },
    ],
  }),
  component: Testimonials,
});

function Testimonials() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle eyebrow="Guest stories" title="What our travellers say" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl bg-card p-7 shadow-card">
              <Quote className="h-7 w-7 text-gold" />
              <blockquote className="mt-3 text-muted-foreground">{t.text}</blockquote>
              <figcaption className="mt-4 font-semibold text-primary">{t.name} <span className="font-normal text-muted-foreground">· {t.from}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-muted-foreground">Travelled with us? We'd love to hear from you.</p>
          <a href={whatsappLink("Hello Daystar, I'd like to share a review of my trip.")} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-primary px-8 py-3 font-semibold uppercase tracking-wider text-primary-foreground">Share your review</a>
        </div>
      </section>
    </SiteLayout>
  );
}
