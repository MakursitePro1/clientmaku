import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Sparkles, Globe, Heart } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export function Footer() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  return (
    <footer className="relative px-4 pb-6 pt-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] max-w-md h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl border border-primary/10 bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg shadow-primary/5">
          <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10 px-5 sm:px-8 py-5 sm:py-6">
            {/* Top row: logo + nav links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src={settings.site_logo_url || "/logo.png"}
                  alt={settings.site_name}
                  className="w-8 h-8 rounded-xl object-cover shadow-md shadow-primary/15 ring-1 ring-primary/10"
                />
                <span className="text-sm font-extrabold tracking-tight">
                  <span className="gradient-text">{settings.navbar_brand_text}</span>
                  <span className="text-foreground"> {settings.navbar_brand_accent}</span>
                </span>
              </Link>

              <nav className="flex items-center gap-1 flex-wrap justify-center">
                {[
                  { name: "Tools", path: "/tools" },
                  { name: "Blog", path: "/blog" },
                  { name: "About", path: "/about" },
                  { name: "Policy", path: "/policy" },
                ].map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

            {/* Bottom: copyright + credit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground/50 flex items-center gap-1">
                {settings.footer_copyright || "© 2024"} <span className="font-semibold gradient-text">{settings.site_name}</span>
                <span className="mx-1">·</span>
                Made with <Heart className="w-2.5 h-2.5 text-red-400/60 fill-red-400/60" />
              </p>

              <a
                href="https://www.makursite.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/8 via-accent/30 to-primary/8 border border-primary/15 hover:border-primary/35 transition-all duration-500 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5"
              >
                <Globe className="w-3 h-3 text-primary/60 group-hover:text-primary transition-colors" />
                <span className="text-[10px] text-muted-foreground/60">Designed & Developed by</span>
                <span className="text-[11px] font-extrabold gradient-text flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
                  Makursite.com
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
