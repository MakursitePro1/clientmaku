import { Link, useNavigate } from "react-router-dom";
import { Zap, Heart, Wrench, Star, Shield, Github, Twitter, ExternalLink, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { name: "Home", hash: "hero" },
  { name: "Tools", hash: "tools" },
  { name: "About", hash: "about" },
  { name: "FAQ", hash: "faq" },
  { name: "Contact", hash: "contact" },
];

const pageLinks = [
  { name: "All Tools", path: "/tools", icon: Wrench },
  { name: "Favorites", path: "/favorites", icon: Star },
  { name: "My Account", path: "/profile", icon: Shield },
];

export function Footer() {
  const navigate = useNavigate();

  const scrollTo = (hash: string) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    } else {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative px-4 pb-8 pt-6">
      {/* Top gradient divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl border border-border/30 bg-card/60 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/5">
          {/* Decorative gradient blobs */}
          <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[250px] h-[200px] bg-pink-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

          {/* Top accent bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10 px-8 sm:px-10 lg:px-14 py-10 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
              {/* Brand Column */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <Link to="/" className="flex items-center gap-3 group w-fit">
                  <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight">
                    <span className="gradient-text">Cyber</span>
                    <span className="text-foreground"> Venom</span>
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground/70 max-w-xs leading-relaxed">
                  200+ free, fast, and powerful web tools for developers, designers, and everyone. Built with ❤️ for the community.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary">
                    <Sparkles className="w-3 h-3" /> 200+ Tools
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-xs font-semibold text-emerald-500">
                    100% Free
                  </span>
                </div>
              </div>

              {/* Quick Links Column */}
              <div className="md:col-span-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-4">Navigate</h3>
                <nav className="flex flex-col gap-1">
                  {quickLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => scrollTo(link.hash)}
                      className="group flex items-center gap-2 px-3 py-2 -ml-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all text-left"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all" />
                      {link.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Pages Column */}
              <div className="md:col-span-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-4">Important Pages</h3>
                <nav className="flex flex-col gap-1">
                  {pageLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="group flex items-center gap-3 px-3 py-2.5 -ml-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                        <link.icon className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors" />
                      </div>
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-50 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground/50 flex items-center gap-1.5">
                © {new Date().getFullYear()} Cyber Venom — Made with
                <Heart className="w-3 h-3 text-red-400/60 fill-red-400/60" />
                for the community
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground/30 font-medium tracking-wider uppercase">Powered by Lovable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
