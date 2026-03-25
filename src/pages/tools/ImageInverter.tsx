import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ImageInverter() {
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const invert = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height);
        for (let i = 0; i < data.data.length; i += 4) {
          data.data[i] = 255 - data.data[i];
          data.data[i + 1] = 255 - data.data[i + 1];
          data.data[i + 2] = 255 - data.data[i + 2];
        }
        ctx.putImageData(data, 0, 0);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const download = () => { const a = document.createElement("a"); a.download = "inverted.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Color Inverter" description="Invert all colors in an image">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && invert(e.target.files[0])} className="text-sm" />
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {image && <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl">Download Inverted</Button>}
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to invert colors</p>}
      </div>
    </ToolLayout>
  );
}
