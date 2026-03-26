import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, UserPlus, Trash2, Search, AlertTriangle, Crown,
  Mail, Lock, Eye, EyeOff, ShieldCheck, UserCheck, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminUser {
  role_id: string;
  user_id: string;
  role: string;
  display_name: string;
  email: string;
  created_at: string;
  totp_enabled: boolean;
  totp_verified: boolean;
}

export default function AdminRoles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // New admin form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [enableTotp, setEnableTotp] = useState(false);
  const [creating, setCreating] = useState(false);

  // Existing user form
  const [existingEmail, setExistingEmail] = useState("");
  const [addingExisting, setAddingExisting] = useState(false);

  // TOTP toggling
  const [togglingTotp, setTogglingTotp] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("id, user_id, role, created_at")
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      setAdmins([]);
      setLoading(false);
      return;
    }

    const userIds = roles.map((r) => r.user_id);

    // Fetch profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds);
    const profileMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) || []);

    // Fetch emails via edge function
    let emailMap: Record<string, string> = {};
    try {
      const { data: emailData } = await supabase.functions.invoke("admin-user-manage", {
        body: { action: "get-admin-emails", user_ids: userIds },
      });
      emailMap = emailData?.emails || {};
    } catch { /* ignore */ }

    // Fetch TOTP statuses via edge function
    let totpMap: Record<string, { enabled: boolean; verified: boolean }> = {};
    try {
      const { data: totpData } = await supabase.functions.invoke("admin-user-manage", {
        body: { action: "get-totp-status", user_ids: userIds },
      });
      totpMap = totpData?.statuses || {};
    } catch { /* ignore */ }

    const merged: AdminUser[] = roles.map((r) => ({
      role_id: r.id,
      user_id: r.user_id,
      role: r.role,
      display_name: profileMap.get(r.user_id) || "Unknown User",
      email: emailMap[r.user_id] || "",
      created_at: r.created_at,
      totp_enabled: totpMap[r.user_id]?.enabled || false,
      totp_verified: totpMap[r.user_id]?.verified || false,
    }));

    setAdmins(merged);
    setLoading(false);
  };

  const handleCreateAdmin = async () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      toast({ title: "Required", description: "Email and password are required.", variant: "destructive" });
      return;
    }
    setCreating(true);

    try {
      const { data, error } = await supabase.functions.invoke("admin-user-manage", {
        body: {
          action: "create-admin",
          email: newEmail.trim(),
          password: newPassword,
          display_name: newDisplayName.trim() || newEmail.trim(),
        },
      });

      if (error || data?.error) {
        toast({ title: "Error", description: data?.error || error?.message || "Failed to create admin.", variant: "destructive" });
        setCreating(false);
        return;
      }

      // If TOTP should be enabled
      if (enableTotp && data?.user_id) {
        await supabase.functions.invoke("admin-user-manage", {
          body: { action: "toggle-totp", target_user_id: data.user_id, enabled: true },
        });
      }

      toast({ title: "Success", description: data?.message || "Admin created successfully!" });
      setNewEmail("");
      setNewPassword("");
      setNewDisplayName("");
      setEnableTotp(false);
      fetchAdmins();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setCreating(false);
  };

  const handleAddExistingAdmin = async () => {
    if (!existingEmail.trim()) return;
    setAddingExisting(true);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .ilike("display_name", existingEmail.trim());

    if (!profiles || profiles.length === 0) {
      toast({ title: "Not Found", description: "No user found with that name/email.", variant: "destructive" });
      setAddingExisting(false);
      return;
    }

    const targetUserId = profiles[0].user_id;
    const existing = admins.find((a) => a.user_id === targetUserId);
    if (existing) {
      toast({ title: "Already Admin", description: "This user is already an admin.", variant: "destructive" });
      setAddingExisting(false);
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: targetUserId, role: "admin" as any });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Admin Added", description: `${profiles[0].display_name} is now an admin.` });
      setExistingEmail("");
      fetchAdmins();
    }
    setAddingExisting(false);
  };

  const handleRemoveAdmin = async (admin: AdminUser) => {
    if (admins.length <= 1) {
      toast({ title: "Cannot Remove", description: "At least one admin must remain.", variant: "destructive" });
      return;
    }
    if (admin.user_id === user?.id) {
      toast({ title: "Cannot Remove", description: "You cannot remove your own admin access.", variant: "destructive" });
      return;
    }
    if (!window.confirm(`Remove admin access from "${admin.display_name}"?`)) return;

    const { error } = await supabase.from("user_roles").delete().eq("id", admin.role_id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Removed", description: `${admin.display_name} is no longer an admin.` });
      fetchAdmins();
    }
  };

  const handleToggleTotp = async (admin: AdminUser) => {
    setTogglingTotp(admin.user_id);
    const newState = !admin.totp_enabled;

    try {
      const { data, error } = await supabase.functions.invoke("admin-user-manage", {
        body: { action: "toggle-totp", target_user_id: admin.user_id, enabled: newState },
      });

      if (error || data?.error) {
        toast({ title: "Error", description: data?.error || "Failed to toggle 2FA.", variant: "destructive" });
      } else {
        toast({
          title: newState ? "2FA Enabled" : "2FA Disabled",
          description: `Google Authenticator ${newState ? "enabled" : "disabled"} for ${admin.display_name}.`,
        });
        fetchAdmins();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setTogglingTotp(null);
  };

  const filtered = admins.filter((a) =>
    a.display_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const isCurrentUser = (userId: string) => userId === user?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Access Control</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create new admins, manage existing ones, and control 2FA settings.
        </p>
      </div>

      {/* Add Admin — Tabs */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Add Admin
          </CardTitle>
          <CardDescription>Create a brand new admin account or promote an existing user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="create" className="gap-2 text-xs sm:text-sm">
                <UserPlus className="w-3.5 h-3.5" /> Create New Admin
              </TabsTrigger>
              <TabsTrigger value="existing" className="gap-2 text-xs sm:text-sm">
                <UserCheck className="w-3.5 h-3.5" /> Add Existing User
              </TabsTrigger>
            </TabsList>

            {/* Create New Admin */}
            <TabsContent value="create" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                  </Label>
                  <Input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="admin@example.com"
                    type="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password
                  </Label>
                  <div className="relative">
                    <Input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Display Name (Optional)</Label>
                <Input
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g. John Admin"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Google Authenticator (2FA)</p>
                    <p className="text-xs text-muted-foreground">Require TOTP code on login</p>
                  </div>
                </div>
                <Switch checked={enableTotp} onCheckedChange={setEnableTotp} />
              </div>

              <Button
                onClick={handleCreateAdmin}
                disabled={creating || !newEmail.trim() || !newPassword.trim()}
                className="w-full gap-2"
                size="lg"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {creating ? "Creating Admin..." : "Create Admin Account"}
              </Button>
            </TabsContent>

            {/* Add Existing User */}
            <TabsContent value="existing" className="space-y-3 mt-0">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">User Display Name or Email</Label>
                <div className="flex gap-2">
                  <Input
                    value={existingEmail}
                    onChange={(e) => setExistingEmail(e.target.value)}
                    placeholder="Search by display name..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAddExistingAdmin()}
                  />
                  <Button onClick={handleAddExistingAdmin} disabled={addingExisting || !existingEmail.trim()} className="gap-2 shrink-0">
                    {addingExisting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  The user must already have an account on this site.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-600 dark:text-amber-400">Security Notice</p>
          <p className="text-muted-foreground mt-0.5">
            At least one admin must always exist. You cannot remove yourself or the last remaining admin.
          </p>
        </div>
      </div>

      {/* Search */}
      {admins.length > 2 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search admins by name or email..." className="pl-9" />
        </div>
      )}

      {/* Admin List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Active Admins ({admins.length})
          </h2>
          <AnimatePresence>
            {filtered.map((admin, i) => (
              <motion.div
                key={admin.role_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
              >
                <Card className="border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-11 h-11">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-sm font-bold">
                            {admin.display_name?.charAt(0)?.toUpperCase() || "A"}
                          </AvatarFallback>
                        </Avatar>
                        {isCurrentUser(admin.user_id) && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-background" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-foreground truncate">{admin.display_name}</h3>
                          {isCurrentUser(admin.user_id) && (
                            <Badge variant="outline" className="text-[10px] shrink-0 border-emerald-500/30 text-emerald-600">You</Badge>
                          )}
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] gap-1 shrink-0">
                            <Crown className="w-3 h-3" /> Admin
                          </Badge>
                        </div>
                        {admin.email && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{admin.email}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                          Since {new Date(admin.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* TOTP Toggle */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className={`w-3.5 h-3.5 ${admin.totp_enabled ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">2FA</span>
                          </div>
                          <Switch
                            checked={admin.totp_enabled}
                            onCheckedChange={() => handleToggleTotp(admin)}
                            disabled={togglingTotp === admin.user_id}
                            className="scale-75"
                          />
                        </div>

                        {/* Remove Button */}
                        {!isCurrentUser(admin.user_id) && admins.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdmin(admin)}
                            className="text-destructive hover:bg-destructive/10 h-9 w-9"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No admins found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
