import { Link } from "react-router-dom";
import { Zap, Heart } from "lucide-react";

const footerLinks = [
  { name: "Home", hash: "hero" },
  { name: "Tools", hash: "tools" },
  { name: "About", hash: "about" },
  { name: "FAQ", hash: "faq" },
  { name: "Contact", hash: "contact" },
];

export function Footer() {
  const scrollTo = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-4 pb-6 pt-2">
      <div className="max-w-4xl mx-auto rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl px-6 py-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">
              <span className="gradient-text">Cyber</span>
              <span className="text-foreground"> Venom</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            {footerLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.hash)}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/tools"
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              All Tools
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-muted-foreground/50 flex items-center gap-1 shrink-0">
            © {new Date().getFullYear()} Cyber Venom
            <Heart className="w-3 h-3 text-primary/60 fill-primary/60" />
          </p>
        </div>
      </div>
    </footer>
  );
}
