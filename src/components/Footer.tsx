import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Globe, Heart, Facebook, Twitter, Instagram, Youtube, Github, Linkedin, Zap, Grid3X3, Shield, Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";

const socialConfig = [
  { key: "social_facebook", name: "Facebook", icon: Facebook, gradient: "from-blue-600 to-blue-400", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_twitter", name: "Twitter", icon: Twitter, gradient: "from-sky-500 to-cyan-400", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_instagram", name: "Instagram", icon: Instagram, gradient: "from-pink-500 via-purple-500 to-orange-400", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_youtube", name: "Youtube", icon: Youtube, gradient: "from-red-600 to-red-400", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_linkedin", name: "LinkedIn", icon: Linkedin, gradient: "from-blue-700 to-blue-500", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_github", name: "GitHub", icon: Github, gradient: "from-gray-700 to-gray-500", defaultUrl: "https://cybervenoms.com/" },
];

const quickLinks = [
  { name: "Tools", path: "/tools" },
  { name: "Categories", path: "/categories" },
  { name: "Blog", path: "/blog" },
];

const resourceLinks = [
  { name: "About", path: "/about" },
  { name: "FAQ", path: "/faq" },
  { name: "Policy", path: "/policy" },
];

export function Footer() {
  const { settings } = useSiteSettings();
  const { totalTools, totalCategories } = useToolCatalog();

  return (
    <footer className="relative mt-8">
      {/* Top decorative gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Main footer */}
      <div className="relative bg-gradient-to-b from-card/95 to-background/80 backdrop-blur-xl overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Upper section - 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-10 sm:py-14">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-4">
              <Link to="/" className="flex items-center gap-3 group w-fit">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-500/40 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={settings.site_logo_url || "/logo.png"}
                    alt={settings.site_name}
                    className="relative w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                  />
                </div>
                <div>
                  <span className="text-base font-extrabold tracking-tight block leading-tight">
                    <span className="gradient-text">{settings.navbar_brand_text}</span>
                    <span className="text-foreground"> {settings.navbar_brand_accent}</span>
                  </span>
                  <span className="text-[9px] text-muted-foreground/40 font-medium tracking-[0.2em] uppercase">
                    {settings.site_tagline}
                  </span>
                </div>
              </Link>
              <p className="text-xs text-muted-foreground/50 leading-relaxed max-w-[260px]">
                Your ultimate collection of free online web tools for developers, designers & everyone.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
                  <Zap className="w-3 h-3" /> {totalTools}+ Tools
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
                  <Grid3X3 className="w-3 h-3" /> {totalCategories} Categories
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/30 border border-border/20 text-[10px] font-bold text-foreground/50">
                  <Shield className="w-3 h-3" /> Free
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/70">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-primary transition-colors duration-200"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary group-hover:shadow-[0_0_6px] group-hover:shadow-primary/50 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/70">Resources</h4>
              <ul className="space-y-2">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-primary transition-colors duration-200"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary group-hover:shadow-[0_0_6px] group-hover:shadow-primary/50 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/70">Connect</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-xs text-muted-foreground/50">
                  <Mail className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                  <span className="truncate">{settings.contact_email}</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-muted-foreground/50">
                  <Phone className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                  <span>{settings.contact_phone}</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-muted-foreground/50">
                  <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
                  <span>{settings.contact_address}</span>
                </li>
              </ul>

              {/* Social icons */}
              <div className="flex items-center gap-2 pt-2">
                {socialConfig.map((s) => {
                  const url = settings[s.key]?.trim() || s.defaultUrl;
                  return (
                    <a
                      key={s.key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className="group/icon relative w-8 h-8 rounded-lg border border-border/60 bg-accent/20 flex items-center justify-center text-muted-foreground/50 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg"
                    >
                      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${s.gradient} opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300`} />
                      <s.icon className="relative z-10 w-3.5 h-3.5 group-hover/icon:text-white transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between py-5">
            <p className="text-[10px] sm:text-[11px] text-muted-foreground/35 flex items-center gap-1.5 flex-wrap justify-center">
              {settings.footer_copyright || "© 2024"}{" "}
              <span className="font-semibold gradient-text">{settings.site_name}</span>
              <span className="text-muted-foreground/15">·</span>
              Made with <Heart className="w-2.5 h-2.5 text-red-400/70 fill-red-400/70 animate-pulse" /> for the community
            </p>

            <a
              href="https://www.makursite.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/25 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-primary/[0.06] to-primary/[0.02] group-hover:from-primary/[0.05] group-hover:via-primary/[0.10] group-hover:to-primary/[0.05] transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Globe className="relative z-10 w-3 h-3 text-primary/40 group-hover:text-primary transition-colors duration-300" />
              <span className="relative z-10 text-[9px] sm:text-[10px] text-muted-foreground/40">Designed & Developed by</span>
              <span className="relative z-10 text-[10px] sm:text-[11px] font-extrabold gradient-text flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
                Makursite.com
                <ArrowUpRight className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
