import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useNavigate } from "react-router-dom";
import {
  Shield, Lock, Key, Mail, AlertTriangle,
  CheckCircle, Eye, EyeOff, RefreshCw, Globe, Fingerprint,
  Clock, Timer, Smartphone, UserPlus, X, Pencil
} from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

const SESSION_TIMEOUT_KEY = "admin_session_timeout_hours";

export default function AdminSecurity() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin list
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Security toggles
  const [loginNotifications, setLoginNotifications] = useState(false);

  // Session timeout
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState("12");
  const [savingTimeout, setSavingTimeout] = useState(false);

  // TOTP
  const [totpStatus, setTotpStatus] = useState<{ enabled: boolean; setup_pending: boolean }>({ enabled: false, setup_pending: false });
  const [totpSetupData, setTotpSetupData] = useState<{ secret: string; uri: string } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpVerifying, setTotpVerifying] = useState(false);
  const [totpDisableCode, setTotpDisableCode] = useState("");
  const [showDisableTotp, setShowDisableTotp] = useState(false);
  const [totpLoading, setTotpLoading] = useState(true);

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  // Admin slug change
  const [newSlug, setNewSlug] = useState("");
  const [changingSlug, setChangingSlug] = useState(false);

  useEffect(() => {
    fetchAdminEmails();
    fetchSecuritySettings();
    fetchTotpStatus();
  }, []);

  const fetchAdminEmails = async () => {
    setLoadingRoles(true);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (roles && roles.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", roles.map((r) => r.user_id));

      if (profiles) {
        setAdminEmails(profiles.map((p) => p.display_name));
      }
    }
    setLoadingRoles(false);
  };

  const fetchSecuritySettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["login_notifications", SESSION_TIMEOUT_KEY]);

    if (data) {
      data.forEach((row: any) => {
        if (row.key === "login_notifications") setLoginNotifications(row.value === true || row.value === "true");
        if (row.key === SESSION_TIMEOUT_KEY) setSessionTimeoutHours(String(row.value || "12"));
      });
    }
  };

  const fetchTotpStatus = async () => {
    setTotpLoading(true);
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
      setTotpStatus({ enabled: result.enabled, setup_pending: result.setup_pending });
    } catch (err) {
      console.error("TOTP status error:", err);
    }
    setTotpLoading(false);
  };

  const saveSetting = async (key: string, value: any) => {
    await supabase
      .from("site_settings")
      .upsert(
        { key, value: value as any, updated_at: new Date().toISOString(), updated_by: user?.id },
        { onConflict: "key" }
      );
  };

  const handleToggleLoginNotifications = async (val: boolean) => {
    setLoginNotifications(val);
    await saveSetting("login_notifications", val);
    toast({ title: "Updated", description: `Login notifications ${val ? "enabled" : "disabled"}.` });
  };

  const handleSaveSessionTimeout = async () => {
    const hours = parseInt(sessionTimeoutHours);
    if (isNaN(hours) || hours < 1 || hours > 720) {
      toast({ title: "Error", description: "Session timeout must be between 1 and 720 hours.", variant: "destructive" });
      return;
    }
    setSavingTimeout(true);
    await saveSetting(SESSION_TIMEOUT_KEY, hours);
    localStorage.setItem(SESSION_TIMEOUT_KEY, String(hours));
    setSavingTimeout(false);
    toast({ title: "Saved", description: `Session will expire after ${hours} hours of inactivity.` });
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Password changed successfully." });
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  // TOTP Setup
  const handleTotpSetup = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/totp-manage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "setup" }),
      });
      const result = await res.json();
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        return;
      }
      setTotpSetupData(result);
      setTotpStatus({ enabled: false, setup_pending: true });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleTotpVerify = async () => {
    if (totpCode.length !== 6) {
      toast({ title: "Error", description: "Enter a 6-digit code.", variant: "destructive" });
      return;
    }
    setTotpVerifying(true);
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
        toast({ title: "Success!", description: "Google Authenticator has been activated." });
        setTotpStatus({ enabled: true, setup_pending: false });
        setTotpSetupData(null);
        setTotpCode("");
        // Mark session as TOTP verified
        sessionStorage.setItem("totp_verified", "true");
      } else {
        toast({ title: "Invalid Code", description: "The code is incorrect. Please try again.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setTotpVerifying(false);
  };

  const handleTotpDisable = async () => {
    if (totpDisableCode.length !== 6) {
      toast({ title: "Error", description: "Enter a 6-digit code to disable.", variant: "destructive" });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/totp-manage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "disable", code: totpDisableCode }),
      });
      const result = await res.json();
      if (result.disabled) {
        toast({ title: "Disabled", description: "Google Authenticator has been removed." });
        setTotpStatus({ enabled: false, setup_pending: false });
        setShowDisableTotp(false);
        setTotpDisableCode("");
        sessionStorage.removeItem("totp_verified");
      } else {
        toast({ title: "Error", description: result.error || "Invalid code.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Email change handler
  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({ title: "Error", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    setChangingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "A confirmation email has been sent to the new address. Please verify to complete the change." });
      setNewEmail("");
    }
    setChangingEmail(false);
  };

  // Admin slug change handler
  const handleChangeSlug = async () => {
    const slug = newSlug.trim().replace(/[^a-zA-Z0-9-_]/g, "");
    if (!slug || slug.length < 4) {
      toast({ title: "Error", description: "Slug must be at least 4 characters (letters, numbers, hyphens).", variant: "destructive" });
      return;
    }
    setChangingSlug(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "admin_slug", value: slug as any, updated_at: new Date().toISOString(), updated_by: user?.id },
        { onConflict: "key" }
      );
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Admin URL changed to /${slug}. Redirecting...` });
      setNewSlug("");
      setTimeout(() => navigate(`/${slug}/security`), 1500);
    }
    setChangingSlug(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Security & Access</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage admin credentials, session timeout, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Account Info */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-primary" />
                Admin Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground truncate">{user?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <p className="text-sm font-mono text-foreground">{user?.id?.slice(0, 12)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge className="bg-primary/10 text-primary text-xs">Admin</Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Admin Panel URL</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/admingorohid306</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                />
              </div>
              {newPassword && (
                <div className="flex items-center gap-2 text-xs">
                  {newPassword.length >= 6 ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span className={newPassword.length >= 6 ? "text-green-600" : "text-amber-600"}>
                    {newPassword.length >= 6 ? "Password strength OK" : "Minimum 6 characters required"}
                  </span>
                </div>
              )}
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword || !newPassword || newPassword !== confirmPassword}
                variant="outline"
                className="gap-2 w-full"
              >
                <Lock className="w-4 h-4" />
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Google Authenticator (TOTP) */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              Google Authenticator (TOTP)
              {totpLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              ) : totpStatus.enabled ? (
                <Badge className="bg-green-500/10 text-green-600 text-[10px]">Active</Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security by requiring a 6-digit code from Google Authenticator
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!totpStatus.enabled && !totpSetupData && (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Protect your admin account by requiring a verification code from Google Authenticator each time you access the admin panel.
                </p>
                <Button onClick={handleTotpSetup} className="mt-4 gap-2">
                  <Key className="w-4 h-4" />
                  Setup Google Authenticator
                </Button>
              </div>
            )}

            {totpSetupData && !totpStatus.enabled && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <QRCodeSVG value={totpSetupData.uri} size={200} />
                  </div>
                  {/* Instructions */}
                  <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-foreground">Setup Steps:</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                        Install <strong className="text-foreground">Google Authenticator</strong> on your phone (iOS/Android)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                        Open the app and tap the <strong className="text-foreground">+</strong> button
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                        Select <strong className="text-foreground">"Scan a QR code"</strong> and scan the code on the left
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                        Enter the 6-digit code below to verify
                      </li>
                    </ol>

                    <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Manual entry key (if QR scan doesn't work):</p>
                      <code className="text-sm font-mono text-foreground break-all select-all">{totpSetupData.secret}</code>
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end pt-2 border-t border-border/50">
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-sm font-medium">Enter 6-digit code from Google Authenticator</label>
                    <Input
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="text-center text-lg font-mono tracking-[0.5em] max-w-[200px]"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => { setTotpSetupData(null); setTotpCode(""); }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleTotpVerify}
                      disabled={totpVerifying || totpCode.length !== 6}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {totpVerifying ? "Verifying..." : "Verify & Activate"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {totpStatus.enabled && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Google Authenticator is active</p>
                    <p className="text-xs text-muted-foreground">A 6-digit code will be required each time you access the admin panel.</p>
                  </div>
                </div>

                {!showDisableTotp ? (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
                    onClick={() => setShowDisableTotp(true)}
                  >
                    <X className="w-4 h-4" /> Disable Google Authenticator
                  </Button>
                ) : (
                  <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 space-y-3">
                    <p className="text-sm font-medium text-destructive">Enter your current 6-digit code to disable:</p>
                    <div className="flex gap-3">
                      <Input
                        value={totpDisableCode}
                        onChange={(e) => setTotpDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        className="text-center font-mono tracking-[0.5em] max-w-[200px]"
                        maxLength={6}
                      />
                      <Button
                        variant="destructive"
                        onClick={handleTotpDisable}
                        disabled={totpDisableCode.length !== 6}
                      >
                        Disable
                      </Button>
                      <Button variant="outline" onClick={() => { setShowDisableTotp(false); setTotpDisableCode(""); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Session Timeout */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              Session Timeout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Timeout Duration (hours)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="720"
                  value={sessionTimeoutHours}
                  onChange={(e) => setSessionTimeoutHours(e.target.value)}
                  placeholder="12"
                />
                <p className="text-xs text-muted-foreground">
                  Current: <span className="font-medium text-foreground">{sessionTimeoutHours} hours</span>
                </p>
              </div>
              <Button onClick={handleSaveSessionTimeout} disabled={savingTimeout} className="gap-2 shrink-0">
                <Clock className="w-4 h-4" />
                {savingTimeout ? "Saving..." : "Save Timeout"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[6, 12, 24, 48, 72].map((h) => (
                <Button
                  key={h}
                  variant={sessionTimeoutHours === String(h) ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSessionTimeoutHours(String(h))}
                >
                  {h}h
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Login Notifications */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Login Notifications</p>
                  <p className="text-xs text-muted-foreground">Get an email notification on each new sign-in</p>
                </div>
              </div>
              <Switch checked={loginNotifications} onCheckedChange={handleToggleLoginNotifications} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Admin Access Control */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              Admin Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Admins</label>
              {loadingRoles ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
                </div>
              ) : (
                <div className="space-y-2">
                  {adminEmails.length > 0 ? (
                    adminEmails.map((name, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Admin</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No admin records found.</p>
                  )}
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-border/50">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="font-medium text-amber-700 dark:text-amber-400">Security Notice</p>
                    <p className="text-muted-foreground">The admin panel URL and credentials should never be shared publicly.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
