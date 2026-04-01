import { useState, useEffect, useMemo } from "react";
import { tools, categories, type Tool } from "@/data/tools";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadField } from "@/components/ImageUploadField";
import {
  Search, Star, Wrench, ArrowLeft, Save, Globe, FileText,
  Share2, Twitter, Code, CheckCircle, AlertTriangle, Eye, Settings2, Link2, Pencil, X as XIcon, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ToolSetting {
  tool_id: string;
  is_enabled: boolean;
  is_featured: boolean;
  custom_name: string;
}

interface ToolSEO {
  id?: string;
  tool_id: string;
  custom_slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  canonical_url: string;
  robots: string;
  structured_data: any;
  long_description: string;
  focus_keyword: string;
  is_enabled: boolean;
}

const ROBOTS_OPTIONS = ["index, follow", "index, nofollow", "noindex, follow", "noindex, nofollow"];

export default function AdminTools() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toolSettings, setToolSettings] = useState<Record<string, ToolSetting>>({});
  const [toolSeoMap, setToolSeoMap] = useState<Record<string, ToolSEO>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "seo">("list");
  const [seoTool, setSeoTool] = useState<Tool | null>(null);
  const [seoData, setSeoData] = useState<ToolSEO | null>(null);
  const [seoSaving, setSeoSaving] = useState(false);
  const [structuredDataStr, setStructuredDataStr] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    fetchAllSeo();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("tool_settings").select("tool_id, is_enabled, is_featured, custom_name");
    if (data) {
      const map: Record<string, ToolSetting> = {};
      data.forEach((s: any) => { map[s.tool_id] = s; });
      setToolSettings(map);
    }
  };

  const fetchAllSeo = async () => {
    const { data } = await supabase.from("tool_seo").select("*");
    if (data) {
      const map: Record<string, ToolSEO> = {};
      data.forEach((s: any) => { map[s.tool_id] = s; });
      setToolSeoMap(map);
    }
  };

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "all" || t.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const isEnabled = (toolId: string) => toolSettings[toolId]?.is_enabled !== false;
  const isFeatured = (toolId: string) => toolSettings[toolId]?.is_featured === true;
  const hasSeo = (toolId: string) => !!toolSeoMap[toolId]?.meta_title;

  const toggleSetting = async (toolId: string, field: "is_enabled" | "is_featured") => {
    setSaving(toolId);
    const current = toolSettings[toolId] || { tool_id: toolId, is_enabled: true, is_featured: false, custom_name: "" };
    const newValue = !current[field];
    const updated = { ...current, [field]: newValue };

    const { error } = await supabase
      .from("tool_settings")
      .upsert({ tool_id: toolId, [field]: newValue, updated_at: new Date().toISOString() }, { onConflict: "tool_id" });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setToolSettings((prev) => ({ ...prev, [toolId]: updated }));
    }
    setSaving(null);
  };

  const startEditName = (toolId: string) => {
    const current = toolSettings[toolId]?.custom_name || "";
    setEditingName(toolId);
    setEditNameValue(current);
  };

  const saveCustomName = async (toolId: string) => {
    setSaving(toolId);
    const { error } = await supabase
      .from("tool_settings")
      .upsert({ tool_id: toolId, custom_name: editNameValue, updated_at: new Date().toISOString() }, { onConflict: "tool_id" });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setToolSettings((prev) => ({
        ...prev,
        [toolId]: { ...(prev[toolId] || { tool_id: toolId, is_enabled: true, is_featured: false, custom_name: "" }), custom_name: editNameValue },
      }));
      toast({ title: "✅ Name Updated!", description: `Tool name saved.` });
    }
    setEditingName(null);
    setSaving(null);
  };

  const getDisplayName = (tool: Tool) => {
    const custom = toolSettings[tool.id]?.custom_name;
    return custom || tool.name;
  };

  const openSeoEditor = (tool: Tool) => {
    const existing = toolSeoMap[tool.id];
    setSeoTool(tool);
    setSeoData(existing || {
      tool_id: tool.id,
      custom_slug: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      og_title: "",
      og_description: "",
      og_image: "",
      og_type: "website",
      twitter_card: "summary_large_image",
      twitter_title: "",
      twitter_description: "",
      canonical_url: "",
      robots: "index, follow",
      structured_data: null,
      long_description: "",
      focus_keyword: "",
      is_enabled: true,
    });
    setStructuredDataStr(existing?.structured_data ? JSON.stringify(existing.structured_data, null, 2) : "");
    setView("seo");
  };

  const handleSeoSave = async () => {
    if (!seoData || !seoTool) return;
    setSeoSaving(true);

    let structuredData = null;
    if (structuredDataStr.trim()) {
      try { structuredData = JSON.parse(structuredDataStr); }
      catch { toast({ title: "Error", description: "Invalid JSON in structured data.", variant: "destructive" }); setSeoSaving(false); return; }
    }

    const payload = {
      tool_id: seoTool.id,
      custom_slug: seoData.custom_slug || "",
      meta_title: seoData.meta_title || "",
      meta_description: seoData.meta_description || "",
      meta_keywords: seoData.meta_keywords || "",
      og_title: seoData.og_title || "",
      og_description: seoData.og_description || "",
      og_image: seoData.og_image || "",
      og_type: seoData.og_type || "website",
      twitter_card: seoData.twitter_card || "summary_large_image",
      twitter_title: seoData.twitter_title || "",
      twitter_description: seoData.twitter_description || "",
      canonical_url: seoData.canonical_url || "",
      robots: seoData.robots || "index, follow",
      structured_data: structuredData,
      long_description: seoData.long_description || "",
      focus_keyword: seoData.focus_keyword || "",
      is_enabled: seoData.is_enabled ?? true,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    };

    const { error } = await supabase
      .from("tool_seo")
      .upsert(payload as any, { onConflict: "tool_id" });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "SEO Saved!", description: `SEO for "${seoTool.name}" saved successfully.` });
      setToolSeoMap((prev) => ({ ...prev, [seoTool.id]: { ...payload, id: seoData.id } as ToolSEO }));
      setView("list");
    }
    setSeoSaving(false);
  };

  const updateSeo = (field: string, value: any) =>
    setSeoData((prev) => prev ? { ...prev, [field]: value } : prev);

  const enabledCount = tools.filter((t) => isEnabled(t.id)).length;
  const featuredCount = tools.filter((t) => isFeatured(t.id)).length;
  const seoCount = Object.values(toolSeoMap).filter((s) => s.meta_title).length;

  // ─── SEO Editor ────────────────────
  if (view === "seo" && seoTool && seoData) {
    const titleLen = (seoData.meta_title || "").length;
    const descLen = (seoData.meta_description || "").length;
    const currentSlug = seoData.custom_slug || seoTool.path.split("/").pop() || "";

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("list")} className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: seoTool.color }}>
                <seoTool.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-foreground truncate">SEO: {seoTool.name}</h1>
                <p className="text-xs text-muted-foreground">Configure full SEO for this tool page</p>
              </div>
            </div>
          </div>
          <Button onClick={handleSeoSave} disabled={seoSaving} className="gap-2 w-full sm:w-auto">
            <Save className="w-4 h-4" />
            {seoSaving ? "Saving..." : "Save SEO"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Slug & URL */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" /> URL & Slug
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Custom Slug</Label>
                  <Input
                    value={seoData.custom_slug}
                    onChange={(e) => updateSeo("custom_slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder={seoTool.path.split("/").pop() || "tool-slug"}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    URL: /tools/<span className="font-mono text-primary">{currentSlug}</span> — Leave empty to use default
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>Canonical URL</Label>
                  <Input
                    value={seoData.canonical_url}
                    onChange={(e) => updateSeo("canonical_url", e.target.value)}
                    placeholder="https://yourdomain.com/tools/..."
                  />
                  <p className="text-[10px] text-muted-foreground">Leave empty to auto-generate</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Focus Keyword</Label>
                  <Input
                    value={seoData.focus_keyword}
                    onChange={(e) => updateSeo("focus_keyword", e.target.value)}
                    placeholder="e.g. age calculator online free"
                  />
                  <p className="text-[10px] text-muted-foreground">Primary keyword you want this page to rank for</p>
                </div>
              </CardContent>
            </Card>

            {/* Meta Tags */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Meta Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Meta Title</Label>
                  <Input
                    value={seoData.meta_title}
                    onChange={(e) => updateSeo("meta_title", e.target.value)}
                    placeholder={`${seoTool.name} — Free Online Tool | Cyber Venom`}
                    maxLength={70}
                  />
                  <div className="flex justify-between">
                    <p className="text-[10px] text-muted-foreground">Recommended: 50-60 characters</p>
                    <p className={`text-[10px] ${titleLen > 60 ? "text-destructive" : titleLen >= 50 ? "text-green-500" : "text-amber-500"}`}>
                      {titleLen}/60
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={seoData.meta_description}
                    onChange={(e) => updateSeo("meta_description", e.target.value)}
                    placeholder={`Use our free ${seoTool.name} online. ${seoTool.description}. No signup required.`}
                    maxLength={170}
                    rows={3}
                  />
                  <div className="flex justify-between">
                    <p className="text-[10px] text-muted-foreground">Recommended: 120-160 characters</p>
                    <p className={`text-[10px] ${descLen > 160 ? "text-destructive" : descLen >= 120 ? "text-green-500" : "text-amber-500"}`}>
                      {descLen}/160
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Keywords (comma separated)</Label>
                  <Input
                    value={seoData.meta_keywords}
                    onChange={(e) => updateSeo("meta_keywords", e.target.value)}
                    placeholder={`${seoTool.name.toLowerCase()}, free online tool, web tools...`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Robots Directive</Label>
                  <Select value={seoData.robots} onValueChange={(v) => updateSeo("robots", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROBOTS_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Long Description (for page content SEO) */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Extended Description (On-Page SEO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={seoData.long_description}
                  onChange={(e) => updateSeo("long_description", e.target.value)}
                  placeholder="Write a detailed description about this tool. This text will be displayed on the tool page below the tool to help with SEO. HTML is supported."
                  rows={8}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-muted-foreground">
                  This content appears on the tool page to boost on-page SEO. Use keywords naturally. HTML supported.
                </p>
              </CardContent>
            </Card>

            {/* Open Graph */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-primary" /> Open Graph (Facebook, LinkedIn)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>OG Title</Label>
                  <Input value={seoData.og_title} onChange={(e) => updateSeo("og_title", e.target.value)} placeholder="Falls back to Meta Title" />
                </div>
                <div className="space-y-1.5">
                  <Label>OG Description</Label>
                  <Textarea value={seoData.og_description} onChange={(e) => updateSeo("og_description", e.target.value)} placeholder="Falls back to Meta Description" rows={2} />
                </div>
                <ImageUploadField label="OG Image (1200×630 recommended)" value={seoData.og_image} onChange={(url) => updateSeo("og_image", url)} />
                <div className="space-y-1.5">
                  <Label>OG Type</Label>
                  <Select value={seoData.og_type} onValueChange={(v) => updateSeo("og_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">website</SelectItem>
                      <SelectItem value="article">article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Twitter */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-primary" /> Twitter / X Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Card Type</Label>
                  <Select value={seoData.twitter_card} onValueChange={(v) => updateSeo("twitter_card", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Twitter Title</Label>
                  <Input value={seoData.twitter_title} onChange={(e) => updateSeo("twitter_title", e.target.value)} placeholder="Falls back to OG Title" />
                </div>
                <div className="space-y-1.5">
                  <Label>Twitter Description</Label>
                  <Textarea value={seoData.twitter_description} onChange={(e) => updateSeo("twitter_description", e.target.value)} placeholder="Falls back to OG Description" rows={2} />
                </div>
              </CardContent>
            </Card>

            {/* Structured Data */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" /> Structured Data (JSON-LD)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={structuredDataStr}
                  onChange={(e) => setStructuredDataStr(e.target.value)}
                  placeholder='{"@context":"https://schema.org","@type":"WebApplication","name":"..."}'
                  rows={8}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-muted-foreground">Optional JSON-LD for rich search results (WebApplication schema recommended for tools).</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Preview */}
          <div className="space-y-4">
            {/* Google Preview */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" /> Google Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background border border-border rounded-lg p-4 space-y-1">
                  <p className="text-sm text-primary truncate font-medium">
                    {seoData.meta_title || `${seoTool.name} | Cyber Venom`}
                  </p>
                  <p className="text-xs text-green-600 truncate">
                    {seoData.canonical_url || `yourdomain.com/tools/${currentSlug}`}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {seoData.meta_description || seoTool.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Preview */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-primary" /> Social Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-lg overflow-hidden">
                  {seoData.og_image ? (
                    <img src={seoData.og_image} alt="OG" className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-muted flex items-center justify-center text-muted-foreground text-xs">No OG Image</div>
                  )}
                  <div className="p-3 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">yourdomain.com</p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {seoData.og_title || seoData.meta_title || seoTool.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {seoData.og_description || seoData.meta_description || seoTool.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Checklist */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" /> SEO Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Focus Keyword", done: !!seoData.focus_keyword },
                  { label: "Meta Title (50-60 chars)", done: titleLen >= 50 && titleLen <= 60 },
                  { label: "Meta Description (120-160)", done: descLen >= 120 && descLen <= 160 },
                  { label: "Keywords", done: !!seoData.meta_keywords },
                  { label: "OG Title & Description", done: !!(seoData.og_title || seoData.og_description) },
                  { label: "OG Image", done: !!seoData.og_image },
                  { label: "Twitter Card", done: !!(seoData.twitter_title) },
                  { label: "Extended Description", done: (seoData.long_description || "").length > 100 },
                  { label: "Custom Slug", done: !!seoData.custom_slug },
                  { label: "Canonical URL", done: !!seoData.canonical_url },
                  { label: "Structured Data", done: !!structuredDataStr.trim() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    {item.done ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enable/Disable */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Label>SEO Enabled</Label>
                  <Switch checked={seoData.is_enabled} onCheckedChange={(v) => updateSeo("is_enabled", v)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tools Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {enabledCount} enabled · {featuredCount} featured · {seoCount} SEO configured · {tools.length} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-md border border-input bg-background text-sm"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Tools List */}
      <div className="space-y-2">
        {filteredTools.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
          >
            <Card className={`border-border/50 transition-all ${!isEnabled(tool.id) ? "opacity-50" : ""}`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: tool.color }}
                    >
                      <tool.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-medium text-sm text-foreground truncate">{tool.name}</h3>
                        <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex">{tool.category}</Badge>
                        {hasSeo(tool.id) ? (
                          <Badge className="text-[10px] bg-green-500/10 text-green-600 border-0 shrink-0">
                            <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> SEO
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] shrink-0 text-muted-foreground">
                            <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> No SEO
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 pl-12 sm:pl-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSeoEditor(tool)}
                      className="gap-1.5 text-xs h-8"
                    >
                      <Settings2 className="w-3.5 h-3.5" /> SEO
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground hidden sm:block">Featured</span>
                      <Switch
                        checked={isFeatured(tool.id)}
                        onCheckedChange={() => toggleSetting(tool.id, "is_featured")}
                        disabled={saving === tool.id}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground hidden sm:block">Enabled</span>
                      <Switch
                        checked={isEnabled(tool.id)}
                        onCheckedChange={() => toggleSetting(tool.id, "is_enabled")}
                        disabled={saving === tool.id}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No tools found matching your search.</p>
        </div>
      )}
    </div>
  );
}
