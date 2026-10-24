import { useSuspenseQuery } from '@tanstack/react-query';
import { toursQueryOptions } from '@/lib/tours.functions';
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Compass, Users, Car } from "lucide-react";
import hero from "@/assets/amboseli.jpg";
import naivasha from "@/assets/hero-naivasha.jpg";
import { SiteLayout, TourCard, SectionTitle } from "@/components/SiteLayout";
import { faqs, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: ({context}) => context.queryClient.ensureQueryData(toursQueryOptions),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Daystar Globe Tours & Safaris | Kenya Safaris & Naivasha Tours" },
      { name: "description", content: "Handcrafted safaris across Kenya — Maasai Mara, Amboseli, the coast and the widest choice of Lake Naivasha tours." },
      { property: "og:title", content: "Daystar Globe Tours & Safaris" },
      { property: "og:description", content: "Kenya safaris and Naivasha tours with expert guides." },
    ],
  }),
  component: Index,
});

const destinations = [
  { name: "Lake Naivasha", note: "Our speciality — boat rides, walking safaris, Hell's Gate & Longonot" },
  { name: "Maasai Mara", note: "Big Five and the Great Migration" },
  { name: "Lake Nakuru", note: "Rhinos and flamingos" },
  { name: "Amboseli", note: "Elephants beneath Kilimanjaro" },
  { name: "Diani & the Coast", note: "Beaches, dhows and marine parks" },
  { name: "Nairobi", note: "City tours, Giraffe Centre & National Park" },
];

function Index() {
  const {data:tours}=useSuspenseQuery(toursQueryOptions);
  const naivashaTours = tours.filter((t) => t.naivasha);
  return (
    <SiteLayout>
      <section className="relative flex min-h-[88vh] items-center">
        <img src={hero} alt="Elephants crossing the savanna beneath Mount Kilimanjaro at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-4 text-overlay-foreground">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gold">Explore · Discover · Create memories</p>
          <h1 className="mt-5 max-w-4xl text-6xl font-semibold leading-[1.05] md:text-8xl">Journey into the heart of wild Kenya</h1>
          <p className="mt-6 max-w-xl text-lg font-light opacity-90">Handcrafted safaris across Kenya's most breathtaking landscapes — with our widest choice of experiences around beautiful Lake Naivasha.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/tours" className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold uppercase tracking-wider text-accent-foreground hover:opacity-90">Explore our tours <ArrowRight className="h-4 w-4" /></Link>
            <a href={whatsappLink("Hello Daystar, please help me plan a safari.")} target="_blank" rel="noreferrer" className="rounded-full border-2 border-overlay-foreground/70 px-8 py-4 font-semibold uppercase tracking-wider hover:bg-overlay-foreground/10">Plan my safari</a>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
          {[[String(tours.length), "Signature tours"], ["6", "Kenyan destinations"], [String(naivashaTours.length), "Naivasha experiences"], ["Nairobi", "Our base"]].map(([n, l]) => (
            <div key={l}><p className="font-display text-5xl text-gold">{n}</p><p className="mt-1 text-sm uppercase tracking-widest opacity-80">{l}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        <img src={naivasha} alt="Hippos and flamingos on Lake Naivasha at sunrise" loading="lazy" width={1920} height={1088} className="h-full rounded-2xl object-cover shadow-card" />
        <div>
          <SectionTitle eyebrow="Our speciality" title="Naivasha, done properly">
            Just 90 km from Nairobi, Lake Naivasha is one of Kenya's most rewarding destinations — and the place we know best. Glide among hippos, walk with giraffes on Crescent Island, cycle Hell's Gate or climb Mount Longonot.
          </SectionTitle>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {naivashaTours.map((t) => <li key={t.name} className="border-l-2 border-gold pl-3 text-sm font-medium">{t.name}</li>)}
          </ul>
          <Link to="/tours" className="mt-8 inline-flex items-center gap-2 font-semibold uppercase tracking-wider text-primary hover:text-gold">See Naivasha tours <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Popular journeys" title="Featured tours" />
            <Link to="/tours" className="font-semibold uppercase tracking-wider text-primary hover:text-gold">All tours →</Link>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {tours.filter((_, i) => i === 0 || i === 1 || i === 6).map((t) => <TourCard key={t.name} tour={t} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow="Across the country" title="Where we take you">Based in Nairobi, we operate throughout Kenya — from the Rift Valley lakes to the savanna and the Indian Ocean coast.</SectionTitle>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <div key={d.name} className="rounded-2xl border bg-card p-6">
              <h3 className="text-2xl font-semibold text-primary">{d.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-earth py-20 text-overlay-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Why Daystar</p>
          <h2 className="mt-2 text-4xl font-semibold md:text-5xl">Travel with people who care</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {[
              { icon: Compass, t: "Local experts", d: "Experienced Kenyan guides who know every trail, lake and park." },
              { icon: Car, t: "Comfortable transport", d: "Well-maintained safari vehicles with pop-up roofs for game viewing." },
              { icon: Users, t: "Tailor-made", d: "Private, family, group and budget-to-luxury trips designed around you." },
              { icon: ShieldCheck, t: "Safe & reliable", d: "Clear pricing, careful planning and support throughout your trip." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t}><Icon className="h-9 w-9 text-gold" /><h3 className="mt-3 text-2xl">{t}</h3><p className="mt-2 text-sm opacity-80">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow="Guest stories" title="What travellers say" />
        <p className="mt-4 text-muted-foreground">Read visitors’ experiences and share your own Kenya safari story.</p>
        <Link to="/testimonials" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">Read & leave a review <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-3xl px-4">
          <SectionTitle eyebrow="Good to know" title="Frequently asked questions" />
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl bg-card p-5">
                <summary className="cursor-pointer font-semibold text-primary">{f.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-5xl font-semibold text-primary">Ready for your Kenyan adventure?</h2>
        <p className="mt-3 text-muted-foreground">Tell us your dates and group size on WhatsApp — we'll send a tailored itinerary and quote.</p>
        <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">Start planning</a>
      </section>
    </SiteLayout>
  );
}
