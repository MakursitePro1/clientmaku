
-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_monthly numeric(10,2) NOT NULL DEFAULT 0,
  price_semi_annual numeric(10,2) NOT NULL DEFAULT 0,
  price_annual numeric(10,2) NOT NULL DEFAULT 0,
  price_lifetime numeric(10,2) NOT NULL DEFAULT 0,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_popular boolean NOT NULL DEFAULT false,
  is_enabled boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  badge_text text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'hsl(263, 85%, 58%)',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Premium tools mapping
CREATE TABLE public.premium_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id text NOT NULL UNIQUE,
  min_plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User subscriptions
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE CASCADE NOT NULL,
  billing_period text NOT NULL DEFAULT 'monthly',
  status text NOT NULL DEFAULT 'pending',
  starts_at timestamptz,
  expires_at timestamptz,
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Payment requests
CREATE TABLE public.payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subscription_id uuid REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE CASCADE NOT NULL,
  billing_period text NOT NULL DEFAULT 'monthly',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'bkash',
  transaction_id text NOT NULL DEFAULT '',
  sender_number text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  admin_note text NOT NULL DEFAULT '',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- subscription_plans: anyone can view, admins can manage
CREATE POLICY "Anyone can view plans" ON public.subscription_plans FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert plans" ON public.subscription_plans FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update plans" ON public.subscription_plans FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete plans" ON public.subscription_plans FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- premium_tools: anyone can view, admins can manage
CREATE POLICY "Anyone can view premium tools" ON public.premium_tools FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert premium tools" ON public.premium_tools FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update premium tools" ON public.premium_tools FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete premium tools" ON public.premium_tools FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- user_subscriptions: users see own, admins see all
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own subscription" ON public.user_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update subscriptions" ON public.user_subscriptions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subscriptions" ON public.user_subscriptions FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- payment_requests: users see own, admins see all
CREATE POLICY "Users can view own payments" ON public.payment_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payment_requests FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can submit payments" ON public.payment_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update payments" ON public.payment_requests FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete payments" ON public.payment_requests FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Insert default plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_semi_annual, price_annual, price_lifetime, features, is_popular, display_order, badge_text, color) VALUES
('Starter', 'Perfect for beginners who want to explore premium tools', 4.00, 20.00, 36.00, 99.00, '["Access 10 premium tools", "Basic support", "No ads on tools", "Email support"]'::jsonb, false, 1, '', 'hsl(199, 89%, 48%)'),
('Professional', 'Best value for regular users and professionals', 9.00, 45.00, 80.00, 199.00, '["Access all premium tools", "Priority support", "No ads anywhere", "API access", "Early access to new tools", "Custom tool requests"]'::jsonb, true, 2, 'Most Popular', 'hsl(263, 85%, 58%)'),
('Enterprise', 'For teams and businesses that need everything', 19.00, 95.00, 170.00, 399.00, '["Everything in Professional", "Team collaboration", "Dedicated support", "White-label options", "Custom integrations", "SLA guarantee", "Unlimited API calls"]'::jsonb, false, 3, 'Best Value', 'hsl(142, 71%, 45%)');

-- Insert 10 popular tools as premium
INSERT INTO public.premium_tools (tool_id) VALUES
('internet-speed-tester'),
('password-generator'),
('ip-address-lookup'),
('temp-mail'),
('temp-number'),
('whois-lookup'),
('hash-generator'),
('typing-test'),
('dns-lookup'),
('ssl-checker');
