import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Smartphone, Shield, CheckCircle, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, signIn } = useAuth();

  // Admin role check
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  // TOTP states
  const [totpRequired, setTotpRequired] = useState<boolean | null>(null);
  const [totpVerified, setTotpVerified] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [totpError, setTotpError] = useState("");

  // Login form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Check admin role
  useEffect(() => {
    if (authLoading) { setAdminLoading(true); return; }
    if (!user) { setIsAdmin(false); setAdminLoading(false); return; }

    let mounted = true;
    const check = async () => {
      setAdminLoading(true);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      setIsAdmin(!error && Boolean(data));
      setAdminLoading(false);
    };
    check();
    return () => { mounted = false; };
  }, [authLoading, user?.id]);

  // Check TOTP requirement
  useEffect(() => {
    if (!user || !isAdmin) return;
    if (sessionStorage.getItem("totp_verified") === "true") {
      setTotpVerified(true);
      setTotpRequired(false);
      return;
    }
    const checkTotp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/totp-manage`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ action: "status" }),
        });
        const result = await res.json();
        if (result.enabled) { setTotpRequired(true); } else { setTotpRequired(false); setTotpVerified(true); }
      } catch {
        setTotpRequired(false);
        setTotpVerified(true);
      }
    };
    checkTotp();
  }, [user, isAdmin]);

  // Handle admin login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setLoginError(error.message);
    }
    setLoginLoading(false);
  };

  // Handle TOTP verify
  const handleVerify = async () => {
    if (totpCode.length !== 6) return;
    setVerifying(true);
    setTotpError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/totp-manage`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: "verify", code: totpCode }),
      });
      const result = await res.json();
      if (result.valid) {
        sessionStorage.setItem("totp_verified", "true");
        setTotpVerified(true);
        setTotpRequired(false);
      } else {
        setTotpError("Invalid code. Please try again.");
        setTotpCode("");
      }
    } catch {
      setTotpError("Verification failed. Please try again.");
    }
    setVerifying(false);
  };

  // Loading state
  if (authLoading || (user && adminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in OR logged in but not admin → show admin login form
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Admin Login</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your admin credentials to access the panel
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {loginError}
                  </div>
                )}

                {/* Show "not admin" message if logged in but not admin */}
                {user && !isAdmin && !adminLoading && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    This account does not have admin access.
                  </div>
                )}

                <Button type="submit" disabled={loginLoading} className="w-full gap-2 h-11">
                  {loginLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In to Admin
                    </>
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                <Shield className="w-3.5 h-3.5" />
                Protected Admin Area
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // TOTP check loading
  if (totpRequired === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // TOTP verification required
  if (totpRequired && !totpVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the 6-digit code from Google Authenticator
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={totpCode}
              onChange={(e) => { setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setTotpError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="000000"
              className="text-center text-2xl font-mono tracking-[0.5em] h-14"
              maxLength={6}
              autoFocus
            />
            {totpError && <p className="text-sm text-destructive text-center">{totpError}</p>}
            <Button onClick={handleVerify} disabled={verifying || totpCode.length !== 6} className="w-full gap-2 h-11">
              {verifying ? <>Verifying...</> : <><CheckCircle className="w-4 h-4" />Verify & Access Admin</>}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              Protected by Google Authenticator
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
