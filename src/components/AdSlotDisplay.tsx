import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdSlotDisplayProps {
  placement: string;
  className?: string;
}

interface AdSlot {
  id: string;
  ad_code: string;
  placement: string;
  display_order: number;
}

// Global cache to avoid refetching
let cachedAds: AdSlot[] | null = null;
let fetchPromise: Promise<AdSlot[]> | null = null;

const fetchAds = async (): Promise<AdSlot[]> => {
  if (cachedAds) return cachedAds;
  if (fetchPromise) return fetchPromise;
  
  fetchPromise = supabase
    .from("ad_slots")
    .select("id, ad_code, placement, display_order")
    .eq("is_enabled", true)
    .order("display_order", { ascending: true })
    .then(({ data }) => {
      cachedAds = (data as AdSlot[]) || [];
      // Invalidate cache after 5 minutes
      setTimeout(() => { cachedAds = null; fetchPromise = null; }, 5 * 60 * 1000);
      return cachedAds;
    });
  
  return fetchPromise;
};

export function AdSlotDisplay({ placement, className = "" }: AdSlotDisplayProps) {
  const [ads, setAds] = useState<AdSlot[]>([]);
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    fetchAds().then(allAds => {
      setAds(allAds.filter(a => a.placement === placement));
    });
  }, [placement]);

  useEffect(() => {
    ads.forEach(ad => {
      const container = containerRefs.current.get(ad.id);
      if (!container || container.dataset.rendered === "true") return;
      
      container.innerHTML = ad.ad_code;
      container.dataset.rendered = "true";

      // Execute any script tags
      const scripts = container.querySelectorAll("script");
      scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    });
  }, [ads]);

  if (ads.length === 0) return null;

  return (
    <>
      {ads.map(ad => (
        <div
          key={ad.id}
          className={`ad-slot-container w-full overflow-hidden ${className}`}
          ref={el => { if (el) containerRefs.current.set(ad.id, el); }}
          data-placement={placement}
        />
      ))}
    </>
  );
}

// Force refresh ads cache (useful after admin changes)
export function invalidateAdCache() {
  cachedAds = null;
  fetchPromise = null;
}
