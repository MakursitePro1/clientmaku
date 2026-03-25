import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Upload, Download, Minus } from "lucide-react";

const ImageCompressor = () => {
  const [image, setImage] = useState<{ file: File; url: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number; blob: Blob } | null>(null);
  const [quality, setQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState(1920);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage({ file, url, size: file.size });
    setCompressed(null);
  };

  const compress = useCallback(() => {
    if (!image) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) {
          setCompressed({ url: URL.createObjectURL(blob), size: blob.size, blob });
          toast({ title: "Compressed!", description: `${formatSize(image.size)} → ${formatSize(blob.size)} (${Math.round((1 - blob.size / image.size) * 100)}% reduced)` });
        }
      }, "image/jpeg", quality / 100);
    };
    img.src = image.url;
  }, [image, quality, maxWidth]);

  const download = () => {
    if (!compressed) return;
    const a = document.createElement("a"); a.href = compressed.url; a.download = "compressed.jpg"; a.click();
  };

  const formatSize = (bytes: number) => bytes > 1048576 ? `${(bytes / 1048576).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <ToolLayout title="Image Compressor" description="Compress images to reduce file size while maintaining quality">
      <div className="space-y-6">
        <canvas ref={canvasRef} className="hidden" />

        {!image ? (
          <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border/50 rounded-2xl cursor-pointer hover:border-primary/30 transition-colors bg-card">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <span className="text-muted-foreground font-medium">Click or drag to upload image</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Quality: {quality}%</label>
                <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Max Width: {maxWidth}px</label>
                <input type="range" min="320" max="3840" step="80" value={maxWidth} onChange={e => setMaxWidth(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={compress} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2">
                <Minus className="w-4 h-4" /> Compress
              </Button>
              {compressed && <Button onClick={download} variant="outline" className="rounded-xl gap-2"><Download className="w-4 h-4" /> Download</Button>}
              <Button variant="outline" onClick={() => { setImage(null); setCompressed(null); }} className="rounded-xl">Reset</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-sm font-semibold">Original</span><span className="text-xs text-muted-foreground">{formatSize(image.size)}</span></div>
                <img src={image.url} alt="Original" className="w-full rounded-xl border border-border/50 object-contain max-h-[300px] bg-secondary/30" />
              </div>
              {compressed && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><span className="text-sm font-semibold">Compressed</span><span className="text-xs gradient-text font-bold">{formatSize(compressed.size)} ({Math.round((1 - compressed.size / image.size) * 100)}% smaller)</span></div>
                  <img src={compressed.url} alt="Compressed" className="w-full rounded-xl border border-border/50 object-contain max-h-[300px] bg-secondary/30" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageCompressor;
