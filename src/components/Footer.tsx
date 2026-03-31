import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Globe, Heart, Facebook, Twitter, Instagram, Youtube, Github, Linkedin, Zap, Grid3X3, Shield, Mail, MessageCircle, Star, TrendingUp, Users, Clock, ChevronUp } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";
import { useState } from "react";

const socialConfig = [
  { key: "social_facebook", name: "Facebook", icon: Facebook, gradient: "from-blue-600 to-blue-400", glow: "shadow-blue-500/20", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_twitter", name: "Twitter", icon: Twitter, gradient: "from-sky-500 to-cyan-400", glow: "shadow-sky-500/20", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_instagram", name: "Instagram", icon: Instagram, gradient: "from-pink-500 via-purple-500 to-orange-400", glow: "shadow-pink-500/20", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_youtube", name: "Youtube", icon: Youtube, gradient: "from-red-600 to-red-400", glow: "shadow-red-500/20", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_linkedin", name: "LinkedIn", icon: Linkedin, gradient: "from-blue-700 to-blue-500", glow: "shadow-blue-600/20", defaultUrl: "https://cybervenoms.com/" },
  { key: "social_github", name: "GitHub", icon: Github, gradient: "from-gray-700 to-gray-500", glow: "shadow-gray-500/20", defaultUrl: "https://cybervenoms.com/" },
];

const quickActions = [
  { name: "Browse Tools", path: "/tools", icon: Grid3X3 },
  { name: "Categories", path: "/categories", icon: TrendingUp },
  { name: "Favorites", path: "/favorites", icon: Star },
  { name: "Contact", path: "/about", icon: Mail },
];

export function Footer() {
  const { settings } = useSiteSettings();
  const { totalTools, totalCategories } = useToolCatalog();
  const [email, setEmail] = useState("");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative px-3 sm:px-4 pb-6 pt-4">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl sm:rounded-3xl border border-primary/[0.08] bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-primary/[0.03]">
          {/* Ambient glow effects */}
          <div className="absolute -top-20 -left-20 w-[300px] h-[200px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-[250px] h-[200px] bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[100px] bg-primary/[0.015] rounded-full blur-[80px] pointer-events-none" />

          {/* Top gradient border */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
            {/* Top Row: Brand + Quick Actions + Newsletter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Brand Column */}
              <div className="flex flex-col items-center md:items-start gap-3">
                <Link to="/" className="flex items-center gap-3 group shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={settings.site_logo_url || "/logo.png"}
                      alt={settings.site_name}
                      className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover shadow-lg shadow-primary/10 ring-2 ring-primary/10 group-hover:ring-primary/25 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-extrabold tracking-tight block leading-tight">
                      <span className="gradient-text">{settings.navbar_brand_text}</span>
                      <span className="text-foreground"> {settings.navbar_brand_accent}</span>
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-muted-foreground/35 font-medium tracking-[0.2em] uppercase">{settings.site_tagline}</span>
                  </div>
                </Link>
                <p className="text-[11px] text-muted-foreground/50 leading-relaxed text-center md:text-left max-w-[250px]">
                  Your all-in-one platform for free online tools. No signup required.
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col items-center gap-3">
                <h4 className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Quick Access</h4>
                <div className="grid grid-cols-2 gap-2 w-full max-w-[240px]">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      to={action.path}
                      className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-border/40 bg-accent/10 hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <action.icon className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      <span className="text-[11px] font-medium text-muted-foreground/70 group-hover:text-foreground transition-colors">{action.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter / Back to Top */}
              <div className="flex flex-col items-center md:items-end gap-3">
                <h4 className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Stay Updated</h4>
                <div className="flex items-center gap-2 w-full max-w-[260px]">
                  <div className="relative flex-1">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30" />
                    <input
                      type="email"
                      placeholder="Enter email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-border/40 bg-accent/10 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => { setEmail(""); }}
                    className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold hover:bg-primary/20 transition-all hover:-translate-y-0.5 shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                {/* Back to Top */}
                <button
                  onClick={scrollToTop}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/30 bg-accent/10 hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 mt-1"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-medium text-muted-foreground/50 group-hover:text-primary transition-colors">Back to Top</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 relative">
              <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            </div>

            {/* Middle: Nav Links */}
            <nav className="flex items-center gap-0.5 flex-wrap justify-center mb-4">
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
                  className="relative px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-muted-foreground/70 hover:text-foreground transition-all duration-300 hover:bg-primary/5 group"
                >
                  {link.name}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-gradient-to-r from-primary/60 to-purple-400/60 rounded-full group-hover:w-[60%] transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
              {socialConfig.map((s) => {
                const url = (settings[s.key]?.trim()) || s.defaultUrl;
                return (
                  <a
                    key={s.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className={`group/icon relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border/50 bg-accent/20 flex items-center justify-center text-muted-foreground/60 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:${s.glow} hover:border-transparent`}
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${s.gradient} opacity-0 group-hover/icon:opacity-100 transition-opacity duration-400`} />
                    <s.icon className="relative z-10 w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover/icon:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>

            {/* Stats badges */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15 text-[10px] sm:text-[11px] font-bold text-primary backdrop-blur-sm">
                <Zap className="w-3 h-3" /> {totalTools}+ Tools
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15 text-[10px] sm:text-[11px] font-bold text-primary backdrop-blur-sm">
                <Grid3X3 className="w-3 h-3" /> {totalCategories} Categories
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-accent/30 to-accent/50 border border-border/30 text-[10px] sm:text-[11px] font-bold text-foreground/60 backdrop-blur-sm">
                <Shield className="w-3 h-3" /> 100% Free
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-accent/30 to-accent/50 border border-border/30 text-[10px] sm:text-[11px] font-bold text-foreground/60 backdrop-blur-sm">
                <Users className="w-3 h-3" /> No Signup
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-accent/30 to-accent/50 border border-border/30 text-[10px] sm:text-[11px] font-bold text-foreground/60 backdrop-blur-sm">
                <Clock className="w-3 h-3" /> 24/7 Available
              </span>
            </div>

            {/* Divider */}
            <div className="my-5 sm:my-6 relative">
              <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/20 border border-primary/10" />
            </div>

            {/* Bottom: copyright + credit */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/40 flex items-center gap-1.5 text-center sm:text-left flex-wrap justify-center">
                {settings.footer_copyright || "© 2024"} <span className="font-semibold gradient-text">{settings.site_name}</span>
                <span className="text-muted-foreground/20">·</span>
                Made with <Heart className="w-2.5 h-2.5 text-red-400/70 fill-red-400/70 animate-pulse" /> for the community
              </p>

              <a
                href="https://www.makursite.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-primary/[0.08] to-primary/[0.03] group-hover:from-primary/[0.06] group-hover:via-primary/[0.12] group-hover:to-primary/[0.06] transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Globe className="relative z-10 w-3 h-3 text-primary/50 group-hover:text-primary transition-colors duration-300 group-hover:rotate-12" />
                <span className="relative z-10 text-[9px] sm:text-[10px] text-muted-foreground/50">Designed & Developed by</span>
                <span className="relative z-10 text-[10px] sm:text-[11px] font-extrabold gradient-text flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
                  Makursite.com
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </span>
              </a>
            </div>
          </div>

          {/* Bottom gradient border */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>
    </footer>
  );
}
