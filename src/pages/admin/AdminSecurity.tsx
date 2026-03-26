import { useState, useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield, Lock, Key, Mail, UserPlus, AlertTriangle,
  CheckCircle, Eye, EyeOff, RefreshCw, Globe, Fingerprint,
  Clock, Timer, Smartphone
} from "lucide-react";
import { motion } from "framer-motion";

const SESSION_TIMEOUT_KEY = "admin_session_timeout_hours";

export default function AdminSecurity() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin list
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Security toggles
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(false);

  // Session timeout
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState("12");
  const [savingTimeout, setSavingTimeout] = useState(false);

  useEffect(() => {
    fetchAdminEmails();
    fetchSecuritySettings();
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
      .in("key", ["totp_enabled", "login_notifications", SESSION_TIMEOUT_KEY]);

    if (data) {
      data.forEach((row: any) => {
        if (row.key === "totp_enabled") setTotpEnabled(row.value === true || row.value === "true");
        if (row.key === "login_notifications") setLoginNotifications(row.value === true || row.value === "true");
        if (row.key === SESSION_TIMEOUT_KEY) setSessionTimeoutHours(String(row.value || "12"));
      });
    }
  };

  const saveSetting = async (key: string, value: any) => {
    await supabase
      .from("site_settings")
      .upsert(
        { key, value: value as any, updated_at: new Date().toISOString(), updated_by: user?.id },
        { onConflict: "key" }
      );
  };

  const handleToggleTotp = async (val: boolean) => {
    setTotpEnabled(val);
    await saveSetting("totp_enabled", val);
    toast({ title: "Updated", description: `Google Authenticator (TOTP) ${val ? "enabled" : "disabled"}.` });
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
    // Also save to localStorage for the session checker to use
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
              <p className="text-xs text-muted-foreground">Current admin account details</p>
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
              <p className="text-xs text-muted-foreground">Update your admin password</p>
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

      {/* Session Timeout */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              Session Timeout
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Automatically log out the admin after a specified duration
            </p>
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
                  Current: <span className="font-medium text-foreground">{sessionTimeoutHours} hours</span> — You will be automatically signed out after this period.
                </p>
              </div>
              <Button
                onClick={handleSaveSessionTimeout}
                disabled={savingTimeout}
                className="gap-2 shrink-0"
              >
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

      {/* Security Features */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Security Features
            </CardTitle>
            <p className="text-xs text-muted-foreground">Configure additional security layers</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Google Authenticator (TOTP)</p>
                  <p className="text-xs text-muted-foreground">Require a 6-digit code from Google Authenticator app for admin login</p>
                </div>
              </div>
              <Switch checked={totpEnabled} onCheckedChange={handleToggleTotp} />
            </div>

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
            <p className="text-xs text-muted-foreground">Manage which users have admin privileges</p>
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
                    <p className="text-muted-foreground">The admin panel URL and credentials should never be shared publicly. Only authorized personnel should have access.</p>
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
