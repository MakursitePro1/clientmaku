import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_semi_annual: number;
  price_annual: number;
  price_lifetime: number;
  features: string[];
  is_popular: boolean;
  is_enabled: boolean;
  display_order: number;
  badge_text: string;
  color: string;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  billing_period: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
}

interface SubscriptionContextType {
  plans: Plan[];
  premiumToolIds: string[];
  userSubscription: UserSubscription | null;
  loading: boolean;
  isToolLocked: (toolId: string) => boolean;
  hasActiveSubscription: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  plans: [],
  premiumToolIds: [],
  userSubscription: null,
  loading: true,
  isToolLocked: () => false,
  hasActiveSubscription: false,
  refreshSubscription: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [premiumToolIds, setPremiumToolIds] = useState<string[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [plansRes, premiumRes] = await Promise.all([
        supabase.from("subscription_plans").select("*").eq("is_enabled", true).order("display_order"),
        supabase.from("premium_tools").select("tool_id"),
      ]);

      if (plansRes.data) {
        setPlans(plansRes.data.map((p: any) => ({
          ...p,
          price_monthly: Number(p.price_monthly),
          price_semi_annual: Number(p.price_semi_annual),
          price_annual: Number(p.price_annual),
          price_lifetime: Number(p.price_lifetime),
          features: Array.isArray(p.features) ? p.features : [],
        })));
      }
      if (premiumRes.data) {
        setPremiumToolIds(premiumRes.data.map((pt: any) => pt.tool_id));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserSubscription(null);
      return;
    }
    const fetchSub = async () => {
      const { data } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setUserSubscription(data);
    };
    fetchSub();
  }, [user]);

  const hasActiveSubscription = !!userSubscription && userSubscription.status === "active";

  const isToolLocked = (toolId: string) => {
    if (!premiumToolIds.includes(toolId)) return false;
    return !hasActiveSubscription;
  };

  const refreshSubscription = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setUserSubscription(data);
  };

  return (
    <SubscriptionContext.Provider value={{ plans, premiumToolIds, userSubscription, loading, isToolLocked, hasActiveSubscription, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
