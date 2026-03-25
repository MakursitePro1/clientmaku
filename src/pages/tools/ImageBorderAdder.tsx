import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ImageBorderAdder() {
  const [image, setImage] = useState<string | null>(null);
  const [borderWidth, setBorderWidth] = useState(20);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const apply = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const b = borderWidth;
      canvas.width = img.width + b * 2;
      canvas.height = img.height + b * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (borderRadius > 0) {
        ctx.save();
        const r = borderRadius;
        ctx.beginPath();
        ctx.moveTo(b + r, b);
        ctx.lineTo(b + img.width - r, b);
        ctx.quadraticCurveTo(b + img.width, b, b + img.width, b + r);
        ctx.lineTo(b + img.width, b + img.height - r);
        ctx.quadraticCurveTo(b + img.width, b + img.height, b + img.width - r, b + img.height);
        ctx.lineTo(b + r, b + img.height);
        ctx.quadraticCurveTo(b, b + img.height, b, b + img.height - r);
        ctx.lineTo(b, b + r);
        ctx.quadraticCurveTo(b, b, b + r, b);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, b, b);
        ctx.restore();
      } else {
        ctx.drawImage(img, b, b);
      }
    };
    img.src = image;
  };

  const download = () => { const a = document.createElement("a"); a.download = "bordered.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Border Adder" description="Add customizable borders to your images">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(f); }}} className="text-sm" />
        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex items-center gap-1"><label className="text-xs text-muted-foreground">Width:</label><Input type="number" value={borderWidth} onChange={e => setBorderWidth(+e.target.value)} className="w-16 rounded-xl" min={1} max={100} /></div>
          <div className="flex items-center gap-1"><label className="text-xs text-muted-foreground">Color:</label><Input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-12 h-10 p-1 rounded-xl" /></div>
          <div className="flex items-center gap-1"><label className="text-xs text-muted-foreground">Radius:</label><Input type="number" value={borderRadius} onChange={e => setBorderRadius(+e.target.value)} className="w-16 rounded-xl" min={0} max={100} /></div>
          <Button onClick={apply} className="gradient-bg text-primary-foreground rounded-xl">Apply</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to add border</p>}
      </div>
    </ToolLayout>
  );
}
