import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ImageFlipRotate() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { imgRef.current = img; setImage(reader.result as string); render(img, 0, false, false); };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const render = (img: HTMLImageElement, rot: number, fh: boolean, fv: boolean) => {
    const canvas = canvasRef.current!;
    const isVertical = rot % 180 !== 0;
    canvas.width = isVertical ? img.height : img.width;
    canvas.height = isVertical ? img.width : img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(fh ? -1 : 1, fv ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  };

  const apply = (rot: number, fh: boolean, fv: boolean) => {
    setRotation(rot); setFlipH(fh); setFlipV(fv);
    if (imgRef.current) render(imgRef.current, rot, fh, fv);
  };

  const download = () => { const a = document.createElement("a"); a.download = "transformed.png"; a.href = canvasRef.current!.toDataURL(); a.click(); };

  return (
    <ToolLayout title="Image Flip & Rotate" description="Flip and rotate images easily">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} className="text-sm" />
        {image && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => apply((rotation + 90) % 360, flipH, flipV)} variant="outline" className="rounded-xl">Rotate 90°</Button>
            <Button onClick={() => apply((rotation + 180) % 360, flipH, flipV)} variant="outline" className="rounded-xl">Rotate 180°</Button>
            <Button onClick={() => apply(rotation, !flipH, flipV)} variant="outline" className="rounded-xl">Flip Horizontal</Button>
            <Button onClick={() => apply(rotation, flipH, !flipV)} variant="outline" className="rounded-xl">Flip Vertical</Button>
            <Button onClick={() => apply(0, false, false)} variant="outline" className="rounded-xl">Reset</Button>
            <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl">Download</Button>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 500, display: image ? "block" : "none" }} />
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to transform</p>}
      </div>
    </ToolLayout>
  );
}
