import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Share2, ExternalLink, Facebook, Twitter, Linkedin, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SEOHead } from "./SEOHead";
import { ScrollToTop } from "./ScrollToTop";
import { FavoriteButton } from "./FavoriteButton";
import { tools } from "@/data/tools";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const shareOptions = [
  { name: "Facebook", icon: Facebook, color: "#1877F2", getUrl: (url: string, title: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: "Twitter", icon: Twitter, color: "#1DA1F2", getUrl: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " — Free on Cyber Venom!")}` },
  { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", getUrl: (url: string, title: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
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
  const shareBtnRef = useRef<HTMLButtonElement>(null);

  const currentTool = useMemo(() => tools.find(t => t.path === location.pathname), [location.pathname]);

  const relatedTools = useMemo(() => {
    if (!currentTool) return [];
    return tools
      .filter(t => t.category === currentTool.category && t.id !== currentTool.id)
      .slice(0, 4);
  }, [currentTool]);

  const toolColor = currentTool?.color || "hsl(var(--primary))";
  const pageUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (option: typeof shareOptions[0]) => {
    window.open(option.getUrl(pageUrl, title), "_blank", "noopener,noreferrer,width=600,height=400");
    setShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} path={location.pathname} type="website" />
      <Navbar />

      <div className="relative">
        {/* ===== HERO SECTION ===== */}
        <div className="relative pt-24 pb-8 px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 cyber-grid opacity-[0.06]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] opacity-[0.12]" style={{ background: toolColor }} />
            <div className="absolute top-20 right-1/4 w-[300px] h-[300px] rounded-full blur-[120px] opacity-[0.06]" style={{ background: toolColor }} />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <Link to="/tools">
                <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground group rounded-xl">
                  <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tools
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col sm:flex-row items-start gap-5 mb-8">
              {currentTool && (
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="relative">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${toolColor.replace(')', ' / 0.2)')}, ${toolColor.replace(')', ' / 0.08)')})`,
                      color: toolColor,
                      boxShadow: `0 20px 60px ${toolColor.replace(')', ' / 0.25)')}, 0 0 0 1px ${toolColor.replace(')', ' / 0.1)')}`
                    }}
                  >
                    <div className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]" style={{ background: `linear-gradient(105deg, transparent 30%, ${toolColor.replace(')', ' / 0.15)')}, transparent 70%)` }} />
                    <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }} />
                    <currentTool.icon className="w-10 h-10 sm:w-12 sm:h-12 relative z-10 drop-shadow-sm" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: toolColor, boxShadow: `0 0 14px 3px ${toolColor.replace(')', ' / 0.5)')}` }} />
                </motion.div>
              )}

              <div className="flex-1 min-w-0">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 leading-tight">{title}</motion.h1>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">{description}</motion.p>

                {/* Action Buttons */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mt-5">
                  {currentTool && <FavoriteButton toolId={currentTool.id} size="lg" />}

                  {/* Share Button with dropdown */}
                  <div className="relative">
                    <Button
                      ref={shareBtnRef}
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-2 border-border/60 hover:border-primary/30 gap-2"
                      onClick={() => setShareOpen(!shareOpen)}
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </Button>

                    <AnimatePresence>
                      {shareOpen && (
                        <>
                          <div className="fixed inset-0 z-[9998]" onClick={() => setShareOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed rounded-2xl bg-card border border-border/50 shadow-2xl z-[9999] p-3 backdrop-blur-xl"
                            style={{
                              top: shareBtnRef.current ? shareBtnRef.current.getBoundingClientRect().bottom + 8 : 0,
                              left: shareBtnRef.current ? shareBtnRef.current.getBoundingClientRect().left : 0,
                            }}
                          >
                            <div className="flex items-center justify-between mb-2 gap-8">
                              <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Share</p>
                              <button onClick={() => setShareOpen(false)} className="w-6 h-6 rounded-full hover:bg-accent/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              {shareOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <button
                                    key={option.name}
                                    onClick={() => handleShare(option)}
                                    title={option.name}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-all"
                                    style={{ backgroundColor: `${option.color}18`, color: option.color }}
                                  >
                                    <Icon />
                                  </button>
                                );
                              })}
                              <button
                                onClick={handleCopyLink}
                                title={copied ? "Copied!" : "Copy Link"}
                                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:scale-110 transition-all"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== TOOL CONTENT ===== */}
        <div className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative rounded-3xl border-2 border-border/40 bg-card shadow-xl overflow-hidden">
              {currentTool && (
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${toolColor}, ${toolColor.replace(')', ' / 0.3)')}, transparent)` }} />
              )}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[100px] opacity-[0.04] pointer-events-none" style={{ background: toolColor }} />
              <div className="relative z-10 p-6 sm:p-8 lg:p-10">{children}</div>
            </motion.div>
          </div>
        </div>

        {/* ===== RELATED TOOLS ===== */}
        {relatedTools.length > 0 && (
          <div className="px-4 pb-20">
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Similar Tools</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedTools.map((tool, i) => (
                    <motion.div key={tool.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                      <Link
                        to={tool.path}
                        className="group relative block rounded-2xl border-2 border-border/40 bg-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl h-full"
                        style={{ boxShadow: `0 4px 20px -8px ${tool.color.replace(')', ' / 0.1)')}` }}
                      >
                        <div className="h-[2px] w-full opacity-50 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }} />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color.replace(')', ' / 0.06)')}, transparent 70%)` }} />
                        <div className="p-5 relative z-10">
                          <div className="flex items-start gap-3.5 mb-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm" style={{ backgroundColor: tool.color.replace(')', ' / 0.12)'), color: tool.color }}>
                              <tool.icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors truncate">{tool.name}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border/30 group-hover:border-primary/20 transition-colors">
                            <span className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: tool.color }}>
                              Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <FavoriteButton toolId={tool.id} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
