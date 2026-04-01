import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Globe, Shield, Zap, ExternalLink, CheckCircle, AlertTriangle,
  BookOpen, FileText, ArrowRight, Copy, Monitor, Smartphone, Settings,
  Eye, BarChart3, Link2, Code, Bell, Users, Crown, Upload
} from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06 },
});

interface StepItem {
  step: number;
  title: string;
  description: string;
  tip?: string;
}

function StepCard({ item }: { item: StepItem }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-xs font-bold text-primary">{item.step}</span>
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
        {item.tip && (
          <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <Zap className="w-3 h-3 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-primary/80">{item.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const gscSteps: StepItem[] = [
  { step: 1, title: "Go to Google Search Console", description: "Visit https://search.google.com/search-console and sign in with your Google account.", tip: "Use the same Google account that you want to manage all your websites from." },
  { step: 2, title: "Add Your Property", description: "Click 'Add property'. Choose 'URL prefix' method and enter your full domain (e.g., https://cybervenoms.com).", tip: "URL prefix is easier — Domain verification requires DNS access." },
  { step: 3, title: "Choose HTML Tag Verification", description: "From the verification methods, select 'HTML tag'. You'll see a meta tag like: <meta name=\"google-site-verification\" content=\"ABC123...\" />", },
  { step: 4, title: "Copy the Content Value", description: "Copy ONLY the content value (e.g., ABC123...) — not the entire meta tag. This is your verification code." },
  { step: 5, title: "Paste in Admin → Indexing & Code", description: "Go to your Admin Panel → Indexing & Code → Verification Codes tab. Paste the code in the 'Google Verification' field and click Save." },
  { step: 6, title: "Verify in Search Console", description: "Go back to Google Search Console and click 'Verify'. It should now detect your verification tag and confirm ownership.", tip: "If verification fails, wait a few minutes and try again. Make sure your site is published." },
  { step: 7, title: "Submit Your Sitemap", description: "After verification, go to Sitemaps → Add a new sitemap. Enter 'sitemap.xml' and click Submit. Google will start crawling your pages." },
];

const bingSteps: StepItem[] = [
  { step: 1, title: "Go to Bing Webmaster Tools", description: "Visit https://www.bing.com/webmasters and sign in with your Microsoft account." },
  { step: 2, title: "Add Your Site", description: "Click 'Add a site' and enter your website URL. You can also import from Google Search Console." },
  { step: 3, title: "Choose Meta Tag Verification", description: "Select the 'HTML Meta Tag' option and copy the content value from the provided meta tag." },
  { step: 4, title: "Paste in Admin Panel", description: "Go to Admin → Indexing & Code → Verification Codes. Paste in the 'Bing Verification' field and Save." },
  { step: 5, title: "Verify & Submit Sitemap", description: "Click Verify in Bing Webmaster Tools, then submit your sitemap URL." },
];

const yandexSteps: StepItem[] = [
  { step: 1, title: "Go to Yandex Webmaster", description: "Visit https://webmaster.yandex.com and sign in." },
  { step: 2, title: "Add Site", description: "Add your website URL and select the meta tag verification method." },
  { step: 3, title: "Copy & Paste Code", description: "Copy the verification code, paste it in Admin → Indexing & Code → Yandex Verification field." },
  { step: 4, title: "Verify", description: "Complete verification in Yandex Webmaster and submit your sitemap." },
];

const adminGuides = [
  {
    title: "Managing Tools",
    icon: Settings,
    color: "text-blue-400",
    items: [
      "Go to Admin → Tools to enable/disable any tool",
      "Click the edit icon to rename any tool",
      "Use the toggle switch to show/hide tools from the website",
      "Drag to reorder tools (display order)",
      "Premium tools can be set from Admin → Subscriptions",
    ],
  },
  {
    title: "Blog Management",
    icon: FileText,
    color: "text-green-400",
    items: [
      "Admin → Blog to create, edit, or delete blog posts",
      "Use the rich text editor for formatted content",
      "Set featured images, categories, and tags",
      "Posts can be saved as 'Draft' or 'Published'",
      "SEO meta tags are auto-generated but can be customized",
    ],
  },
  {
    title: "Subscription & Premium",
    icon: Crown,
    color: "text-yellow-400",
    items: [
      "Admin → Subscriptions to manage plans and pricing",
      "Edit plan names, prices (USD & BDT), and features",
      "Mark tools as premium to require subscription",
      "Review and approve/reject payment requests",
      "Configure payment gateways (bKash, Nagad, etc.)",
    ],
  },
  {
    title: "SEO Management",
    icon: Search,
    color: "text-purple-400",
    items: [
      "Admin → SEO to edit meta tags for every page and tool",
      "Set custom titles, descriptions, keywords, and OG images",
      "Structured data (JSON-LD) is auto-generated",
      "Canonical URLs prevent duplicate content issues",
      "Robots meta tags control search engine indexing",
    ],
  },
  {
    title: "User Management",
    icon: Users,
    color: "text-red-400",
    items: [
      "Admin → Users shows all registered users",
      "Admin → Roles to assign admin/moderator roles",
      "Users can be managed (view details, subscriptions)",
      "Role-based access control protects admin features",
    ],
  },
  {
    title: "Custom Tools",
    icon: Upload,
    color: "text-cyan-400",
    items: [
      "Admin → Custom Tools to upload HTML-based tools",
      "Upload .html files or paste HTML content directly",
      "Custom tools get their own URL and SEO settings",
      "Set category, icon, color, and description",
      "Enable/disable custom tools anytime",
    ],
  },
];

export default function AdminDocs() {
  const [activeTab, setActiveTab] = useState("gsc");
  const { settings } = useSiteSettings();
  const domain = settings.site_domain?.trim() || "https://cybervenoms.com";

  const tabs = [
    { id: "gsc", label: "Google", icon: Search },
    { id: "bing", label: "Bing", icon: Globe },
    { id: "yandex", label: "Yandex", icon: Globe },
    { id: "guides", label: "Admin Guides", icon: BookOpen },
    { id: "checklist", label: "SEO Checklist", icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Documentation & Guides
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          Step-by-step guides for setting up search engines, managing your site, and SEO best practices
        </p>
      </div>

      {/* Domain info banner */}
      <motion.div {...fadeIn(0)}>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Your Domain</p>
            <p className="text-sm font-mono text-primary truncate">{domain}</p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            <CheckCircle className="w-3 h-3 mr-1" /> Active
          </Badge>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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

        {/* Google Search Console */}
        <TabsContent value="gsc" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    Google Search Console Setup
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                      Open GSC <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Google Search Console helps you monitor your site's presence in Google search results. Follow these steps to set it up.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {gscSteps.map((item) => (
                  <StepCard key={item.step} item={item} />
                ))}

                <div className="mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-destructive">Common Issues</p>
                      <ul className="text-[11px] text-destructive/70 mt-1 space-y-1">
                        <li>• Make sure your site is published before verifying</li>
                        <li>• Only paste the content VALUE, not the full meta tag</li>
                        <li>• DNS propagation may take up to 48 hours</li>
                        <li>• Ensure sitemap.xml is accessible at {domain}/sitemap.xml</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* After GSC - Google Analytics */}
          <motion.div {...fadeIn(1)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  Google Analytics Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StepCard item={{ step: 1, title: "Create a GA4 Property", description: "Go to https://analytics.google.com → Admin → Create Property. Follow the setup wizard." }} />
                <StepCard item={{ step: 2, title: "Get Your Measurement ID", description: "After creating the property, go to Data Streams → Web. Your Measurement ID looks like G-XXXXXXXXXX." }} />
                <StepCard item={{ step: 3, title: "Add to Admin Panel", description: "Go to Admin → Indexing & Code → Analytics tab. Paste your GA4 Measurement ID and save.", tip: "For Google Tag Manager, use the GTM-XXXXXXX format ID instead." }} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Bing */}
        <TabsContent value="bing" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Bing Webmaster Tools Setup
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                    <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer">
                      Open Bing <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bing Webmaster Tools lets you optimize your website for Bing search. You can also import your Google Search Console data.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {bingSteps.map((item) => (
                  <StepCard key={item.step} item={item} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Yandex */}
        <TabsContent value="yandex" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-red-400" />
                    Yandex Webmaster Setup
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                    <a href="https://webmaster.yandex.com" target="_blank" rel="noopener noreferrer">
                      Open Yandex <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {yandexSteps.map((item) => (
                  <StepCard key={item.step} item={item} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Admin Guides */}
        <TabsContent value="guides" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminGuides.map((guide, i) => (
              <motion.div key={guide.title} {...fadeIn(i)}>
                <Card className="border-border/50 h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <guide.icon className={`w-4 h-4 ${guide.color}`} />
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <ArrowRight className="w-3 h-3 text-primary/50 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* SEO Checklist */}
        <TabsContent value="checklist" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  SEO Optimization Checklist
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Ensure your website is fully optimized for search engines
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Technical SEO", items: [
                      { text: "Sitemap.xml submitted to Google & Bing", done: true },
                      { text: "Robots.txt configured correctly", done: true },
                      { text: "SSL certificate active (HTTPS)", done: true },
                      { text: "All pages have unique meta titles", done: true },
                      { text: "All pages have meta descriptions", done: true },
                      { text: "Canonical URLs set for all pages", done: true },
                      { text: "Open Graph tags for social sharing", done: true },
                      { text: "Structured data (JSON-LD) added", done: true },
                    ]},
                    { category: "Content SEO", items: [
                      { text: "Each tool has a unique description", done: true },
                      { text: "Blog posts have categories and tags", done: true },
                      { text: "Images have alt text attributes", done: false },
                      { text: "Internal linking between pages", done: true },
                      { text: "Focus keywords set for tools", done: true },
                    ]},
                    { category: "Performance", items: [
                      { text: "Lazy loading for images", done: true },
                      { text: "Code splitting (lazy routes)", done: true },
                      { text: "Minified CSS and JavaScript", done: true },
                      { text: "Responsive design for mobile", done: true },
                    ]},
                    { category: "Analytics & Monitoring", items: [
                      { text: "Google Search Console connected", done: false },
                      { text: "Google Analytics configured", done: false },
                      { text: "Bing Webmaster Tools connected", done: false },
                    ]},
                  ].map((section) => (
                    <div key={section.category}>
                      <h4 className="text-xs font-bold text-foreground mb-2">{section.category}</h4>
                      <div className="space-y-1.5">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              item.done ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                            }`}>
                              {item.done ? <CheckCircle className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                            </div>
                            <span className={item.done ? "text-muted-foreground" : "text-foreground font-medium"}>
                              {item.text}
                            </span>
                            {!item.done && <Badge variant="outline" className="text-[9px] ml-auto">Pending</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
