import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowUpRight, Sparkles, Grid3X3, BookOpen, Shield, Info } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";

const navLinks = [
  { name: "Category", path: "/categories", icon: Grid3X3 },
  { name: "About", hash: "about", icon: Info },
  { name: "Blog", path: "/blog", icon: BookOpen },
  { name: "Policy", path: "/policy", icon: Shield },
];

export function Footer() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { totalTools, totalCategories } = useToolCatalog();
  const footerText = (settings.footer_text || `${totalTools} free, fast, and powerful web tools across ${totalCategories} categories for developers, designers, and everyone. Built with ❤️ for the community.`)
    .replace(/\b\d+\+?\s*free,\s*fast,\s*and\s*powerful\s*web\s*tools/gi, `${totalTools} free, fast, and powerful web tools`)
    .replace(/\b\d+\+?\s*free\s*tools/gi, `${totalTools} free tools`)
    .replace(/\b\d+\+?\s*tools/gi, `${totalTools} tools`)
    .replace(/\bacross\s+\d+\+?\s*categories/gi, `across ${totalCategories} categories`)
    .replace(/\b\d+\+?\s*categories/gi, `${totalCategories} categories`);

  const handleNav = (link: typeof navLinks[0]) => {
    if (link.path) {
      navigate(link.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link.hash) {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(link.hash!);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        const el = document.getElementById(link.hash!);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative px-4 pb-8 pt-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl border-2 border-primary/15 bg-card/60 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-primary/5">
          <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[250px] h-[200px] bg-pink-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none" />

          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

              {/* Brand Column */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <Link to="/" className="flex items-center gap-3 group w-fit">
                  {settings.site_logo_url ? (
                    <img
                      src={settings.site_logo_url}
                      alt={settings.site_name}
                      className="w-12 h-12 rounded-2xl object-cover shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow ring-2 ring-primary/10 group-hover:ring-primary/30"
                    />
                  ) : (
                    <img
                      src="/logo.png"
                      alt={settings.site_name}
                      className="w-12 h-12 rounded-2xl object-cover shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow ring-2 ring-primary/10 group-hover:ring-primary/30"
                    />
                  )}
                  <div>
                    <span className="text-xl font-extrabold tracking-tight block">
                      <span className="gradient-text">{settings.navbar_brand_text}</span>
                      <span className="text-foreground"> {settings.navbar_brand_accent}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 font-medium tracking-wider uppercase">{settings.site_tagline}</span>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground/70 max-w-xs leading-relaxed">
                  {settings.footer_text || `${totalTools} free, fast, and powerful web tools across ${totalCategories} categories for developers, designers, and everyone. Built with ❤️ for the community.`}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary">
                    <Sparkles className="w-3 h-3" /> {totalTools} Tools
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-xs font-semibold text-emerald-500">
                    <Grid3X3 className="w-3 h-3" /> {totalCategories} Categories
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50 border border-border/40 text-xs font-semibold text-foreground/80">
                    100% Free
                  </span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="md:col-span-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-5">Navigate</h3>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNav(link)}
                      className="group flex items-center gap-3 px-3 py-2.5 -ml-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                        <link.icon className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors" />
                      </div>
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-50 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </nav>
              </div>

              {/* CTA Column */}
              <div className="md:col-span-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-5">Get Started</h3>
                <p className="text-sm text-muted-foreground/60 mb-4 leading-relaxed">
                  Explore our massive collection of free tools. No signup required for most tools — just open and use!
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/tools"
                    className="group flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm font-semibold text-primary hover:bg-primary/20 hover:border-primary/30 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explore All Tools
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/categories"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Browse Categories
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground/50 flex items-center gap-1.5">
                {settings.footer_copyright || "All rights reserved by"} <span className="font-semibold gradient-text">{settings.site_name}</span>
              </p>
              <a
                href="https://www.cybervenom.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide gradient-text hover:opacity-80 transition-opacity"
              >
                <Sparkles className="w-3 h-3 text-primary" />
                Developed By Cyber Venom.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
