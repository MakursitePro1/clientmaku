import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Plus, Trash2, Edit, Eye, Upload, FileCode, ArrowLeft, X,
  CheckCircle, AlertCircle, Code2, Palette, Tag, Globe, Copy,
  Sparkles, Layers, Zap, LayoutGrid, RotateCcw, Archive,
  Search, ExternalLink, AlertTriangle, icons as lucideIcons
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories as toolCategories } from "@/data/tools";
import { cn } from "@/lib/utils";

// Popular icons to show first
const POPULAR_ICON_NAMES = [
  "Wrench", "Code2", "Calculator", "FileText", "Image", "Globe", "Lock",
  "Palette", "Mail", "Shield", "PiggyBank", "Share2", "Zap", "Sparkles",
  "Star", "Heart", "Camera", "Music", "Video", "Database", "Cloud",
  "Map", "Clock", "Calendar", "Bookmark", "Search", "Settings", "Terminal",
  "Hash", "Link", "Key", "Cpu", "Wifi", "QrCode", "Smartphone", "Monitor",
  "Gamepad2", "Scissors", "Ruler", "Compass", "Pen", "Type", "Binary",
  "Braces", "Bug", "Cog", "Fingerprint", "Flask", "Gauge", "Gift",
  "HardDrive", "Headphones", "Layers", "LayoutGrid", "Lightbulb", "Megaphone",
  "Microscope", "Package", "Paintbrush", "Puzzle", "Rocket", "ScanLine",
  "Server", "Sigma", "Sliders", "Swords", "Target", "Thermometer", "Timer",
  "Truck", "Umbrella", "Users", "Wand2", "Workflow", "Boxes", "FileCode"
];

function getIconComponent(name: string): LucideIcon {
  return (lucideIcons as Record<string, LucideIcon>)[name] || FileCode;
}

interface CustomTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon_name: string;
  color: string;
  html_content: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

const SUPPORTED_CATEGORIES = toolCategories.filter(c => c.id !== "all");

