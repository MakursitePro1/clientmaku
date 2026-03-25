import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ImageToGrayscale() {
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convert = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height);
        for (let i = 0; i < data.data.length; i += 4) {
          const avg = data.data[i] * 0.299 + data.data[i + 1] * 0.587 + data.data[i + 2] * 0.114;
          data.data[i] = data.data[i + 1] = data.data[i + 2] = avg;
        }
        ctx.putImageData(data, 0, 0);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const download = () => { const a = document.createElement("a"); a.download = "grayscale.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image to Grayscale" description="Convert color images to grayscale">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && convert(e.target.files[0])} className="text-sm" />
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {image && <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl">Download Grayscale</Button>}
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to convert to grayscale</p>}
      </div>
    </ToolLayout>
  );
}
