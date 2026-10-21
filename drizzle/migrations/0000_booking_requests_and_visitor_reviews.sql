CREATE TABLE public.booking_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK(char_length(email) BETWEEN 3 AND 255),
 phone text NOT NULL CHECK(char_length(phone) BETWEEN 7 AND 30),
 tour text NOT NULL CHECK(char_length(tour) BETWEEN 1 AND 120),
 travel_date date NOT NULL, guests integer NOT NULL CHECK(guests BETWEEN 1 AND 100),
 message text NOT NULL DEFAULT '' CHECK(char_length(message) <= 2000),
 status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','closed'))
);
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.visitor_reviews (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL CHECK(char_length(name) BETWEEN 1 AND 100),
 country text NOT NULL DEFAULT '' CHECK(char_length(country) <= 100),
 tour text NOT NULL CHECK(char_length(tour) BETWEEN 1 AND 120),
 rating integer NOT NULL CHECK(rating BETWEEN 1 AND 5),
 review text NOT NULL CHECK(char_length(review) BETWEEN 10 AND 2000)
);
GRANT SELECT ON public.visitor_reviews TO anon, authenticated;
GRANT ALL ON public.visitor_reviews TO service_role;
ALTER TABLE public.visitor_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can read shared reviews" ON public.visitor_reviews FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX visitor_reviews_created_idx ON public.visitor_reviews(created_at DESC);