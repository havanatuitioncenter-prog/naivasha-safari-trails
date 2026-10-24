import { toursQueryOptions } from "@/lib/tours.functions";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Clock, MapPin, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VisitorForm } from "@/components/VisitorForms";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/tours_/$slug")({
 loader: async ({ params, context }) => { const tours = await context.queryClient.ensureQueryData(toursQueryOptions); const tour = tours.find(t => t.slug === params.slug); if (!tour) throw notFound(); return tour; },
 head: ({ loaderData: tour }) => ({ meta: [
  { title: tour ? `${tour.name} | Daystar Globe Tours` : "Tour unavailable | Daystar Globe Tours" },
  { name: "description", content: tour?.summary ?? "Explore Kenya safaris with Daystar Globe Tours." },
  { property: "og:title", content: tour ? `${tour.name} | Daystar Globe Tours` : "Tour unavailable" },
  { property: "og:description", content: tour?.summary ?? "Kenya safaris from Nairobi." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: TourDetail,
});
function TourDetail() { const tour = Route.useLoaderData(); return <SiteLayout>
 <section className="relative flex min-h-96 items-end"><img src={tour.image} alt={tour.name} className="absolute inset-0 h-full w-full object-cover" /><div className="hero-overlay absolute inset-0" /><div className="relative mx-auto w-full max-w-7xl px-4 py-12 text-overlay-foreground"><Link to="/tours" className="mb-6 inline-flex items-center gap-2 text-sm"><ArrowLeft className="h-4 w-4" />All tours</Link><h1 className="max-w-3xl text-5xl font-semibold">{tour.name}</h1><div className="mt-4 flex flex-wrap gap-5"><span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{tour.area}</span><span className="flex items-center gap-2"><Clock className="h-4 w-4" />{tour.duration}</span></div></div></section>
 {tour.photoUrls.length > 1 && <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pt-8 md:grid-cols-3">{tour.photoUrls.slice(1).map((src,i)=><img key={src} src={src} alt={`${tour.name} photo ${i+2}`} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />)}</section>}
 <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2"><div><h2 className="text-3xl font-semibold text-primary">Your experience</h2><p className="mt-4 text-muted-foreground">{tour.summary}</p><h2 className="mt-8 text-2xl font-semibold text-primary">Highlights</h2><ul className="mt-4 space-y-3">{tour.highlights.map(h => <li key={h} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-gold" />{h}</li>)}</ul><h2 className="mt-8 text-2xl font-semibold text-primary">Proposed inclusions</h2><ul className="mt-4 space-y-2">{tour.includes.map(h => <li key={h} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-gold" />{h}</li>)}</ul><p className="mt-5 text-sm text-muted-foreground">This is a suggested tour outline. Final activities, transfers, meals, entry fees and accommodation are confirmed in your personalised quote. No price is published.</p><h2 className="mt-8 text-2xl font-semibold text-primary">Before you travel</h2><p className="mt-3 text-muted-foreground">Bring comfortable footwear, sun protection and a camera. Tell us about accessibility needs and dietary preferences when requesting your trip. Weather and local conditions may change the schedule.</p><Button asChild variant="outline" className="mt-6"><a href={whatsappLink(`Hello Daystar Globe Tours, I'm interested in the "${tour.name}" tour.`)} target="_blank" rel="noreferrer">Ask on WhatsApp</a></Button></div><div><h2 className="text-3xl font-semibold text-primary">Request this tour</h2><div className="mt-6"><VisitorForm kind="booking" selectedTour={tour.name} /></div></div></section>
 </SiteLayout>; }