import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadField } from "@/components/ImageUploadField";
import {
  Search, Plus, Edit, Trash2, ArrowLeft, Save, Globe, FileText,
  Eye, EyeOff, Twitter, Share2, Code, CheckCircle, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PageSEO {
  id: string;
  page_path: string;
  page_name: string;
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
  is_enabled: boolean;
  updated_at: string;
}

const COMMON_PAGES = [
  { path: "/", name: "Homepage" },
  { path: "/tools", name: "All Tools" },
  { path: "/blog", name: "Blog" },
  { path: "/categories", name: "Categories" },
  { path: "/favorites", name: "Favorites" },
  { path: "/auth", name: "Login / Signup" },
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/terms", name: "Terms of Service" },
  { path: "/about", name: "About Us" },
  { path: "/contact", name: "Contact" },
];

const ROBOTS_OPTIONS = [
  "index, follow",
  "index, nofollow",
  "noindex, follow",
  "noindex, nofollow",
];

const emptyPage: Omit<PageSEO, "id" | "updated_at"> = {
  page_path: "",
  page_name: "",
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
  is_enabled: true,
};

export default function AdminSEO() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<PageSEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "editor">("list");
  const [editing, setEditing] = useState<Partial<PageSEO>>(emptyPage);
  const [saving, setSaving] = useState(false);
  const [structuredDataStr, setStructuredDataStr] = useState("");

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("page_seo")
      .select("*")
      .order("page_path");
    if (data) setPages(data as unknown as PageSEO[]);
    setLoading(false);
  };

  const openEditor = (page?: PageSEO) => {
    if (page) {
      setEditing(page);
      setStructuredDataStr(page.structured_data ? JSON.stringify(page.structured_data, null, 2) : "");
    } else {
      setEditing({ ...emptyPage });
      setStructuredDataStr("");
    }
    setView("editor");
  };

  const handleSave = async () => {
    if (!editing.page_path?.trim()) {
      toast({ title: "Error", description: "Page path is required.", variant: "destructive" });
      return;
    }
    setSaving(true);

    let structuredData = null;
    if (structuredDataStr.trim()) {
      try {
        structuredData = JSON.parse(structuredDataStr);
      } catch {
        toast({ title: "Error", description: "Invalid JSON in structured data.", variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    const payload = {
      page_path: editing.page_path,
      page_name: editing.page_name || "",
      meta_title: editing.meta_title || "",
      meta_description: editing.meta_description || "",
      meta_keywords: editing.meta_keywords || "",
      og_title: editing.og_title || "",
      og_description: editing.og_description || "",
      og_image: editing.og_image || "",
      og_type: editing.og_type || "website",
      twitter_card: editing.twitter_card || "summary_large_image",
      twitter_title: editing.twitter_title || "",
      twitter_description: editing.twitter_description || "",
      canonical_url: editing.canonical_url || "",
      robots: editing.robots || "index, follow",
      structured_data: structuredData,
      is_enabled: editing.is_enabled ?? true,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("page_seo").update(payload as any).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("page_seo").insert(payload as any));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: `SEO for "${editing.page_name || editing.page_path}" saved.` });
      setView("list");
      fetchPages();
    }
    setSaving(false);
  };

  const handleDelete = async (page: PageSEO) => {
    if (!window.confirm(`Delete SEO settings for "${page.page_name || page.page_path}"?`)) return;
    const { error } = await supabase.from("page_seo").delete().eq("id", page.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "SEO settings removed." });
      fetchPages();
    }
  };

  const updateField = (field: string, value: any) =>
    setEditing((prev) => ({ ...prev, [field]: value }));

  const selectCommonPage = (path: string) => {
    const page = COMMON_PAGES.find((p) => p.path === path);
    if (page) {
      updateField("page_path", page.path);
      updateField("page_name", page.name);
    }
  };

  const filtered = pages.filter((p) =>
    p.page_name.toLowerCase().includes(search.toLowerCase()) ||
    p.page_path.toLowerCase().includes(search.toLowerCase())
  );

  const getSeoScore = (p: PageSEO) => {
    let score = 0;
    if (p.meta_title) score += 20;
    if (p.meta_description && p.meta_description.length >= 50) score += 20;
    if (p.meta_keywords) score += 10;
    if (p.og_title || p.og_description) score += 15;
    if (p.og_image) score += 15;
    if (p.twitter_title || p.twitter_description) score += 10;
    if (p.canonical_url) score += 10;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-destructive";
  };

  // ─── Editor ────────────────────────────────
  if (view === "editor") {
    const titleLen = (editing.meta_title || "").length;
    const descLen = (editing.meta_description || "").length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("list")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {editing.id ? "Edit SEO Settings" : "Add Page SEO"}
              </h1>
              <p className="text-xs text-muted-foreground">Configure SEO for a specific page</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save SEO"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {/* Page Identity */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Page Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!editing.id && (
                  <div className="space-y-1.5">
                    <Label>Quick Select Page</Label>
                    <Select onValueChange={selectCommonPage}>
                      <SelectTrigger><SelectValue placeholder="Select a common page..." /></SelectTrigger>
                      <SelectContent>
                        {COMMON_PAGES.map((p) => (
                          <SelectItem key={p.path} value={p.path}>{p.name} ({p.path})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">Or enter a custom path below</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>Page Path *</Label>
                  <Input
                    value={editing.page_path || ""}
                    onChange={(e) => updateField("page_path", e.target.value)}
                    placeholder="/tools/age-calculator"
                  />
                  <p className="text-[10px] text-muted-foreground">The URL path (e.g. / or /tools or /blog)</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Page Name</Label>
                  <Input
                    value={editing.page_name || ""}
                    onChange={(e) => updateField("page_name", e.target.value)}
                    placeholder="Homepage"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editing.is_enabled ?? true}
                    onCheckedChange={(v) => updateField("is_enabled", v)}
                  />
                  <Label>SEO Enabled</Label>
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
                    value={editing.meta_title || ""}
                    onChange={(e) => updateField("meta_title", e.target.value)}
                    placeholder="Page Title — Cyber Venom"
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
                    value={editing.meta_description || ""}
                    onChange={(e) => updateField("meta_description", e.target.value)}
                    placeholder="A compelling description for search engines..."
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
                    value={editing.meta_keywords || ""}
                    onChange={(e) => updateField("meta_keywords", e.target.value)}
                    placeholder="web tools, free tools, online calculator..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Robots Directive</Label>
                  <Select value={editing.robots || "index, follow"} onValueChange={(v) => updateField("robots", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROBOTS_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Canonical URL</Label>
                  <Input
                    value={editing.canonical_url || ""}
                    onChange={(e) => updateField("canonical_url", e.target.value)}
                    placeholder="https://yourdomain.com/page"
                  />
                  <p className="text-[10px] text-muted-foreground">Leave empty to auto-generate</p>
                </div>
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
                  <Input
                    value={editing.og_title || ""}
                    onChange={(e) => updateField("og_title", e.target.value)}
                    placeholder="Title shown on social media shares"
                  />
                  <p className="text-[10px] text-muted-foreground">Falls back to Meta Title if empty</p>
                </div>
                <div className="space-y-1.5">
                  <Label>OG Description</Label>
                  <Textarea
                    value={editing.og_description || ""}
                    onChange={(e) => updateField("og_description", e.target.value)}
                    placeholder="Description shown on social shares..."
                    rows={2}
                  />
                </div>
                <ImageUploadField
                  label="OG Image (1200×630 recommended)"
                  value={editing.og_image || ""}
                  onChange={(url) => updateField("og_image", url)}
                  placeholder="Upload or paste image URL..."
                />
                <div className="space-y-1.5">
                  <Label>OG Type</Label>
                  <Select value={editing.og_type || "website"} onValueChange={(v) => updateField("og_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">website</SelectItem>
                      <SelectItem value="article">article</SelectItem>
                      <SelectItem value="product">product</SelectItem>
                      <SelectItem value="profile">profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Twitter Card */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-primary" /> Twitter / X Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Card Type</Label>
                  <Select value={editing.twitter_card || "summary_large_image"} onValueChange={(v) => updateField("twitter_card", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Twitter Title</Label>
                  <Input
                    value={editing.twitter_title || ""}
                    onChange={(e) => updateField("twitter_title", e.target.value)}
                    placeholder="Falls back to OG Title if empty"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Twitter Description</Label>
                  <Textarea
                    value={editing.twitter_description || ""}
                    onChange={(e) => updateField("twitter_description", e.target.value)}
                    placeholder="Falls back to OG Description if empty"
                    rows={2}
                  />
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
                  placeholder='{"@context":"https://schema.org","@type":"WebPage",...}'
                  rows={8}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-muted-foreground">Optional. Enter valid JSON-LD for rich search results.</p>
              </CardContent>
            </Card>
          </div>

          {/* Preview Sidebar */}
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
                    {editing.meta_title || editing.page_name || "Page Title"}
                  </p>
                  <p className="text-xs text-green-600 truncate">
                    {editing.canonical_url || `yourdomain.com${editing.page_path || "/"}`}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {editing.meta_description || "No description set. Add a meta description to improve CTR."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Preview */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-primary" /> Social Share Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-lg overflow-hidden">
                  {(editing.og_image) ? (
                    <img src={editing.og_image} alt="OG" className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-muted flex items-center justify-center text-muted-foreground text-xs">
                      No OG Image
                    </div>
                  )}
                  <div className="p-3 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {editing.canonical_url ? new URL(editing.canonical_url).hostname : "yourdomain.com"}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {editing.og_title || editing.meta_title || "Page Title"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {editing.og_description || editing.meta_description || "No description"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Score */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" /> SEO Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Meta Title", done: !!(editing.meta_title) },
                  { label: "Meta Description (120+ chars)", done: (editing.meta_description || "").length >= 120 },
                  { label: "Keywords", done: !!(editing.meta_keywords) },
                  { label: "OG Title & Description", done: !!(editing.og_title || editing.og_description) },
                  { label: "OG Image", done: !!(editing.og_image) },
                  { label: "Twitter Card", done: !!(editing.twitter_title || editing.twitter_description) },
                  { label: "Canonical URL", done: !!(editing.canonical_url) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    {item.done ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SEO Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage SEO settings for every page ({pages.length} pages configured)
          </p>
        </div>
        <Button onClick={() => openEditor()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Page SEO
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..." className="pl-9" />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Globe className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No SEO settings yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add SEO settings to improve your search rankings.</p>
            <Button onClick={() => openEditor()} className="mt-4 gap-2">
              <Plus className="w-4 h-4" /> Add First Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((page, i) => {
              const score = getSeoScore(page);
              return (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${score >= 80 ? "bg-green-500/10 text-green-500" : score >= 50 ? "bg-amber-500/10 text-amber-500" : "bg-destructive/10 text-destructive"}`}>
                          {score}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm text-foreground truncate">
                              {page.page_name || page.page_path}
                            </h3>
                            {!page.is_enabled && (
                              <Badge variant="secondary" className="text-[10px] shrink-0">
                                <EyeOff className="w-3 h-3 mr-1" /> Disabled
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{page.page_path}</p>
                          {page.meta_title && (
                            <p className="text-xs text-primary/70 truncate mt-0.5">{page.meta_title}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => openEditor(page)} className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(page)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
