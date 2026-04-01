import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Save, Globe, Code, FileText, Search, CheckCircle, ExternalLink,
  Copy, AlertTriangle, Zap
} from "lucide-react";
import { motion } from "framer-motion";

interface CodeInjection {
  head_code: string;
  footer_code: string;
  custom_css: string;
  custom_js: string;
  google_verification: string;
  bing_verification: string;
  yandex_verification: string;
  pinterest_verification: string;
  google_analytics_id: string;
  google_tag_manager_id: string;
}

const defaultCodes: CodeInjection = {
  head_code: "",
  footer_code: "",
  custom_css: "",
  custom_js: "",
  google_verification: "",
  bing_verification: "",
  yandex_verification: "",
  pinterest_verification: "",
  google_analytics_id: "",
  google_tag_manager_id: "",
};

const searchEngines = [
  {
    name: "Google Search Console",
    url: "https://search.google.com/search-console",
    icon: "🔍",
    color: "hsl(210, 80%, 55%)",
    steps: [
      "Go to Google Search Console",
      "Add your property (URL prefix or Domain)",
      "Choose 'HTML tag' verification method",
      "Copy the meta tag content value",
      "Paste it in the Google Verification field below",
      "Click Save, then verify in Search Console",
    ],
  },
  {
    name: "Bing Webmaster Tools",
    url: "https://www.bing.com/webmasters",
    icon: "🌐",
    color: "hsl(160, 70%, 45%)",
    steps: [
      "Go to Bing Webmaster Tools",
      "Add your site URL",
      "Choose 'Meta Tag' verification",
      "Copy the content value from the meta tag",
      "Paste it in the Bing Verification field below",
      "Click Save, then verify in Bing",
    ],
  },
  {
    name: "Yandex Webmaster",
    url: "https://webmaster.yandex.com",
    icon: "🟡",
    color: "hsl(45, 90%, 50%)",
    steps: [
      "Go to Yandex Webmaster",
      "Add your site",
      "Choose 'Meta tag' verification",
      "Copy the content value",
      "Paste it in the Yandex Verification field below",
    ],
  },
  {
    name: "Pinterest",
    url: "https://www.pinterest.com/settings/claim",
    icon: "📌",
    color: "hsl(0, 75%, 50%)",
    steps: [
      "Go to Pinterest Settings → Claim",
      "Choose 'Add HTML tag'",
      "Copy the content value",
      "Paste it in the Pinterest Verification field below",
    ],
  },
];

