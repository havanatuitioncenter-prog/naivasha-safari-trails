import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Mail, Phone, MessageCircle, Check, Clock, MapPin } from "lucide-react";
import logo from "@/assets/daystar-logo.jpeg.asset.json";
import { EMAIL, LOCATION, PHONE_DISPLAY, PHONE_TEL, whatsappLink, tourSlug, type Tour } from "@/lib/site";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/itinerary", label: "Itinerary" },
  { to: "/about", label: "About" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="Daystar Globe Tours and Safaris" className="h-14 w-14 object-contain mix-blend-multiply" />
            <span className="leading-tight">
              <span className="block font-display text-2xl font-semibold text-primary">Daystar <span className="text-gold">Globe</span></span>
              <span className="block text-xs font-medium tracking-wide text-primary">TOURS AND SAFARIS</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium uppercase tracking-[0.15em] lg:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-foreground hover:text-gold" activeProps={{ className: "text-gold" }} activeOptions={{ exact: true }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Button asChild className="shrink-0 rounded-full"><Link to="/booking" search={{ tour: "Custom Kenya itinerary" }}>Book now</Link></Button>
        </div>
        <nav className="flex justify-start gap-4 overflow-x-auto border-t px-4 py-2 text-xs font-medium uppercase tracking-wider sm:justify-center lg:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="shrink-0" activeProps={{ className: "text-gold" }} activeOptions={{ exact: true }}>{n.label}</Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-earth text-overlay-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-3xl text-gold">Daystar Globe Tours & Safaris</h3>
            <p className="mt-3 max-w-md text-sm opacity-80">Handcrafted safaris and holidays across Kenya — with our widest choice of experiences around beautiful Lake Naivasha.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="mb-3 font-semibold uppercase tracking-widest text-gold">Explore</p>
            {nav.map((n) => <Link key={n.to} to={n.to} className="block opacity-80 hover:text-gold">{n.label}</Link>)}
          </div>
          <div className="space-y-3 text-sm">
            <p className="mb-3 font-semibold uppercase tracking-widest text-gold">Contact</p>
            <p className="flex items-center gap-2 opacity-90"><MapPin className="h-4 w-4 text-gold" />{LOCATION}</p>
            <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4" />{PHONE_DISPLAY}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold"><MessageCircle className="h-4 w-4" />WhatsApp us</a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-gold"><Mail className="h-4 w-4" />{EMAIL}</a>
          </div>
        </div>
        <p className="border-t border-overlay-foreground/10 py-5 text-center text-xs opacity-60">© {new Date().getFullYear()} Daystar Globe Tours and Safaris · Explore · Discover · Experience</p>
      </footer>
      <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-overlay-foreground shadow-card transition-transform hover:scale-110">
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h2 className="mt-2 text-4xl font-semibold text-primary md:text-5xl">{title}</h2>
      {children && <p className="mt-3 max-w-2xl text-muted-foreground">{children}</p>}
    </div>
  );
}

export function TourCard({ tour, detailed = false }: { tour: Tour; detailed?: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-card">
      <div className="relative">
        <img src={tour.image} alt={tour.name} loading="lazy" width={1200} height={912} className="h-56 w-full object-cover" />
        {tour.naivasha && <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">Naivasha</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" />{tour.area}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gold" />{tour.duration}</span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-primary"><Link to="/tours/$slug" params={{ slug: tourSlug(tour.name) }}>{tour.name}</Link></h3>
        <p className="mt-2 text-sm text-muted-foreground">{tour.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {tour.highlights.map((h) => <li key={h} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{h}</li>)}
        </ul>
        {detailed && (
          <div className="mt-5 border-t pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Includes</p>
            <ul className="mt-2 grid grid-cols-2 gap-1.5 text-sm">
              {tour.includes.map((i) => <li key={i} className="flex items-start gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{i}</li>)}
            </ul>
          </div>
        )}
        <Button asChild className="mt-6"><Link to="/tours/$slug" params={{ slug: tourSlug(tour.name) }}>View tour & request booking</Link></Button>
      </div>
    </article>
  );
}
