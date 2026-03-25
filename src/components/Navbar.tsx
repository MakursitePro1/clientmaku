import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Tools", path: "/#tools" },
  { name: "About", path: "/#about" },
  { name: "FAQ", path: "/#faq" },
  { name: "Contact", path: "/#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith("/#")) {
      const id = path.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = path;
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
                to={link.path.startsWith("/#") ? "/" : link.path}
                onClick={() => handleNavClick(link.path)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button className="gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity glow-shadow">
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
                to={link.path.startsWith("/#") ? "/" : link.path}
                onClick={() => handleNavClick(link.path)}
                className="block px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Button className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold mt-2">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
