import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Injects custom head/footer code, verification meta tags, analytics scripts
 * from site_settings into the DOM at runtime.
 */
export function CodeInjector() {
  useEffect(() => {
    const keys = [
      "head_code", "footer_code", "custom_css", "custom_js",
      "google_verification", "bing_verification", "yandex_verification", "pinterest_verification",
      "google_analytics_id", "google_tag_manager_id",
    ];

    const inject = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", keys);

      if (!data) return;

      const settings: Record<string, string> = {};
      data.forEach((row: any) => {
        settings[row.key] = typeof row.value === "string" ? row.value : String(row.value ?? "");
      });

      // Verification meta tags
      const verifications = [
        { key: "google_verification", name: "google-site-verification" },
        { key: "bing_verification", name: "msvalidate.01" },
        { key: "yandex_verification", name: "yandex-verification" },
        { key: "pinterest_verification", name: "p:domain_verify" },
      ];

      verifications.forEach(({ key, name }) => {
        const value = settings[key];
        if (value) {
          let meta = document.querySelector(`meta[name="${name}"]`);
          if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", name);
            document.head.appendChild(meta);
          }
          meta.setAttribute("content", value);
        }
      });

      // Google Analytics
      const gaId = settings.google_analytics_id;
      if (gaId && !document.getElementById("ga-script")) {
        const s1 = document.createElement("script");
        s1.id = "ga-script";
        s1.async = true;
        s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(s1);

        const s2 = document.createElement("script");
        s2.id = "ga-config";
        s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
        document.head.appendChild(s2);
      }

      // Google Tag Manager
      const gtmId = settings.google_tag_manager_id;
      if (gtmId && !document.getElementById("gtm-script")) {
        const s = document.createElement("script");
        s.id = "gtm-script";
        s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
        document.head.appendChild(s);
      }

      // Head code injection
      if (settings.head_code) {
        const container = document.createElement("div");
        container.id = "injected-head-code";
        container.innerHTML = settings.head_code;
        Array.from(container.children).forEach((el) => document.head.appendChild(el));
      }

      // Custom CSS
      if (settings.custom_css) {
        const style = document.createElement("style");
        style.id = "injected-custom-css";
        style.textContent = settings.custom_css;
        document.head.appendChild(style);
      }

      // Footer code injection
      if (settings.footer_code) {
        const container = document.createElement("div");
        container.id = "injected-footer-code";
        container.innerHTML = settings.footer_code;
        Array.from(container.children).forEach((el) => document.body.appendChild(el));
      }

      // Custom JS
      if (settings.custom_js) {
        const script = document.createElement("script");
        script.id = "injected-custom-js";
        script.textContent = settings.custom_js;
        document.body.appendChild(script);
      }
    };

    inject();

    return () => {
      // Cleanup injected elements
      ["ga-script", "ga-config", "gtm-script", "injected-head-code", "injected-custom-css", "injected-footer-code", "injected-custom-js"].forEach((id) => {
        document.getElementById(id)?.remove();
      });
      ["google-site-verification", "msvalidate.01", "yandex-verification", "p:domain_verify"].forEach((name) => {
        document.querySelector(`meta[name="${name}"]`)?.remove();
      });
    };
  }, []);

  return null;
}
