import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smartphone, Shield, CheckCircle } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [totpRequired, setTotpRequired] = useState<boolean | null>(null);
  const [totpVerified, setTotpVerified] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) return;

    // Check if already verified this session
    if (sessionStorage.getItem("totp_verified") === "true") {
      setTotpVerified(true);
      setTotpRequired(false);
      return;
    }

    // Check if TOTP is enabled for this user
    const checkTotp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/totp-manage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: "status" }),
        });
        const result = await res.json();
        if (result.enabled) {
          setTotpRequired(true);
        } else {
          setTotpRequired(false);
          setTotpVerified(true);
        }
      } catch {
        setTotpRequired(false);
        setTotpVerified(true);
      }
    };
    checkTotp();
  }, [user, isAdmin]);

  const handleVerify = async () => {
    if (totpCode.length !== 6) return;
    setVerifying(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/totp-manage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "verify", code: totpCode }),
      });
      const result = await res.json();
      if (result.valid) {
        sessionStorage.setItem("totp_verified", "true");
        setTotpVerified(true);
        setTotpRequired(false);
      } else {
        setError("Invalid code. Please try again.");
        setTotpCode("");
      }
    } catch {
      setError("Verification failed. Please try again.");
    }
    setVerifying(false);
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

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
              onChange={(e) => {
                setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="000000"
              className="text-center text-2xl font-mono tracking-[0.5em] h-14"
              maxLength={6}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button
              onClick={handleVerify}
              disabled={verifying || totpCode.length !== 6}
              className="w-full gap-2 h-11"
            >
              {verifying ? (
                <>Verifying...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verify & Access Admin
                </>
              )}
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
