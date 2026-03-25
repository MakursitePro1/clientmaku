import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ImageTextOverlay() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("Your Text Here");
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(48);
  const [posY, setPosY] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const apply = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText(text, img.width / 2, img.height * posY / 100);
      ctx.shadowBlur = 0;
    };
    img.src = image;
  };

  const download = () => { const a = document.createElement("a"); a.download = "text-overlay.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Text Overlay" description="Add text overlays on images">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(f); }}} className="text-sm" />
        <div className="flex gap-3 flex-wrap items-center">
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Text" className="rounded-xl flex-1" />
          <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 p-1 rounded-xl" />
          <div className="flex items-center gap-1"><label className="text-xs text-muted-foreground">Size:</label><Input type="number" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-16 rounded-xl" min={10} /></div>
          <div className="flex items-center gap-1"><label className="text-xs text-muted-foreground">Y%:</label><Input type="number" value={posY} onChange={e => setPosY(+e.target.value)} className="w-16 rounded-xl" min={5} max={95} /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={apply} className="gradient-bg text-primary-foreground rounded-xl">Apply Text</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to add text</p>}
      </div>
    </ToolLayout>
  );
}
