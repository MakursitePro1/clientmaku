import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
}

const SITE_NAME = "Cyber Venom";
const BASE_URL = "https://makuwebtools.lovable.app";

export function SEOHead({ title, description, path = "/", type = "website" }: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME} — Free Online Web Tools`;
  const url = `${BASE_URL}${path}`;
  const truncatedDesc = description.length > 160 ? description.slice(0, 157) + "..." : description;

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
    setMeta("name", "keywords", `${title}, free online tools, web tools, cyber venom, ${title.toLowerCase()}`);
    setMeta("name", "robots", "index, follow");

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", truncatedDesc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", truncatedDesc);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    return () => {
      document.title = `${SITE_NAME} — Free Online Web Tools`;
    };
  }, [fullTitle, truncatedDesc, url, type]);

  return null;
}
