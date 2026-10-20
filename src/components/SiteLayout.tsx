import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import logo from "@/assets/daystar-logo.jpeg.asset.json";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

const nav = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo.url} alt="Daystar Globe Tours and Safaris" className="h-14 w-14 rounded-md object-cover" />
            <span className="hidden font-display text-lg font-bold text-primary sm:block">Daystar Globe Tours</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-foreground hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-earth text-overlay-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <h3 className="text-xl text-gold">Daystar Globe Tours & Safaris</h3>
            <p className="mt-2 text-sm opacity-80">Explore · Discover · Experience. Based in Naivasha, Kenya.</p>
          </div>
          <div className="space-y-2 text-sm">
            <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4" />{PHONE_DISPLAY}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold"><MessageCircle className="h-4 w-4" />WhatsApp us</a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-gold"><Mail className="h-4 w-4" />{EMAIL}</a>
          </div>
          <p className="text-sm opacity-70 md:text-right">© {new Date().getFullYear()} Daystar Globe Tours and Safaris</p>
        </div>
      </footer>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-overlay-foreground shadow-card transition-transform hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}

export function TourCard({ tour }: { tour: import("@/lib/site").Tour }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-card shadow-card">
      <img src={tour.image} alt={tour.name} loading="lazy" width={1200} height={912} className="h-52 w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className="text-primary">{tour.area}</span>
          <span className="text-muted-foreground">· {tour.duration}</span>
        </div>
        <h3 className="mt-2 text-xl font-bold">{tour.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{tour.summary}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {tour.highlights.map((h) => (
            <li key={h} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{h}</li>
          ))}
        </ul>
        <a
          href={whatsappLink(`Hello Daystar Globe Tours, I'm interested in the "${tour.name}" tour.`)}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 pt-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 [margin-top:1.25rem]"
        >
          <MessageCircle className="h-4 w-4" /> Book on WhatsApp
        </a>
      </div>
    </article>
  );
}
