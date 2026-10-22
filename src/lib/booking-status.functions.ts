import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lookupSchema = z.object({
  reference: z.string().trim().regex(/^[0-9a-fA-F]{8}$/, "Enter the 8-character reference from your confirmation."),
  email: z.string().trim().email("Enter the email you booked with.").max(255),
});

// Public lookup: the caller must know both the booking reference and the
// booking email, and only non-sensitive status fields are returned.
export const getBookingStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => lookupSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("booking_requests")
      .select("id,tour,travel_date,guests,status,admin_note,confirmed_at,created_at,email")
      .ilike("email", data.email)
      .limit(20);
    if (error) return { found: false as const };
    const match = (rows ?? []).find((row) => row.id.replace(/-/g, "").toUpperCase().startsWith(data.reference.toUpperCase()));
    if (!match) return { found: false as const };
    return {
      found: true as const,
      booking: {
        tour: match.tour,
        travel_date: match.travel_date,
        guests: match.guests,
        status: match.status,
        admin_note: match.admin_note,
        confirmed_at: match.confirmed_at,
        created_at: match.created_at,
      },
    };
  });
