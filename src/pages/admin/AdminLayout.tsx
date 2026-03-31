import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import {
  LayoutDashboard, Wrench, Users, Settings, ChevronLeft, ChevronRight,
  LogOut, Home, Shield, Menu, X, FileText, Megaphone, UserCog, Search, Upload, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { settings } = useSiteSettings();
  useSessionTimeout();

  const ADMIN_BASE = `/${settings.admin_slug || "makuadmingowebs99"}`;

  const sidebarLinks = [
    { name: "Dashboard", path: ADMIN_BASE, icon: LayoutDashboard },
    { name: "Tools", path: `${ADMIN_BASE}/tools`, icon: Wrench },
    { name: "Blog", path: `${ADMIN_BASE}/blog`, icon: FileText },
    { name: "Ads", path: `${ADMIN_BASE}/ads`, icon: Megaphone },
    { name: "SEO", path: `${ADMIN_BASE}/seo`, icon: Search },
    { name: "Custom Tools", path: `${ADMIN_BASE}/custom-tools`, icon: Upload },
    { name: "Subscriptions", path: `${ADMIN_BASE}/subscriptions`, icon: Crown },
    { name: "Users", path: `${ADMIN_BASE}/users`, icon: Users },
    { name: "Admin Roles", path: `${ADMIN_BASE}/roles`, icon: UserCog },
    { name: "Security", path: `${ADMIN_BASE}/security`, icon: Shield },
    { name: "Settings", path: `${ADMIN_BASE}/settings`, icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === ADMIN_BASE) return location.pathname === ADMIN_BASE;
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border/50">
        <Link to={ADMIN_BASE} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-foreground text-sm">Admin Panel</h1>
              <p className="text-[10px] text-muted-foreground">Cyber Venom</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive(link.path)
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <link.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <Home className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/50 bg-card transition-all duration-300 sticky top-0 h-screen",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border/50 flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="flex items-center gap-2 ml-3">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-14 left-0 bottom-0 w-[260px] bg-card border-r border-border/50 z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 pt-[4.5rem] md:pt-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
