import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SiteLayout, SectionTitle } from "@/components/SiteLayout";
import { VisitorForm } from "@/components/VisitorForms";
import { tourChoice } from "@/lib/submission-schemas";

export const Route = createFileRoute("/booking")({
  validateSearch: (search) => z.object({ tour: tourChoice.catch("Custom Kenya itinerary") }).parse(search),
  head: () => ({ meta: [
    { title: "Booking Request | Daystar Globe Tours & Safaris" },
    { name: "description", content: "Request your Kenya safari from Nairobi with Daystar Globe Tours. Share your dates, group size and preferred tour." },
    { property: "og:title", content: "Request a Kenya Safari | Daystar Globe Tours" },
    { property: "og:description", content: "Plan a Naivasha trip or a tailor-made Kenya safari." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Booking,
});
function Booking() {
  const { tour } = Route.useSearch();
  return <SiteLayout><section className="mx-auto max-w-3xl px-4 py-16"><SectionTitle eyebrow="Your next adventure" title="Request your Kenya safari">Share your preferred dates and plans. We’ll help shape a journey from Nairobi, across Kenya.</SectionTitle><div className="mt-10"><VisitorForm kind="booking" selectedTour={tour} /></div></section></SiteLayout>;
}