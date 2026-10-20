import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, Compass, Users } from "lucide-react";
import hero from "@/assets/hero-naivasha.jpg";
import { SiteLayout, TourCard } from "@/components/SiteLayout";
import { tours, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daystar Globe Tours & Safaris | Naivasha & Kenya Safaris" },
      { name: "description", content: "Lake Naivasha boat rides, Hell's Gate, Crescent Island and Maasai Mara safaris with a trusted Kenyan tour company." },
      { property: "og:title", content: "Daystar Globe Tours & Safaris" },
      { property: "og:description", content: "Explore Naivasha and Kenya with expert local guides." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <section className="relative flex min-h-[85vh] items-center">
        <img src={hero} alt="Sunrise over Lake Naivasha with hippos and flamingos" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 text-overlay-foreground">
          <p className="font-semibold uppercase tracking-[0.3em] text-gold">Explore · Discover · Experience</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight md:text-7xl">Unforgettable safaris from the shores of Naivasha</h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">Boat rides among hippos, walking safaris with giraffes, and journeys across Kenya's legendary parks.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tours" className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90">View tours</Link>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-overlay-foreground/60 px-6 py-3 font-semibold hover:bg-overlay-foreground/10">
              <MessageCircle className="h-5 w-5" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {[
          { icon: Compass, t: "Local experts", d: "Naivasha-based guides who know every trail, channel and viewpoint." },
          { icon: ShieldCheck, t: "Safe & reliable", d: "Comfortable vehicles, licensed guides and clear, honest planning." },
          { icon: Users, t: "Tailor-made", d: "Private, family and group trips designed around you." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <Icon className="h-8 w-8 text-accent" />
            <h3 className="mt-3 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-semibold uppercase tracking-widest text-primary">Popular around Naivasha</p>
              <h2 className="mt-2 text-4xl font-bold">Featured tours</h2>
            </div>
            <Link to="/tours" className="font-semibold text-primary hover:underline">All tours →</Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {tours.slice(0, 3).map((t) => <TourCard key={t.name} tour={t} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-4xl font-bold">Ready for your Kenyan adventure?</h2>
        <p className="mt-3 text-muted-foreground">Message us on WhatsApp and we'll plan the perfect trip for you.</p>
        <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          <MessageCircle className="h-5 w-5" /> Start planning
        </a>
      </section>
    </SiteLayout>
  );
}
