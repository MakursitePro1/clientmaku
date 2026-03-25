import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";
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
        <div className="rounded-2xl px-6 py-3 flex items-center justify-between" style={{ backgroundColor: "hsl(240, 20%, 12%)" }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold" style={{ color: "hsl(0, 0%, 95%)" }}>WebTools</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 rounded-xl px-2 py-1" style={{ backgroundColor: "hsl(240, 15%, 18%)" }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path.startsWith("/#") ? "/" : link.path}
                onClick={() => handleNavClick(link.path)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-background/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-background/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button className="gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 rounded-2xl p-4 space-y-2" style={{ backgroundColor: "hsl(240, 20%, 12%)" }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path.startsWith("/#") ? "/" : link.path}
                onClick={() => handleNavClick(link.path)}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-background/10 transition-colors"
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
