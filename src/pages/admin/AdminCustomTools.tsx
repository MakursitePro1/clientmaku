import { useState, useEffect, useRef } from "react";
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
  Plus, Trash2, Edit, Eye, Upload, FileCode, Info, ArrowLeft, X,
  CheckCircle, AlertCircle, Code2, Palette, Tag, FileText, Globe
} from "lucide-react";
import { categories as toolCategories } from "@/data/tools";
import { cn } from "@/lib/utils";

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
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

const SUPPORTED_CATEGORIES = toolCategories.filter(c => c.id !== "all");

const ICON_OPTIONS = [
  "Wrench", "Code2", "Calculator", "FileText", "Image", "Globe", "Lock",
  "Palette", "Mail", "Gamepad2", "Shield", "PiggyBank", "Share2", "Zap",
  "Sparkles", "Star", "Heart", "Camera", "Music", "Video", "Database",
  "Cloud", "Map", "Clock", "Calendar", "Bookmark", "Search", "Settings"
];

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
    body { font-family: system-ui, sans-serif; padding: 20px; background: transparent; color: #1a1a2e; }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px; font-size: 14px; }
    button { padding: 10px 20px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
    button:hover { background: #5a4bd1; }
    .result { margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>My Custom Tool</h1>
    <p>Write your tool logic here...</p>
    <input type="text" id="input" placeholder="Enter something...">
    <button onclick="process()">Process</button>
    <div class="result" id="result"></div>
  </div>
  <script>
    function process() {
      const input = document.getElementById('input').value;
      document.getElementById('result').innerHTML = '<strong>Result:</strong> ' + input;
    }
  </script>
</body>
</html>`;

export default function AdminCustomTools() {
  const [tools, setTools] = useState<CustomTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit" | "preview">("list");
  const [editingTool, setEditingTool] = useState<Partial<CustomTool>>({});
  const [previewTool, setPreviewTool] = useState<CustomTool | null>(null);
  const [saving, setSaving] = useState(false);
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

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const handleCreate = () => {
    setEditingTool({
      name: "", slug: "", description: "", category: "utility",
      icon_name: "Wrench", color: "hsl(263, 85%, 58%)", html_content: "", is_enabled: true
    });
    setView("create");
  };

  const handleEdit = (tool: CustomTool) => {
    setEditingTool({ ...tool });
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
      toast.success(`File "${file.name}" loaded successfully!`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!editingTool.name?.trim()) { toast.error("Tool name is required!"); return; }
    if (!editingTool.html_content?.trim()) { toast.error("HTML content is required!"); return; }

    const slug = editingTool.slug?.trim() || generateSlug(editingTool.name);
    setSaving(true);

    if (view === "create") {
      const { error } = await supabase.from("custom_tools").insert({
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
      } as any);
      if (error) toast.error("Failed to create: " + error.message);
      else { toast.success("Custom tool created!"); setView("list"); fetchTools(); }
    } else {
      const { error } = await supabase.from("custom_tools")
        .update({
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
        } as any)
        .eq("id", editingTool.id!);
      if (error) toast.error("Failed to update: " + error.message);
      else { toast.success("Custom tool updated!"); setView("list"); fetchTools(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    const { error } = await supabase.from("custom_tools").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Tool deleted permanently!"); fetchTools(); }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("custom_tools").update({ is_enabled: !enabled }).eq("id", id);
    if (!error) { toast.success(enabled ? "Tool disabled" : "Tool enabled"); fetchTools(); }
  };

  const updateField = (field: string, value: any) =>
    setEditingTool(prev => ({
      ...prev, [field]: value,
      ...(field === "name" && !prev.slug ? { slug: generateSlug(value) } : {})
    }));

  // PREVIEW VIEW
  if (view === "preview" && previewTool) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => { setView("list"); setPreviewTool(null); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-lg font-bold">Preview: {previewTool.name}</h2>
        </div>
        <div className="border border-border rounded-xl overflow-hidden bg-white" style={{ height: "70vh" }}>
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

  // CREATE / EDIT VIEW
  if (view === "create" || view === "edit") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setView("list")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold">
            {view === "create" ? "Create New Custom Tool" : "Edit Custom Tool"}
          </h2>
        </div>

        {/* Guidelines */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> Upload Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Supported Files
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li><code>.html</code> / <code>.htm</code> — Single HTML file with embedded CSS & JS</li>
                  <li>Maximum file size: <strong>5MB</strong></li>
                  <li>All CSS should be inside <code>&lt;style&gt;</code> tags</li>
                  <li>All JavaScript should be inside <code>&lt;script&gt;</code> tags</li>
                </ul>
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" /> Not Supported
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li><code>.tsx</code>, <code>.jsx</code>, <code>.vue</code> — React/Vue components</li>
                  <li>Separate CSS/JS files (must be inline)</li>
                  <li>External dependencies requiring npm install</li>
                  <li>Server-side code (PHP, Python, Node.js)</li>
                </ul>
              </div>
            </div>
            <div className="pt-2 border-t border-primary/10">
              <p className="font-semibold text-foreground text-xs mb-1">📝 How to create a tool:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-xs">
                <li>Create a single <code>.html</code> file with your tool's HTML, CSS, and JavaScript</li>
                <li>Use <code>&lt;style&gt;</code> for styling and <code>&lt;script&gt;</code> for logic</li>
                <li>Upload the file or paste the code directly in the editor below</li>
                <li>Fill in the tool name, description, category, and color</li>
                <li>Preview to verify it works, then save</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Basic Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tool Name *</Label>
                  <Input value={editingTool.name || ""} onChange={e => updateField("name", e.target.value)} placeholder="e.g. JSON Beautifier" />
                </div>
                <div>
                  <Label>Slug (URL path) *</Label>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Globe className="w-3 h-3" /> /tools/custom/{editingTool.slug || "your-slug"}
                  </div>
                  <Input value={editingTool.slug || ""} onChange={e => updateField("slug", e.target.value)} placeholder="json-beautifier" />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea value={editingTool.description || ""} onChange={e => updateField("description", e.target.value)} placeholder="A brief description of what this tool does..." rows={3} />
                </div>
                <div>
                  <Label>Category *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                    {SUPPORTED_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => updateField("category", cat.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                          editingTool.category === cat.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:border-primary/40"
                        )}
                      >
                        <cat.icon className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COLOR_PRESETS.map(color => (
                      <button
                        key={color}
                        onClick={() => updateField("color", color)}
                        className={cn(
                          "w-8 h-8 rounded-lg border-2 transition-all",
                          editingTool.color === color ? "border-foreground scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Input value={editingTool.color || ""} onChange={e => updateField("color", e.target.value)} placeholder="hsl(263, 85%, 58%)" className="mt-2" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enabled</Label>
                  <Switch checked={editingTool.is_enabled ?? true} onCheckedChange={v => updateField("is_enabled", v)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Code */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileCode className="w-4 h-4" /> Tool Code (HTML)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <input ref={fileInputRef} type="file" accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" /> Upload HTML File
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => updateField("html_content", SAMPLE_HTML)}>
                    <Code2 className="w-4 h-4 mr-1" /> Load Sample
                  </Button>
                  {editingTool.html_content && (
                    <Button variant="outline" size="sm" onClick={() => updateField("html_content", "")}>
                      <X className="w-4 h-4 mr-1" /> Clear
                    </Button>
                  )}
                </div>
                <Textarea
                  value={editingTool.html_content || ""}
                  onChange={e => updateField("html_content", e.target.value)}
                  placeholder="Paste your HTML code here or upload a file..."
                  className="font-mono text-xs min-h-[300px]"
                  spellCheck={false}
                />
                {editingTool.html_content && (
                  <p className="text-xs text-muted-foreground">
                    Size: {(new Blob([editingTool.html_content]).size / 1024).toFixed(1)} KB
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Inline Preview */}
            {editingTool.html_content && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border border-border rounded-lg overflow-hidden bg-white" style={{ height: "300px" }}>
                    <iframe
                      srcDoc={editingTool.html_content}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-forms allow-modals"
                      title="Preview"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : view === "create" ? "Create Tool" : "Update Tool"}
          </Button>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Custom Tools</h1>
          <p className="text-sm text-muted-foreground">Upload and manage custom HTML tools</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Custom Tool
        </Button>
      </div>

      {/* Guidelines Card */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="pt-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" /> Quick Guide
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Create a <strong>single HTML file</strong> with embedded CSS and JavaScript</li>
            <li>Upload the file or paste code directly into the editor</li>
            <li>Custom tools appear at <code>/tools/custom/your-slug</code> and in the tools grid</li>
            <li>Supported: <code>.html</code>, <code>.htm</code> files up to 5MB</li>
            <li>Tools run in a sandboxed iframe for security</li>
          </ul>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : tools.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <FileCode className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg font-semibold text-muted-foreground mb-2">No Custom Tools Yet</p>
            <p className="text-sm text-muted-foreground/70 mb-6">Create your first custom tool by uploading an HTML file</p>
            <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" /> Create First Tool</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tools.map(tool => (
            <Card key={tool.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: tool.color + "22", color: tool.color }}
                    >
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">/tools/custom/{tool.slug}</p>
                    </div>
                    <Badge variant={tool.is_enabled ? "default" : "secondary"} className="shrink-0 text-[10px]">
                      {tool.is_enabled ? "Active" : "Disabled"}
                    </Badge>
                    <Badge variant="outline" className="shrink-0 text-[10px]">{tool.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={tool.is_enabled} onCheckedChange={() => handleToggle(tool.id, tool.is_enabled)} />
                    <Button variant="outline" size="sm" onClick={() => { setPreviewTool(tool); setView("preview"); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tool)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(tool.id, tool.name)}>
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
