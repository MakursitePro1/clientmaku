import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";

const ImageResizer = () => {
  const [image, setImage] = useState<{ url: string; w: number; h: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lock, setLock] = useState(true);
  const [resized, setResized] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ratioRef = useRef(1);

  const handleFile = (file: File) => {
    const img = new window.Image();
    img.onload = () => {
      setImage({ url: URL.createObjectURL(file), w: img.width, h: img.height });
      setWidth(img.width.toString());
      setHeight(img.height.toString());
      ratioRef.current = img.width / img.height;
      setResized(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const onWidthChange = (v: string) => {
    setWidth(v);
    if (lock && v) setHeight(Math.round(parseInt(v) / ratioRef.current).toString());
  };
  const onHeightChange = (v: string) => {
    setHeight(v);
    if (lock && v) setWidth(Math.round(parseInt(v) * ratioRef.current).toString());
  };

  const resize = () => {
    if (!image) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const w = parseInt(width) || img.width;
      const h = parseInt(height) || img.height;
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      setResized(canvas.toDataURL("image/png"));
    };
    img.src = image.url;
  };

  const download = () => {
    if (!resized) return;
    const a = document.createElement("a"); a.href = resized; a.download = `resized_${width}x${height}.png`; a.click();
  };

  const presets = [
    { label: "Profile (200×200)", w: 200, h: 200 },
    { label: "HD (1280×720)", w: 1280, h: 720 },
    { label: "Full HD (1920×1080)", w: 1920, h: 1080 },
    { label: "Instagram (1080×1080)", w: 1080, h: 1080 },
    { label: "Facebook Cover (820×312)", w: 820, h: 312 },
  ];

  return (
    <ToolLayout title="Image Resizer" description="Resize images to exact dimensions with presets">
      <div className="space-y-6">
        <canvas ref={canvasRef} className="hidden" />

        {!image ? (
          <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border/50 rounded-2xl cursor-pointer hover:border-primary/30 transition-colors bg-card">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <span className="text-muted-foreground font-medium">Upload image to resize</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button key={p.label} onClick={() => { setWidth(p.w.toString()); setHeight(p.h.toString()); setLock(false); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border/50 text-muted-foreground hover:border-primary/30 transition-colors">
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold mb-1 block">Width (px)</label>
                <Input type="number" value={width} onChange={e => onWidthChange(e.target.value)} className="rounded-xl bg-card border-border/50" />
              </div>
              <button onClick={() => setLock(!lock)} className={`mt-5 p-2 rounded-lg border ${lock ? "border-primary text-primary" : "border-border/50 text-muted-foreground"}`}>
                {lock ? "🔗" : "🔓"}
              </button>
              <div className="flex-1">
                <label className="text-sm font-semibold mb-1 block">Height (px)</label>
                <Input type="number" value={height} onChange={e => onHeightChange(e.target.value)} className="rounded-xl bg-card border-border/50" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Original: {image.w} × {image.h}px</p>
            <div className="flex gap-3">
              <Button onClick={resize} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Resize</Button>
              {resized && <Button onClick={download} variant="outline" className="rounded-xl gap-2"><Download className="w-4 h-4" /> Download</Button>}
              <Button variant="outline" onClick={() => { setImage(null); setResized(null); }} className="rounded-xl">Reset</Button>
            </div>
            {resized && <img src={resized} alt="Resized" className="max-w-full max-h-[400px] rounded-xl border border-border/50 mx-auto object-contain bg-secondary/30" />}
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageResizer;
