
CREATE TABLE public.ad_slots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    placement text NOT NULL DEFAULT 'before_tool',
    ad_code text NOT NULL DEFAULT '',
    is_enabled boolean NOT NULL DEFAULT true,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by uuid
);

ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled ads" ON public.ad_slots FOR SELECT USING (true);
CREATE POLICY "Admins can insert ads" ON public.ad_slots FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ads" ON public.ad_slots FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ads" ON public.ad_slots FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
