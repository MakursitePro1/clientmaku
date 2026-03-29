import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Image, Copy, Upload, Download, FileText, Trash2 } from "lucide-react";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setBase64(dataUrl);
      setPreview(dataUrl);
      const img = new window.Image();
      img.onload = () => setDimensions({ w: img.width, h: img.height });
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <ToolLayout title="Image to Base64" description="Convert images to Base64 encoded strings and vice versa">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Upload */}
        <motion.div
          onClick={() => !preview && fileRef.current?.click()}
          className={`tool-section-card border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${preview ? "" : "border-primary/20 hover:border-primary/40"}`}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-lg" />
              <div className="flex gap-2 justify-center">
                <button className="tool-btn-primary px-4 py-2 text-xs flex items-center gap-1.5" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                  <Upload className="w-3.5 h-3.5" /> Change
                </button>
                <button className="tool-btn-primary px-4 py-2 text-xs flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))" }} onClick={(e) => { e.stopPropagation(); setBase64(""); setPreview(""); setFileName(""); }}>
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Upload className="w-14 h-14 mx-auto text-primary/30" />
              </motion.div>
              <p className="font-semibold text-sm gradient-text">Click or drop an image to convert</p>
              <p className="text-xs text-muted-foreground">Supports PNG, JPG, GIF, WebP, SVG</p>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        {preview && (
          <div className="grid grid-cols-4 gap-3">
            <div className="tool-stat-card">
              <Image className="w-5 h-5 mx-auto text-primary mb-1" />
              <div className="stat-value text-sm">{dimensions.w}×{dimensions.h}</div>
              <div className="stat-label">Dimensions</div>
            </div>
            <div className="tool-stat-card">
              <div className="stat-value text-sm">{formatSize(fileSize)}</div>
              <div className="stat-label">File Size</div>
            </div>
            <div className="tool-stat-card">
              <div className="stat-value text-sm">{formatSize(base64.length)}</div>
              <div className="stat-label">Base64 Size</div>
            </div>
            <div className="tool-stat-card">
              <FileText className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <div className="stat-value text-sm truncate">{fileName.split(".").pop()?.toUpperCase()}</div>
              <div className="stat-label">Format</div>
            </div>
          </div>
        )}

        {/* Base64 Output */}
        {base64 && (
          <div className="tool-section-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold gradient-text">🔗 Base64 String</h3>
              <button onClick={() => { navigator.clipboard.writeText(base64); toast.success("Base64 copied!"); }} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <textarea className="w-full p-4 bg-primary/5 rounded-xl border border-primary/10 font-mono text-[10px] h-32 resize-y" readOnly value={base64} />
          </div>
        )}

        {/* Decode Section */}
        <div className="tool-section-card p-4 space-y-3">
          <h3 className="text-sm font-bold gradient-text">🔓 Decode Base64 to Image</h3>
          <Input placeholder="Paste Base64 string here..." className="tool-input-colorful rounded-xl font-mono text-xs"
            onChange={e => {
              const val = e.target.value.trim();
              if (val.startsWith("data:image/")) {
                setPreview(val);
                setBase64(val);
              }
            }} />
        </div>
      </div>
    </ToolLayout>
  );
}
