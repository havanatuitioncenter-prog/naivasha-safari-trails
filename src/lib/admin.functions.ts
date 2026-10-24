import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { tourSchema, photoSchema } from './tour-schemas';
import { tourSlug } from './site';

function sessionConfig(password: string) { return {
  password,
  name: "daystar-admin",
  maxAge: 60 * 60 * 8, // 8 hours
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
}; }

type AdminSession = { admin?: boolean };

// Hash both sides to equal-length digests first: timingSafeEqual throws on a
// length mismatch, and the raw length itself would leak through timing.
function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin(secret: string) {
  const session = await useSession<AdminSession>(sessionConfig(secret));
  if (!session.data.admin) throw new Error("Unauthorized");
  return session;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ password: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig(process.env['SESSION_SECRET']!));
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig(process.env['SESSION_SECRET']!));
  await session.clear();
  return { ok: true as const };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig(process.env['SESSION_SECRET']!));
  return { admin: session.data.admin === true };
});

export const adminOverview = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin(process.env['SESSION_SECRET']!);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: bookings }, { data: reviews }] = await Promise.all([
    supabaseAdmin.from("booking_requests").select("status"),
    supabaseAdmin.from("visitor_reviews").select("rating,hidden"),
  ]);
  const all = bookings ?? [];
  const allReviews = reviews ?? [];
  return {
    totalBookings: all.length,
    newBookings: all.filter((b) => b.status === "new").length,
    confirmedBookings: all.filter((b) => b.status === "confirmed").length,
    declinedBookings: all.filter((b) => b.status === "declined").length,
    totalReviews: allReviews.length,
    visibleReviews: allReviews.filter((r) => !r.hidden).length,
    averageRating: allReviews.length
      ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10
      : 0,
  };
});

export const adminListBookings = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin(process.env['SESSION_SECRET']!);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("booking_requests")
    .select("id,created_at,name,email,phone,tour,travel_date,guests,message,status,admin_note,confirmed_at,safari_answers")
    .order("created_at", { ascending: false })
    .limit(200);
  return { bookings: data ?? [] };
});

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "confirmed", "declined"]),
  admin_note: z.string().trim().max(1000).optional(),
});

export const adminSetBookingStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => statusSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin(process.env['SESSION_SECRET']!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("booking_requests")
      .update({
        status: data.status,
        admin_note: data.admin_note ?? "",
        confirmed_at: data.status === "confirmed" ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    return { ok: !error };
  });

export const adminListReviews = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin(process.env['SESSION_SECRET']!);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("visitor_reviews")
    .select("id,created_at,name,country,tour,rating,review,hidden")
    .order("created_at", { ascending: false })
    .limit(200);
  return { reviews: data ?? [] };
});

export const adminSetReviewHidden = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), hidden: z.boolean() }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin(process.env['SESSION_SECRET']!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("visitor_reviews").update({ hidden: data.hidden }).eq("id", data.id);
    return { ok: !error };
  });

export const adminDeleteReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin(process.env['SESSION_SECRET']!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("visitor_reviews").delete().eq("id", data.id);
    return { ok: !error };
  });

export const adminSaveTour = createServerFn({method:'POST'}).inputValidator((input:unknown)=>tourSchema.parse(input)).handler(async({data})=>{
 await requireAdmin(process.env['SESSION_SECRET']!);
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {id,...row}=data;
 const result=id?await supabaseAdmin.from('tours').update(row).eq('id',id).select('id').single():await supabaseAdmin.from('tours').insert({...row,slug:tourSlug(row.name)}).select('id').single();
 if(result.error) throw new Error('Could not save this tour. Please check that its name is unique.');
 return {ok:true};
});
export const adminDeleteTour=createServerFn({method:'POST'}).inputValidator((input:unknown)=>z.object({id:z.string().uuid()}).parse(input)).handler(async({data})=>{
 await requireAdmin(process.env['SESSION_SECRET']!);
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error}=await supabaseAdmin.from('tours').delete().eq('id',data.id);
 if(error)throw new Error('Could not delete this tour.');
 return {ok:true};
});
export const adminUploadPhoto=createServerFn({method:'POST'}).inputValidator((input:unknown)=>photoSchema.parse(input)).handler(async({data})=>{
 await requireAdmin(process.env['SESSION_SECRET']!);
 const bytes=Uint8Array.from(atob(data.base64),c=>c.charCodeAt(0));
 if(bytes.length>5*1024*1024)throw new Error('Choose a photo smaller than 5 MB.');
 const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
 if(!(data.type==='image/jpeg'&&jpg||data.type==='image/png'&&png||data.type==='image/webp'&&webp))throw new Error('Choose a valid JPG, PNG or WebP photo.');
 const path=`${crypto.randomUUID()}.${jpg?'jpg':png?'png':'webp'}`;
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error}=await supabaseAdmin.storage.from('tour-photos').upload(path,bytes,{contentType:data.type});
 if(error)throw new Error('Could not upload the photo.');
 const {data:signed}=await supabaseAdmin.storage.from('tour-photos').createSignedUrl(path,3600);
 return {path,url:signed?.signedUrl.replace(process.env['SUPABASE_URL']!,import.meta.env['VITE_SUPABASE_URL'])??''};
});
export const adminExportBookings=createServerFn({method:'GET'}).handler(async()=>{
 await requireAdmin(process.env['SESSION_SECRET']!);
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {bookingsCsv}=await import('./booking-csv');
 const rows=[];
 for(let offset=0;;offset+=1000){
 const {data,error}=await supabaseAdmin.from('booking_requests').select('*').order('created_at').order('id').range(offset,offset+999);
 if(error)throw new Error('Could not export bookings.');
 rows.push(...(data??[])); if((data??[]).length<1000)break;
 }
 return {csv:bookingsCsv(rows)};
});
