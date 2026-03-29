import { useState, useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Tag, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string;
  read_time: string;
  published_at: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { totalTools, totalCategories } = useToolCatalog();

  // Replace hardcoded counts in blog content with dynamic values
  const dynamicContent = useMemo(() => {
    if (!post?.content) return "";
    return post.content
      .replace(/200\+?\s*(free\s+)?tools/gi, `${totalTools}+ free tools`)
      .replace(/over\s+200\s*(free\s+)?tools/gi, `over ${totalTools} free tools`)
      .replace(/\b200\+?\s*tools/gi, `${totalTools}+ tools`);
  }, [post?.content, totalTools]);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(data as BlogPost);

      // Fetch related
      const { data: relData } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, author, featured_image, read_time, published_at, tags, content, meta_title, meta_description")
        .eq("status", "published")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(2);
      
      let relPosts = (relData as BlogPost[]) || [];
      if (relPosts.length < 2) {
        const { data: more } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, category, author, featured_image, read_time, published_at, tags, content, meta_title, meta_description")
          .eq("status", "published")
          .neq("id", data.id)
          .neq("category", data.category)
          .limit(2 - relPosts.length);
        if (more) relPosts = [...relPosts, ...(more as BlogPost[])];
      }
      setRelated(relPosts);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (notFound) return <Navigate to="/blog" replace />;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">{post.category}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 mb-8">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
              {post.published_at && (
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              )}
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.read_time}</span>
              <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image && (
        <section className="px-4 pb-10">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="rounded-2xl overflow-hidden border border-border/30 shadow-xl">
              <img src={post.featured_image} alt={post.title} className="w-full h-64 sm:h-80 object-cover" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-3xl mx-auto">
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border/20">
              <Tag className="w-4 h-4 text-muted-foreground/50" />
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-accent/50 border border-border/20 text-xs font-medium text-muted-foreground">{tag}</span>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((rp) => (
                <Link key={rp.id} to={`/blog/${rp.slug}`} className="group block rounded-2xl border border-border/30 bg-card/60 overflow-hidden hover:border-primary/30 transition-all">
                  {rp.featured_image && (
                    <img src={rp.featured_image} alt={rp.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{rp.read_time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPostPage;
