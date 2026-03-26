import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, UserPlus, Trash2, Search, AlertTriangle, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface AdminUser {
  role_id: string;
  user_id: string;
  role: string;
  display_name: string;
  created_at: string;
}

export default function AdminRoles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    // Get all admin roles
    const { data: roles } = await supabase
      .from("user_roles")
      .select("id, user_id, role, created_at")
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      setAdmins([]);
      setLoading(false);
      return;
    }

    // Get profiles for these users
    const userIds = roles.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) || []);

    const merged: AdminUser[] = roles.map((r) => ({
      role_id: r.id,
      user_id: r.user_id,
      role: r.role,
      display_name: profileMap.get(r.user_id) || "Unknown User",
      created_at: r.created_at,
    }));

    setAdmins(merged);
    setLoading(false);
  };

  const handleAddAdmin = async () => {
    if (!email.trim()) return;
    setAdding(true);

    // Find profile by display_name (email)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .ilike("display_name", email.trim());

    if (!profiles || profiles.length === 0) {
      toast({ title: "Not Found", description: "No user found with that name/email.", variant: "destructive" });
      setAdding(false);
      return;
    }

    const targetUserId = profiles[0].user_id;

    // Check if already admin
    const existing = admins.find((a) => a.user_id === targetUserId);
    if (existing) {
      toast({ title: "Already Admin", description: "This user is already an admin.", variant: "destructive" });
      setAdding(false);
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: targetUserId, role: "admin" as any });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Admin Added", description: `${profiles[0].display_name} is now an admin.` });
      setEmail("");
      fetchAdmins();
    }
    setAdding(false);
  };

  const handleRemoveAdmin = async (admin: AdminUser) => {
    // Prevent removing the last admin
    if (admins.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one admin must remain. You cannot remove the last admin.",
        variant: "destructive",
      });
      return;
    }

    // Prevent removing yourself
    if (admin.user_id === user?.id) {
      toast({
        title: "Cannot Remove",
        description: "You cannot remove your own admin access.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`Remove admin access from "${admin.display_name}"?`)) return;

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", admin.role_id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Removed", description: `${admin.display_name} is no longer an admin.` });
      fetchAdmins();
    }
  };

  const filtered = admins.filter((a) =>
    a.display_name.toLowerCase().includes(search.toLowerCase())
  );

  const isCurrentUser = (userId: string) => userId === user?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Access Control</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage who has admin access. At least one admin is mandatory.
        </p>
      </div>

      {/* Add Admin */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" /> Add New Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user display name or email..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAddAdmin()}
            />
            <Button onClick={handleAddAdmin} disabled={adding || !email.trim()} className="gap-2 shrink-0">
              <UserPlus className="w-4 h-4" />
              {adding ? "Adding..." : "Add Admin"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Search by the user's display name as shown in their profile.
          </p>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-600 dark:text-amber-400">Important Security Notice</p>
          <p className="text-muted-foreground mt-0.5">
            At least one admin must always exist. You cannot remove yourself or the last remaining admin.
          </p>
        </div>
      </div>

      {/* Search */}
      {admins.length > 3 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search admins..." className="pl-9" />
        </div>
      )}

      {/* Admin List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((admin, i) => (
            <motion.div
              key={admin.role_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {admin.display_name?.charAt(0)?.toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-foreground truncate">{admin.display_name}</h3>
                        {isCurrentUser(admin.user_id) && (
                          <Badge variant="outline" className="text-[10px] shrink-0">You</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Admin since {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-0 text-[10px] gap-1">
                        <Crown className="w-3 h-3" /> Admin
                      </Badge>
                      {!isCurrentUser(admin.user_id) && admins.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAdmin(admin)}
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
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
