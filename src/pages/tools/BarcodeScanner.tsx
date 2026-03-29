import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Copy, ExternalLink, ScanBarcode, RotateCcw, CheckCircle2, History, Trash2 } from "lucide-react";

interface ScanResult {
  data: string;
  format: string;
  timestamp: Date;
}

export default function BarcodeScanner() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [scanning, setScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setScanning(true);

      if ('BarcodeDetector' in window) {
        const img = new Image();
        img.onload = async () => {
          try {
            const detector = new (window as any).BarcodeDetector({
              formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'itf', 'codabar', 'data_matrix', 'pdf417']
            });
            const barcodes = await detector.detect(img);
            if (barcodes.length > 0) {
              const newResults = barcodes.map((b: any) => ({
                data: b.rawValue,
                format: b.format.replace(/_/g, ' ').toUpperCase(),
                timestamp: new Date(),
              }));
              setResults(prev => [...newResults, ...prev].slice(0, 30));
              toast.success(`${barcodes.length} barcode(s) detected!`);
            } else {
              toast.error("No barcode found. Try a clearer image.");
            }
          } catch {
            toast.error("Detection failed. Try a different image.");
          }
          setScanning(false);
        };
        img.src = dataUrl;
      } else {
        // Fallback: try QR server API
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("https://api.qrserver.com/v1/read-qr-code/", { method: "POST", body: formData });
          const data = await res.json();
          const decoded = data?.[0]?.symbol?.[0]?.data;
          if (decoded) {
            setResults(prev => [{ data: decoded, format: "QR CODE", timestamp: new Date() }, ...prev].slice(0, 30));
            toast.success("Code decoded!");
          } else {
            toast.error("Could not decode. BarcodeDetector API recommended (Chrome 83+).");
          }
        } catch {
          toast.error("Try Chrome 83+ for full barcode support.");
        }
        setScanning(false);
      }
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
    if (file?.type.startsWith("image/")) processFile(file);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const latestResult = results[0];

  return (
    <ToolLayout title="Barcode Scanner" description="Scan barcodes and QR codes from images — supports 10+ formats">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Upload */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !imagePreview && fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all overflow-hidden ${
            dragOver ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40"
          }`}
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

          {scanning && (
            <motion.div
              className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <ScanBarcode className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="text-sm font-semibold ml-3">Scanning...</p>
            </motion.div>
          )}

          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Uploaded" className="max-h-56 mx-auto rounded-xl" />
              <div className="flex gap-2 mt-4 justify-center">
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                  <Upload className="w-3.5 h-3.5" /> Change
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={(e) => { e.stopPropagation(); setImagePreview(""); }}>
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Upload className="w-14 h-14 mx-auto text-muted-foreground/40" />
              </motion.div>
              <p className="font-semibold text-sm">Drop a barcode image or click to upload</p>
              <p className="text-xs text-muted-foreground">Supports PNG, JPG, GIF, WebP</p>
            </div>
          )}
        </motion.div>

        {/* Latest Result */}
        <AnimatePresence>
          {latestResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-border/50 bg-card overflow-hidden"
            >
              <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold">Decoded Result</span>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {latestResult.format}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <p className="font-mono text-sm font-semibold break-all select-all">{latestResult.data}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={() => copy(latestResult.data)}>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                  {latestResult.data.startsWith("http") && (
                    <a href={latestResult.data} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="rounded-lg gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Open
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {results.length > 1 && (
          <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10 flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Scan History ({results.length})</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => { setResults([]); toast.success("Cleared!"); }}>
                <Trash2 className="w-3 h-3" /> Clear
              </Button>
            </div>
            <div className="divide-y divide-border/20 max-h-48 overflow-y-auto">
              {results.slice(1).map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 hover:bg-accent/10 text-xs">
                  <span className="font-semibold text-primary shrink-0">{r.format}</span>
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
          <h3 className="text-xs font-bold mb-2">Supported Barcode Formats</h3>
          <div className="flex flex-wrap gap-2">
            {["QR Code", "EAN-13", "EAN-8", "Code 128", "Code 39", "UPC-A", "UPC-E", "ITF", "Codabar", "Data Matrix", "PDF417"].map(f => (
              <span key={f} className="px-2.5 py-1 rounded-full bg-accent/30 text-[10px] font-semibold">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
