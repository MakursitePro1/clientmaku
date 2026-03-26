import { useState, useEffect, useMemo } from "react";
import { tools, categories, type Tool } from "@/data/tools";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Filter, Wrench, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ToolSetting {
  tool_id: string;
  is_enabled: boolean;
  is_featured: boolean;
}

export default function AdminTools() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toolSettings, setToolSettings] = useState<Record<string, ToolSetting>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("tool_settings").select("tool_id, is_enabled, is_featured");
      if (data) {
        const map: Record<string, ToolSetting> = {};
        data.forEach((s: any) => { map[s.tool_id] = s; });
        setToolSettings(map);
      }
    };
    fetchSettings();
  }, []);

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

  const toggleSetting = async (toolId: string, field: "is_enabled" | "is_featured") => {
    setSaving(toolId);
    const current = toolSettings[toolId] || { tool_id: toolId, is_enabled: true, is_featured: false };
    const newValue = !current[field];
    const updated = { ...current, [field]: newValue };

    const { error } = await supabase
      .from("tool_settings")
      .upsert({ tool_id: toolId, [field]: newValue, updated_at: new Date().toISOString() }, { onConflict: "tool_id" });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setToolSettings((prev) => ({ ...prev, [toolId]: updated }));
      toast({ title: "Updated", description: `${field === "is_enabled" ? "Visibility" : "Featured"} toggled for tool.` });
    }
    setSaving(null);
  };

  const enabledCount = tools.filter((t) => isEnabled(t.id)).length;
  const featuredCount = tools.filter((t) => isFeatured(t.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tools Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {enabledCount} enabled · {featuredCount} featured · {tools.length} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: tool.color }}
                  >
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-foreground truncate">{tool.name}</h3>
                      <Badge variant="secondary" className="text-[10px] shrink-0">{tool.category}</Badge>
                      {isFeatured(tool.id) && (
                        <Badge className="text-[10px] bg-amber-500/10 text-amber-600 shrink-0">
                          <Star className="w-2.5 h-2.5 mr-0.5" /> Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">Featured</span>
                      <Switch
                        checked={isFeatured(tool.id)}
                        onCheckedChange={() => toggleSetting(tool.id, "is_featured")}
                        disabled={saving === tool.id}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">Enabled</span>
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
