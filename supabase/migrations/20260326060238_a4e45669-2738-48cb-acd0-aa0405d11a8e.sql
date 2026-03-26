
CREATE TABLE public.tool_seo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id text NOT NULL UNIQUE,
  custom_slug text NOT NULL DEFAULT '',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  meta_keywords text NOT NULL DEFAULT '',
  og_title text NOT NULL DEFAULT '',
  og_description text NOT NULL DEFAULT '',
  og_image text NOT NULL DEFAULT '',
  og_type text NOT NULL DEFAULT 'website',
  twitter_card text NOT NULL DEFAULT 'summary_large_image',
  twitter_title text NOT NULL DEFAULT '',
  twitter_description text NOT NULL DEFAULT '',
  canonical_url text NOT NULL DEFAULT '',
  robots text NOT NULL DEFAULT 'index, follow',
  structured_data jsonb DEFAULT NULL,
  long_description text NOT NULL DEFAULT '',
  focus_keyword text NOT NULL DEFAULT '',
  is_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid DEFAULT NULL
);

ALTER TABLE public.tool_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tool SEO" ON public.tool_seo
FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert tool SEO" ON public.tool_seo
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tool SEO" ON public.tool_seo
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tool SEO" ON public.tool_seo
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
