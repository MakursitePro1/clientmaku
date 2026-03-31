
-- Add BDT price columns to subscription_plans
ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS price_monthly_bdt numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_semi_annual_bdt numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_annual_bdt numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_lifetime_bdt numeric NOT NULL DEFAULT 0;

-- Create payment_gateways table for admin-managed payment methods
CREATE TABLE IF NOT EXISTS public.payment_gateways (
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

ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled gateways" ON public.payment_gateways FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert gateways" ON public.payment_gateways FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gateways" ON public.payment_gateways FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gateways" ON public.payment_gateways FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Insert default payment gateways
INSERT INTO public.payment_gateways (name, gateway_id, account_number, color, display_order) VALUES
  ('bKash', 'bkash', '01XXXXXXXXX', '#E2136E', 1),
  ('Nagad', 'nagad', '01XXXXXXXXX', '#F6921E', 2),
  ('Rocket', 'rocket', '01XXXXXXXXX', '#8C3494', 3),
  ('Upay', 'upay', '01XXXXXXXXX', '#00A651', 4),
  ('Bank Transfer', 'bank', 'Account details will be shown', '#1a56db', 5),
  ('Card Payment', 'card', 'Contact for card payment', '#1a1a2e', 6);
