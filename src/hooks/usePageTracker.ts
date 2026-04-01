import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function usePageTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;

    // Don't track admin pages
    if (path.includes("admin") || path.includes("makuadmingowebs99")) return;

    supabase.from("page_views").insert({
      page_path: path,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent || "",
    }).then(() => {});
  }, [location.pathname]);
}
