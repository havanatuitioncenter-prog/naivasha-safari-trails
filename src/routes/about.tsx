import { createFileRoute } from "@tanstack/react-router";
import crescent from "@/assets/crescent.jpg";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Daystar Globe Tours & Safaris" },
      { name: "description", content: "A Naivasha-based Kenyan tour company offering personal, professional safaris." },
      { property: "og:title", content: "About Daystar Globe Tours & Safaris" },
      { property: "og:description", content: "Meet the Naivasha team behind your Kenyan safari." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-widest text-primary">About us</p>
          <h1 className="mt-2 text-5xl font-bold">Rooted in Naivasha, guiding across Kenya</h1>
          <p className="mt-5 text-muted-foreground">Daystar Globe Tours and Safaris is a Kenyan tour company based on the shores of Lake Naivasha. We create personal, well-organised journeys — from relaxed lake excursions to full safaris in the Maasai Mara.</p>
          <p className="mt-4 text-muted-foreground">Our promise is simple: honest advice, friendly guides, and memories that last a lifetime.</p>
        </div>
        <img src={crescent} alt="Guided walking safari on Crescent Island" loading="lazy" width={1200} height={912} className="rounded-2xl shadow-card" />
      </section>
    </SiteLayout>
  );
}
