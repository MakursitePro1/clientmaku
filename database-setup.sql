-- ================================================================
-- CyberVenom Web Tools Platform — Complete Database Setup
-- Run this in Supabase Dashboard → SQL Editor
-- ================================================================

-- 1. Create Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- ================================================================
-- 2. Create Tables
-- ================================================================

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  username text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- User Roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Site Settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Custom Tools
CREATE TABLE public.custom_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'utility',
  icon_name text NOT NULL DEFAULT 'Wrench',
  color text NOT NULL DEFAULT 'hsl(263, 85%, 58%)',
  html_content text NOT NULL DEFAULT '',
  embed_url text NOT NULL DEFAULT '',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  meta_keywords text NOT NULL DEFAULT '',
  is_enabled boolean NOT NULL DEFAULT true,
  view_count integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Tool Settings
CREATE TABLE public.tool_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id text NOT NULL UNIQUE,
  custom_name text NOT NULL DEFAULT '',
  is_enabled boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Favorites
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- Ad Slots
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

-- Blog Posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  author text NOT NULL DEFAULT 'Admin',
  featured_image text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  read_time text NOT NULL DEFAULT '5 min read',
  status text NOT NULL DEFAULT 'draft',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  published_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Page SEO
CREATE TABLE public.page_seo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  page_name text NOT NULL DEFAULT '',
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
  structured_data jsonb,
  is_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Tool SEO
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
  long_description text NOT NULL DEFAULT '',
  focus_keyword text NOT NULL DEFAULT '',
  structured_data jsonb,
  is_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Subscription Plans
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  badge_text text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'hsl(263, 85%, 58%)',
  price_monthly numeric NOT NULL DEFAULT 0,
  price_semi_annual numeric NOT NULL DEFAULT 0,
  price_annual numeric NOT NULL DEFAULT 0,
  price_lifetime numeric NOT NULL DEFAULT 0,
  price_monthly_bdt numeric NOT NULL DEFAULT 0,
  price_semi_annual_bdt numeric NOT NULL DEFAULT 0,
  price_annual_bdt numeric NOT NULL DEFAULT 0,
  price_lifetime_bdt numeric NOT NULL DEFAULT 0,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_popular boolean NOT NULL DEFAULT false,
  is_enabled boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Premium Tools
CREATE TABLE public.premium_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id text NOT NULL UNIQUE,
  min_plan_id uuid REFERENCES public.subscription_plans(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User Subscriptions
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  billing_period text NOT NULL DEFAULT 'monthly',
  status text NOT NULL DEFAULT 'pending',
  starts_at timestamptz,
  expires_at timestamptz,
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Payment Gateways
CREATE TABLE public.payment_gateways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gateway_id text NOT NULL UNIQUE,
  account_number text NOT NULL DEFAULT '',
  account_name text NOT NULL DEFAULT '',
  instructions text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '#000000',
  is_enabled boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Payment Requests
CREATE TABLE public.payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  subscription_id uuid REFERENCES public.user_subscriptions(id),
  billing_period text NOT NULL DEFAULT 'monthly',
  payment_method text NOT NULL DEFAULT 'bkash',
  transaction_id text NOT NULL DEFAULT '',
  sender_number text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  admin_note text NOT NULL DEFAULT '',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tool Ratings
CREATE TABLE public.tool_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid NOT NULL REFERENCES public.custom_tools(id),
  user_id uuid NOT NULL,
  rating integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tool_id, user_id)
);

-- Page Views
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL DEFAULT '/',
  referrer text DEFAULT '',
  user_agent text DEFAULT '',
  country text DEFAULT '',
  visitor_id text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- TOTP Secrets
CREATE TABLE public.totp_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  secret text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ================================================================
-- 3. Create Functions
-- ================================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN
  -- CHANGE THIS EMAIL to your admin email
  IF NEW.email = 'your-admin@example.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_tool_rating(p_tool_id uuid)
