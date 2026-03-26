import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { tools } from "@/data/tools";
import { Users, Wrench, Heart, Settings, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, favorites: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, favoritesRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("favorites").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        users: profilesRes.count || 0,
        favorites: favoritesRes.count || 0,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Tools", value: tools.length, icon: Wrench, color: "text-primary" },
    { title: "Registered Users", value: stats.users, icon: Users, color: "text-blue-500" },
    { title: "Total Favorites", value: stats.favorites, icon: Heart, color: "text-red-500" },
    { title: "Categories", value: 12, icon: Settings, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome to the admin panel overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Manage Tools", href: "/admingorohid306/tools" },
              { label: "View Users", href: "/admingorohid306/users" },
              { label: "Site Settings", href: "/admingorohid306/settings" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="block px-4 py-3 rounded-lg bg-accent/30 hover:bg-accent/60 text-sm font-medium text-foreground transition-colors"
              >
                {action.label} →
              </a>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Platform", value: "Makur Web Tools" },
              { label: "Total Tools", value: `${tools.length} tools` },
              { label: "Status", value: "Active" },
            ].map((info) => (
              <div key={info.label} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                <span className="text-sm text-muted-foreground">{info.label}</span>
                <span className="text-sm font-medium text-foreground">{info.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
