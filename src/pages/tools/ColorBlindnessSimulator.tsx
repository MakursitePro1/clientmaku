import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const filters: Record<string, number[][]> = {
  Normal: [[1,0,0],[0,1,0],[0,0,1]],
  Protanopia: [[0.567,0.433,0],[0.558,0.442,0],[0,0.242,0.758]],
  Deuteranopia: [[0.625,0.375,0],[0.7,0.3,0],[0,0.3,0.7]],
  Tritanopia: [[0.95,0.05,0],[0,0.433,0.567],[0,0.475,0.525]],
  Achromatopsia: [[0.299,0.587,0.114],[0.299,0.587,0.114],[0.299,0.587,0.114]],
};

export default function ColorBlindnessSimulator() {
  const [image, setImage] = useState<string | null>(null);
  const [filter, setFilter] = useState("Normal");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalData = useRef<ImageData | null>(null);

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        originalData.current = ctx.getImageData(0, 0, img.width, img.height);
        setImage(reader.result as string);
        setFilter("Normal");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const applyFilter = (name: string) => {
    setFilter(name);
    if (!originalData.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const src = originalData.current;
    const out = ctx.createImageData(src.width, src.height);
    const m = filters[name];
    for (let i = 0; i < src.data.length; i += 4) {
      const r = src.data[i], g = src.data[i+1], b = src.data[i+2];
      out.data[i] = Math.min(255, m[0][0]*r + m[0][1]*g + m[0][2]*b);
      out.data[i+1] = Math.min(255, m[1][0]*r + m[1][1]*g + m[1][2]*b);
      out.data[i+2] = Math.min(255, m[2][0]*r + m[2][1]*g + m[2][2]*b);
      out.data[i+3] = src.data[i+3];
    }
    ctx.putImageData(out, 0, 0);
  };

  return (
    <ToolLayout title="Color Blindness Simulator" description="See how images look to people with color blindness">
      <div className="space-y-4 max-w-3xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} className="text-sm" />
        {image && (
          <div className="flex gap-2 flex-wrap">
            {Object.keys(filters).map(f => (
              <Button key={f} onClick={() => applyFilter(f)} variant={filter === f ? "default" : "outline"} size="sm" className="rounded-xl">{f}</Button>
            ))}
          </div>
        )}
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-12">Upload an image to simulate color blindness</p>}
      </div>
    </ToolLayout>
  );
}
