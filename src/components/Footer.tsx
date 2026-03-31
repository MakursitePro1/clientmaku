import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Globe, Heart, Facebook, Twitter, Instagram, Youtube, Github, Linkedin, Zap, Grid3X3, Shield } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";

const socialConfig = [
  { key: "social_facebook", name: "Facebook", icon: Facebook, color: "hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/15", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_twitter", name: "Twitter", icon: Twitter, color: "hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-400/15", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_instagram", name: "Instagram", icon: Instagram, color: "hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/15", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_youtube", name: "Youtube", icon: Youtube, color: "hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/15", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_linkedin", name: "LinkedIn", icon: Linkedin, color: "hover:text-blue-600 hover:border-blue-600/50 hover:bg-blue-600/15", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_github", name: "GitHub", icon: Github, color: "hover:text-foreground hover:border-foreground/50 hover:bg-foreground/15", defaultUrl: "https://cybervenoms.com/" },
];

export function Footer() {
  const { settings } = useSiteSettings();
  const { totalTools, totalCategories } = useToolCatalog();

  return (
    <footer className="relative px-3 sm:px-4 pb-6 pt-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl sm:rounded-3xl border border-primary/10 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl shadow-primary/5">
          <div className="absolute top-0 left-0 w-[250px] h-[150px] bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[200px] h-[150px] bg-pink-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
          <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-5 sm:py-8">
            {/* Top: Brand + Nav */}
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:gap-5">
              {/* Brand */}
              <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                <img
                  src={settings.site_logo_url || "/logo.png"}
                  alt={settings.site_name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-md shadow-primary/15 ring-1 ring-primary/10"
                />
                <div>
                  <span className="text-sm sm:text-base font-extrabold tracking-tight block leading-tight">
                    <span className="gradient-text">{settings.navbar_brand_text}</span>
                    <span className="text-foreground"> {settings.navbar_brand_accent}</span>
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground/40 font-medium tracking-wider uppercase">{settings.site_tagline}</span>
                </div>
              </Link>

              {/* Nav Links */}
              <nav className="flex items-center gap-0.5 flex-wrap justify-center">
                {[
                  { name: "Tools", path: "/tools" },
                  { name: "Categories", path: "/categories" },
                  { name: "Blog", path: "/blog" },
                  { name: "About", path: "/about" },
                  { name: "FAQ", path: "/faq" },
                  { name: "Policy", path: "/policy" },
                ].map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Icons - always visible */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-5">
              {socialConfig.map((s) => {
                const url = (settings[s.key]?.trim()) || s.defaultUrl;
                return (
                  <a
                    key={s.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-border/70 bg-accent/40 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${s.color}`}
                  >
                    <s.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  </a>
                );
              })}
            </div>

            {/* Stats badges */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] sm:text-[11px] font-semibold text-primary">
                <Zap className="w-3 h-3" /> {totalTools}+ Tools
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] sm:text-[11px] font-semibold text-primary">
                <Grid3X3 className="w-3 h-3" /> {totalCategories} Categories
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-accent/40 border border-border/30 text-[10px] sm:text-[11px] font-semibold text-foreground/70">
                <Shield className="w-3 h-3" /> 100% Free
              </span>
            </div>

            {/* Divider */}
            <div className="my-4 sm:my-5 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

            {/* Bottom: copyright + credit */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/45 flex items-center gap-1.5 text-center sm:text-left">
                {settings.footer_copyright || "© 2024"} <span className="font-semibold gradient-text">{settings.site_name}</span>
                <span className="text-muted-foreground/25">·</span>
                Made with <Heart className="w-2.5 h-2.5 text-red-400/60 fill-red-400/60" /> for the community
              </p>

              <a
                href="https://www.makursite.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-primary/8 via-accent/30 to-primary/8 border border-primary/15 hover:border-primary/35 transition-all duration-500 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5"
              >
                <Globe className="w-3 h-3 text-primary/60 group-hover:text-primary transition-colors" />
                <span className="text-[9px] sm:text-[10px] text-muted-foreground/60">Designed & Developed by</span>
                <span className="text-[10px] sm:text-[11px] font-extrabold gradient-text flex items-center gap-1">
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