export default function AdminIndexing() {
  const [codes, setCodes] = useState<CodeInjection>(defaultCodes);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("indexing");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCodes = async () => {
      const keys = Object.keys(defaultCodes);
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", keys);
      if (data) {
        const loaded = { ...defaultCodes };
        data.forEach((row: any) => {
          if (row.key in loaded) {
            (loaded as any)[row.key] = typeof row.value === "string" ? row.value : (row.value !== null ? String(row.value) : "");
          }
        });
        setCodes(loaded);
      }
    };
    fetchCodes();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(codes)) {
      await supabase
        .from("site_settings")
        .upsert(
          { key, value: value as any, updated_at: new Date().toISOString(), updated_by: user?.id },
          { onConflict: "key" }
        );
    }
    setSaving(false);
    toast({ title: "✅ Saved!", description: "All indexing & code settings saved successfully." });
  };

  const updateField = (field: keyof CodeInjection, value: string) => {
    setCodes((prev) => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard." });
  };

  const sitemapUrl = `${window.location.origin}/sitemap.xml`;
  const robotsUrl = `${window.location.origin}/robots.txt`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Indexing & Code Injection</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Manage search engine indexing and inject custom code
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 shrink-0 w-full sm:w-auto">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="indexing" className="gap-1.5 text-xs sm:text-sm">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search Engines</span>
            <span className="sm:hidden">Index</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5 text-xs sm:text-sm">
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-1.5 text-xs sm:text-sm">
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code Injection</span>
            <span className="sm:hidden">Code</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Engine Indexing Tab */}
        <TabsContent value="indexing" className="space-y-4 mt-4">
          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Quick Links
                </CardTitle>
                <p className="text-xs text-muted-foreground">Your sitemap and robots.txt URLs for search engines</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input value={sitemapUrl} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" className="shrink-0" onClick={() => copyToClipboard(sitemapUrl)}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0" asChild>
                    <a href={sitemapUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input value={robotsUrl} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" className="shrink-0" onClick={() => copyToClipboard(robotsUrl)}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0" asChild>
                    <a href={robotsUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Verification Codes */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Verification Codes
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Paste the <code className="text-primary">content</code> value from verification meta tags
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    🔍 Google Search Console
                  </label>
                  <Input
                    value={codes.google_verification}
                    onChange={(e) => updateField("google_verification", e.target.value)}
                    placeholder="e.g. abc123xyz..."
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    🌐 Bing Webmaster
                  </label>
                  <Input
                    value={codes.bing_verification}
                    onChange={(e) => updateField("bing_verification", e.target.value)}
                    placeholder="e.g. ABCDEF123456..."
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    🟡 Yandex Webmaster
                  </label>
                  <Input
                    value={codes.yandex_verification}
                    onChange={(e) => updateField("yandex_verification", e.target.value)}
                    placeholder="e.g. 1234abcd5678..."
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    📌 Pinterest
                  </label>
                  <Input
                    value={codes.pinterest_verification}
                    onChange={(e) => updateField("pinterest_verification", e.target.value)}
                    placeholder="e.g. abcdef123456..."
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Engine Guides */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Setup Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchEngines.map((engine) => (
                    <div key={engine.name} className="border border-border/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{engine.icon}</span>
                          <h3 className="font-medium text-sm">{engine.name}</h3>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1 text-xs h-7" asChild>
                          <a href={engine.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" /> Open
                          </a>
                        </Button>
                      </div>
                      <ol className="space-y-1">
                        {engine.steps.map((step, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-2">
                            <Badge variant="secondary" className="text-[9px] h-4 w-4 p-0 flex items-center justify-center shrink-0">
                              {i + 1}
                            </Badge>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Google Analytics
                </CardTitle>
                <p className="text-xs text-muted-foreground">Add your Google Analytics tracking ID</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Google Analytics ID (GA4)</label>
                  <Input
                    value={codes.google_analytics_id}
                    onChange={(e) => updateField("google_analytics_id", e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Format: G-XXXXXXXXXX (GA4 Measurement ID)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  Google Tag Manager
                </CardTitle>
                <p className="text-xs text-muted-foreground">Add your GTM Container ID</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">GTM Container ID</label>
                  <Input
                    value={codes.google_tag_manager_id}
                    onChange={(e) => updateField("google_tag_manager_id", e.target.value)}
                    placeholder="GTM-XXXXXXX"
                    className="font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Format: GTM-XXXXXXX</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Code Injection Tab */}
        <TabsContent value="code" className="space-y-4 mt-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  Head Code Injection
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Code placed inside <code className="text-primary">&lt;head&gt;</code> — ideal for meta tags, stylesheets, verification codes
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={codes.head_code}
                  onChange={(e) => updateField("head_code", e.target.value)}
                  placeholder={'<!-- Add your head code here -->\n<meta name="..." content="...">\n<link rel="stylesheet" href="...">'}
                  rows={10}
                  className="font-mono text-xs resize-y"
                />
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <p className="text-[10px] text-muted-foreground">Be careful with head code — invalid HTML can break the page.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Footer Code Injection
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Code placed before <code className="text-primary">&lt;/body&gt;</code> — ideal for scripts, chat widgets, analytics
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={codes.footer_code}
                  onChange={(e) => updateField("footer_code", e.target.value)}
                  placeholder={'<!-- Add your footer code here -->\n<script src="..."></script>'}
                  rows={10}
                  className="font-mono text-xs resize-y"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Custom CSS
                </CardTitle>
                <p className="text-xs text-muted-foreground">Add custom CSS styles to the website</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={codes.custom_css}
                  onChange={(e) => updateField("custom_css", e.target.value)}
                  placeholder={"/* Custom CSS */\nbody {\n  /* your styles */\n}"}
                  rows={8}
                  className="font-mono text-xs resize-y"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  Custom JavaScript
                </CardTitle>
                <p className="text-xs text-muted-foreground">Add custom JavaScript to the website</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={codes.custom_js}
                  onChange={(e) => updateField("custom_js", e.target.value)}
                  placeholder={"// Custom JavaScript\nconsole.log('Hello from custom JS');"}
                  rows={8}
                  className="font-mono text-xs resize-y"
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
