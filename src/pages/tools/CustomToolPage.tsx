import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import {
  ArrowLeft, Maximize2, Minimize2, Share2, ChevronRight,
  FileCode, ExternalLink, Eye, Star, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CustomTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  html_content: string;
  embed_url: string;
  color: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  view_count: number;
}

export default function CustomToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tool, setTool] = useState<CustomTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { tools: allTools } = useToolCatalog();
  const viewCounted = useRef(false);

  // Rating state
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    return allTools
      .filter(t => t.category === tool.category && t.id !== `custom-${tool.slug}`)
      .slice(0, 8);
  }, [tool, allTools]);

  // Fetch tool
  useEffect(() => {
    if (!slug) return;
    supabase
      .from("custom_tools")
      .select("*")
      .eq("slug", slug)
      .eq("is_enabled", true)
      .is("deleted_at", null)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setTool(data as unknown as CustomTool);
        setLoading(false);
      });
  }, [slug]);

  // Increment view count once
  useEffect(() => {
    if (!slug || viewCounted.current) return;
    viewCounted.current = true;
    supabase.rpc("increment_tool_view", { tool_slug: slug }).then(() => {
      setTool(prev => prev ? { ...prev, view_count: (prev.view_count || 0) + 1 } : prev);
    });
  }, [slug]);

  // Fetch ratings
  const fetchRatings = useCallback(async () => {
    if (!tool) return;
    const { data } = await supabase.rpc("get_tool_rating", { p_tool_id: tool.id });
    if (data && data[0]) {
      setAvgRating(Number(data[0].avg_rating));
      setTotalRatings(Number(data[0].total_ratings));
    }
    if (user) {
      const { data: ur } = await supabase
        .from("tool_ratings")
        .select("rating")
        .eq("tool_id", tool.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (ur) setUserRating(ur.rating);
    }
  }, [tool, user]);

  useEffect(() => { fetchRatings(); }, [fetchRatings]);

  const handleRate = async (rating: number) => {
    if (!user) { toast.error("Please login to rate this tool"); return; }
    if (!tool) return;
    setRatingLoading(true);
    const { error } = await supabase
      .from("tool_ratings")
      .upsert({ tool_id: tool.id, user_id: user.id, rating, updated_at: new Date().toISOString() },
        { onConflict: "tool_id,user_id" });
    if (error) toast.error("Failed to submit rating");
    else { setUserRating(rating); toast.success("Rating submitted!"); await fetchRatings(); }
    setRatingLoading(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
            This tool doesn't exist or has been disabled.
          </p>
          <Button onClick={() => navigate("/tools")} size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Browse All Tools
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const StarRating = ({ interactive = false }: { interactive?: boolean }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => {
        const filled = interactive
          ? star <= (hoverRating || userRating)
          : star <= Math.round(avgRating);
        return (
          <button
            key={star}
            disabled={!interactive || ratingLoading}
            onClick={() => interactive && handleRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-all duration-150 ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"} disabled:opacity-50`}
          >
            <Star
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
            />
          </button>
        );
      })}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tool.color + "22", color: tool.color }}
            >
              <span className="text-sm font-bold">{tool.name.charAt(0)}</span>
            </div>
            <h2 className="font-semibold text-sm">{tool.name}</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)} className="gap-1.5">
            <Minimize2 className="w-4 h-4" /> Exit
          </Button>
        </div>
        <iframe
          ref={iframeRef}
          {...(tool.embed_url ? { src: tool.embed_url } : { srcDoc: tool.html_content })}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
          title={tool.name}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-[72px] sm:pt-[80px] lg:pt-[88px]">
      <SEOHead
        title={tool.meta_title || tool.name}
        description={tool.meta_description || tool.description}
        path={`/tools/custom/${tool.slug}`}
      />
      <Navbar />
      <ScrollToTop />


      {/* Spacer for header gap */}
      <div className="h-4 sm:h-6" />

      {/* FULL WIDTH TOOL IFRAME */}
      <div className="w-full flex-1" style={{ minHeight: 0 }}>
        <iframe
          ref={iframeRef}
          srcDoc={tool.html_content}
          title={tool.name}
          sandbox="allow-scripts allow-forms allow-modals allow-popups"
          className="w-full border-0 block"
          style={{ height: "calc(100vh - 160px)", minHeight: "500px" }}
        />
      </div>

      {/* Info + Rating strip */}
      <div className="w-full border-t border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center ring-1 ring-border/50 shadow-sm"
                style={{ backgroundColor: tool.color + "12", color: tool.color }}
              >
                <span className="text-xl font-bold">{tool.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold">{tool.name}</h2>
                {tool.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 max-w-lg">{tool.description}</p>
                )}
              </div>
            </div>

            {/* Stats & Rating */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {/* Views */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="font-semibold text-foreground">{tool.view_count || 0}</span>
                <span className="hidden sm:inline">views</span>
              </div>

              {/* Rating display */}
              <div className="flex items-center gap-2">
                <StarRating interactive={false} />
                <span className="text-sm font-semibold text-foreground">{avgRating > 0 ? avgRating.toFixed(1) : "0"}</span>
                <span className="text-xs text-muted-foreground">({totalRatings})</span>
              </div>

              {/* User rating */}
              <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-border/50">
                <span className="text-xs text-muted-foreground hidden sm:inline">Your rating:</span>
                <StarRating interactive={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="w-full border-t border-border/40 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold">Related Tools</h2>
              <Link to="/tools" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedTools.map(rt => {
                const Icon = rt.icon || FileCode;
                return (
                  <Link
                    key={rt.id}
                    to={rt.path}
                    className="group flex items-center gap-3 p-3.5 rounded-2xl border border-border/60 bg-card hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: rt.color + "15", color: rt.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium truncate block group-hover:text-primary transition-colors">{rt.name}</span>
                      <span className="text-[11px] text-muted-foreground">{rt.category}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
