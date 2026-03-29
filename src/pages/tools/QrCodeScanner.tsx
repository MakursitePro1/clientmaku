import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, Copy, ExternalLink, Image, RotateCcw, CheckCircle2, AlertCircle, FileText, Link2 } from "lucide-react";

interface ScanResult {
  data: string;
  type: "url" | "text" | "email" | "phone" | "wifi" | "vcard" | "sms";
  timestamp: Date;
}

function detectType(data: string): ScanResult["type"] {
  if (/^https?:\/\//i.test(data)) return "url";
  if (/^mailto:/i.test(data) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) return "email";
  if (/^tel:/i.test(data) || /^\+?\d[\d\s-]{7,}$/.test(data)) return "phone";
  if (/^WIFI:/i.test(data)) return "wifi";
  if (/^BEGIN:VCARD/i.test(data)) return "vcard";
  if (/^SMSTO:/i.test(data)) return "sms";
  return "text";
}

function parseWifi(data: string) {
  const ssid = data.match(/S:([^;]*)/)?.[1] || "";
  const pass = data.match(/P:([^;]*)/)?.[1] || "";
  const enc = data.match(/T:([^;]*)/)?.[1] || "";
  return { ssid, pass, enc };
}

const typeIcons: Record<ScanResult["type"], { icon: any; label: string; color: string }> = {
  url: { icon: Link2, label: "URL", color: "text-blue-500" },
  text: { icon: FileText, label: "Text", color: "text-foreground" },
  email: { icon: FileText, label: "Email", color: "text-green-500" },
  phone: { icon: FileText, label: "Phone", color: "text-purple-500" },
  wifi: { icon: FileText, label: "WiFi", color: "text-yellow-500" },
  vcard: { icon: FileText, label: "Contact", color: "text-pink-500" },
  sms: { icon: FileText, label: "SMS", color: "text-orange-500" },
};

export default function QrCodeScanner() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [image, setImage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      setImage(reader.result as string);
      setScanning(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        const decoded = data?.[0]?.symbol?.[0]?.data;

        if (decoded) {
          const type = detectType(decoded);
          const result: ScanResult = { data: decoded, type, timestamp: new Date() };
          setResults(prev => [result, ...prev].slice(0, 20));
          toast.success("QR Code decoded successfully!");
        } else {
          toast.error("Could not decode QR code from this image");
        }
      } catch {
        toast.error("Error decoding. Please try another image.");
      }
      setScanning(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  };

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) processFile(file);
      }
    }
  }, [processFile]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const reset = () => {
    setImage("");
    setScanning(false);
  };

  const latestResult = results[0];

  return (
    <ToolLayout title="QR Code Scanner" description="Scan QR codes from images — supports URL, WiFi, vCard, SMS and more">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Upload Area */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !image && fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all overflow-hidden ${
            dragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/50 hover:border-primary/40"
          }`}
          whileHover={{ scale: image ? 1 : 1.01 }}
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

          {scanning && (
            <motion.div
              className="absolute inset-0 bg-primary/5 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <ScanLine className="w-12 h-12 text-primary mx-auto" />
                </motion.div>
                <p className="text-sm font-semibold mt-3 text-primary">Scanning QR Code...</p>
              </div>
            </motion.div>
          )}

          {image ? (
            <div className="relative">
              <img src={image} alt="QR" className="max-h-64 mx-auto rounded-xl" />
              <div className="flex gap-2 mt-4 justify-center">
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                  <Image className="w-3.5 h-3.5" /> Change Image
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={(e) => { e.stopPropagation(); reset(); }}>
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Upload className="w-14 h-14 mx-auto text-muted-foreground/40" />
              </motion.div>
              <div>
                <p className="font-semibold text-sm">Drop an image, click to upload, or paste from clipboard</p>
                <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, GIF, WebP</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Latest Result */}
        <AnimatePresence>
          {latestResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-border/50 bg-card overflow-hidden"
            >
              <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold">Decoded Result</span>
                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 ${typeIcons[latestResult.type].color}`}>
                  {typeIcons[latestResult.type].label}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* WiFi parsed info */}
                {latestResult.type === "wifi" && (() => {
                  const wifi = parseWifi(latestResult.data);
                  return (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Network", val: wifi.ssid },
                        { label: "Password", val: wifi.pass || "None" },
                        { label: "Security", val: wifi.enc || "Open" },
                      ].map(f => (
                        <div key={f.label} className="p-3 bg-accent/20 rounded-xl text-center">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase">{f.label}</p>
                          <p className="font-bold text-sm mt-1 truncate">{f.val}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Raw data */}
                <div className="p-3 bg-accent/20 rounded-xl">
                  <p className="font-mono text-sm break-all select-all">{latestResult.data}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={() => copy(latestResult.data)}>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                  {latestResult.type === "url" && (
                    <a href={latestResult.data} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="rounded-lg gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Open Link
                      </Button>
                    </a>
                  )}
                  {latestResult.type === "email" && (
                    <a href={`mailto:${latestResult.data.replace(/^mailto:/i, "")}`}>
                      <Button size="sm" variant="outline" className="rounded-lg gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Send Email
                      </Button>
                    </a>
                  )}
                  {latestResult.type === "phone" && (
                    <a href={`tel:${latestResult.data.replace(/^tel:/i, "")}`}>
                      <Button size="sm" variant="outline" className="rounded-lg gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Call
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan History */}
        {results.length > 1 && (
          <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10 flex items-center justify-between">
              <span className="text-xs font-bold">📋 Scan History ({results.length})</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setResults([])}>Clear</Button>
            </div>
            <div className="divide-y divide-border/20 max-h-48 overflow-y-auto">
              {results.slice(1).map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 hover:bg-accent/10 text-xs">
                  <span className={`font-semibold ${typeIcons[r.type].color}`}>{typeIcons[r.type].label}</span>
                  <span className="font-mono truncate flex-1">{r.data}</span>
                  <button onClick={() => copy(r.data)} className="text-muted-foreground hover:text-foreground shrink-0">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supported formats */}
        <div className="rounded-xl border border-border/30 bg-card p-4">
          <h3 className="text-xs font-bold mb-2">Supported QR Code Types</h3>
          <div className="flex flex-wrap gap-2">
            {["URL", "Plain Text", "WiFi", "vCard", "Email", "Phone", "SMS"].map(type => (
              <span key={type} className="px-2.5 py-1 rounded-full bg-accent/30 text-[10px] font-semibold">{type}</span>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
