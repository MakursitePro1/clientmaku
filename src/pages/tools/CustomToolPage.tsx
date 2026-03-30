import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ArrowLeft, Maximize2, Minimize2, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

interface CustomTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  html_content: string;
  color: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export default function CustomToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<CustomTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("custom_tools")
      .select("*")
      .eq("slug", slug)
      .eq("is_enabled", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setTool(data as unknown as CustomTool);
        setLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading tool...</p>
        </div>
      </div>
    );
  }

  if (notFound || !tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Tool Not Found</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            This tool doesn't exist or has been disabled by the administrator.
          </p>
          <Button onClick={() => navigate("/tools")} size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Browse All Tools
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tool.color + "22", color: tool.color }}>
              <span className="text-sm font-bold">{tool.name.charAt(0)}</span>
            </div>
            <h2 className="font-semibold text-sm">{tool.name}</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)} className="gap-1.5">
            <Minimize2 className="w-4 h-4" /> Exit Fullscreen
          </Button>
        </div>
        <iframe
          ref={iframeRef}
          srcDoc={tool.html_content}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts allow-forms allow-modals allow-popups"
          title={tool.name}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={tool.meta_title || tool.name}
        description={tool.meta_description || tool.description}
        path={`/tools/custom/${tool.slug}`}
      />
      <Navbar />
      <ScrollToTop />

      {/* Minimal header */}
      <div className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate("/tools")} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tool.color + "22", color: tool.color }}>
              <span className="text-lg font-bold">{tool.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">{tool.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 hidden sm:flex">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)} className="gap-1.5">
              <Maximize2 className="w-4 h-4" /> <span className="hidden sm:inline">Fullscreen</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Full-width tool area */}
      <div className="w-full">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4">
          <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-lg" style={{ minHeight: "80vh" }}>
            <iframe
              ref={iframeRef}
              srcDoc={tool.html_content}
              className="w-full border-0"
              style={{ minHeight: "80vh" }}
              sandbox="allow-scripts allow-forms allow-modals allow-popups"
              title={tool.name}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
