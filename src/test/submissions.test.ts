import { describe, expect, it } from "vitest";
import { bookingSchema, reviewSchema } from "@/lib/submission-schemas";
import { kenyaItinerary, tourSlug, tours, PHONE_TEL, whatsappLink } from "@/lib/site";

const booking = { name: "Visitor", email: "visitor@example.com", phone: "+254790990300", tour: "Custom Kenya itinerary", travel_date: "2099-01-01", guests: 2, message: "", website: "" };
describe("Visitor submissions", () => {
 it("accepts a valid booking request", () => expect(bookingSchema.safeParse(booking).success).toBe(true));
 it("rejects past dates", () => expect(bookingSchema.safeParse({...booking, travel_date:"2020-01-01"}).success).toBe(false));
 it("rejects impossible dates", () => expect(bookingSchema.safeParse({...booking, travel_date:"2099-02-31"}).success).toBe(false));
 it("rejects unknown tours", () => expect(bookingSchema.safeParse({...booking, tour:"unknown"}).success).toBe(false));
 it("requires consent for publicly shared reviews", () => expect(reviewSchema.safeParse({name:"Visitor",country:"Kenya",tour:booking.tour,rating:5,review:"A wonderful experience.",consent:false,website:""}).success).toBe(false));
 it("rejects ratings outside five stars", () => expect(reviewSchema.safeParse({name:"Visitor",country:"Kenya",tour:booking.tour,rating:6,review:"A wonderful experience.",consent:true,website:""}).success).toBe(false));
 it("has a unique detail slug for every tour", () => expect(new Set(tours.map(t => tourSlug(t.name))).size).toBe(9));
 it("preserves the supplied call number", () => expect(PHONE_TEL).toBe("+254790990300"));
 it("preserves the supplied WhatsApp number", () => expect(whatsappLink()).toMatch(/^https:\/\/wa.me\/254790990300\?text=/));
 it("includes Naivasha in the Kenya itinerary", () => expect(kenyaItinerary.some(d => d.title.includes("Naivasha"))).toBe(true));
});