import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Zap, Heart, LogIn, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

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
  const [isCompactNav, setIsCompactNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string; avatar_url: string | null } | null>(null);
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    setScrolled(window.scrollY > 20);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkCompactNav = () => {
      const isNarrowScreen = window.innerWidth < 768;
      const isTouchDevice =
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        navigator.maxTouchPoints > 0;
      setIsCompactNav(isNarrowScreen || isTouchDevice);
    };
    checkCompactNav();
    window.addEventListener("resize", checkCompactNav);
    return () => window.removeEventListener("resize", checkCompactNav);
  }, []);

  useEffect(() => {
    if (!isCompactNav) setIsOpen(false);
  }, [isCompactNav]);

  // Close profile dropdown on click outside
  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  useEffect(() => {
    if (location.pathname !== "/") { setActiveHash(""); return; }
    const handleScroll = () => {
      const sections = ["contact", "faq", "about", "tools", "hero"];
      let found = "hero";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) { found = id; break; }
        }
      }
      setActiveHash(found);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const hash = location.hash.replace("#", "");
      setTimeout(() => {
        if (hash === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
        else document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
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
    if (link.path === "/tools") { navigate(link.path); window.scrollTo({ top: 0 }); return; }
    if (link.hash === "hero") {
      if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
      else { navigate("/"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100); }
      return;
    }
    if (link.hash) {
      if (location.pathname === "/") document.getElementById(link.hash)?.scrollIntoView({ behavior: "smooth" });
      else navigate(`/#${link.hash}`);
    }
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-clip">
      <div className="w-full px-2 sm:px-4 lg:px-8 pt-2 sm:pt-3 lg:pt-4 box-border">
        <div
          className={cn(
            "relative w-full max-w-full box-border navbar-glass rounded-xl sm:rounded-2xl px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex items-center gap-2 transition-all duration-500",
            scrolled ? "navbar-glass-scrolled" : ""
          )}
        >
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none">
            <div className="navbar-shine" />
          </div>

          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => { e.preventDefault(); handleNavClick({ name: "Home", path: "/", hash: "hero" }); }}
            className="flex items-center gap-2 sm:gap-2.5 relative z-10 flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl gradient-bg flex items-center justify-center glow-shadow flex-shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-sm sm:text-lg font-bold tracking-tight whitespace-nowrap leading-none">
              <span className="gradient-text">Cyber</span>
              <span className="text-white"> Venom</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className={cn("items-center gap-1 bg-white/5 rounded-xl px-2 py-1 relative z-10 border border-white/5 mx-auto", isCompactNav ? "hidden" : "flex")}>
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

          {/* Desktop Right Side */}
          <div className={cn("relative z-10 ml-auto flex items-center gap-2", isCompactNav ? "hidden" : "flex")}>
            {/* Favorites Icon with Count */}
            <button
              onClick={() => navigate("/favorites")}
              className={cn(
                "relative p-2 rounded-xl transition-all duration-300 hover:scale-110 group",
                location.pathname === "/favorites"
                  ? "bg-red-500/20 text-red-400"
                  : "text-white/50 hover:text-red-400 hover:bg-white/10"
              )}
              aria-label="Favorites"
            >
              <Heart className={cn("w-5 h-5 transition-all", favorites.length > 0 && "fill-red-500 text-red-500")} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-lg shadow-red-500/50 animate-in zoom-in">
                  {favorites.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Avatar className="w-8 h-8 border-2 border-primary/30">
                    {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                    <AvatarFallback className="text-xs font-bold bg-primary/20 text-primary">
                      {profile?.display_name ? getInitials(profile.display_name) : <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-2 mb-1 border-b border-border/30">
                      <p className="text-sm font-semibold truncate">{profile?.display_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" /> Account Settings
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/favorites"); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-400" /> My Favorites
                      {favorites.length > 0 && (
                        <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{favorites.length}</span>
                      )}
                    </button>
                    <div className="border-t border-border/30 mt-1 pt-1">
                      <button
                        onClick={() => { setProfileOpen(false); signOut(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-red-500/10 text-red-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                className="relative gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all glow-shadow hover:scale-105 text-sm lg:text-base overflow-hidden group"
                onClick={() => navigate("/auth")}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <LogIn className="w-4 h-4" /> Login
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={cn("text-white relative z-10 p-1 flex-shrink-0 ml-auto", isCompactNav ? "inline-flex" : "hidden")}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && isCompactNav && (
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

            {/* Mobile Favorites */}
            <button
              onClick={() => { setIsOpen(false); navigate("/favorites"); }}
              className={cn(
                "block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2",
                location.pathname === "/favorites"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Heart className={cn("w-4 h-4", favorites.length > 0 && "fill-red-500 text-red-500")} />
              Favorites
              {favorites.length > 0 && (
                <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{favorites.length}</span>
              )}
            </button>

            {user ? (
              <>
                <Button
                  className="w-full rounded-xl font-semibold mt-1 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => { setIsOpen(false); navigate("/profile"); }}
                >
                  <User className="w-4 h-4 mr-2" /> Profile
                </Button>
                <Button
                  className="w-full rounded-xl font-semibold mt-1 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => { setIsOpen(false); signOut(); }}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <Button
                className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold mt-2"
                onClick={() => { setIsOpen(false); navigate("/auth"); }}
              >
                <LogIn className="w-4 h-4 mr-2" /> Login / Sign Up
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
