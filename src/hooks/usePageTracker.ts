import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getVisitorId(): string {
  const key = "cv_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

let countryCache: string | null = null;

async function getCountry(): Promise<string> {
  if (countryCache !== null) return countryCache;
  try {
    const cached = sessionStorage.getItem("cv_country");
    if (cached) { countryCache = cached; return cached; }
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const country = data.country_name || "";
    if (country) { sessionStorage.setItem("cv_country", country); countryCache = country; }
    return country;
  } catch {
    countryCache = "";
    return "";
  }
}

export function usePageTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;

    if (path.includes("admin") || path.includes("makuadmingowebs99")) return;

    // Use requestIdleCallback to avoid blocking rendering
    const track = () => {
      const visitorId = getVisitorId();
      getCountry().then((country) => {
        supabase.from("page_views").insert({
          page_path: path,
          referrer: document.referrer || "",
          user_agent: navigator.userAgent || "",
          visitor_id: visitorId,
          country: country || "",
        } as any).then(() => {});
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(track, { timeout: 2000 });
    } else {
      setTimeout(track, 100);
    }
  }, [location.pathname]);
}
