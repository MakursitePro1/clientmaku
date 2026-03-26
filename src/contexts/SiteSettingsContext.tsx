import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
  site_logo_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta_text: string;
  hero_cta_link: string;
  about_title: string;
  about_text: string;
  footer_text: string;
  footer_copyright: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  social_youtube: string;
  social_linkedin: string;
  social_github: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_image: string;
  navbar_brand_text: string;
  navbar_brand_accent: string;
  stats_tools_count: string;
  stats_users_count: string;
  stats_categories_count: string;
  announcement_text: string;
  announcement_enabled: string;
  admin_slug: string;
  [key: string]: string;
}

const defaults: SiteSettings = {
  site_name: "Cyber Venom",
  site_tagline: "Free Online Web Tools",
  site_description: "Your ultimate collection of free online web tools",
  site_logo_url: "",
  contact_email: "hello@cybervenom.com",
  contact_phone: "+880 1754-839834",
  contact_address: "Dhaka, Bangladesh",
  hero_title: "Your Ultimate Collection",
  hero_subtitle: "Web Tools",
  hero_description: "Image editors, code testers, converters, generators — all in one place. Completely free, no signup required.",
  hero_cta_text: "Explore Tools",
  hero_cta_link: "/tools",
  about_title: "About Us",
  about_text: "",
  footer_text: "200+ free, fast, and powerful web tools for developers, designers, and everyone. Built with ❤️ for the community.",
  footer_copyright: "All rights reserved by",
  social_facebook: "",
  social_twitter: "",
  social_instagram: "",
  social_youtube: "",
  social_linkedin: "",
  social_github: "",
  seo_title: "Cyber Venom — Free Online Web Tools",
  seo_description: "210+ free online tools for developers, designers, and everyone.",
  seo_keywords: "web tools, online tools, free tools, developer tools",
  seo_og_image: "",
  navbar_brand_text: "Cyber",
  navbar_brand_accent: "Venom",
  stats_tools_count: "210+",
  stats_users_count: "200K+",
  stats_categories_count: "12",
  announcement_text: "",
  announcement_enabled: "false",
  admin_slug: "admingorohid306",
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaults,
  loading: true,
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value");

      if (data && data.length > 0) {
        const merged = { ...defaults };
        data.forEach((row: any) => {
          if (row.key in merged) {
            merged[row.key] = typeof row.value === "string" ? row.value : String(row.value ?? "");
          }
        });
        setSettings(merged);
      }
      setLoading(false);
    };

    fetchSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload: any) => {
          if (payload.new && payload.new.key) {
            setSettings((prev) => ({
              ...prev,
              [payload.new.key]: typeof payload.new.value === "string"
                ? payload.new.value
                : String(payload.new.value ?? ""),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
