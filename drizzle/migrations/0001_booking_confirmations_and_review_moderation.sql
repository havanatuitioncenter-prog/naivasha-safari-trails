ALTER TABLE public.booking_requests ADD COLUMN admin_note text NOT NULL DEFAULT '';
ALTER TABLE public.booking_requests ADD COLUMN confirmed_at timestamp with time zone;
ALTER TABLE public.visitor_reviews ADD COLUMN hidden boolean NOT NULL DEFAULT false;
DROP POLICY IF EXISTS "Visitors can read shared reviews" ON public.visitor_reviews;
CREATE POLICY "Visitors can read shared reviews" ON public.visitor_reviews FOR SELECT TO anon, authenticated USING (hidden = false);