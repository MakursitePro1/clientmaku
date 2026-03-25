import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/", hash: "" },
  { name: "Tools", path: "/", hash: "tools" },
  { name: "About", path: "/", hash: "about" },
  { name: "FAQ", path: "/", hash: "faq" },
  { name: "Contact", path: "/", hash: "contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveHash("");
      return;
    }

    const handleScroll = () => {
      const sections = ["contact", "faq", "about", "tools"];
      let found = "";
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
    if (link.hash === "" && activeHash === "") return true;
    return link.hash === activeHash;
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsOpen(false);
    if (link.hash) {
      if (location.pathname === "/") {
        document.getElementById(link.hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = `/#${link.hash}`;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between border border-border/50">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center glow-shadow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Cyber</span> Venom
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-secondary/80 rounded-xl px-2 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(link)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              className="gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity glow-shadow"
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
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4 space-y-2 border border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link)}
                className={cn(
                  "block px-4 py-3 rounded-lg transition-colors",
                  isActive(link)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.name}
              </Link>
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
