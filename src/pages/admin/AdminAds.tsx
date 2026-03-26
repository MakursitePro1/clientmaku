import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, Trash2, Save, Monitor, Smartphone, Eye, EyeOff,
  ArrowUp, ArrowDown, Megaphone, Code, LayoutTemplate
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdSlot {
  id: string;
  name: string;
  placement: string;
  ad_code: string;
  is_enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const PLACEMENTS = [
  { value: "before_tool", label: "Before Tool Content", description: "Shows above the tool" },
  { value: "after_tool", label: "After Tool Content", description: "Shows below the tool" },
  { value: "sidebar_top", label: "Before Related Tools", description: "Shows above related tools section" },
  { value: "in_content", label: "Inside Tool Card (Bottom)", description: "Shows at the bottom inside tool card" },
];

export default function AdminAds() {
  const [ads, setAds] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<AdSlot | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [formName, setFormName] = useState("");
  const [formPlacement, setFormPlacement] = useState("before_tool");
  const [formCode, setFormCode] = useState("");
  const [formEnabled, setFormEnabled] = useState(true);
  const [formOrder, setFormOrder] = useState(0);

  const fetchAds = async () => {
    const { data } = await supabase
      .from("ad_slots")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setAds(data as AdSlot[]);
    setLoading(false);
  };

  useEffect(() => { fetchAds(); }, []);

  const resetForm = () => {
    setFormName("");
    setFormPlacement("before_tool");
    setFormCode("");
    setFormEnabled(true);
    setFormOrder(ads.length);
    setEditingAd(null);
    setShowForm(false);
  };

  const openEditForm = (ad: AdSlot) => {
    setFormName(ad.name);
    setFormPlacement(ad.placement);
    setFormCode(ad.ad_code);
    setFormEnabled(ad.is_enabled);
    setFormOrder(ad.display_order);
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formCode.trim()) {
      toast({ title: "Error", description: "Name and Ad Code are required.", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload = {
      name: formName.trim(),
      placement: formPlacement,
      ad_code: formCode,
      is_enabled: formEnabled,
      display_order: formOrder,
      updated_by: user?.id,
    };

    if (editingAd) {
      await supabase.from("ad_slots").update(payload).eq("id", editingAd.id);
      toast({ title: "✅ Updated!", description: `Ad "${formName}" updated successfully.` });
    } else {
      await supabase.from("ad_slots").insert(payload);
      toast({ title: "✅ Created!", description: `Ad "${formName}" created successfully.` });
    }

    setSaving(false);
    resetForm();
    fetchAds();
  };

  const handleDelete = async (ad: AdSlot) => {
    if (!confirm(`Delete ad "${ad.name}"?`)) return;
    await supabase.from("ad_slots").delete().eq("id", ad.id);
    toast({ title: "🗑️ Deleted!", description: `Ad "${ad.name}" removed.` });
    fetchAds();
  };

  const toggleEnabled = async (ad: AdSlot) => {
    await supabase.from("ad_slots").update({ is_enabled: !ad.is_enabled }).eq("id", ad.id);
    fetchAds();
  };

  const getPlacementLabel = (val: string) => PLACEMENTS.find(p => p.value === val)?.label || val;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            Ad Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage advertisements displayed on tool pages ({ads.length} total)
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add New Ad
        </Button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-primary/30 shadow-lg shadow-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  {editingAd ? "Edit Ad Slot" : "Create New Ad Slot"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Ad Name</label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Google AdSense Banner, Custom Banner"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Placement</label>
                    <Select value={formPlacement} onValueChange={setFormPlacement}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLACEMENTS.map(p => (
                          <SelectItem key={p.value} value={p.value}>
                            <div>
                              <div className="font-medium">{p.label}</div>
                              <div className="text-xs text-muted-foreground">{p.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-muted-foreground" />
                    Ad Code (HTML/JavaScript)
                  </label>
                  <Textarea
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder={`Paste your ad code here...\n\nExamples:\n• Google AdSense script tag\n• Custom HTML banner\n• Any ad network code`}
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports HTML, JavaScript, and iframe-based ads from any ad network.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Display Order</label>
                    <Input
                      type="number"
                      value={formOrder}
                      onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch checked={formEnabled} onCheckedChange={setFormEnabled} />
                    <span className="text-sm font-medium">{formEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : editingAd ? "Update Ad" : "Create Ad"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ads List */}
      {ads.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-1">No Ads Yet</h3>
            <p className="text-sm text-muted-foreground/70 mb-4">Create your first ad slot to start monetizing.</p>
            <Button onClick={() => { resetForm(); setShowForm(true); }} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Create First Ad
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ads.map((ad, i) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`border-border/50 transition-all ${!ad.is_enabled ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm truncate">{ad.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ad.is_enabled ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                          {ad.is_enabled ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <LayoutTemplate className="w-3 h-3" />
                          {getPlacementLabel(ad.placement)}
                        </span>
                        <span>Order: {ad.display_order}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewId(previewId === ad.id ? null : ad.id)}
                        title="Preview"
                      >
                        {previewId === ad.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Switch
                        checked={ad.is_enabled}
                        onCheckedChange={() => toggleEnabled(ad)}
                      />
                      <Button variant="outline" size="sm" onClick={() => openEditForm(ad)} className="h-8 text-xs">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(ad)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Preview */}
                  <AnimatePresence>
                    {previewId === ad.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Ad Code Preview:</p>
                          <pre className="bg-muted/50 rounded-lg p-3 text-xs font-mono overflow-x-auto max-h-40 whitespace-pre-wrap break-all">
                            {ad.ad_code}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <Card className="border-border/30 bg-muted/30">
        <CardContent className="p-4">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" /> How Ads Work
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
            <li><strong>Before Tool Content</strong> — Ad appears above the tool on every tool page</li>
            <li><strong>After Tool Content</strong> — Ad appears below the tool content area</li>
            <li><strong>Before Related Tools</strong> — Ad appears above the "Similar Tools" section</li>
            <li><strong>Inside Tool Card (Bottom)</strong> — Ad appears inside the tool card at the bottom</li>
            <li>Supports <strong>Google AdSense</strong>, <strong>Media.net</strong>, <strong>PropellerAds</strong>, or any custom HTML/JS ads</li>
            <li>All ads are <strong>responsive</strong> and adapt to screen size automatically</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
