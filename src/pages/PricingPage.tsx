import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Sparkles, Zap, Shield, Star, ArrowRight, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BillingPeriod = "monthly" | "semi_annual" | "annual" | "lifetime";

const billingOptions: { id: BillingPeriod; label: string; discount?: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "semi_annual", label: "6 Months", discount: "Save 15%" },
  { id: "annual", label: "Yearly", discount: "Save 25%" },
  { id: "lifetime", label: "Lifetime", discount: "Best Deal" },
];

const paymentMethods = [
  { id: "bkash", name: "bKash", color: "#E2136E", number: "01XXXXXXXXX" },
  { id: "nagad", name: "Nagad", color: "#F6921E", number: "01XXXXXXXXX" },
  { id: "rocket", name: "Rocket", color: "#8C3494", number: "01XXXXXXXXX" },
  { id: "upay", name: "Upay", color: "#00A651", number: "01XXXXXXXXX" },
  { id: "bank", name: "Bank Transfer", color: "#1a56db", number: "Account details will be shown" },
  { id: "card", name: "Card Payment", color: "#1a1a2e", number: "Contact for card payment" },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { plans, hasActiveSubscription } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getPrice = (plan: any) => {
    switch (billing) {
      case "semi_annual": return plan.price_semi_annual;
      case "annual": return plan.price_annual;
      case "lifetime": return plan.price_lifetime;
      default: return plan.price_monthly;
    }
  };

  const handleSelectPlan = (plan: any) => {
    if (!user) {
      toast.error("Please login first to subscribe");
      navigate("/auth");
      return;
    }
    if (hasActiveSubscription) {
      toast.info("You already have an active subscription!");
      return;
    }
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!user || !selectedPlan) return;
    if (!transactionId.trim()) {
      toast.error("Please enter your Transaction ID");
      return;
    }
    if (!senderNumber.trim() && !["bank", "card"].includes(selectedPayment)) {
      toast.error("Please enter your sender number");
      return;
    }

    setSubmitting(true);
    try {
      // Create subscription
      const { data: sub, error: subErr } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          billing_period: billing,
          status: "pending",
        })
        .select()
        .single();

      if (subErr) throw subErr;

      // Create payment request
      const { error: payErr } = await supabase
        .from("payment_requests")
        .insert({
          user_id: user.id,
          subscription_id: sub.id,
          plan_id: selectedPlan.id,
          billing_period: billing,
          amount: getPrice(selectedPlan),
          payment_method: selectedPayment,
          transaction_id: transactionId.trim(),
          sender_number: senderNumber.trim(),
          status: "pending",
        });

      if (payErr) throw payErr;

      toast.success("Payment submitted! We'll verify and activate your subscription soon.");
      setCheckoutOpen(false);
      setTransactionId("");
      setSenderNumber("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  const planIcons = [Zap, Crown, Shield];

  return (
    <>
      <SEOHead title="Pricing - Premium Plans" description="Choose the perfect plan to unlock premium tools" />
      <Navbar />
      <ScrollToTop />

      <main className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Premium Plans</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
              Unlock <span className="gradient-text">Premium Tools</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect plan to access our premium collection of powerful web tools
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-14"
          >
            {billingOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setBilling(opt.id)}
                className={cn(
                  "relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                  billing === opt.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
                )}
              >
                {opt.label}
                {opt.discount && (
                  <span className={cn(
                    "ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold",
                    billing === opt.id ? "bg-white/20" : "bg-green-500/10 text-green-600"
                  )}>
                    {opt.discount}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const PlanIcon = planIcons[index] || Zap;
              const price = getPrice(plan);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                  className={cn(
                    "relative rounded-2xl border-2 p-6 transition-all duration-500 hover:-translate-y-2",
                    plan.is_popular
                      ? "border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-xl shadow-primary/10"
                      : "border-border/50 bg-card hover:border-primary/30"
                  )}
                >
                  {plan.badge_text && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                        {plan.badge_text}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color.replace(")", " / 0.12)")}`, color: plan.color }}
                    >
                      <PlanIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-extrabold">${price}</span>
                      {billing !== "lifetime" && (
                        <span className="text-muted-foreground text-sm mb-1">
                          /{billing === "monthly" ? "mo" : billing === "semi_annual" ? "6mo" : "yr"}
                        </span>
                      )}
                      {billing === "lifetime" && (
                        <span className="text-muted-foreground text-sm mb-1">one-time</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={cn(
                      "w-full rounded-xl font-semibold h-12 text-base transition-all",
                      plan.is_popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-card border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    {hasActiveSubscription ? "Current Plan" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Checkout - {selectedPlan?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Order Summary */}
            <div className="rounded-xl border border-border/50 bg-accent/30 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{selectedPlan?.name} Plan</span>
                <span className="font-bold text-lg">${selectedPlan ? getPrice(selectedPlan) : 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {billing === "monthly" ? "Monthly" : billing === "semi_annual" ? "6 Months" : billing === "annual" ? "Yearly" : "Lifetime"} billing
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Select Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-center transition-all text-sm font-semibold",
                      selectedPayment === pm.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/50 hover:border-primary/30"
                    )}
                    style={selectedPayment === pm.id ? { borderColor: pm.color } : {}}
                  >
                    <span style={{ color: pm.color }}>{pm.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs font-semibold text-primary mb-1">
                Send payment to:
              </p>
              <p className="text-sm font-bold">
                {paymentMethods.find(p => p.id === selectedPayment)?.number}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Amount: <strong>${selectedPlan ? getPrice(selectedPlan) : 0}</strong>
              </p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="txn-id" className="text-sm">Transaction ID *</Label>
                <Input
                  id="txn-id"
                  placeholder="Enter your transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="mt-1"
                />
              </div>
              {!["bank", "card"].includes(selectedPayment) && (
                <div>
                  <Label htmlFor="sender" className="text-sm">Sender Number *</Label>
                  <Input
                    id="sender"
                    placeholder="Enter your mobile number"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmitPayment}
              disabled={submitting}
              className="w-full h-12 rounded-xl font-semibold bg-primary text-primary-foreground"
            >
              {submitting ? "Submitting..." : "Submit Payment"}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center">
              Your subscription will be activated after admin verification
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
