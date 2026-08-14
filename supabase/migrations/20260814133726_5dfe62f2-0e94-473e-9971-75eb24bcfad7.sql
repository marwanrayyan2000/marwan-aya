CREATE TABLE public.guestbook_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 60),
  message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 600),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.guestbook_entries TO anon, authenticated;
GRANT ALL ON public.guestbook_entries TO service_role;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook entries"
  ON public.guestbook_entries FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can add a guestbook entry"
  ON public.guestbook_entries FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.memory_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL CHECK (char_length(image_url) BETWEEN 1 AND 1000),
  caption TEXT CHECK (caption IS NULL OR char_length(caption) <= 200),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.memory_photos TO anon, authenticated;
GRANT ALL ON public.memory_photos TO service_role;
ALTER TABLE public.memory_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared photos"
  ON public.memory_photos FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can share a photo"
  ON public.memory_photos FOR INSERT TO anon, authenticated WITH CHECK (true);