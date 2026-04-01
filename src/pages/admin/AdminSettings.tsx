import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Save, Globe, FileText, MessageCircle, Layout,
  ExternalLink, Type, Mail, Phone, MapPin, Facebook, Twitter,
  Instagram, Youtube, Linkedin, Github, Star, Megaphone, Key, Link2
} from "lucide-react";
import { motion } from "framer-motion";
import { ImageUploadField } from "@/components/ImageUploadField";

interface SiteSettings {
  // General
  site_name: string;
  site_tagline: string;
  site_description: string;
  site_logo_url: string;
  favicon_url: string;
  // Contact
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_form_email: string;
  // Hero Section
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta_text: string;
  hero_cta_link: string;
  // About Section
  about_title: string;
  about_text: string;
  about_mission: string;
  // Footer
  footer_text: string;
  footer_copyright: string;
  // Social Links
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  social_youtube: string;
  social_linkedin: string;
  social_github: string;
  // SEO
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_image: string;
  // Navbar
  navbar_brand_text: string;
  navbar_brand_accent: string;
  // Stats
  stats_tools_count: string;
  stats_users_count: string;
  stats_categories_count: string;
  // Announcements
  announcement_text: string;
  announcement_enabled: string;
  // Admin
  admin_slug: string;
}

const defaultSettings: SiteSettings = {
  site_name: "Cyber Venom",
  site_tagline: "Free Online Web Tools",
  site_description: "Your ultimate collection of free online web tools",
  site_logo_url: "",
  favicon_url: "",
  contact_email: "contact@cybervenom.com",
  contact_phone: "+880 1754-839834",
  contact_address: "",
  contact_form_email: "",
  hero_title: "Your Ultimate Collection",
  hero_subtitle: "Web Tools",
  hero_description: "Image editors, code testers, converters, generators — all in one place. Completely free, no signup required.",
  hero_cta_text: "Explore Tools",
  hero_cta_link: "/tools",
  about_title: "About Us",
  about_text: "",
  about_mission: "",
  footer_text: "",
  footer_copyright: "© 2024 Cyber Venom. All rights reserved.",
  social_facebook: "",
  social_twitter: "",
  social_instagram: "",
  social_youtube: "",
  social_linkedin: "",
  social_github: "",
  seo_title: "Cyber Venom — Free Online Web Tools",
  seo_description: "210+ free online tools for developers, designers, and everyone.",
  seo_keywords: "web tools, online tools, free tools, developer tools",
  seo_og_image: "",
  navbar_brand_text: "Cyber",
  navbar_brand_accent: "Venom",
  stats_tools_count: "210+",
  stats_users_count: "200K+",
  stats_categories_count: "12",
  announcement_text: "",
  announcement_enabled: "false",
  admin_slug: "makuadmingowebs99",
};

type SettingField = {
  key: keyof SiteSettings;
  label: string;
  type: "input" | "textarea" | "url" | "image";
  placeholder?: string;
  icon?: any;
};

