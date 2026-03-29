import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Zap, Heart, LogIn, LogOut, User, Settings, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/", hash: "hero" },
  { name: "Tools", path: "/tools", hash: "", highlight: true },
  { name: "Blog", path: "/blog", hash: "" },
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
  const { settings } = useSiteSettings();

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
      const isNarrowScreen = window.innerWidth < 1024;
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
    if (link.path === "/tools") return location.pathname === "/tools" || location.pathname.startsWith("/tools/");
    if (link.path === "/blog") return location.pathname === "/blog" || location.pathname.startsWith("/blog/");
    if (location.pathname !== "/") return false;
    return link.hash === activeHash;
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsOpen(false);
    if (link.path && !link.hash) { navigate(link.path); window.scrollTo({ top: 0 }); return; }
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
      {/* Announcement Bar */}
      {settings.announcement_enabled === "true" && settings.announcement_text && (
        <div className="w-full bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 text-gray-700 text-center text-xs py-1.5 px-4 font-medium border-b border-orange-100/60">
          {settings.announcement_text}
        </div>
      )}

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
            {settings.site_logo_url ? (
              <img src={settings.site_logo_url} alt={settings.site_name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl object-cover glow-shadow flex-shrink-0" />
            ) : (
              <img src="/logo.png" alt={settings.site_name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl object-cover glow-shadow flex-shrink-0" />
            )}
            <span className="text-sm sm:text-lg font-bold tracking-tight whitespace-nowrap leading-none">
              <span className="gradient-text">{settings.navbar_brand_text}</span>
              <span className="text-gray-800"> {settings.navbar_brand_accent}</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className={cn("items-center gap-1 bg-black/5 rounded-xl px-2 py-1 relative z-10 border border-black/5 mx-auto hidden lg:flex", isCompactNav ? "!hidden" : "")}>
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={cn(
                  "px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative whitespace-nowrap flex items-center gap-1.5",
                  isActive(link)
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                )}
              >
                {link.highlight && (
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </motion.span>
                )}
                {link.name}
              </button>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className={cn("relative z-10 ml-auto items-center gap-3 hidden lg:flex", isCompactNav ? "!hidden" : "")}>
            <motion.button
              onClick={() => navigate("/favorites")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative p-2.5 rounded-xl border-2 transition-all duration-300 group",
                location.pathname === "/favorites"
                  ? "bg-gradient-to-br from-red-500/15 to-pink-500/15 border-red-400/40 shadow-md shadow-red-500/10"
                  : favorites.length > 0
                    ? "bg-red-50/80 border-red-300/40 hover:border-red-400/60 hover:bg-red-50"
                    : "bg-white/60 border-gray-200/60 hover:border-gray-300 hover:bg-white/80"
              )}
              aria-label="Favorites"
            >
              <Heart
                className={cn(
                  "w-5 h-5 relative z-10 transition-all duration-300",
                  favorites.length > 0
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                )}
              />
              <AnimatePresence>
                {favorites.length > 0 && (
                  <motion.span
                    key={favorites.length}
                    initial={{ scale: 0, y: 5 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_2px_10px_rgba(239,68,68,0.5)] border border-red-400/30"
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-pink-500 to-orange-400 opacity-60 group-hover:opacity-100 blur-[2px] transition-opacity duration-300" />
                    <Avatar className="w-8 h-8 relative border-2 border-gray-200 group-hover:border-gray-300 transition-colors">
                      {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                      <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary/30 to-pink-500/30 text-primary-foreground">
                        {profile?.display_name ? getInitials(profile.display_name) : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-black/20 p-2 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                      <div className="relative px-3 py-3 mb-1 border-b border-border/30">
                        <p className="text-sm font-bold truncate">{profile?.display_name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-accent transition-colors group/item"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                          <Settings className="w-3.5 h-3.5 text-primary" />
                        </div>
                        Account Settings
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); navigate("/favorites"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-accent transition-colors group/item"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center group-hover/item:bg-red-500/20 transition-colors">
                          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                        </div>
                        My Favorites
                        {favorites.length > 0 && (
                          <span className="ml-auto text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">{favorites.length}</span>
                        )}
                      </button>
                      <div className="border-t border-border/30 mt-1 pt-1">
                        <button
                          onClick={() => { setProfileOpen(false); signOut(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-red-500/10 text-red-400 transition-colors group/item"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center group-hover/item:bg-red-500/20 transition-colors">
                            <LogOut className="w-3.5 h-3.5" />
                          </div>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

          {/* Mobile: Favorites + Toggle */}
          <div className={cn("relative z-10 ml-auto flex items-center gap-1 lg:hidden", isCompactNav ? "" : "!hidden")}>
            <motion.button
              onClick={() => navigate("/favorites")}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative p-2 rounded-lg border-2 transition-all",
                favorites.length > 0
                  ? "bg-red-50/80 border-red-300/40"
                  : "bg-white/60 border-gray-200/60"
              )}
              aria-label="Favorites"
            >
              <Heart
                className={cn(
                  "w-4.5 h-4.5 transition-all",
                  favorites.length > 0
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                )}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5 shadow-lg">
                  {favorites.length}
                </span>
              )}
            </motion.button>

            <button
              className="text-gray-700 p-1 flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && isCompactNav && (
          <div className="lg:hidden mt-2 navbar-glass rounded-2xl p-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={cn(
                  "block w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
                  isActive(link)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                )}
              >
                {link.name}
              </button>
            ))}

            <button
              onClick={() => { setIsOpen(false); navigate("/favorites"); }}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2",
                location.pathname === "/favorites"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
              )}
            >
              <Heart className={cn("w-4 h-4", favorites.length > 0 ? "fill-red-500 text-red-500" : "")} />
              Favorites
              {favorites.length > 0 && (
                <span className="ml-auto text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-bold">{favorites.length}</span>
              )}
            </button>

            <div className="pt-2 border-t border-black/10">
              {user ? (
                <div className="space-y-1">
                  <button
                    onClick={() => { setIsOpen(false); navigate("/profile"); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-black/5 transition-all flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); signOut(); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <Button
                  className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold"
                  onClick={() => { setIsOpen(false); navigate("/auth"); }}
                >
                  <LogIn className="w-4 h-4 mr-2" /> Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
