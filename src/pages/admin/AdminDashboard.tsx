import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { tools, categories } from "@/data/tools";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import {
  Users, Wrench, Heart, Settings, TrendingUp, Shield, FileCode,
  Globe, BarChart3, Activity, Clock, Eye, Star, Zap, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend
} from "recharts";

interface DashboardStats {
  users: number;
  favorites: number;
  blogPosts: number;
  customTools: number;
  enabledTools: number;
  disabledTools: number;
  admins: number;
  recentUsers: { display_name: string; created_at: string }[];
  recentFavorites: { tool_id: string; created_at: string }[];
  categoryData: { name: string; count: number }[];
  toolSettings: { tool_id: string; is_enabled: boolean; is_featured: boolean }[];
  favoritesByTool: { name: string; count: number }[];
  userGrowth: { date: string; count: number }[];
}

const CHART_COLORS = [
  "hsl(263, 85%, 58%)", "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)",
  "hsl(0, 84%, 60%)", "hsl(45, 93%, 47%)", "hsl(280, 90%, 55%)",
  "hsl(330, 80%, 55%)", "hsl(170, 75%, 41%)", "hsl(25, 95%, 53%)",
  "hsl(210, 100%, 56%)", "hsl(340, 82%, 52%)", "hsl(120, 60%, 45%)"
];

export default function AdminDashboard() {
  const { settings } = useSiteSettings();
  const adminBase = `/${settings.admin_slug || "makuadmingowebs99"}`;
  const [stats, setStats] = useState<DashboardStats>({
    users: 0, favorites: 0, blogPosts: 0, customTools: 0,
    enabledTools: 0, disabledTools: 0, admins: 0,
    recentUsers: [], recentFavorites: [], categoryData: [],
    toolSettings: [], favoritesByTool: [], userGrowth: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        profilesRes, favoritesRes, blogRes, customToolsRes,
        toolSettingsRes, rolesRes, recentProfilesRes, recentFavsRes
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("favorites").select("*"),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("custom_tools").select("id, is_enabled", { count: "exact" }),
        supabase.from("tool_settings").select("tool_id, is_enabled, is_featured"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("display_name, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("favorites").select("tool_id, created_at").order("created_at", { ascending: false }).limit(10),
      ]);

      // Category distribution
      const catCounts: Record<string, number> = {};
      tools.forEach(t => {
        catCounts[t.category] = (catCounts[t.category] || 0) + 1;
      });
      const categoryData = categories
        .filter(c => c.id !== "all" && catCounts[c.id])
        .map(c => ({ name: c.label, count: catCounts[c.id] || 0 }))
        .sort((a, b) => b.count - a.count);

      // Favorites by tool (top 10)
      const favCounts: Record<string, number> = {};
      (favoritesRes.data || []).forEach((f: any) => {
        favCounts[f.tool_id] = (favCounts[f.tool_id] || 0) + 1;
      });
      const favoritesByTool = Object.entries(favCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([id, count]) => {
          const tool = tools.find(t => t.id === id);
          return { name: tool?.name?.slice(0, 18) || id.slice(0, 18), count };
        });

      // Tool settings stats
      const settingsData = toolSettingsRes.data || [];
      const disabledTools = settingsData.filter((s: any) => !s.is_enabled).length;

      // User growth (group by date)
      const profilesList = recentProfilesRes.data || [];
      const userGrowthMap: Record<string, number> = {};
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("en", { month: "short", day: "numeric" });
        userGrowthMap[key] = 0;
      }

      setStats({
        users: profilesRes.count || 0,
        favorites: (favoritesRes.data || []).length,
        blogPosts: blogRes.count || 0,
        customTools: customToolsRes.count || 0,
        enabledTools: tools.length - disabledTools,
        disabledTools,
        admins: rolesRes.count || 0,
        recentUsers: profilesList,
        recentFavorites: recentFavsRes.data || [],
        categoryData,
        toolSettings: settingsData as any,
        favoritesByTool,
        userGrowth: Object.entries(userGrowthMap).map(([date, count]) => ({ date, count })),
      });
      setLoading(false);
    };
    fetchAll();
  }, []);

  const statCards = [
    { title: "Total Tools", value: tools.length, icon: Wrench, change: "+0", up: true },
    { title: "Custom Tools", value: stats.customTools, icon: FileCode, change: "new", up: true },
    { title: "Registered Users", value: stats.users, icon: Users, change: "+active", up: true },
    { title: "Total Favorites", value: stats.favorites, icon: Heart, change: "engagement", up: true },
    { title: "Blog Posts", value: stats.blogPosts, icon: Globe, change: "content", up: true },
    { title: "Admin Roles", value: stats.admins, icon: Shield, change: "secure", up: true },
  ];

  // Tool status data for pie chart
  const toolStatusData = [
    { name: "Enabled", value: stats.enabledTools, color: "hsl(142, 71%, 45%)" },
    { name: "Disabled", value: stats.disabledTools, color: "hsl(0, 84%, 60%)" },
    { name: "Custom", value: stats.customTools, color: "hsl(263, 85%, 58%)" },
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Real-time overview of your platform performance
          </p>
        </div>
        <Badge variant="outline" className="self-start flex items-center gap-1.5 px-3 py-1.5">
          <Activity className="w-3 h-3 text-green-500 animate-pulse" />
          <span className="text-xs">Live</span>
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="border-border/50 hover:shadow-md transition-all hover:border-primary/20 group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground flex items-center gap-0.5">
                    {stat.up ? <ArrowUpRight className="w-2.5 h-2.5 text-green-500" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-500" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Tools by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stats.categoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tool Status Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" /> Tool Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={toolStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {toolStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Favorited Tools */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" /> Most Favorited Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.favoritesByTool.length > 0 ? (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.favoritesByTool} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                  No favorite data yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Category Size Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval={0} angle={-30} textAnchor="end" />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(263, 85%, 58%)"
                      fill="hsl(263, 85%, 58%)"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recentUsers.length > 0 ? stats.recentUsers.map((user, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {user.display_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.display_name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Manage Tools", href: `${adminBase}/tools`, icon: Wrench },
                { label: "Custom Tools", href: `${adminBase}/custom-tools`, icon: FileCode },
                { label: "Blog Posts", href: `${adminBase}/blog`, icon: Globe },
                { label: "SEO Settings", href: `${adminBase}/seo`, icon: TrendingUp },
                { label: "View Users", href: `${adminBase}/users`, icon: Users },
                { label: "Site Settings", href: `${adminBase}/settings`, icon: Settings },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent/30 hover:bg-accent/60 text-sm font-medium text-foreground transition-colors group"
                >
                  <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  {action.label}
                  <ArrowUpRight className="w-3 h-3 ml-auto text-muted-foreground/50" />
                </a>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Built-in Tools", value: tools.length, icon: Wrench },
                { label: "Custom Tools", value: stats.customTools, icon: FileCode },
                { label: "Categories", value: categories.filter(c => c.id !== "all").length, icon: Settings },
                { label: "Blog Posts", value: stats.blogPosts, icon: Globe },
                { label: "Enabled Tools", value: stats.enabledTools, icon: Eye },
                { label: "Disabled Tools", value: stats.disabledTools, icon: Shield },
                { label: "Status", value: "Active", icon: Activity },
              ].map((info) => (
                <div key={info.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <info.icon className="w-3.5 h-3.5" /> {info.label}
                  </span>
                  <Badge variant="secondary" className="text-xs font-semibold">{info.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