type SettingSection = {
  title: string;
  icon: any;
  description: string;
  fields: SettingField[];
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (data) {
        const loaded = { ...defaultSettings };
        data.forEach((row: any) => {
          if (row.key in loaded) {
            const val = row.value;
            (loaded as any)[row.key] = typeof val === "string" ? val : (val !== null ? String(val) : "");
          }
        });
        setSettings(loaded);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("site_settings")
        .upsert(
          { key, value: value as any, updated_at: new Date().toISOString(), updated_by: user?.id },
          { onConflict: "key" }
        );
    }
    setSaving(false);
    toast({ title: "✅ Saved!", description: "All settings have been updated successfully." });
  };

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "hero", label: "Hero", icon: Layout },
    { id: "content", label: "Content", icon: FileText },
    { id: "contact", label: "Contact", icon: MessageCircle },
    { id: "social", label: "Social", icon: ExternalLink },
    { id: "seo", label: "SEO", icon: Megaphone },
    { id: "navbar", label: "Navbar", icon: Type },
    { id: "admin", label: "Admin", icon: Key },
  ];

  const sections: Record<string, SettingSection[]> = {
    general: [
      {
        title: "Site Identity",
        icon: Globe,
        description: "Core website information",
        fields: [
          { key: "site_name", label: "Site Name", type: "input", placeholder: "Cyber Venom" },
          { key: "site_tagline", label: "Tagline", type: "input", placeholder: "Free Online Web Tools" },
          { key: "site_description", label: "Site Description", type: "textarea", placeholder: "Describe your website..." },
          { key: "site_logo_url", label: "Logo Image", type: "image", placeholder: "Upload or paste URL..." },
          { key: "favicon_url", label: "Favicon Image", type: "image", placeholder: "Upload or paste URL..." },
        ],
      },
      {
        title: "Stats Display",
        icon: Star,
        description: "Statistics shown on homepage",
        fields: [
          { key: "stats_tools_count", label: "Total Tools Text", type: "input", placeholder: "210+" },
          { key: "stats_users_count", label: "Happy Users Text", type: "input", placeholder: "200K+" },
          { key: "stats_categories_count", label: "Categories Count", type: "input", placeholder: "12" },
        ],
      },
      {
        title: "Announcement Banner",
        icon: Megaphone,
        description: "Display a banner notice on the website",
        fields: [
          { key: "announcement_text", label: "Announcement Text", type: "input", placeholder: "Important notice..." },
          { key: "announcement_enabled", label: "Enabled (true/false)", type: "input", placeholder: "false" },
        ],
      },
    ],
    hero: [
      {
        title: "Hero Section",
        icon: Layout,
        description: "Customize the homepage hero section",
        fields: [
          { key: "hero_title", label: "Hero Title", type: "input", placeholder: "Your Ultimate Collection" },
          { key: "hero_subtitle", label: "Hero Subtitle (Animated)", type: "input", placeholder: "Web Tools" },
          { key: "hero_description", label: "Hero Description", type: "textarea", placeholder: "Description text..." },
          { key: "hero_cta_text", label: "CTA Button Text", type: "input", placeholder: "Explore Tools" },
          { key: "hero_cta_link", label: "CTA Button Link", type: "input", placeholder: "/tools" },
        ],
      },
    ],
    content: [
      {
        title: "About Section",
        icon: FileText,
        description: "About page content",
        fields: [
          { key: "about_title", label: "About Title", type: "input", placeholder: "About Us" },
          { key: "about_text", label: "About Description", type: "textarea", placeholder: "About your website..." },
          { key: "about_mission", label: "Mission Statement", type: "textarea", placeholder: "Our mission..." },
        ],
      },
      {
        title: "Footer",
        icon: FileText,
        description: "Customize the footer area",
        fields: [
          { key: "footer_text", label: "Footer Description", type: "textarea", placeholder: "Footer text..." },
          { key: "footer_copyright", label: "Copyright Text", type: "input", placeholder: "© 2024 Cyber Venom" },
        ],
      },
    ],
    contact: [
      {
        title: "Contact Information",
        icon: MessageCircle,
        description: "Contact details for the website",
        fields: [
          { key: "contact_email", label: "Contact Email", type: "input", placeholder: "contact@cybervenom.com", icon: Mail },
          { key: "contact_phone", label: "Phone Number", type: "input", placeholder: "+880...", icon: Phone },
          { key: "contact_address", label: "Address", type: "textarea", placeholder: "Your address...", icon: MapPin },
          { key: "contact_form_email", label: "Form Submission Email", type: "input", placeholder: "forms@cybervenom.com", icon: Mail },
        ],
      },
    ],
    social: [
      {
        title: "Social Media Links",
        icon: ExternalLink,
        description: "Set up your social media links",
        fields: [
          { key: "social_facebook", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/...", icon: Facebook },
          { key: "social_twitter", label: "Twitter/X URL", type: "url", placeholder: "https://x.com/...", icon: Twitter },
          { key: "social_instagram", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/...", icon: Instagram },
          { key: "social_youtube", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/...", icon: Youtube },
          { key: "social_linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/...", icon: Linkedin },
          { key: "social_github", label: "GitHub URL", type: "url", placeholder: "https://github.com/...", icon: Github },
        ],
      },
    ],
    seo: [
      {
        title: "SEO Settings",
        icon: Megaphone,
        description: "Search engine optimization settings",
        fields: [
          { key: "seo_title", label: "Meta Title", type: "input", placeholder: "Page Title" },
          { key: "seo_description", label: "Meta Description", type: "textarea", placeholder: "Description shown in search engines..." },
          { key: "seo_keywords", label: "Keywords (comma separated)", type: "input", placeholder: "web tools, online tools..." },
          { key: "seo_og_image", label: "OG Image", type: "image", placeholder: "Upload or paste URL..." },
        ],
      },
    ],
    navbar: [
      {
        title: "Navbar Branding",
        icon: Type,
        description: "Customize the navbar branding",
        fields: [
          { key: "navbar_brand_text", label: "Brand Text (Part 1)", type: "input", placeholder: "Cyber" },
          { key: "navbar_brand_accent", label: "Brand Accent (Part 2)", type: "input", placeholder: "Venom" },
        ],
      },
    ],
    admin: [
      {
        title: "Admin Panel URL",
        icon: Link2,
        description: "Change the admin panel URL slug. After saving, use the new URL to access admin.",
        fields: [
          { key: "admin_slug", label: "Admin URL Slug", type: "input", placeholder: "makuadmingowebs99" },
        ],
      },
    ],
  };

  const renderField = (field: SettingField) => (
    <div key={field.key} className="space-y-1.5">
      {field.type === "image" ? (
        <ImageUploadField
          label={field.label}
          value={settings[field.key]}
          onChange={(url) => updateField(field.key, url)}
          placeholder={field.placeholder}
        />
      ) : (
        <>
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            {field.icon && <field.icon className="w-3.5 h-3.5 text-muted-foreground" />}
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <Textarea
              value={settings[field.key]}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="resize-none"
            />
          ) : (
            <Input
              value={settings[field.key]}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              type={field.type === "url" ? "url" : "text"}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Manage all website settings from here</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 shrink-0 w-full sm:w-auto">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(sections).map(([tabId, secs]) => (
          <TabsContent key={tabId} value={tabId} className="space-y-4 mt-4">
            {secs.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <section.icon className="w-4 h-4 text-primary" />
                      {section.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map(renderField)}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
