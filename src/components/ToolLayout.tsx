import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SEOHead } from "./SEOHead";
import { ScrollToTop } from "./ScrollToTop";
import { FavoriteButton } from "./FavoriteButton";
import { AdSlotDisplay } from "./AdSlotDisplay";
import { ToolSidebar } from "./ToolSidebar";
import { tools } from "@/data/tools";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const shareOptions = [
  { name: "Facebook", icon: Facebook, color: "#1877F2", getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: "Twitter", icon: Twitter, color: "#1DA1F2", getUrl: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " — Free on Cyber Venom!")}` },
  { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", getUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { name: "WhatsApp", icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ), color: "#25D366", getUrl: (url: string, title: string) => `https://wa.me/?text=${encodeURIComponent(title + " — " + url)}` },
  { name: "Telegram", icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ), color: "#0088CC", getUrl: (url: string, title: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
];

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const location = useLocation();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toolSeo, setToolSeo] = useState<any>(null);

  const currentTool = useMemo(() => tools.find(t => t.path === location.pathname), [location.pathname]);

  useEffect(() => {
    if (!currentTool) return;
    supabase
      .from("tool_seo")
      .select("*")
      .eq("tool_id", currentTool.id)
      .eq("is_enabled", true)
      .maybeSingle()
      .then(({ data }) => { if (data) setToolSeo(data); });
  }, [currentTool?.id]);

  const seoTitle = toolSeo?.meta_title || title;
  const seoDescription = toolSeo?.meta_description || description;
  const toolColor = currentTool?.color || "hsl(var(--primary))";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (option: typeof shareOptions[0]) => {
    window.open(option.getUrl(pageUrl, seoTitle), "_blank", "noopener,noreferrer,width=600,height=400");
    setShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={seoTitle} description={seoDescription} path={location.pathname} type="website" />
      <Navbar />

      <div className="relative tool-page-shell">
        {/* ===== COLORFUL HERO HEADER ===== */}
        <div className="relative pt-20 sm:pt-24 pb-4 px-4 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${toolColor.replace(')', ' / 0.25)')}, transparent)`,
            }}
          />
          <div className="absolute top-10 left-[15%] w-[300px] h-[200px] rounded-full blur-[100px] pointer-events-none opacity-20"
            style={{ backgroundColor: toolColor }} />
          <div className="absolute top-10 right-[15%] w-[250px] h-[180px] rounded-full blur-[100px] pointer-events-none opacity-15"
            style={{ backgroundColor: toolColor }} />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{ backgroundColor: toolColor, top: `${20 + i * 15}%`, left: `${8 + i * 20}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
              <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Tools</span>
              </Link>
            </motion.div>

            {/* Tool Header Card — Colorful */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="tool-header-card relative overflow-hidden"
              style={{ boxShadow: `0 8px 40px -12px ${toolColor.replace(')', ' / 0.15)')}` }}
            >
              {/* Top gradient stripe */}
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${toolColor}, ${toolColor.replace(')', ' / 0.4)')}, ${toolColor})` }} />

              {/* Subtle glow inside card */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[80px] rounded-full blur-[60px] pointer-events-none opacity-20"
                style={{ backgroundColor: toolColor }} />

              <div className="relative bg-card/80 backdrop-blur-xl p-4 sm:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  {currentTool && (
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${toolColor.replace(')', ' / 0.2)')}, ${toolColor.replace(')', ' / 0.05)')})`,
                        color: toolColor,
                        boxShadow: `0 4px 20px -4px ${toolColor.replace(')', ' / 0.3)')}`
                      }}
                    >
                      {/* Icon glow ring */}
                      <div className="absolute inset-0 rounded-2xl opacity-40"
                        style={{ boxShadow: `inset 0 0 20px ${toolColor.replace(')', ' / 0.2)')}` }} />
                      <currentTool.icon className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />

                      {/* Sparkle dot */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ backgroundColor: toolColor }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-foreground leading-tight truncate">{title}</h1>
                    {description ? <p className="text-xs sm:text-sm text-muted-foreground/90 mt-0.5 line-clamp-1">{description}</p> : null}
                    {/* Category badge */}
                    {currentTool && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${toolColor.replace(')', ' / 0.1)')}`,
                          color: toolColor,
                        }}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {currentTool.category}
                      </motion.span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {currentTool && <FavoriteButton toolId={currentTool.id} size="sm" />}
                    <div className="relative">
                      <button
                        onClick={() => setShareOpen(!shareOpen)}
                        className="w-9 h-9 rounded-xl border border-border/60 bg-background/80 hover:bg-accent/50 flex items-center justify-center transition-all hover:scale-105"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <AnimatePresence>
                        {shareOpen && (
                          <>
                            <div className="fixed inset-0 z-[9998]" onClick={() => setShareOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: -6, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.96 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-2 rounded-xl bg-card border border-border/50 shadow-xl z-[9999] p-2.5 min-w-[200px]"
                            >
                              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-1 mb-2">Share</p>
                              <div className="flex items-center gap-1.5">
                                {shareOptions.map((option) => {
                                  const Icon = option.icon;
                                  return (
                                    <button
                                      key={option.name}
                                      onClick={() => handleShare(option)}
                                      title={option.name}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-all"
                                      style={{ backgroundColor: `${option.color}14`, color: option.color }}
                                    >
                                      <Icon />
                                    </button>
                                  );
                                })}
                                <button
                                  onClick={handleCopyLink}
                                  title={copied ? "Copied!" : "Copy Link"}
                                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:scale-110 transition-all"
                                >
                                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AD: BEFORE TOOL */}
        <div className="px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <AdSlotDisplay placement="before_tool" className="rounded-xl" />
          </div>
        </div>

        {/* ===== TWO-COLUMN LAYOUT ===== */}
        <div className="px-4 pb-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="tool-page-main relative overflow-hidden"
                style={{ boxShadow: `0 4px 24px -8px ${toolColor.replace(')', ' / 0.08)')}` }}
              >
                {/* Top color bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${toolColor}, ${toolColor.replace(')', ' / 0.3)')}, transparent)` }} />

                {/* Corner glow */}
                <div className="absolute top-0 left-0 w-[200px] h-[100px] rounded-full blur-[80px] pointer-events-none opacity-10"
                  style={{ backgroundColor: toolColor }} />

              <div className="p-4 sm:p-6 lg:p-8 relative" style={{ '--tool-color': toolColor } as React.CSSProperties}>
                  {children}
                  <AdSlotDisplay placement="in_content" className="mt-6 pt-5 border-t border-border/20" />
                </div>
              </motion.div>

              {/* SEO Long Description */}
              {toolSeo?.long_description && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="tool-rich-block mt-6 p-5 sm:p-6"
                >
                  <h2 className="text-base font-bold text-foreground mb-3">About {title}</h2>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground/80 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: toolSeo.long_description }}
                  />
                </motion.div>
              )}

              <div className="mt-4">
                <AdSlotDisplay placement="after_tool" className="rounded-xl" />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
              <div className="lg:sticky lg:top-24">
                <ToolSidebar currentToolId={currentTool?.id} currentCategory={currentTool?.category} />
              </div>
            </div>
          </div>
        </div>

        {toolSeo?.structured_data && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSeo.structured_data) }} />
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
