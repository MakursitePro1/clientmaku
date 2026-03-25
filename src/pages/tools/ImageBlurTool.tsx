import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ImageBlurTool() {
  const [image, setImage] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const apply = (src: string, blur: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";
    };
    img.src = src;
  };

  const load = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result as string); apply(reader.result as string, blurAmount); };
    reader.readAsDataURL(file);
  };

  const download = () => { const a = document.createElement("a"); a.download = "blurred.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Blur Tool" description="Apply blur effect to images">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && load(e.target.files[0])} className="text-sm" />
        {image && (
          <div className="flex gap-3 items-center">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Blur: {blurAmount}px</label>
            <input type="range" min={0} max={30} value={blurAmount} onChange={e => { setBlurAmount(+e.target.value); apply(image, +e.target.value); }} className="flex-1" />
            <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl">Download</Button>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to blur</p>}
      </div>
    </ToolLayout>
  );
}
