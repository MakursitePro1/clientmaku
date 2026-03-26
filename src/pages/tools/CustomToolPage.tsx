import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";

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
        else setTool(data as CustomTool);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground mb-6">This tool doesn't exist or has been disabled.</p>
          <Button onClick={() => navigate("/tools")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>
        </div>
        <Footer />
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/tools")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{tool.name}</h1>
            {tool.description && <p className="text-sm text-muted-foreground">{tool.description}</p>}
          </div>
        </div>
        <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm" style={{ minHeight: "70vh" }}>
          <iframe
            srcDoc={tool.html_content}
            className="w-full border-0"
            style={{ minHeight: "70vh" }}
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
            title={tool.name}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
