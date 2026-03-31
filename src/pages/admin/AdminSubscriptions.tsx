import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Crown, Check, X, Clock, DollarSign, Users, Package, Shield, Eye, Search,
  Plus, Trash2, Pencil, CreditCard, Settings2, Save, Globe
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { tools } from "@/data/tools";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_semi_annual: number;
  price_annual: number;
  price_lifetime: number;
  price_monthly_bdt: number;
  price_semi_annual_bdt: number;
  price_annual_bdt: number;
  price_lifetime_bdt: number;
  features: string[];
  is_popular: boolean;
  is_enabled: boolean;
  display_order: number;
  badge_text: string;
  color: string;
}

interface Gateway {
  id: string;
  name: string;
  gateway_id: string;
  account_number: string;
  account_name: string;
  instructions: string;
  color: string;
  is_enabled: boolean;
  display_order: number;
}

export default function AdminSubscriptions() {
  const [activeTab, setActiveTab] = useState("payments");
  const [payments, setPayments] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [premiumToolIds, setPremiumToolIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [searchTool, setSearchTool] = useState("");
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [editGateway, setEditGateway] = useState<Gateway | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [activeCurrency, setActiveCurrency] = useState<string>("usd");
  const { user } = useAuth();

  const fetchAll = async () => {
    setLoading(true);
    const [paymentsRes, subsRes, plansRes, premiumRes, gatewaysRes, currencyRes] = await Promise.all([
      supabase.from("payment_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("user_subscriptions").select("*").order("created_at", { ascending: false }),
      supabase.from("subscription_plans").select("*").order("display_order"),
      supabase.from("premium_tools").select("*"),
      supabase.from("payment_gateways").select("*").order("display_order"),
      supabase.from("site_settings").select("*").eq("key", "active_currency").maybeSingle(),
    ]);
    if (paymentsRes.data) setPayments(paymentsRes.data);
    if (subsRes.data) setSubscriptions(subsRes.data);
    if (plansRes.data) setPlans(plansRes.data.map((p: any) => ({
      ...p,
      features: Array.isArray(p.features) ? p.features : [],
    })));
    if (premiumRes.data) setPremiumToolIds(premiumRes.data.map((p: any) => p.tool_id));
    if (gatewaysRes.data) setGateways(gatewaysRes.data);
    if (currencyRes.data) setActiveCurrency(String(currencyRes.data.value) || "usd");
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // === Payment handlers ===
  const handleApprove = async (payment: any) => {
    try {
      const now = new Date();
      let expiresAt = new Date();
      if (payment.billing_period === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
      else if (payment.billing_period === "semi_annual") expiresAt.setMonth(expiresAt.getMonth() + 6);
      else if (payment.billing_period === "annual") expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      else expiresAt.setFullYear(expiresAt.getFullYear() + 99);

      await supabase.from("payment_requests").update({
        status: "approved", admin_note: adminNote,
        reviewed_by: user?.id, reviewed_at: now.toISOString(),
      }).eq("id", payment.id);

      if (payment.subscription_id) {
        await supabase.from("user_subscriptions").update({
          status: "active", starts_at: now.toISOString(),
          expires_at: expiresAt.toISOString(), approved_by: user?.id,
        }).eq("id", payment.subscription_id);
      }
      toast.success("Payment approved & subscription activated!");
      setReviewDialog(null); setAdminNote(""); fetchAll();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleReject = async (payment: any) => {
    await supabase.from("payment_requests").update({
      status: "rejected", admin_note: adminNote,
      reviewed_by: user?.id, reviewed_at: new Date().toISOString(),
    }).eq("id", payment.id);
    if (payment.subscription_id) {
      await supabase.from("user_subscriptions").update({ status: "cancelled" }).eq("id", payment.subscription_id);
    }
    toast.success("Payment rejected"); setReviewDialog(null); setAdminNote(""); fetchAll();
  };

  // === Plan CRUD ===
  const savePlan = async () => {
    if (!editPlan) return;
    const { id, ...rest } = editPlan;
    const payload = {
      ...rest,
      features: rest.features as any,
      price_monthly: Number(rest.price_monthly),
      price_semi_annual: Number(rest.price_semi_annual),
      price_annual: Number(rest.price_annual),
      price_lifetime: Number(rest.price_lifetime),
      price_monthly_bdt: Number(rest.price_monthly_bdt),
      price_semi_annual_bdt: Number(rest.price_semi_annual_bdt),
      price_annual_bdt: Number(rest.price_annual_bdt),
      price_lifetime_bdt: Number(rest.price_lifetime_bdt),
    };

    if (id) {
      const { error } = await supabase.from("subscription_plans").update(payload).eq("id", id);
      if (error) { toast.error(error.message); return; }
      toast.success("Plan updated!");
    } else {
      const { error } = await supabase.from("subscription_plans").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Plan created!");
    }
    setEditPlan(null); fetchAll();
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await supabase.from("subscription_plans").delete().eq("id", id);
    toast.success("Plan deleted"); fetchAll();
  };

  const addFeature = () => {
    if (!newFeature.trim() || !editPlan) return;
    setEditPlan({ ...editPlan, features: [...editPlan.features, newFeature.trim()] });
    setNewFeature("");
  };

  const removeFeature = (idx: number) => {
    if (!editPlan) return;
    setEditPlan({ ...editPlan, features: editPlan.features.filter((_, i) => i !== idx) });
  };

  const newPlanTemplate: Plan = {
    id: "", name: "", description: "", badge_text: "", color: "hsl(263, 85%, 58%)",
    price_monthly: 0, price_semi_annual: 0, price_annual: 0, price_lifetime: 0,
    price_monthly_bdt: 0, price_semi_annual_bdt: 0, price_annual_bdt: 0, price_lifetime_bdt: 0,
    features: [], is_popular: false, is_enabled: true, display_order: plans.length,
  };

  // === Gateway CRUD ===
  const saveGateway = async () => {
    if (!editGateway) return;
    const { id, ...rest } = editGateway;
    if (id) {
      const { error } = await supabase.from("payment_gateways").update(rest).eq("id", id);
      if (error) { toast.error(error.message); return; }
      toast.success("Gateway updated!");
    } else {
      const { error } = await supabase.from("payment_gateways").insert(rest);
      if (error) { toast.error(error.message); return; }
      toast.success("Gateway added!");
    }
    setEditGateway(null); fetchAll();
  };

  const deleteGateway = async (id: string) => {
    if (!confirm("Delete this gateway?")) return;
    await supabase.from("payment_gateways").delete().eq("id", id);
    toast.success("Gateway deleted"); fetchAll();
  };

  const newGatewayTemplate: Gateway = {
    id: "", name: "", gateway_id: "", account_number: "", account_name: "",
    instructions: "", color: "#000000", is_enabled: true, display_order: gateways.length,
  };

  // === Currency ===
  const saveCurrency = async (val: string) => {
    setActiveCurrency(val);
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", "active_currency").maybeSingle();
    if (existing) {
      await supabase.from("site_settings").update({ value: val as any }).eq("key", "active_currency");
    } else {
      await supabase.from("site_settings").insert({ key: "active_currency", value: val as any });
    }
    toast.success(`Currency set to ${val.toUpperCase()}`);
  };

  // === Premium tools ===
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
          <p className="text-sm text-muted-foreground mt-1">Manage plans, payments, gateways & premium tools</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-500" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
          { label: "Active Subs", value: stats.activeSubs, icon: Users, color: "text-blue-500" },
          { label: "Total Subs", value: stats.totalSubs, icon: Package, color: "text-purple-500" },
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
        <TabsList className="w-full justify-start flex-wrap">
          <TabsTrigger value="payments" className="gap-1.5">
            <DollarSign className="w-4 h-4" /> Payments
            {stats.pending > 0 && <Badge variant="destructive" className="ml-1 text-[10px] px-1.5">{stats.pending}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="gap-1.5"><Users className="w-4 h-4" /> Subscriptions</TabsTrigger>
          <TabsTrigger value="plans" className="gap-1.5"><Package className="w-4 h-4" /> Plans</TabsTrigger>
          <TabsTrigger value="gateways" className="gap-1.5"><CreditCard className="w-4 h-4" /> Gateways</TabsTrigger>
          <TabsTrigger value="premium-tools" className="gap-1.5"><Shield className="w-4 h-4" /> Premium Tools</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5"><Settings2 className="w-4 h-4" /> Settings</TabsTrigger>
        </TabsList>

        {/* ====== Payments Tab ====== */}
        <TabsContent value="payments" className="mt-4 space-y-3">
          {payments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No payment requests yet</div>
          ) : payments.map((p) => (
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
                  <Button size="sm" variant="outline" className="text-green-600 border-green-500/30 hover:bg-green-500/10"
                    onClick={() => { setReviewDialog(p); setAdminNote(""); }}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Review
                  </Button>
                )}
                {p.status !== "pending" && p.admin_note && (
                  <span className="text-xs text-muted-foreground">Note: {p.admin_note}</span>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ====== Subscriptions Tab ====== */}
        <TabsContent value="subscriptions" className="mt-4 space-y-3">
          {subscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No subscriptions yet</div>
          ) : subscriptions.map((s) => (
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
          ))}
        </TabsContent>

        {/* ====== Plans Tab ====== */}
        <TabsContent value="plans" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{plans.length} plans</p>
            <Button size="sm" onClick={() => setEditPlan(newPlanTemplate)}>
              <Plus className="w-4 h-4 mr-1" /> Add Plan
            </Button>
          </div>
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">{plan.name}</span>
                    {plan.is_popular && <Badge className="text-[10px]">Popular</Badge>}
                    {plan.badge_text && <Badge variant="outline" className="text-[10px]">{plan.badge_text}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    USD: ${Number(plan.price_monthly)}/mo · ${Number(plan.price_semi_annual)}/6mo · ${Number(plan.price_annual)}/yr · ${Number(plan.price_lifetime)} lifetime
                  </p>
                  <p className="text-xs text-muted-foreground">
                    BDT: ৳{Number(plan.price_monthly_bdt)}/mo · ৳{Number(plan.price_semi_annual_bdt)}/6mo · ৳{Number(plan.price_annual_bdt)}/yr · ৳{Number(plan.price_lifetime_bdt)} lifetime
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{plan.features.length} features · Order: {plan.display_order}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={plan.is_enabled} onCheckedChange={async (v) => {
                    await supabase.from("subscription_plans").update({ is_enabled: v }).eq("id", plan.id);
                    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, is_enabled: v } : p));
                    toast.success(v ? "Plan enabled" : "Plan disabled");
                  }} />
                  <Button size="icon" variant="ghost" onClick={() => setEditPlan(plan)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deletePlan(plan.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ====== Gateways Tab ====== */}
        <TabsContent value="gateways" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{gateways.length} payment gateways</p>
            <Button size="sm" onClick={() => setEditGateway(newGatewayTemplate)}>
              <Plus className="w-4 h-4 mr-1" /> Add Gateway
            </Button>
          </div>
          {gateways.map((gw) => (
            <div key={gw.id} className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: gw.color }}>
                {gw.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{gw.name}</span>
                  <span className="text-xs text-muted-foreground">({gw.gateway_id})</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{gw.account_number}</p>
                {gw.account_name && <p className="text-xs text-muted-foreground">{gw.account_name}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={gw.is_enabled} onCheckedChange={async (v) => {
                  await supabase.from("payment_gateways").update({ is_enabled: v }).eq("id", gw.id);
                  setGateways(prev => prev.map(g => g.id === gw.id ? { ...g, is_enabled: v } : g));
                  toast.success(v ? "Gateway enabled" : "Gateway disabled");
                }} />
                <Button size="icon" variant="ghost" onClick={() => setEditGateway(gw)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteGateway(gw.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ====== Premium Tools Tab ====== */}
        <TabsContent value="premium-tools" className="mt-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tools..." value={searchTool} onChange={(e) => setSearchTool(e.target.value)} className="pl-9" />
          </div>
          <p className="text-xs text-muted-foreground">{premiumToolIds.length} tools marked as premium</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredTools.map((tool) => (
              <button key={tool.id} onClick={() => togglePremiumTool(tool.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all text-sm",
                  premiumToolIds.includes(tool.id) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                )}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: tool.color.replace(")", " / 0.12)"), color: tool.color }}>
                  <tool.icon className="w-4 h-4" />
                </div>
                <span className="flex-1 font-medium truncate">{tool.name}</span>
                {premiumToolIds.includes(tool.id) && <Crown className="w-4 h-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </TabsContent>

        {/* ====== Settings Tab ====== */}
        <TabsContent value="settings" className="mt-4 space-y-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Display Currency</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Select which currency to show on the public pricing page
            </p>
            <Select value={activeCurrency} onValueChange={saveCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="bdt">BDT (৳)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {/* ====== Review Payment Dialog ====== */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Review Payment</DialogTitle></DialogHeader>
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
                <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Add a note..." className="mt-1" />
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

      {/* ====== Edit Plan Dialog ====== */}
      <Dialog open={!!editPlan} onOpenChange={() => setEditPlan(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editPlan?.id ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>
          {editPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Plan Name</Label>
                  <Input value={editPlan.name} onChange={e => setEditPlan({ ...editPlan, name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Badge Text</Label>
                  <Input value={editPlan.badge_text} onChange={e => setEditPlan({ ...editPlan, badge_text: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea value={editPlan.description} onChange={e => setEditPlan({ ...editPlan, description: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Color (HSL/Hex)</Label>
                  <Input value={editPlan.color} onChange={e => setEditPlan({ ...editPlan, color: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Display Order</Label>
                  <Input type="number" value={editPlan.display_order} onChange={e => setEditPlan({ ...editPlan, display_order: Number(e.target.value) })} className="mt-1" />
                </div>
              </div>

              {/* USD Prices */}
              <div>
                <Label className="text-xs font-bold text-primary">USD Prices ($)</Label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div><Label className="text-[10px]">Monthly</Label><Input type="number" step="0.01" value={editPlan.price_monthly} onChange={e => setEditPlan({ ...editPlan, price_monthly: Number(e.target.value) })} /></div>
                  <div><Label className="text-[10px]">6 Months</Label><Input type="number" step="0.01" value={editPlan.price_semi_annual} onChange={e => setEditPlan({ ...editPlan, price_semi_annual: Number(e.target.value) })} /></div>
                  <div><Label className="text-[10px]">Annual</Label><Input type="number" step="0.01" value={editPlan.price_annual} onChange={e => setEditPlan({ ...editPlan, price_annual: Number(e.target.value) })} /></div>
                  <div><Label className="text-[10px]">Lifetime</Label><Input type="number" step="0.01" value={editPlan.price_lifetime} onChange={e => setEditPlan({ ...editPlan, price_lifetime: Number(e.target.value) })} /></div>
                </div>
              </div>

              {/* BDT Prices */}
              <div>
                <Label className="text-xs font-bold text-green-600">BDT Prices (৳)</Label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div><Label className="text-[10px]">Monthly</Label><Input type="number" step="1" value={editPlan.price_monthly_bdt} onChange={e => setEditPlan({ ...editPlan, price_monthly_bdt: Number(e.target.value) })} /></div>
                  <div><Label className="text-[10px]">6 Months</Label><Input type="number" step="1" value={editPlan.price_semi_annual_bdt} onChange={e => setEditPlan({ ...editPlan, price_semi_annual_bdt: Number(e.target.value) })} /></div>
                  <div><Label className="text-[10px]">Annual</Label><Input type="number" step="1" value={editPlan.price_annual_bdt} onChange={e => setEditPlan({ ...editPlan, price_annual_bdt: Number(e.target.value) })} /></div>
                  <div><Label className="text-[10px]">Lifetime</Label><Input type="number" step="1" value={editPlan.price_lifetime_bdt} onChange={e => setEditPlan({ ...editPlan, price_lifetime_bdt: Number(e.target.value) })} /></div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={editPlan.is_popular} onCheckedChange={v => setEditPlan({ ...editPlan, is_popular: v })} />
                  Popular
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={editPlan.is_enabled} onCheckedChange={v => setEditPlan({ ...editPlan, is_enabled: v })} />
                  Enabled
                </label>
              </div>

              {/* Features */}
              <div>
                <Label className="text-xs">Features</Label>
                <div className="space-y-1 mt-1">
                  {editPlan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3 text-green-500 shrink-0" />
                      <span className="flex-1">{f}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeFeature(i)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Add feature..." value={newFeature} onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addFeature()} className="flex-1" />
                  <Button size="sm" onClick={addFeature}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>

              <Button onClick={savePlan} className="w-full">
                <Save className="w-4 h-4 mr-1" /> {editPlan.id ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ====== Edit Gateway Dialog ====== */}
      <Dialog open={!!editGateway} onOpenChange={() => setEditGateway(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editGateway?.id ? "Edit Gateway" : "Add Gateway"}</DialogTitle>
          </DialogHeader>
          {editGateway && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Display Name</Label>
                  <Input value={editGateway.name} onChange={e => setEditGateway({ ...editGateway, name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Gateway ID</Label>
                  <Input value={editGateway.gateway_id} onChange={e => setEditGateway({ ...editGateway, gateway_id: e.target.value })} className="mt-1" placeholder="e.g. bkash" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Account Number</Label>
                <Input value={editGateway.account_number} onChange={e => setEditGateway({ ...editGateway, account_number: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Account Name</Label>
                <Input value={editGateway.account_name} onChange={e => setEditGateway({ ...editGateway, account_name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Instructions</Label>
                <Textarea value={editGateway.instructions} onChange={e => setEditGateway({ ...editGateway, instructions: e.target.value })} className="mt-1" placeholder="Payment instructions for users..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" value={editGateway.color} onChange={e => setEditGateway({ ...editGateway, color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                    <Input value={editGateway.color} onChange={e => setEditGateway({ ...editGateway, color: e.target.value })} className="flex-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Display Order</Label>
                  <Input type="number" value={editGateway.display_order} onChange={e => setEditGateway({ ...editGateway, display_order: Number(e.target.value) })} className="mt-1" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={editGateway.is_enabled} onCheckedChange={v => setEditGateway({ ...editGateway, is_enabled: v })} />
                Enabled
              </label>
              <Button onClick={saveGateway} className="w-full">
                <Save className="w-4 h-4 mr-1" /> {editGateway.id ? "Update Gateway" : "Add Gateway"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
