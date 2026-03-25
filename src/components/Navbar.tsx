import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [activeHash, setActiveHash] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(window.scrollY > 20);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section on homepage
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveHash("");
      return;
    }

    const handleScroll = () => {
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

  // Handle hash scrolling after navigation
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const hash = location.hash.replace("#", "");
      setTimeout(() => {
        if (hash === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.pathname, location.hash]);

  const isActive = (link: typeof navLinks[0]) => {
    if (link.path === "/tools") return location.pathname === "/tools";
    if (location.pathname !== "/") return false;
    return link.hash === activeHash;
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsOpen(false);

    // Tools page - direct navigation
    if (link.path === "/tools") {
      navigate("/tools");
      window.scrollTo({ top: 0 });
      return;
    }

    // Home link
    if (link.hash === "hero") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      }
      return;
    }

    // Section links (About, FAQ, Contact)
    if (link.hash) {
      if (location.pathname === "/") {
        const el = document.getElementById(link.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/#${link.hash}`);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-2 sm:px-4 lg:px-8 pt-2 sm:pt-3 lg:pt-4 box-border overflow-hidden">
        <div
          className={cn(
            "navbar-glass rounded-xl sm:rounded-2xl px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-500",
            scrolled ? "navbar-glass-scrolled" : ""
          )}
        >
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none">
            <div className="navbar-shine" />
          </div>

          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick({ name: "Home", path: "/", hash: "hero" });
            }}
            className="flex items-center gap-2 sm:gap-2.5 relative z-10 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl gradient-bg flex items-center justify-center glow-shadow flex-shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
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
                  "px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative whitespace-nowrap",
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
              className="gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all glow-shadow hover:scale-105 text-sm lg:text-base"
              onClick={() => navigate("/tools")}
            >
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-white relative z-10 p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
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
              onClick={() => { setIsOpen(false); navigate("/tools"); }}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