const COLOR_PRESETS = [
  "hsl(263, 85%, 58%)", "hsl(0, 84%, 60%)", "hsl(142, 71%, 45%)",
  "hsl(199, 89%, 48%)", "hsl(280, 90%, 55%)", "hsl(45, 93%, 47%)",
  "hsl(330, 80%, 55%)", "hsl(170, 75%, 41%)", "hsl(25, 95%, 53%)",
  "hsl(210, 100%, 56%)", "hsl(340, 82%, 52%)", "hsl(120, 60%, 45%)"
];

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Custom Tool</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 24px; background: #fafbfc; color: #1a1a2e; }
    .container { max-width: 640px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700; }
    p { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    input, textarea, select { width: 100%; padding: 12px 16px; border: 2px solid #e8e8e8; border-radius: 12px; margin-bottom: 12px; font-size: 15px; transition: border-color 0.2s; outline: none; }
    input:focus, textarea:focus { border-color: #6c5ce7; }
    button { padding: 12px 28px; background: linear-gradient(135deg, #6c5ce7, #a855f7); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 15px; font-weight: 600; transition: transform 0.15s, box-shadow 0.15s; }
    button:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108, 92, 231, 0.35); }
    .result { margin-top: 20px; padding: 20px; background: white; border-radius: 12px; border: 2px solid #e8e8e8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✨ My Custom Tool</h1>
    <p>A sample tool template — customize it however you want!</p>
    <input type="text" id="input" placeholder="Type something here...">
    <button onclick="process()">⚡ Process</button>
    <div class="result" id="result" style="display:none"></div>
  </div>
  <script>
    function process() {
      const input = document.getElementById('input').value;
      const result = document.getElementById('result');
      result.style.display = 'block';
      result.innerHTML = '<strong>✅ Result:</strong> ' + (input || 'Please enter something first');
    }
  </script>
</body>
</html>`;

export default function AdminCustomTools() {
  const [tools, setTools] = useState<CustomTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit" | "preview" | "trash">("list");
  const [editingTool, setEditingTool] = useState<Partial<CustomTool>>({});
  const [previewTool, setPreviewTool] = useState<CustomTool | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "code" | "seo">("info");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; tool: CustomTool | null; permanent: boolean }>({ open: false, tool: null, permanent: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchTools(); }, []);

  const fetchTools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("custom_tools")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setTools(data as unknown as CustomTool[]);
    setLoading(false);
  };

  const activeToolsList = tools.filter(t => !t.deleted_at);
  const trashedTools = tools.filter(t => !!t.deleted_at);
  const filteredTools = activeToolsList.filter(t =>
    !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const enabledCount = activeToolsList.filter(t => t.is_enabled).length;

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const handleCreate = () => {
    setEditingTool({
      name: "", slug: "", description: "", category: "utility",
      icon_name: "Wrench", color: "hsl(263, 85%, 58%)", html_content: "", is_enabled: true
    });
    setActiveTab("info");
    setView("create");
  };

  const handleEdit = (tool: CustomTool) => {
    setEditingTool({ ...tool });
    setActiveTab("info");
    setView("edit");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["html", "htm"].includes(ext || "")) {
      toast.error("Only .html and .htm files are supported!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditingTool(prev => ({ ...prev, html_content: ev.target?.result as string }));
      toast.success(`"${file.name}" loaded successfully!`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!editingTool.name?.trim()) { toast.error("Tool name is required!"); return; }
    if (!editingTool.html_content?.trim()) { toast.error("HTML content is required!"); return; }

    const slug = editingTool.slug?.trim() || generateSlug(editingTool.name);
    setSaving(true);

    const payload = {
      name: editingTool.name!.trim(),
      slug,
      description: editingTool.description?.trim() || "",
      category: editingTool.category || "utility",
      icon_name: editingTool.icon_name || "Wrench",
      color: editingTool.color || "hsl(263, 85%, 58%)",
      html_content: editingTool.html_content!,
      is_enabled: editingTool.is_enabled ?? true,
      meta_title: editingTool.meta_title?.trim() || "",
      meta_description: editingTool.meta_description?.trim() || "",
      meta_keywords: editingTool.meta_keywords?.trim() || "",
    } as any;

    if (view === "create") {
      const { error } = await supabase.from("custom_tools").insert(payload);
      if (error) toast.error("Failed to create: " + error.message);
      else { toast.success("Custom tool created!"); setView("list"); fetchTools(); }
    } else {
      const { error } = await supabase.from("custom_tools").update(payload).eq("id", editingTool.id!);
      if (error) toast.error("Failed to update: " + error.message);
      else { toast.success("Custom tool updated!"); setView("list"); fetchTools(); }
    }
    setSaving(false);
  };

  // Soft delete → move to trash
  const handleMoveToTrash = async (tool: CustomTool) => {
    const { error } = await supabase.from("custom_tools")
      .update({ deleted_at: new Date().toISOString(), is_enabled: false } as any)
      .eq("id", tool.id);
    if (error) toast.error("Failed to move to trash");
    else { toast.success(`"${tool.name}" moved to trash`); fetchTools(); }
    setDeleteDialog({ open: false, tool: null, permanent: false });
  };

  // Permanent delete
  const handlePermanentDelete = async (tool: CustomTool) => {
    const { error } = await supabase.from("custom_tools").delete().eq("id", tool.id);
    if (error) toast.error("Failed to delete permanently");
    else { toast.success(`"${tool.name}" permanently deleted`); fetchTools(); }
    setDeleteDialog({ open: false, tool: null, permanent: false });
  };

  // Restore from trash
  const handleRestore = async (tool: CustomTool) => {
    const { error } = await supabase.from("custom_tools")
      .update({ deleted_at: null } as any)
      .eq("id", tool.id);
    if (error) toast.error("Failed to restore");
    else { toast.success(`"${tool.name}" restored!`); fetchTools(); }
  };

  // Empty entire trash
  const handleEmptyTrash = async () => {
    if (!confirm("Permanently delete ALL trashed tools? This cannot be undone!")) return;
    for (const tool of trashedTools) {
      await supabase.from("custom_tools").delete().eq("id", tool.id);
    }
    toast.success("Trash emptied!");
    fetchTools();
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("custom_tools").update({ is_enabled: !enabled }).eq("id", id);
    if (!error) { toast.success(enabled ? "Tool disabled" : "Tool enabled"); fetchTools(); }
  };

  const handleDuplicate = async (tool: CustomTool) => {
    const newSlug = `${tool.slug}-copy-${Date.now().toString(36)}`;
    const { error } = await supabase.from("custom_tools").insert({
      name: `${tool.name} (Copy)`,
      slug: newSlug,
      description: tool.description,
      category: tool.category,
      icon_name: tool.icon_name,
      color: tool.color,
      html_content: tool.html_content,
      is_enabled: false,
      meta_title: tool.meta_title,
      meta_description: tool.meta_description,
      meta_keywords: tool.meta_keywords,
    } as any);
    if (error) toast.error("Failed to duplicate");
    else { toast.success("Tool duplicated!"); fetchTools(); }
  };

  const updateField = (field: string, value: any) =>
    setEditingTool(prev => ({
      ...prev, [field]: value,
      ...(field === "name" && !prev.slug ? { slug: generateSlug(value) } : {})
    }));

  // DELETE CONFIRMATION DIALOG
  const DeleteConfirmDialog = () => (
    <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, tool: null, permanent: false })}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              deleteDialog.permanent ? "bg-destructive/10" : "bg-amber-500/10"
            )}>
              {deleteDialog.permanent
                ? <AlertTriangle className="w-6 h-6 text-destructive" />
                : <Trash2 className="w-6 h-6 text-amber-500" />
              }
            </div>
            <div>
              <DialogTitle>
                {deleteDialog.permanent ? "Permanent Delete" : "Move to Trash"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {deleteDialog.permanent
                  ? "This action cannot be undone. The tool will be permanently removed."
                  : "The tool will be moved to trash. You can restore it later."
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {deleteDialog.tool && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: deleteDialog.tool.color + "22", color: deleteDialog.tool.color }}
            >
              <FileCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{deleteDialog.tool.name}</p>
              <p className="text-xs text-muted-foreground">/tools/custom/{deleteDialog.tool.slug}</p>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setDeleteDialog({ open: false, tool: null, permanent: false })}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (!deleteDialog.tool) return;
              if (deleteDialog.permanent) handlePermanentDelete(deleteDialog.tool);
              else handleMoveToTrash(deleteDialog.tool);
            }}
          >
            {deleteDialog.permanent ? "Delete Permanently" : "Move to Trash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // PREVIEW VIEW
  if (view === "preview" && previewTool) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => { setView("list"); setPreviewTool(null); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: previewTool.color + "22", color: previewTool.color }}>
                <FileCode className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold">{previewTool.name}</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(previewTool)} className="gap-1.5">
              <Edit className="w-4 h-4" /> Edit
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`/tools/custom/${previewTool.slug}`} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                <ExternalLink className="w-4 h-4" /> Open Live
              </a>
            </Button>
          </div>
        </div>
        <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-lg" style={{ height: "75vh" }}>
          <iframe
            srcDoc={previewTool.html_content}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-forms allow-modals"
            title={previewTool.name}
          />
        </div>
      </div>
    );
  }

  // TRASH VIEW
  if (view === "trash") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setView("list")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" /> Trash
              </h2>
              <p className="text-xs text-muted-foreground">{trashedTools.length} item(s) in trash</p>
            </div>
          </div>
          {trashedTools.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleEmptyTrash} className="gap-1.5">
              <Trash2 className="w-4 h-4" /> Empty Trash
            </Button>
          )}
        </div>

        {trashedTools.length === 0 ? (
          <Card className="border-dashed border-2 border-border/60">
            <CardContent className="text-center py-16">
              <Archive className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold mb-2">Trash is Empty</h3>
              <p className="text-sm text-muted-foreground">Deleted tools will appear here for recovery.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {trashedTools.map(tool => (
              <Card key={tool.id} className="border-border/60 opacity-75 hover:opacity-100 transition-all">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 grayscale"
                        style={{ backgroundColor: tool.color + "22", color: tool.color }}
                      >
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate line-through text-muted-foreground">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Deleted {tool.deleted_at ? new Date(tool.deleted_at).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleRestore(tool)} className="gap-1.5">
                        <RotateCcw className="w-4 h-4" /> Restore
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, tool, permanent: true })}
                        className="gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Forever
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <DeleteConfirmDialog />
      </div>
    );
  }

  // CREATE / EDIT VIEW
  if (view === "create" || view === "edit") {
    const tabs = [
      { id: "info" as const, label: "Basic Info", icon: Tag },
      { id: "code" as const, label: "Tool Code", icon: Code2 },
      { id: "seo" as const, label: "SEO", icon: Globe },
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setView("list")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div>
              <h2 className="text-xl font-bold">
                {view === "create" ? "Create New Tool" : "Edit Tool"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {view === "create" ? "Build a custom HTML tool" : `Editing: ${editingTool.name}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-1.5">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {view === "create" ? "Create Tool" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Basic Info */}
        {activeTab === "info" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <Card className="border-border/60">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Tool Name *</Label>
                    <Input value={editingTool.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="e.g. JSON Beautifier" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">URL Slug *</Label>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 mb-1.5">
                      <Globe className="w-3 h-3" />
                      <code className="bg-muted px-1.5 py-0.5 rounded">/tools/custom/{editingTool.slug || "your-slug"}</code>
                    </div>
                    <Input value={editingTool.slug || ""} onChange={e => updateField("slug", e.target.value)} placeholder="json-beautifier" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Description</Label>
                    <Textarea value={editingTool.description || ""} onChange={e => updateField("description", e.target.value)} placeholder="A brief description..." rows={3} className="mt-1.5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-primary" /> Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SUPPORTED_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => updateField("category", cat.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all",
                          editingTool.category === cat.id
                            ? "bg-primary/10 text-primary border-primary/40 shadow-sm"
                            : "bg-card border-border/40 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <cat.icon className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Theme Color
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_PRESETS.map(color => (
                      <button
                        key={color}
                        onClick={() => updateField("color", color)}
                        className={cn(
                          "w-9 h-9 rounded-xl border-2 transition-all hover:scale-110",
                          editingTool.color === color ? "border-foreground scale-110 shadow-lg" : "border-transparent shadow-sm"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Input value={editingTool.color || ""} onChange={e => updateField("color", e.target.value)} placeholder="hsl(263, 85%, 58%)" />
                  {editingTool.color && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="w-12 h-12 rounded-xl shadow-sm" style={{ backgroundColor: editingTool.color }} />
                      <div>
                        <p className="text-xs font-medium">Preview</p>
                        <p className="text-xs text-muted-foreground">{editingTool.color}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-semibold">Enabled</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Tool will be visible to users</p>
                    </div>
                    <Switch checked={editingTool.is_enabled ?? true} onCheckedChange={v => updateField("is_enabled", v)} />
                  </div>
                </CardContent>
              </Card>

              {editingTool.name && (
                <Card className="border-border/60 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-muted-foreground">Card Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: (editingTool.color || "hsl(263,85%,58%)") + "22", color: editingTool.color || "hsl(263,85%,58%)" }}>
                        <FileCode className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{editingTool.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{editingTool.description || "No description"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Tab: Code */}
        {activeTab === "code" && (
          <div className="space-y-5">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-primary" /> HTML Code
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <input ref={fileInputRef} type="file" accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
                      <Upload className="w-4 h-4" /> Upload File
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => updateField("html_content", SAMPLE_HTML)} className="gap-1.5">
                      <Sparkles className="w-4 h-4" /> Sample Template
                    </Button>
                    {editingTool.html_content && (
                      <Button variant="outline" size="sm" onClick={() => updateField("html_content", "")} className="gap-1.5 text-destructive hover:text-destructive">
                        <X className="w-4 h-4" /> Clear
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!editingTool.html_content ? (
                  <div
                    className="border-2 border-dashed border-border/60 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-primary", "bg-primary/5"); }}
                    onDragLeave={e => { e.currentTarget.classList.remove("border-primary", "bg-primary/5"); }}
                    onDrop={e => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-primary", "bg-primary/5");
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        const input = fileInputRef.current;
                        if (input) {
                          const dt = new DataTransfer();
                          dt.items.add(file);
                          input.files = dt.files;
                          input.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                      }
                    }}
                  >
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                    <p className="text-sm font-semibold mb-1">Drop your HTML file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse • .html / .htm up to 5MB</p>
                  </div>
                ) : (
                  <>
                    <Textarea
                      value={editingTool.html_content}
                      onChange={e => updateField("html_content", e.target.value)}
                      placeholder="Paste your HTML code here..."
                      className="font-mono text-xs min-h-[400px] bg-muted/30 border-border/40"
                      spellCheck={false}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Size: {(new Blob([editingTool.html_content]).size / 1024).toFixed(1)} KB</span>
                      <span>{editingTool.html_content.split("\n").length} lines</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {editingTool.html_content && (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" /> Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm" style={{ height: "400px" }}>
                    <iframe srcDoc={editingTool.html_content} className="w-full h-full border-0" sandbox="allow-scripts allow-forms allow-modals" title="Preview" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Tab: SEO */}
        {activeTab === "seo" && (
          <div className="space-y-5">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Search Engine Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="text-sm font-semibold">Meta Title</Label>
                  <Input value={editingTool.meta_title || ""} onChange={e => updateField("meta_title", e.target.value)} placeholder="Custom meta title (leave empty to use tool name)" className="mt-1.5" />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
                    <p className={cn("text-xs", (editingTool.meta_title || "").length > 60 ? "text-destructive" : "text-muted-foreground")}>
                      {(editingTool.meta_title || "").length}/60
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Meta Description</Label>
                  <Textarea value={editingTool.meta_description || ""} onChange={e => updateField("meta_description", e.target.value)} placeholder="Custom meta description for search engines..." rows={3} className="mt-1.5" />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-muted-foreground">Recommended: 120-160 characters</p>
                    <p className={cn("text-xs", (editingTool.meta_description || "").length > 160 ? "text-destructive" : "text-muted-foreground")}>
                      {(editingTool.meta_description || "").length}/160
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Meta Keywords</Label>
                  <Input value={editingTool.meta_keywords || ""} onChange={e => updateField("meta_keywords", e.target.value)} placeholder="keyword1, keyword2, keyword3" className="mt-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">Separate keywords with commas</p>
                </div>
              </CardContent>
            </Card>

            {/* SEO Score & Preview */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">🔍 Google Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 p-3 rounded-xl bg-white border border-border/40">
                    <p className="text-[#1a0dab] text-sm font-medium truncate">
                      {editingTool.meta_title || editingTool.name || "Tool Title"}
                    </p>
                    <p className="text-[#006621] text-xs truncate">
                      yoursite.com › tools › custom › {editingTool.slug || "your-slug"}
                    </p>
                    <p className="text-xs text-[#545454] line-clamp-2">
                      {editingTool.meta_description || editingTool.description || "Tool description will appear here..."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">📊 SEO Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { label: "Meta Title", ok: !!(editingTool.meta_title || editingTool.name), warn: (editingTool.meta_title || "").length > 60 },
                      { label: "Meta Description", ok: (editingTool.meta_description || "").length >= 50, warn: (editingTool.meta_description || "").length > 160 },
                      { label: "Keywords", ok: !!(editingTool.meta_keywords), warn: false },
                      { label: "URL Slug", ok: !!(editingTool.slug), warn: (editingTool.slug || "").includes(" ") },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2 text-xs">
                        {item.warn ? (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : item.ok ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={item.ok ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
      <DeleteConfirmDialog />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Custom Tools
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeToolsList.length} tools • {enabledCount} active
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setView("trash")} className="gap-1.5 relative">
            <Trash2 className="w-4 h-4" /> Trash
            {trashedTools.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                {trashedTools.length}
              </span>
            )}
          </Button>
          <Button onClick={handleCreate} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Tool
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: activeToolsList.length, icon: Layers, color: "text-primary" },
          { label: "Active", value: enabledCount, icon: Zap, color: "text-green-500" },
          { label: "Disabled", value: activeToolsList.length - enabledCount, icon: AlertCircle, color: "text-muted-foreground" },
          { label: "In Trash", value: trashedTools.length, icon: Trash2, color: "text-destructive" },
        ].map(stat => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      {activeToolsList.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tools by name or slug..."
            className="pl-9"
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading tools...</p>
        </div>
      ) : activeToolsList.length === 0 ? (
        <Card className="border-dashed border-2 border-border/60">
          <CardContent className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <FileCode className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Custom Tools Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first custom tool by uploading an HTML file or writing code directly.
            </p>
            <Button onClick={handleCreate} size="lg" className="gap-2">
              <Plus className="w-4 h-4" /> Create Your First Tool
            </Button>
          </CardContent>
        </Card>
      ) : filteredTools.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="text-center py-12">
            <Search className="w-8 h-8 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No tools match "{searchQuery}"</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredTools.map(tool => (
            <Card key={tool.id} className={cn(
              "border-border/60 overflow-hidden transition-all hover:shadow-md",
              !tool.is_enabled && "opacity-60"
            )}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: tool.color + "22", color: tool.color }}
                    >
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                        <Badge
                          variant={tool.is_enabled ? "default" : "secondary"}
                          className={cn("text-[10px] shrink-0", tool.is_enabled ? "bg-green-500/10 text-green-600 border-green-500/20" : "")}
                        >
                          {tool.is_enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-xs text-muted-foreground">/tools/custom/{tool.slug}</code>
                        <Badge variant="outline" className="text-[10px]">{tool.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Switch checked={tool.is_enabled} onCheckedChange={() => handleToggle(tool.id, tool.is_enabled)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setPreviewTool(tool); setView("preview"); }} title="Preview">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(tool)} title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicate(tool)} title="Duplicate">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteDialog({ open: true, tool, permanent: false })}
                      title="Move to Trash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
