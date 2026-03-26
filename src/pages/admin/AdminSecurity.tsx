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
  Shield, Lock, Key, Mail, UserPlus, UserMinus, AlertTriangle,
  CheckCircle, Eye, EyeOff, RefreshCw, Globe, Fingerprint
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSecurity() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin email management
  const [adminEmail, setAdminEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Security settings from site_settings
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

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
      .in("key", ["google_auth_enabled", "two_factor_enabled", "login_notifications"]);

    if (data) {
      data.forEach((row: any) => {
        const val = row.value === true || row.value === "true";
        if (row.key === "google_auth_enabled") setGoogleAuthEnabled(val);
        if (row.key === "two_factor_enabled") setTwoFactorEnabled(val);
        if (row.key === "login_notifications") setLoginNotifications(val);
      });
    }
  };

  const saveSecuritySetting = async (key: string, value: boolean) => {
    await supabase
      .from("site_settings")
      .upsert(
        { key, value: value as any, updated_at: new Date().toISOString(), updated_by: user?.id },
        { onConflict: "key" }
      );
  };

  const handleToggleGoogleAuth = async (val: boolean) => {
    setGoogleAuthEnabled(val);
    await saveSecuritySetting("google_auth_enabled", val);
    toast({ title: "Updated", description: `Google Auth ${val ? "enabled" : "disabled"}.` });
  };

  const handleToggleTwoFactor = async (val: boolean) => {
    setTwoFactorEnabled(val);
    await saveSecuritySetting("two_factor_enabled", val);
    toast({ title: "Updated", description: `Two-Factor Auth ${val ? "enabled" : "disabled"}.` });
  };

  const handleToggleLoginNotifications = async (val: boolean) => {
    setLoginNotifications(val);
    await saveSecuritySetting("login_notifications", val);
    toast({ title: "Updated", description: `Login notifications ${val ? "enabled" : "disabled"}.` });
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
      setCurrentPassword("");
    }
    setChangingPassword(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Security & Access</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage admin credentials, authentication methods, and security settings
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

      {/* Authentication Methods */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Authentication Methods
            </CardTitle>
            <p className="text-xs text-muted-foreground">Configure how users sign in to your site</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Google Sign-In</p>
                  <p className="text-xs text-muted-foreground">Allow users to sign in with Google</p>
                </div>
              </div>
              <Switch checked={googleAuthEnabled} onCheckedChange={handleToggleGoogleAuth} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add extra layer of security</p>
                </div>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={handleToggleTwoFactor} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Login Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified on new sign-ins</p>
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
                    adminEmails.map((email, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{email}</span>
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
              <p className="text-xs text-muted-foreground mb-3">
                Admin access is controlled through the database. Only users with the "admin" role in the user_roles table can access this panel.
              </p>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <p className="font-medium">Security Notice</p>
                    <p>The admin panel URL and credentials should never be shared publicly. Only authorized personnel should have access.</p>
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
