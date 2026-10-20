import { createFileRoute } from "@tanstack/react-router";
import crescent from "@/assets/crescent.jpg";
import { SiteLayout, SectionTitle } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Daystar Globe Tours & Safaris" },
      { name: "description", content: "A Kenyan tour company operating safaris countrywide, specialising in Lake Naivasha experiences." },
      { property: "og:title", content: "About Daystar Globe Tours & Safaris" },
      { property: "og:description", content: "Kenya-wide safaris with a Naivasha speciality." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <SectionTitle eyebrow="About us" title="Nairobi-based, Kenya-wide safaris" />
          <p className="mt-5 text-muted-foreground">Daystar Globe Tours and Safaris is a Nairobi-based Kenyan tour company operating across the whole country — from the Maasai Mara and Amboseli to the Rift Valley lakes and the Indian Ocean coast.</p>
          <p className="mt-4 text-muted-foreground">From our Nairobi office we arrange city tours, airport transfers and pick-up for every itinerary. Lake Naivasha is where we offer the most experiences: boat safaris, Crescent Island walks, Hell's Gate cycling, Mount Longonot hikes and easy day trips from Nairobi.</p>
          <p className="mt-4 text-muted-foreground">Our promise is simple: honest advice, friendly professional guides, and journeys that become lifelong memories.</p>
        </div>
        <img src={crescent} alt="Guided walking safari on Crescent Island" loading="lazy" width={1200} height={912} className="rounded-2xl shadow-card" />
      </section>
      <section className="bg-secondary py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
          {[
            ["Our mission", "To share the beauty of Kenya through safe, well-planned and personal travel experiences."],
            ["Our vision", "To be the most trusted name for Kenyan safaris and Naivasha adventures."],
            ["Our values", "Honesty, care for our guests, respect for wildlife and support for local communities."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-card p-7"><h3 className="text-2xl font-semibold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
