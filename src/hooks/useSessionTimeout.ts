import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const SESSION_TIMEOUT_KEY = "admin_session_timeout_hours";
const LOGIN_TIMESTAMP_KEY = "admin_login_timestamp";

export function useSessionTimeout() {
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Record login time if not already set
    if (!localStorage.getItem(LOGIN_TIMESTAMP_KEY)) {
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, String(Date.now()));
    }

    const checkTimeout = async () => {
      // Get timeout from localStorage (cached) or default 12h
      let timeoutHours = 12;
      const cached = localStorage.getItem(SESSION_TIMEOUT_KEY);
      if (cached) {
        timeoutHours = parseInt(cached) || 12;
      } else {
        // Fetch from DB
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", SESSION_TIMEOUT_KEY)
          .maybeSingle();
        if (data?.value) {
          timeoutHours = typeof data.value === "number" ? data.value : parseInt(String(data.value)) || 12;
          localStorage.setItem(SESSION_TIMEOUT_KEY, String(timeoutHours));
        }
      }

      const loginTime = parseInt(localStorage.getItem(LOGIN_TIMESTAMP_KEY) || "0");
      const elapsed = Date.now() - loginTime;
      const timeoutMs = timeoutHours * 60 * 60 * 1000;

      if (loginTime > 0 && elapsed >= timeoutMs) {
        localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
        localStorage.removeItem(SESSION_TIMEOUT_KEY);
        await signOut();
      }
    };

    // Check immediately and every 60 seconds
    checkTimeout();
    const interval = setInterval(checkTimeout, 60_000);

    return () => clearInterval(interval);
  }, [user, signOut]);

  // Reset login timestamp on fresh login
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        localStorage.setItem(LOGIN_TIMESTAMP_KEY, String(Date.now()));
      }
      if (event === "SIGNED_OUT") {
        localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
}