RETURNS TABLE(avg_rating numeric, total_ratings bigint) LANGUAGE sql
STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT COALESCE(AVG(rating)::numeric(3,1), 0), COUNT(*)
  FROM public.tool_ratings WHERE tool_id = p_tool_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_tool_view(tool_slug text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN
  UPDATE public.custom_tools SET view_count = view_count + 1
  WHERE slug = tool_slug AND is_enabled = true AND deleted_at IS NULL;
END;
$$;

-- ================================================================
-- 4. Create Triggers
-- ================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();

-- ================================================================
-- 5. Enable RLS on All Tables
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.totp_secrets ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 6. RLS Policies
-- ================================================================

-- Profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User Roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Site Settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Custom Tools
CREATE POLICY "Anyone can view enabled custom tools" ON public.custom_tools FOR SELECT USING (true);
CREATE POLICY "Admins can insert custom tools" ON public.custom_tools FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update custom tools" ON public.custom_tools FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete custom tools" ON public.custom_tools FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Tool Settings
CREATE POLICY "Anyone can view tool settings" ON public.tool_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert tool settings" ON public.tool_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tool settings" ON public.tool_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tool settings" ON public.tool_settings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Ad Slots
CREATE POLICY "Anyone can view enabled ads" ON public.ad_slots FOR SELECT USING (true);
CREATE POLICY "Admins can insert ads" ON public.ad_slots FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ads" ON public.ad_slots FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ads" ON public.ad_slots FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Blog Posts
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all posts" ON public.blog_posts FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update posts" ON public.blog_posts FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete posts" ON public.blog_posts FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Page SEO
CREATE POLICY "Anyone can view page SEO" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Admins can insert page SEO" ON public.page_seo FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update page SEO" ON public.page_seo FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete page SEO" ON public.page_seo FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Tool SEO
CREATE POLICY "Anyone can view tool SEO" ON public.tool_seo FOR SELECT USING (true);
CREATE POLICY "Admins can insert tool SEO" ON public.tool_seo FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tool SEO" ON public.tool_seo FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tool SEO" ON public.tool_seo FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Subscription Plans
CREATE POLICY "Anyone can view plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can insert plans" ON public.subscription_plans FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update plans" ON public.subscription_plans FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete plans" ON public.subscription_plans FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Premium Tools
CREATE POLICY "Anyone can view premium tools" ON public.premium_tools FOR SELECT USING (true);
CREATE POLICY "Admins can insert premium tools" ON public.premium_tools FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update premium tools" ON public.premium_tools FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete premium tools" ON public.premium_tools FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- User Subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own subscription" ON public.user_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update subscriptions" ON public.user_subscriptions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subscriptions" ON public.user_subscriptions FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Payment Gateways
CREATE POLICY "Anyone can view enabled gateways" ON public.payment_gateways FOR SELECT USING (true);
CREATE POLICY "Admins can insert gateways" ON public.payment_gateways FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gateways" ON public.payment_gateways FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gateways" ON public.payment_gateways FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Payment Requests
CREATE POLICY "Users can view own payments" ON public.payment_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payment_requests FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can submit payments" ON public.payment_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update payments" ON public.payment_requests FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete payments" ON public.payment_requests FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Tool Ratings
CREATE POLICY "Anyone can view ratings" ON public.tool_ratings FOR SELECT USING (true);
CREATE POLICY "Users can rate tools" ON public.tool_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rating" ON public.tool_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rating" ON public.tool_ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Page Views
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view page views" ON public.page_views FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- TOTP Secrets
CREATE POLICY "Users can view own totp" ON public.totp_secrets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Service role full access" ON public.totp_secrets FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ================================================================
-- 7. Indexes
-- ================================================================

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);
CREATE INDEX idx_page_views_visitor_id ON public.page_views (visitor_id);
CREATE INDEX idx_page_views_country ON public.page_views (country);
CREATE INDEX idx_favorites_user_id ON public.favorites (user_id);
CREATE INDEX idx_tool_settings_tool_id ON public.tool_settings (tool_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX idx_custom_tools_slug ON public.custom_tools (slug);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions (user_id);
CREATE INDEX idx_payment_requests_user_id ON public.payment_requests (user_id);

-- ================================================================
-- Done! Your database is ready.
-- ================================================================
