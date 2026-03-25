import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImageCompare() {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [slider, setSlider] = useState(50);

  return (
    <ToolLayout title="Image Compare Slider" description="Compare two images side by side with a slider">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Image 1 (Before)</label>
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setImage1(r.result as string); r.readAsDataURL(f); }}} className="text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Image 2 (After)</label>
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setImage2(r.result as string); r.readAsDataURL(f); }}} className="text-sm" />
          </div>
        </div>
        {image1 && image2 ? (
          <>
            <input type="range" min={0} max={100} value={slider} onChange={e => setSlider(+e.target.value)} className="w-full" />
            <div className="relative rounded-xl overflow-hidden border border-border" style={{ height: 400 }}>
              <img src={image2} alt="After" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${slider}%` }}>
                <img src={image1} alt="Before" className="w-full h-full object-cover" style={{ width: `${10000 / slider}%`, maxWidth: "none" }} />
              </div>
              <div className="absolute top-0 bottom-0" style={{ left: `${slider}%`, transform: "translateX(-50%)" }}>
                <div className="w-1 h-full bg-white shadow-lg" />
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">Upload two images to compare</p>
        )}
      </div>
    </ToolLayout>
  );
}
