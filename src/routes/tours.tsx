import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, TourCard, SectionTitle } from "@/components/SiteLayout";
import { tours } from "@/lib/site";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Kenya Safari Tours & Naivasha Trips | Daystar Globe Tours" },
      { name: "description", content: "Lake Naivasha boat safaris, Crescent Island, Hell's Gate, Longonot, Nakuru, Maasai Mara, Amboseli and Diani beach tours." },
      { property: "og:title", content: "Safari Tours | Daystar Globe Tours" },
      { property: "og:description", content: "Naivasha day trips and safaris across Kenya." },
    ],
  }),
  component: Tours,
});

function Tours() {
  const naivasha = tours.filter((t) => t.naivasha);
  const kenya = tours.filter((t) => !t.naivasha);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle eyebrow="Our tours" title="Lake Naivasha experiences">Our biggest collection of tours — day trips and short stays around Lake Naivasha and the Rift Valley. Every tour can be customised.</SectionTitle>
        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {naivasha.map((t) => <TourCard key={t.name} tour={t} detailed />)}
        </div>
      </section>
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Across Kenya" title="Safaris & holidays nationwide">From the Maasai Mara to the Indian Ocean coast.</SectionTitle>
          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {kenya.map((t) => <TourCard key={t.name} tour={t} detailed />)}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
