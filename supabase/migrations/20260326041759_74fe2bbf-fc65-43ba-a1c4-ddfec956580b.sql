
CREATE TABLE public.totp_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  secret text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.totp_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own totp" ON public.totp_secrets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON public.totp_secrets
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER update_totp_secrets_updated_at
  BEFORE UPDATE ON public.totp_secrets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
