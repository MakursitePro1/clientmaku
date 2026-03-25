import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 200, h: 200 });
  const [imgDim, setImgDim] = useState({ w: 0, h: 0 });

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setImgDim({ w: img.width, h: img.height });
        setCrop({ x: 0, y: 0, w: Math.min(200, img.width), h: Math.min(200, img.height) });
      };
      img.src = reader.result as string;
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const cropImage = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.w;
      canvas.height = crop.h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      const a = document.createElement("a");
      a.download = "cropped.png";
      a.href = canvas.toDataURL();
      a.click();
      toast.success("Image cropped and downloaded!");
    };
    img.src = image;
  };

  return (
    <ToolLayout title="Image Cropper" description="Crop images to specific dimensions">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} className="text-sm" />
        {image && (
          <>
            <div className="grid grid-cols-4 gap-2">
              <div><label className="text-xs text-muted-foreground">X</label><Input type="number" value={crop.x} onChange={e => setCrop({...crop, x: +e.target.value})} className="rounded-xl" /></div>
              <div><label className="text-xs text-muted-foreground">Y</label><Input type="number" value={crop.y} onChange={e => setCrop({...crop, y: +e.target.value})} className="rounded-xl" /></div>
              <div><label className="text-xs text-muted-foreground">Width</label><Input type="number" value={crop.w} onChange={e => setCrop({...crop, w: +e.target.value})} className="rounded-xl" /></div>
              <div><label className="text-xs text-muted-foreground">Height</label><Input type="number" value={crop.h} onChange={e => setCrop({...crop, h: +e.target.value})} className="rounded-xl" /></div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[[1,1],[16,9],[4,3],[3,2],[1,1.414]].map(([w,h]) => (
                <Button key={`${w}:${h}`} size="sm" variant="outline" className="rounded-xl" onClick={() => setCrop({...crop, w: Math.min(imgDim.w, 400), h: Math.min(imgDim.h, Math.round(400 * h / w))})}>{w}:{h}</Button>
              ))}
            </div>
            <img src={image} alt="Preview" className="w-full rounded-xl border border-border max-h-80 object-contain" />
            <Button onClick={cropImage} className="gradient-bg text-primary-foreground rounded-xl">Crop & Download</Button>
          </>
        )}
        {!image && <p className="text-center text-muted-foreground py-8">Upload an image to crop</p>}
      </div>
    </ToolLayout>
  );
}
