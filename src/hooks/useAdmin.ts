import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const checkAdmin = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.error("Admin role check failed:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }

      setLoading(false);
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.id]);

  return { isAdmin, loading };
}
