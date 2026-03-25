import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ImageCollage() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid"|"horizontal"|"vertical">("grid");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addImages = (files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const generate = async () => {
    if (images.length < 2) return;
    const loaded = await Promise.all(images.map(src => new Promise<HTMLImageElement>(res => { const img = new Image(); img.onload = () => res(img); img.src = src; })));
    const canvas = canvasRef.current!;
    const gap = 8;
    const maxW = 800;

    if (layout === "horizontal") {
      const h = 400;
      const totalW = loaded.reduce((s, img) => s + (img.width * h / img.height), 0) + gap * (loaded.length - 1);
      canvas.width = totalW; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, totalW, h);
      let x = 0;
      loaded.forEach(img => { const w = img.width * h / img.height; ctx.drawImage(img, x, 0, w, h); x += w + gap; });
    } else if (layout === "vertical") {
      const w = maxW;
      const totalH = loaded.reduce((s, img) => s + (img.height * w / img.width), 0) + gap * (loaded.length - 1);
      canvas.width = w; canvas.height = totalH;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, w, totalH);
      let y = 0;
      loaded.forEach(img => { const h = img.height * w / img.width; ctx.drawImage(img, 0, y, w, h); y += h + gap; });
    } else {
      const cols = Math.ceil(Math.sqrt(loaded.length));
      const cellW = Math.floor(maxW / cols);
      const rows = Math.ceil(loaded.length / cols);
      canvas.width = cols * cellW + gap * (cols - 1);
      canvas.height = rows * cellW + gap * (rows - 1);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      loaded.forEach((img, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x = col * (cellW + gap), y = row * (cellW + gap);
        const scale = Math.min(cellW / img.width, cellW / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, x + (cellW - w) / 2, y + (cellW - h) / 2, w, h);
      });
    }
  };

  const download = () => { const a = document.createElement("a"); a.download = "collage.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Collage Maker" description="Create photo collages from multiple images">
      <div className="space-y-4 max-w-3xl mx-auto">
        <input type="file" accept="image/*" multiple onChange={e => e.target.files && addImages(e.target.files)} className="text-sm" />
        {images.length > 0 && (
          <>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-sm text-muted-foreground">{images.length} images</span>
              {(["grid", "horizontal", "vertical"] as const).map(l => (
                <Button key={l} onClick={() => setLayout(l)} variant={layout === l ? "default" : "outline"} size="sm" className="rounded-xl capitalize">{l}</Button>
              ))}
              <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl">Generate</Button>
              <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
              <Button onClick={() => setImages([])} variant="outline" size="sm" className="rounded-xl">Clear All</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-border" />)}
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 600 }} />
        {images.length === 0 && <p className="text-center text-muted-foreground py-8">Upload multiple images to create a collage</p>}
      </div>
    </ToolLayout>
  );
}
