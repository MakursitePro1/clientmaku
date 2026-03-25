import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const presets = [
  { name: "Instagram Post", w: 1080, h: 1080 },
  { name: "Instagram Story", w: 1080, h: 1920 },
  { name: "Facebook Cover", w: 820, h: 312 },
  { name: "Facebook Post", w: 1200, h: 630 },
  { name: "Twitter Header", w: 1500, h: 500 },
  { name: "Twitter Post", w: 1200, h: 675 },
  { name: "LinkedIn Banner", w: 1584, h: 396 },
  { name: "YouTube Thumbnail", w: 1280, h: 720 },
  { name: "Pinterest Pin", w: 1000, h: 1500 },
];

export default function SocialImageResizer() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [preset, setPreset] = useState(presets[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const load = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { setImage(img); draw(img, preset); };
    img.src = URL.createObjectURL(file);
  };

  const draw = (img: HTMLImageElement, p: typeof presets[0]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = p.w;
    canvas.height = p.h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, p.w, p.h);
    const scale = Math.max(p.w / img.width, p.h / img.height);
    const sw = img.width * scale, sh = img.height * scale;
    ctx.drawImage(img, (p.w - sw) / 2, (p.h - sh) / 2, sw, sh);
  };

  const selectPreset = (p: typeof presets[0]) => {
    setPreset(p);
    if (image) draw(image, p);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${preset.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout title="Social Media Image Resizer" description="Resize images for all social media platforms">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={load} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary file:text-primary-foreground" />
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button key={p.name} onClick={() => selectPreset(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${preset.name === p.name ? "bg-primary text-primary-foreground border-primary" : "bg-accent/30 border-border hover:bg-accent/50"}`}>
              {p.name} ({p.w}×{p.h})
            </button>
          ))}
        </div>
        <div className="bg-accent/30 rounded-xl p-4 flex justify-center overflow-auto">
          <canvas ref={canvasRef} className="max-w-full max-h-96 rounded-lg" />
        </div>
        {image && <Button onClick={download} className="w-full gradient-bg text-primary-foreground rounded-xl">Download {preset.name}</Button>}
      </div>
    </ToolLayout>
  );
}
