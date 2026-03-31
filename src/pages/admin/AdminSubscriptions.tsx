import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Crown, Check, X, Clock, DollarSign, Users, Package, Shield, Eye, Search, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { tools } from "@/data/tools";

export default function AdminSubscriptions() {
  const [activeTab, setActiveTab] = useState("payments");
  const [payments, setPayments] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [premiumToolIds, setPremiumToolIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [searchTool, setSearchTool] = useState("");
  const { user } = useAuth();

  const fetchAll = async () => {
    setLoading(true);
    const [paymentsRes, subsRes, plansRes, premiumRes] = await Promise.all([
      supabase.from("payment_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("user_subscriptions").select("*").order("created_at", { ascending: false }),
      supabase.from("subscription_plans").select("*").order("display_order"),
      supabase.from("premium_tools").select("*"),
    ]);
    if (paymentsRes.data) setPayments(paymentsRes.data);
    if (subsRes.data) setSubscriptions(subsRes.data);
    if (plansRes.data) setPlans(plansRes.data);
    if (premiumRes.data) setPremiumToolIds(premiumRes.data.map((p: any) => p.tool_id));
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleApprove = async (payment: any) => {
    try {
      const now = new Date();
      let expiresAt = new Date();
      if (payment.billing_period === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
      else if (payment.billing_period === "semi_annual") expiresAt.setMonth(expiresAt.getMonth() + 6);
      else if (payment.billing_period === "annual") expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      else expiresAt.setFullYear(expiresAt.getFullYear() + 99);

      // Update payment
      await supabase.from("payment_requests").update({
        status: "approved",
        admin_note: adminNote,
        reviewed_by: user?.id,
        reviewed_at: now.toISOString(),
      }).eq("id", payment.id);

      // Activate subscription
      if (payment.subscription_id) {
        await supabase.from("user_subscriptions").update({
          status: "active",
          starts_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          approved_by: user?.id,
        }).eq("id", payment.subscription_id);
      }

      toast.success("Payment approved & subscription activated!");
      setReviewDialog(null);
      setAdminNote("");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReject = async (payment: any) => {
    await supabase.from("payment_requests").update({
      status: "rejected",
      admin_note: adminNote,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", payment.id);

    if (payment.subscription_id) {
      await supabase.from("user_subscriptions").update({ status: "cancelled" }).eq("id", payment.subscription_id);
    }

    toast.success("Payment rejected");
    setReviewDialog(null);
    setAdminNote("");
    fetchAll();
  };

  const togglePremiumTool = async (toolId: string) => {
    if (premiumToolIds.includes(toolId)) {
      await supabase.from("premium_tools").delete().eq("tool_id", toolId);
      setPremiumToolIds(prev => prev.filter(id => id !== toolId));
      toast.success("Tool removed from premium");
    } else {
      await supabase.from("premium_tools").insert({ tool_id: toolId });
      setPremiumToolIds(prev => [...prev, toolId]);
      toast.success("Tool added to premium");
    }
  };

  const togglePlanEnabled = async (planId: string, enabled: boolean) => {
    await supabase.from("subscription_plans").update({ is_enabled: enabled }).eq("id", planId);
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, is_enabled: enabled } : p));
    toast.success(enabled ? "Plan enabled" : "Plan disabled");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved": case "active": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "rejected": case "cancelled": case "expired": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(searchTool.toLowerCase()) || t.id.includes(searchTool.toLowerCase())
  );

  const stats = {
    totalRevenue: payments.filter(p => p.status === "approved").reduce((s, p) => s + Number(p.amount), 0),
    pending: payments.filter(p => p.status === "pending").length,
    activeSubs: subscriptions.filter(s => s.status === "active").length,
    totalSubs: subscriptions.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            Subscription Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage plans, payments & premium tools</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-500" },
          { label: "Pending Payments", value: stats.pending, icon: Clock, color: "text-amber-500" },
          { label: "Active Subscriptions", value: stats.activeSubs, icon: Users, color: "text-blue-500" },
          { label: "Total Subscriptions", value: stats.totalSubs, icon: Package, color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="payments" className="gap-1.5">
            <DollarSign className="w-4 h-4" /> Payments
            {stats.pending > 0 && <Badge variant="destructive" className="ml-1 text-[10px] px-1.5">{stats.pending}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="gap-1.5"><Users className="w-4 h-4" /> Subscriptions</TabsTrigger>
          <TabsTrigger value="plans" className="gap-1.5"><Package className="w-4 h-4" /> Plans</TabsTrigger>
          <TabsTrigger value="premium-tools" className="gap-1.5"><Shield className="w-4 h-4" /> Premium Tools</TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-4 space-y-3">
          {payments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No payment requests yet</div>
          ) : (
            payments.map((p) => (
              <div key={p.id} className="rounded-xl border border-border/50 bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{p.payment_method.toUpperCase()}</span>
                    <Badge variant="outline" className={cn("text-[10px]", statusColor(p.status))}>{p.status}</Badge>
                    <span className="text-xs text-muted-foreground">#{p.transaction_id}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 space-x-3">
                    <span>Amount: <strong>${Number(p.amount).toFixed(2)}</strong></span>
                    <span>From: {p.sender_number || "N/A"}</span>
                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {p.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="text-green-600 border-green-500/30 hover:bg-green-500/10"
                        onClick={() => { setReviewDialog(p); setAdminNote(""); }}>
                        <Eye className="w-3.5 h-3.5 mr-1" /> Review
                      </Button>
                    </>
                  )}
                  {p.status !== "pending" && (
                    <span className="text-xs text-muted-foreground">{p.admin_note && `Note: ${p.admin_note}`}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="mt-4 space-y-3">
          {subscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No subscriptions yet</div>
          ) : (
            subscriptions.map((s) => (
              <div key={s.id} className="rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn("text-[10px]", statusColor(s.status))}>{s.status}</Badge>
                  <span className="text-sm font-semibold">{s.billing_period}</span>
                  <span className="text-xs text-muted-foreground">User: {s.user_id.slice(0, 8)}...</span>
                </div>
                {s.starts_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(s.starts_at).toLocaleDateString()} → {s.expires_at ? new Date(s.expires_at).toLocaleDateString() : "Lifetime"}
                  </p>
                )}
              </div>
            ))
          )}
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="mt-4 space-y-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{plan.name}</span>
                  {plan.is_popular && <Badge className="text-[10px]">Popular</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${Number(plan.price_monthly).toFixed(2)}/mo · ${Number(plan.price_semi_annual).toFixed(2)}/6mo · ${Number(plan.price_annual).toFixed(2)}/yr · ${Number(plan.price_lifetime).toFixed(2)} lifetime
                </p>
              </div>
              <Switch checked={plan.is_enabled} onCheckedChange={(v) => togglePlanEnabled(plan.id, v)} />
            </div>
          ))}
        </TabsContent>

        {/* Premium Tools Tab */}
        <TabsContent value="premium-tools" className="mt-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchTool}
              onChange={(e) => setSearchTool(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">{premiumToolIds.length} tools marked as premium</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => togglePremiumTool(tool.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all text-sm",
                  premiumToolIds.includes(tool.id)
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/30"
                )}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tool.color.replace(")", " / 0.12)"), color: tool.color }}>
                  <tool.icon className="w-4 h-4" />
                </div>
                <span className="flex-1 font-medium truncate">{tool.name}</span>
                {premiumToolIds.includes(tool.id) && (
                  <Crown className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Payment</DialogTitle>
          </DialogHeader>
          {reviewDialog && (
            <div className="space-y-4">
              <div className="rounded-xl bg-accent/30 p-4 space-y-2 text-sm">
                <p><strong>Method:</strong> {reviewDialog.payment_method.toUpperCase()}</p>
                <p><strong>Transaction ID:</strong> {reviewDialog.transaction_id}</p>
                <p><strong>Sender:</strong> {reviewDialog.sender_number || "N/A"}</p>
                <p><strong>Amount:</strong> ${Number(reviewDialog.amount).toFixed(2)}</p>
                <p><strong>Period:</strong> {reviewDialog.billing_period}</p>
                <p><strong>Date:</strong> {new Date(reviewDialog.created_at).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm">Admin Note (optional)</Label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add a note..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleApprove(reviewDialog)} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button onClick={() => handleReject(reviewDialog)} variant="destructive" className="flex-1">
                  <X className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
