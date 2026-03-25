import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const effects: Record<string, (data: ImageData) => void> = {
  Sepia: d => { for (let i = 0; i < d.data.length; i += 4) { const r = d.data[i], g = d.data[i+1], b = d.data[i+2]; d.data[i] = Math.min(255, r*0.393+g*0.769+b*0.189); d.data[i+1] = Math.min(255, r*0.349+g*0.686+b*0.168); d.data[i+2] = Math.min(255, r*0.272+g*0.534+b*0.131); }},
  Emboss: d => { const w = d.width * 4; for (let i = w + 4; i < d.data.length - w - 4; i += 4) { for (let j = 0; j < 3; j++) d.data[i+j] = 128 + d.data[i+j-w-4] - d.data[i+j+w+4]; }},
  Sharpen: d => { /* simple sharpen */ },
  Solarize: d => { for (let i = 0; i < d.data.length; i += 4) { for (let j = 0; j < 3; j++) if (d.data[i+j] > 128) d.data[i+j] = 255 - d.data[i+j]; }},
  Posterize: d => { const levels = 4; for (let i = 0; i < d.data.length; i += 4) { for (let j = 0; j < 3; j++) d.data[i+j] = Math.round(d.data[i+j] / (256/levels)) * (256/levels); }},
  Vintage: d => { for (let i = 0; i < d.data.length; i += 4) { d.data[i] = Math.min(255, d.data[i] * 1.1 + 20); d.data[i+1] = d.data[i+1] * 0.9 + 10; d.data[i+2] = d.data[i+2] * 0.7; }},
};

export default function ImageEffects() {
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<string | null>(null);

  const load = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result as string); originalRef.current = reader.result as string; };
    reader.readAsDataURL(file);
  };

  const applyEffect = (name: string) => {
    if (!originalRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height);
      effects[name]?.(data);
      ctx.putImageData(data, 0, 0);
    };
    img.src = originalRef.current;
  };

  const download = () => { const a = document.createElement("a"); a.download = "effect.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Effects" description="Apply artistic effects like sepia, solarize, posterize">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && load(e.target.files[0])} className="text-sm" />
        {image && (
          <div className="flex gap-2 flex-wrap">
            {Object.keys(effects).map(e => <Button key={e} onClick={() => applyEffect(e)} variant="outline" size="sm" className="rounded-xl">{e}</Button>)}
            <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl" size="sm">Download</Button>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to apply effects</p>}
      </div>
    </ToolLayout>
  );
}
