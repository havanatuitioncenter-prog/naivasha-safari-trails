import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { bookingSchema, reviewSchema } from "./submission-schemas";

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if(data.tour !== 'Custom Kenya itinerary') {
      const {data:tour}=await supabaseAdmin.from('tours').select('id').eq('name',data.tour).maybeSingle();
      if(!tour)return {success:false as const,message:'Choose an available tour or a custom Kenya itinerary.'};
    }
    const { website: _website, ...row } = data;
    const { data: saved, error } = await supabaseAdmin.from("booking_requests").insert(row).select("id").single();
    if (error || !saved) return { success: false as const, message: "Your request could not be saved. Please try again or contact us on WhatsApp." };
    return { success: true as const, id: saved.id };
  });

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if(data.tour !== 'Custom Kenya itinerary') {
      const {data:tour}=await supabaseAdmin.from('tours').select('id').eq('name',data.tour).maybeSingle();
      if(!tour)return {success:false as const,message:'Choose an available tour or a custom Kenya itinerary.'};
    }
    const { website: _website, consent: _consent, ...row } = data;
    const { data: saved, error } = await supabaseAdmin.from("visitor_reviews").insert(row).select("id").single();
    if (error || !saved) return { success: false as const, message: "Your review could not be saved. Please try again." };
    return { success: true as const, id: saved.id };
  });

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) return { reviews: [], unavailable: true };
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from("visitor_reviews").select("id,name,country,tour,rating,review,created_at").order("created_at", { ascending: false }).limit(50);
  return { reviews: data ?? [], unavailable: Boolean(error) };
});