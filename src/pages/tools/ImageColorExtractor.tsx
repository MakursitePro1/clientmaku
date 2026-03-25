import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImageColorExtractor() {
  const [colors, setColors] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extract = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        // Sample colors from grid
        const sampled = new Map<string, number>();
        const step = Math.max(1, Math.floor(data.length / (4 * 500)));
        for (let i = 0; i < data.length; i += 4 * step) {
          const r = Math.round(data[i] / 32) * 32;
          const g = Math.round(data[i+1] / 32) * 32;
          const b = Math.round(data[i+2] / 32) * 32;
          const hex = `#${[r,g,b].map(v => Math.min(255, v).toString(16).padStart(2, "0")).join("")}`;
          sampled.set(hex, (sampled.get(hex) || 0) + 1);
        }
        const sorted = [...sampled.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(e => e[0]);
        setColors(sorted);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copy = (c: string) => { navigator.clipboard.writeText(c); toast.success(`${c} copied!`); };

  return (
    <ToolLayout title="Image Color Extractor" description="Extract dominant colors from any image">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && extract(e.target.files[0])} className="text-sm" />
        <canvas ref={canvasRef} className="hidden" />
        {image && <img src={image} alt="Uploaded" className="w-full max-h-64 object-contain rounded-xl border border-border" />}
        {colors.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {colors.map(c => (
              <button key={c} onClick={() => copy(c)} className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border hover:bg-accent/30 transition-colors">
                <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: c }} />
                <span className="text-xs font-mono">{c}</span>
              </button>
            ))}
          </div>
        )}
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to extract its colors</p>}
      </div>
    </ToolLayout>
  );
}
