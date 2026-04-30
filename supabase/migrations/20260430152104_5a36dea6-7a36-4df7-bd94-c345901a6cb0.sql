CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  path text NOT NULL,
  referrer text,
  referrer_host text,
  country text,
  region text,
  city text,
  visitor_hash text,
  user_agent text
);

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_country ON public.page_views (country);
CREATE INDEX idx_page_views_path ON public.page_views (path);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view page_views"
ON public.page_views
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete page_views"
ON public.page_views
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));
