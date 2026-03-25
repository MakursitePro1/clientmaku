import { Link } from "react-router-dom";
import { Zap, Heart, Wrench, BookOpen, Mail, Shield, Star } from "lucide-react";

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
  { name: "Login / Signup", path: "/auth", icon: Shield },
];

export function Footer() {
  const scrollTo = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-4 pb-8 pt-4">
      <div className="max-w-5xl mx-auto rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl px-8 py-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-base">
                <span className="gradient-text">Cyber</span>
                <span className="text-foreground"> Venom</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground/60 max-w-[220px] leading-relaxed">
              200+ free web tools for developers, creators & everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-1">Quick Links</span>
            <nav className="flex flex-wrap gap-1">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.hash)}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Pages */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-1">Pages</span>
            <nav className="flex flex-wrap gap-1">
              {pageLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <link.icon className="w-3 h-3" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-center">
          <p className="text-[11px] text-muted-foreground/50 flex items-center gap-1">
            © {new Date().getFullYear()} Cyber Venom — Made with
            <Heart className="w-3 h-3 text-primary/60 fill-primary/60" />
          </p>
        </div>
      </div>
    </footer>
  );
}
