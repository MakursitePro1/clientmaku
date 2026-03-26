import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Globe, FileText, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  footer_text: string;
}

const defaultSettings: SiteSettings = {
  site_name: "Makur Web Tools",
  site_description: "Free online tools for everyone",
  contact_email: "contact@makursite.com",
  contact_phone: "+880 1754-839834",
  hero_title: "",
  hero_subtitle: "",
  about_text: "",
  footer_text: "",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value");
      if (data) {
        const loaded = { ...defaultSettings };
        data.forEach((row: any) => {
          if (row.key in loaded) {
            (loaded as any)[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          }
        });
        setSettings(loaded);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await supabase
        .from("site_settings")
        .upsert(
          { key, value: JSON.stringify(value), updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
    }
    setSaving(false);
    toast({ title: "Saved!", description: "Site settings updated successfully." });
  };

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const settingSections = [
    {
      title: "General",
      icon: Globe,
      fields: [
        { key: "site_name" as const, label: "Site Name", type: "input" },
        { key: "site_description" as const, label: "Site Description", type: "input" },
      ],
    },
    {
      title: "Contact",
      icon: MessageCircle,
      fields: [
        { key: "contact_email" as const, label: "Contact Email", type: "input" },
        { key: "contact_phone" as const, label: "Contact Phone", type: "input" },
      ],
    },
    {
      title: "Content",
      icon: FileText,
      fields: [
        { key: "hero_title" as const, label: "Hero Title", type: "input" },
        { key: "hero_subtitle" as const, label: "Hero Subtitle", type: "input" },
        { key: "about_text" as const, label: "About Section Text", type: "textarea" },
        { key: "footer_text" as const, label: "Footer Text", type: "input" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your website content and configuration</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {settingSections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <section.icon className="w-4 h-4 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{field.label}</label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={settings[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <Input
                      value={settings[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
