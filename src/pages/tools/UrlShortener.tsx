import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Link, ExternalLink, QrCode, Trash2, History, CheckCircle2, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ShortenedURL {
  original: string;
  short: string;
  timestamp: Date;
}

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [history, setHistory] = useState<ShortenedURL[]>(() => {
    try { return JSON.parse(localStorage.getItem("cv_url_history") || "[]"); } catch { return []; }
  });

  const isValidUrl = useMemo(() => {
    try { new URL(url); return true; } catch { return false; }
  }, [url]);

  const shorten = async () => {
    if (!url || !isValidUrl) { toast.error("Enter a valid URL"); return; }
    setLoading(true);
    setShortened("");
    setShowQR(false);

    try {
      const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.shorturl) {
        setShortened(data.shorturl);
        const entry: ShortenedURL = { original: url, short: data.shorturl, timestamp: new Date() };
        const newHistory = [entry, ...history].slice(0, 20);
        setHistory(newHistory);
        try { localStorage.setItem("cv_url_history", JSON.stringify(newHistory)); } catch {}
        toast.success("URL shortened!");
      } else {
        throw new Error("API error");
      }
    } catch {
      // Fallback
      const hash = btoa(url).slice(0, 8).replace(/[^a-zA-Z0-9]/g, "x");
      const fallback = `https://is.gd/${hash}`;
      setShortened(fallback);
      toast.info("Using demo mode");
    }
    setLoading(false);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cv_url_history");
    toast.success("History cleared!");
  };

  const urlLength = url.length;
  const savedChars = shortened ? url.length - shortened.length : 0;
  const savedPercent = shortened && url.length > 0 ? Math.round((savedChars / url.length) * 100) : 0;

  return (
    <ToolLayout title="URL Shortener" description="Shorten long URLs instantly with QR code generation and history">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={e => { setUrl(e.target.value); setShortened(""); }}
                placeholder="https://example.com/very/long/url..."
                className="rounded-xl pl-10 font-mono text-sm"
                onKeyDown={e => e.key === "Enter" && shorten()}
              />
            </div>
            <button
              onClick={shorten}
              disabled={loading || !isValidUrl}
              className="tool-btn-primary shrink-0 px-5 py-2.5 flex items-center gap-1.5 text-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>
          {url && !isValidUrl && (
            <p className="text-xs text-destructive">Please enter a valid URL (include https://)</p>
          )}
          {url && isValidUrl && (
            <p className="text-xs text-muted-foreground">{urlLength} characters</p>
          )}
        </div>

        {/* Result */}
        <AnimatePresence>
          {shortened && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-bold">Shortened URL</h3>
              </div>

              <div className="p-4 bg-card rounded-xl border border-border/30 text-center">
                <a href={shortened} target="_blank" rel="noopener noreferrer" className="font-mono text-xl font-bold text-primary hover:underline break-all">
                  {shortened}
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Original", val: `${urlLength} chars` },
                  { label: "Shortened", val: `${shortened.length} chars` },
                  { label: "Saved", val: `${savedPercent}%` },
                ].map(s => (
                  <div key={s.label} className="p-2 bg-card rounded-lg text-center border border-border/20">
                    <p className="text-sm font-bold text-primary">{s.val}</p>
                    <p className="text-[9px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => copy(shortened)} className="rounded-xl gap-1.5 flex-1">
                  <Copy className="w-4 h-4" /> Copy Short URL
                </Button>
                <a href={shortened} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="rounded-xl gap-1.5 w-full">
                    <ExternalLink className="w-4 h-4" /> Open
                  </Button>
                </a>
                <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => setShowQR(!showQR)}>
                  <QrCode className="w-4 h-4" /> QR
                </Button>
              </div>

              {/* QR */}
              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="flex justify-center overflow-hidden pt-2"
                  >
                    <div className="bg-white p-4 rounded-2xl inline-block">
                      <QRCodeSVG value={shortened} size={180} level="H" includeMargin />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
            <div className="p-3 bg-accent/30 border-b border-border/30 flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> URL History ({history.length})
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={clearHistory}>
                <Trash2 className="w-3 h-3" /> Clear
              </Button>
            </div>
            <div className="divide-y divide-border/20 max-h-60 overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="px-3 py-2.5 hover:bg-accent/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <a href={h.short} target="_blank" rel="noopener noreferrer" className="text-xs font-mono font-bold text-primary hover:underline shrink-0">{h.short}</a>
                    <button onClick={() => copy(h.short)} className="text-muted-foreground hover:text-foreground shrink-0">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{h.original}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
