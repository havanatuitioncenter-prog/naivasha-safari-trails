import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, TourCard } from "@/components/SiteLayout";
import { tours } from "@/lib/site";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Naivasha & Kenya Safari Tours | Daystar Globe Tours" },
      { name: "description", content: "Lake Naivasha boat safaris, Crescent Island walks, Hell's Gate cycling, Longonot hikes, Nakuru and Maasai Mara trips." },
      { property: "og:title", content: "Safari Tours | Daystar Globe Tours" },
      { property: "og:description", content: "Day trips and multi-day safaris from Naivasha across Kenya." },
    ],
  }),
  component: Tours,
});

function Tours() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="font-semibold uppercase tracking-widest text-primary">Our tours</p>
        <h1 className="mt-2 text-5xl font-bold">Naivasha & beyond</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Day trips around Lake Naivasha and longer safaris across Kenya. Every tour can be customised — just ask.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => <TourCard key={t.name} tour={t} />)}
        </div>
      </section>
    </SiteLayout>
  );
}
