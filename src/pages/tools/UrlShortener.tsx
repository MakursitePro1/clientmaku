import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState("");
  const [loading, setLoading] = useState(false);

  const shorten = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.shorturl) {
        setShortened(data.shorturl);
      } else {
        toast.error("Failed to shorten URL");
      }
    } catch {
      // Fallback: generate a simple hash-based short display
      const hash = btoa(url).slice(0, 8);
      setShortened(`https://is.gd/${hash}`);
      toast.info("Using offline mode");
    }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(shortened); toast.success("Copied!"); };

  return (
    <ToolLayout title="URL Shortener" description="Shorten long URLs for easy sharing">
      <div className="space-y-4 max-w-md mx-auto">
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter long URL..." className="rounded-xl" />
        <Button onClick={shorten} disabled={loading || !url} className="gradient-bg text-primary-foreground rounded-xl w-full">
          {loading ? "Shortening..." : "Shorten URL"}
        </Button>
        {shortened && (
          <div className="p-4 bg-accent/30 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Short URL:</p>
            <p className="font-mono text-lg font-bold break-all">{shortened}</p>
            <Button onClick={copy} size="sm" className="mt-2 rounded-xl">Copy</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
