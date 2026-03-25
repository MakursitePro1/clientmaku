import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/", hash: "hero" },
  { name: "Tools", path: "/tools", hash: "" },
  { name: "About", path: "/", hash: "about" },
  { name: "FAQ", path: "/", hash: "faq" },
  { name: "Contact", path: "/", hash: "contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [activeHash, setActiveHash] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveHash("");
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["contact", "faq", "about", "tools", "hero"];
      let found = "hero";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            found = id;
            break;
          }
        }
      }
      setActiveHash(found);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isActive = (link: typeof navLinks[0]) => {
    if (location.pathname !== "/") return false;
    return link.hash === activeHash;
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsOpen(false);
    if (link.hash) {
      if (location.pathname === "/") {
        const el = document.getElementById(link.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (link.hash === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        window.location.href = `/#${link.hash}`;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div
          className={cn(
            "navbar-glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-500",
            scrolled ? "navbar-glass-scrolled" : ""
          )}
        >
          {/* Shine effect overlay */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="navbar-shine" />
          </div>

          <Link to="/" onClick={() => { if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center glow-shadow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Cyber</span>
              <span className="text-white"> Venom</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl px-2 py-1 relative z-10 border border-white/5">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative",
                  isActive(link)
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden md:block relative z-10">
            <Button
              className="gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all glow-shadow hover:scale-105"
              onClick={() => {
                if (location.pathname === "/") {
                  document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#tools";
                }
              }}
            >
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-white relative z-10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 navbar-glass rounded-2xl p-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={cn(
                  "block w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
                  isActive(link)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {link.name}
              </button>
            ))}
            <Button
              className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold mt-2"
              onClick={() => {
                setIsOpen(false);
                if (location.pathname === "/") {
                  document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#tools";
                }
              }}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
