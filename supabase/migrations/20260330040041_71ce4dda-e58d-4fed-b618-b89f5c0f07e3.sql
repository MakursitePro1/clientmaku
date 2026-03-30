
-- Add view_count to custom_tools
ALTER TABLE public.custom_tools ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

-- Create tool_ratings table
CREATE TABLE public.tool_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES public.custom_tools(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (tool_id, user_id)
);

ALTER TABLE public.tool_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can view ratings
CREATE POLICY "Anyone can view ratings" ON public.tool_ratings FOR SELECT TO public USING (true);

-- Authenticated users can insert their rating
CREATE POLICY "Users can rate tools" ON public.tool_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can update their own rating
CREATE POLICY "Users can update own rating" ON public.tool_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can delete their own rating
CREATE POLICY "Users can delete own rating" ON public.tool_ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Function to increment view count (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.increment_tool_view(tool_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.custom_tools SET view_count = view_count + 1 WHERE slug = tool_slug AND is_enabled = true AND deleted_at IS NULL;
END;
$$;

-- Function to get average rating
CREATE OR REPLACE FUNCTION public.get_tool_rating(p_tool_id uuid)
RETURNS TABLE(avg_rating numeric, total_ratings bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(AVG(rating)::numeric(3,1), 0), COUNT(*) FROM public.tool_ratings WHERE tool_id = p_tool_id;
$$;
