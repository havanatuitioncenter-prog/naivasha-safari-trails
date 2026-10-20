import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, MapPin, Clock, Car } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { EMAIL, HOURS, LOCATION, MAPS_LINK, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Daystar Globe Tours & Safaris" },
      { name: "description", content: "Call, WhatsApp or email Daystar Globe Tours on +254 790 990300 to book your Naivasha safari." },
      { property: "og:title", content: "Contact Daystar Globe Tours" },
      { property: "og:description", content: "Book your Kenya safari via WhatsApp, phone or email." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const items = [
    { icon: MessageCircle, label: "WhatsApp", value: PHONE_DISPLAY, href: whatsappLink(), ext: true },
    { icon: Phone, label: "Call us", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
    { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MapPin, label: "Based in", value: LOCATION, href: MAPS_LINK, ext: true },
    { icon: Clock, label: "Office hours", value: HOURS },
    { icon: Car, label: "Pick-up & drop-off", value: "Anywhere in Nairobi, plus JKIA transfers" },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="font-semibold uppercase tracking-widest text-primary">Get in touch</p>
        <h1 className="mt-2 text-5xl font-bold">Let's plan your trip</h1>
        <p className="mt-3 text-muted-foreground">The fastest way to reach us is WhatsApp — we usually reply quickly.</p>
        <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
          {items.map(({ icon: Icon, label, value, href, ext }) => {
            const inner = (
              <>
                <Icon className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </>
            );
            return href ? (
              <a key={label} href={href} target={ext ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-card hover:border-primary">{inner}</a>
            ) : (
              <div key={label} className="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-card">{inner}</div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
