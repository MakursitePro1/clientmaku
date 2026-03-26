import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
}

const SITE_NAME = "Makursite";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

// Global cache for page SEO
let seoCache: Record<string, any> = {};
let seoCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function loadSeoCache() {
  if (Date.now() - seoCacheTime < CACHE_TTL && Object.keys(seoCache).length > 0) return;
  const { data } = await supabase.from("page_seo").select("*").eq("is_enabled", true);
  if (data) {
    seoCache = {};
    data.forEach((row: any) => { seoCache[row.page_path] = row; });
    seoCacheTime = Date.now();
  }
}

export function SEOHead({ title, description, path = "/", type = "website" }: SEOHeadProps) {
  const [dbSeo, setDbSeo] = useState<any>(null);

  useEffect(() => {
    loadSeoCache().then(() => {
      if (seoCache[path]) setDbSeo(seoCache[path]);
    });
  }, [path]);

  const seoTitle = dbSeo?.meta_title || title;
  const fullTitle = `${seoTitle} | ${SITE_NAME} — Free Online Web Tools`;
  const seoDesc = dbSeo?.meta_description || description;
  const truncatedDesc = seoDesc.length > 160 ? seoDesc.slice(0, 157) + "..." : seoDesc;
  const url = dbSeo?.canonical_url || `${BASE_URL}${path}`;
  const ogTitle = dbSeo?.og_title || fullTitle;
  const ogDesc = dbSeo?.og_description || truncatedDesc;
  const ogImage = dbSeo?.og_image || "";
  const ogType = dbSeo?.og_type || type;
  const twitterCard = dbSeo?.twitter_card || "summary_large_image";
  const twitterTitle = dbSeo?.twitter_title || ogTitle;
  const twitterDesc = dbSeo?.twitter_description || ogDesc;
  const keywords = dbSeo?.meta_keywords || `${title}, free online tools, web tools, makursite`;
  const robots = dbSeo?.robots || "index, follow";

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", truncatedDesc);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", robots);

    // Open Graph
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", ogDesc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", SITE_NAME);
    if (ogImage) setMeta("property", "og:image", ogImage);

    // Twitter
    setMeta("name", "twitter:card", twitterCard);
    setMeta("name", "twitter:title", twitterTitle);
    setMeta("name", "twitter:description", twitterDesc);
    if (ogImage) setMeta("name", "twitter:image", ogImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // JSON-LD
    if (dbSeo?.structured_data) {
      let ldScript = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
      if (!ldScript) {
        ldScript = document.createElement("script");
        ldScript.type = "application/ld+json";
        ldScript.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(dbSeo.structured_data);
    }

    return () => {
      document.title = `${SITE_NAME} — Free Online Web Tools`;
      const ldScript = document.querySelector('script[data-seo-jsonld]');
      if (ldScript) ldScript.remove();
    };
  }, [fullTitle, truncatedDesc, url, ogTitle, ogDesc, ogImage, ogType, twitterCard, twitterTitle, twitterDesc, keywords, robots, dbSeo]);

  return null;
}
