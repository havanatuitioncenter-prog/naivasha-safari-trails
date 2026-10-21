import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout, SectionTitle } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { kenyaItinerary } from "@/lib/site";
import lake from "@/assets/hero-naivasha.jpg";

export const Route = createFileRoute("/itinerary")({
 head: () => ({ meta: [
  { title: "7-Day Kenya Itinerary | Daystar Globe Tours" },
  { name: "description", content: "A suggested seven-day Kenya journey from Nairobi through Lake Naivasha, Nakuru and the Maasai Mara." },
  { property: "og:title", content: "7 Days in Kenya | Daystar Globe Tours" },
  { property: "og:description", content: "Explore a suggested Nairobi, Naivasha, Nakuru and Maasai Mara itinerary." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: Itinerary,
});
function Itinerary() { return <SiteLayout>
 <section className="relative flex min-h-80 items-center"><img src={lake} alt="Lake Naivasha scenery" className="absolute inset-0 h-full w-full object-cover" /><div className="hero-overlay absolute inset-0" /><div className="relative mx-auto w-full max-w-7xl px-4 py-16 text-overlay-foreground"><p className="font-semibold uppercase text-gold">Suggested journey · 7 days</p><h1 className="mt-3 text-5xl font-semibold">Kenya: lakes to the Mara</h1><p className="mt-4">Nairobi → Naivasha → Nakuru → Maasai Mara → Nairobi</p></div></section>
 <section className="mx-auto max-w-4xl px-4 py-16"><SectionTitle eyebrow="Day by day" title="A week of Kenyan discovery">A starting point for your private itinerary, not a confirmed package. Activities and accommodation are agreed when we prepare your quote.</SectionTitle><ol className="mt-10">{kenyaItinerary.map((day,i) => <li key={day.title} className="grid grid-cols-[4rem_1fr] gap-5 border-b py-7"><span className="font-display text-3xl text-gold">0{i+1}</span><div><h2 className="text-2xl font-semibold text-primary">{day.title}</h2><p className="mt-2 text-muted-foreground">{day.detail}</p></div></li>)}</ol><p className="mt-8 text-sm text-muted-foreground">Road conditions, weather, park access and accommodation locations affect travel times. Wildlife sightings are never guaranteed. Confirm all details before booking.</p><Button asChild size="lg" className="mt-8"><Link to="/booking" search={{ tour: "Custom Kenya itinerary" }}>Request this itinerary<ArrowRight /></Link></Button></section>
 </SiteLayout>; }