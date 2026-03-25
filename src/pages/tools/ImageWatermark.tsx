import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ImageWatermark() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("Cyber Venom");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(40);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const apply = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = `rgba(255,255,255,${opacity / 100})`;
      ctx.textAlign = "center";
      // Diagonal watermarks
      const step = fontSize * 4;
      ctx.save();
      ctx.rotate(-Math.PI / 6);
      for (let y = -img.height; y < img.height * 2; y += step) {
        for (let x = -img.width; x < img.width * 2; x += step) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    };
    img.src = image;
  };

  const download = () => {
    const a = document.createElement("a");
    a.download = "watermarked.png";
    a.href = canvasRef.current!.toDataURL();
    a.click();
  };

  return (
    <ToolLayout title="Image Watermark Adder" description="Add text watermarks to your images">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(f); }}} className="text-sm" />
        <div className="flex gap-3 flex-wrap">
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Watermark text" className="rounded-xl flex-1" />
          <div className="flex items-center gap-1"><label className="text-xs text-muted-foreground">Opacity:</label><Input type="number" value={opacity} onChange={e => setOpacity(+e.target.value)} min={5} max={100} className="w-16 rounded-xl" /></div>
          <div className="flex items-center gap-1"><label className="text-xs text-muted-foreground">Size:</label><Input type="number" value={fontSize} onChange={e => setFontSize(+e.target.value)} min={10} max={200} className="w-16 rounded-xl" /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={apply} className="gradient-bg text-primary-foreground rounded-xl">Apply Watermark</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to add watermark</p>}
      </div>
    </ToolLayout>
  );
}
