import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function MemeGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const fontSize = Math.max(20, img.width / 12);
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.lineWidth = fontSize / 10;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#fff";
      // Top text
      ctx.strokeText(topText.toUpperCase(), img.width / 2, fontSize + 20);
      ctx.fillText(topText.toUpperCase(), img.width / 2, fontSize + 20);
      // Bottom text
      ctx.strokeText(bottomText.toUpperCase(), img.width / 2, img.height - 20);
      ctx.fillText(bottomText.toUpperCase(), img.width / 2, img.height - 20);
    };
    img.src = image;
  };

  const download = () => { const a = document.createElement("a"); a.download = "meme.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Meme Generator" description="Create memes with custom top and bottom text">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(f); }}} className="text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input value={topText} onChange={e => setTopText(e.target.value)} placeholder="Top text" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
          <input value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="Bottom text" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl">Generate Meme</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to create a meme</p>}
      </div>
    </ToolLayout>
  );
}
