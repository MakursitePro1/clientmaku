import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ImagePixelator() {
  const [image, setImage] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pixelate = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      applyPixelation(reader.result as string, pixelSize);
    };
    reader.readAsDataURL(file);
  };

  const applyPixelation = (src: string, size: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      const sw = Math.ceil(img.width / size);
      const sh = Math.ceil(img.height / size);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, sw, sh);
      ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, img.width, img.height);
    };
    img.src = src;
  };

  const download = () => { const a = document.createElement("a"); a.download = "pixelated.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Pixelator" description="Pixelate images with adjustable block size">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && pixelate(e.target.files[0])} className="text-sm" />
        {image && (
          <div className="flex gap-3 items-center">
            <label className="text-sm text-muted-foreground">Pixel Size: {pixelSize}</label>
            <input type="range" min={2} max={50} value={pixelSize} onChange={e => { setPixelSize(+e.target.value); applyPixelation(image, +e.target.value); }} className="flex-1" />
            <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl">Download</Button>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to pixelate</p>}
      </div>
    </ToolLayout>
  );
}
