import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check, Eye } from "lucide-react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [url, setUrl] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generated = [
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    title && `<title>${title}</title>`,
    title && `<meta name="title" content="${title}">`,
    description && `<meta name="description" content="${description}">`,
    keywords && `<meta name="keywords" content="${keywords}">`,
    author && `<meta name="author" content="${author}">`,
    ``,
    `<!-- Open Graph / Facebook -->`,
    `<meta property="og:type" content="website">`,
    url && `<meta property="og:url" content="${url}">`,
    title && `<meta property="og:title" content="${title}">`,
    description && `<meta property="og:description" content="${description}">`,
    ogImage && `<meta property="og:image" content="${ogImage}">`,
    ``,
    `<!-- Twitter -->`,
    `<meta property="twitter:card" content="summary_large_image">`,
    url && `<meta property="twitter:url" content="${url}">`,
    title && `<meta property="twitter:title" content="${title}">`,
    description && `<meta property="twitter:description" content="${description}">`,
    ogImage && `<meta property="twitter:image" content="${ogImage}">`,
    twitterHandle && `<meta name="twitter:creator" content="${twitterHandle}">`,
  ]
    .filter(Boolean)
    .join("\n");

  const copyCode = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout title="Meta Tag Generator" description="Generate SEO-friendly meta tags for your website">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Website" className="rounded-xl" />
            <span className="text-xs text-muted-foreground">{title.length}/60 characters</span>
          </div>
          <div className="space-y-2">
            <Label>Author</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="John Doe" className="rounded-xl" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of your page..." className="rounded-xl" rows={3} />
            <span className="text-xs text-muted-foreground">{description.length}/160 characters</span>
          </div>
          <div className="space-y-2">
            <Label>Keywords (comma separated)</Label>
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="web, tools, seo" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>OG Image URL</Label>
            <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/image.jpg" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Twitter Handle</Label>
            <Input value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@username" className="rounded-xl" />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={copyCode} className="gradient-bg text-primary-foreground rounded-xl font-semibold">
            {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Meta Tags</>}
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" /> {showPreview ? "Hide" : "Show"} Google Preview
          </Button>
        </div>

        {showPreview && (
          <div className="bg-white rounded-xl p-5 border border-border/50 space-y-1">
            <div className="text-[#1a0dab] text-lg truncate">{title || "Page Title"}</div>
            <div className="text-[#006621] text-sm truncate">{url || "https://example.com"}</div>
            <div className="text-[#545454] text-sm line-clamp-2">{description || "Your page description will appear here..."}</div>
          </div>
        )}

        <pre className="bg-accent/50 rounded-2xl p-5 text-sm overflow-auto max-h-96 font-mono whitespace-pre-wrap">{generated}</pre>
      </div>
    </ToolLayout>
  );
}
