
CREATE TABLE public.custom_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'utility',
  icon_name text NOT NULL DEFAULT 'Wrench',
  color text NOT NULL DEFAULT 'hsl(263, 85%, 58%)',
  html_content text NOT NULL DEFAULT '',
  is_enabled boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can insert custom tools" ON public.custom_tools FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update custom tools" ON public.custom_tools FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete custom tools" ON public.custom_tools FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view enabled custom tools" ON public.custom_tools FOR SELECT TO public USING (true);

CREATE TRIGGER update_custom_tools_updated_at BEFORE UPDATE ON public.custom_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
