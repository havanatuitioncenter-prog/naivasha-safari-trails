import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SiteLayout, SectionTitle } from "@/components/SiteLayout";
import { VisitorForm } from "@/components/VisitorForms";
import { toursQueryOptions } from "@/lib/tours.functions";
import { listReviews } from "@/lib/submissions.functions";

export const Route = createFileRoute("/testimonials")({
  loader: async ({context}) => { const [reviews] = await Promise.all([listReviews(),context.queryClient.ensureQueryData(toursQueryOptions)]); return reviews; },
  head: () => ({ meta: [
    { title: "Visitor Reviews | Daystar Globe Tours & Safaris" },
    { name: "description", content: "Read visitor reviews of Daystar Globe Tours and share your Kenya safari experience." },
    { property: "og:title", content: "Visitor Reviews | Daystar Globe Tours" },
    { property: "og:description", content: "Kenya safari stories shared by visitors." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Testimonials,
});
function Testimonials() {
 const { reviews, unavailable } = Route.useLoaderData();
 return <SiteLayout><section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Guest stories" title="Visitor reviews" />
 {unavailable ? <p role="alert" className="mt-8 text-muted-foreground">Reviews are temporarily unavailable. Please try again later.</p> : reviews.length === 0 ? <p className="mt-8 text-muted-foreground">No visitor reviews yet. Share the first story from your trip.</p> : <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{reviews.map(r => <figure key={r.id} className="rounded-lg border bg-card p-6"><div aria-label={`${r.rating} out of 5 stars`} className="flex gap-1">{[1,2,3,4,5].map(n => <Star key={n} className={n <= r.rating ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-muted-foreground"} />)}</div><p className="mt-3 text-xs text-muted-foreground">{r.tour}</p><blockquote className="mt-3 whitespace-pre-wrap break-words">{r.review}</blockquote><figcaption className="mt-5 font-semibold text-primary">{r.name}{r.country && <span className="font-normal text-muted-foreground"> · {r.country}</span>}</figcaption><p className="mt-1 text-xs text-muted-foreground">{r.created_at.slice(0,10)}</p></figure>)}</div>}
 </section><section className="border-t bg-secondary py-16"><div className="mx-auto max-w-3xl px-4"><SectionTitle eyebrow="Your experience" title="Leave a review" /><div className="mt-8"><VisitorForm kind="review" /></div></div></section></SiteLayout>;
}
