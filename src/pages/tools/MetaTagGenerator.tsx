import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Code, Copy, Globe, FileText, Image } from "lucide-react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("My Website - Best Online Tools");
  const [description, setDescription] = useState("Discover the best free online tools for productivity, security, and more.");
  const [keywords, setKeywords] = useState("tools, online, free, productivity");
  const [author, setAuthor] = useState("Cyber Venom");
  const [ogImage, setOgImage] = useState("https://example.com/og-image.jpg");
  const [url, setUrl] = useState("https://example.com");
  const [twitterHandle, setTwitterHandle] = useState("@cybervenom");

  const metaTags = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<meta name="keywords" content="${keywords}" />
<meta name="author" content="${author}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${ogImage}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${ogImage}" />
<meta property="twitter:creator" content="${twitterHandle}" />`;
  }, [title, description, keywords, author, ogImage, url, twitterHandle]);

  return (
    <ToolLayout title="Meta Tag Generator" description="Generate SEO-friendly meta tags for your website">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Inputs */}
        <div className="tool-section-card p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Website Information</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Page Title ({title.length}/60)</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} className="tool-input-colorful rounded-xl" maxLength={60} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Description ({description.length}/160)</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} className="tool-input-colorful rounded-xl resize-none" rows={2} maxLength={160} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground">Keywords</label><Input value={keywords} onChange={e => setKeywords(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground">Author</label><Input value={author} onChange={e => setAuthor(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground">URL</label><Input value={url} onChange={e => setUrl(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-muted-foreground">Twitter Handle</label><Input value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
              <div className="col-span-2 space-y-1.5"><label className="text-xs font-semibold text-muted-foreground">OG Image URL</label><Input value={ogImage} onChange={e => setOgImage(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
            </div>
          </div>
        </div>

        {/* SEO Score */}
        <div className="grid grid-cols-4 gap-3">
          <div className="tool-stat-card">
            <div className={`stat-value text-lg ${title.length <= 60 ? "text-green-500" : "text-red-500"}`}>{title.length}/60</div>
            <div className="stat-label">Title</div>
          </div>
          <div className="tool-stat-card">
            <div className={`stat-value text-lg ${description.length <= 160 ? "text-green-500" : "text-red-500"}`}>{description.length}/160</div>
            <div className="stat-label">Description</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{keywords.split(",").filter(Boolean).length}</div>
            <div className="stat-label">Keywords</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg text-green-500">✓</div>
            <div className="stat-label">OG Tags</div>
          </div>
        </div>

        {/* Google Preview */}
        <div className="tool-section-card p-4">
          <h3 className="text-sm font-bold gradient-text mb-3">🔍 Google Preview</h3>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border">
            <p className="text-blue-600 dark:text-blue-400 text-lg font-medium truncate">{title}</p>
            <p className="text-green-700 dark:text-green-500 text-xs truncate">{url}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>

        {/* Output */}
        <div className="tool-section-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold gradient-text"><Code className="w-4 h-4 inline mr-1" /> Generated Meta Tags</h3>
            <button onClick={() => { navigator.clipboard.writeText(metaTags); toast.success("Meta tags copied!"); }} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
          </div>
          <pre className="p-4 bg-primary/5 rounded-xl border border-primary/10 overflow-x-auto text-xs font-mono max-h-[300px] overflow-y-auto whitespace-pre-wrap">{metaTags}</pre>
        </div>
      </div>
    </ToolLayout>
  );
}
