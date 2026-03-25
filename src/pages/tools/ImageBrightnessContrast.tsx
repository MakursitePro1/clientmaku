import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ImageBrightnessContrast() {
  const [image, setImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<ImageData | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const load = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        const canvas = canvasRef.current!;
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        originalRef.current = ctx.getImageData(0, 0, img.width, img.height);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const apply = () => {
    if (!originalRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const src = originalRef.current;
    const out = ctx.createImageData(src.width, src.height);
    const b = brightness, c = contrast / 100 + 1, s = saturation / 100 + 1;
    for (let i = 0; i < src.data.length; i += 4) {
      let r = src.data[i] + b, g = src.data[i + 1] + b, bl = src.data[i + 2] + b;
      r = ((r - 128) * c) + 128; g = ((g - 128) * c) + 128; bl = ((bl - 128) * c) + 128;
      const gray = 0.299 * r + 0.587 * g + 0.114 * bl;
      r = gray + (r - gray) * s; g = gray + (g - gray) * s; bl = gray + (bl - gray) * s;
      out.data[i] = Math.min(255, Math.max(0, r));
      out.data[i + 1] = Math.min(255, Math.max(0, g));
      out.data[i + 2] = Math.min(255, Math.max(0, bl));
      out.data[i + 3] = src.data[i + 3];
    }
    ctx.putImageData(out, 0, 0);
  };

  const download = () => { const a = document.createElement("a"); a.download = "adjusted.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Brightness & Contrast Editor" description="Adjust image brightness, contrast and saturation">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && load(e.target.files[0])} className="text-sm" />
        {image && (
          <>
            <div className="space-y-3">
              <div><label className="text-sm text-muted-foreground">Brightness: {brightness}</label><input type="range" min={-100} max={100} value={brightness} onChange={e => setBrightness(+e.target.value)} className="w-full" /></div>
              <div><label className="text-sm text-muted-foreground">Contrast: {contrast}</label><input type="range" min={-100} max={100} value={contrast} onChange={e => setContrast(+e.target.value)} className="w-full" /></div>
              <div><label className="text-sm text-muted-foreground">Saturation: {saturation}</label><input type="range" min={-100} max={100} value={saturation} onChange={e => setSaturation(+e.target.value)} className="w-full" /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={apply} className="gradient-bg text-primary-foreground rounded-xl">Apply</Button>
              <Button onClick={() => { setBrightness(0); setContrast(0); setSaturation(0); if (originalRef.current && canvasRef.current) canvasRef.current.getContext("2d")!.putImageData(originalRef.current, 0, 0); }} variant="outline" className="rounded-xl">Reset</Button>
              <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to adjust</p>}
      </div>
    </ToolLayout>
  );
}
