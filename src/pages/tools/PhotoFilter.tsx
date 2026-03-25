import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const filters = [
  { name: "None", style: "" },
  { name: "Grayscale", style: "grayscale(100%)" },
  { name: "Sepia", style: "sepia(100%)" },
  { name: "Vintage", style: "sepia(50%) contrast(80%) brightness(90%)" },
  { name: "Cool", style: "hue-rotate(180deg) saturate(80%)" },
  { name: "Warm", style: "hue-rotate(-30deg) saturate(150%) brightness(105%)" },
  { name: "High Contrast", style: "contrast(150%) brightness(110%)" },
  { name: "Dramatic", style: "contrast(130%) brightness(80%) saturate(120%)" },
  { name: "Fade", style: "brightness(120%) saturate(60%)" },
  { name: "Invert", style: "invert(100%)" },
];

export default function PhotoFilter() {
  const [image, setImage] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = filters[activeFilter].style || "none";
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "filtered-photo.png";
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolLayout title="Photo Filter" description="Apply beautiful filters to your photos">
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {image ? (
            <img src={image} alt="Photo" className="max-h-64 mx-auto rounded-xl" style={{ filter: filters[activeFilter].style || "none" }} />
          ) : <p className="text-muted-foreground">Click to upload a photo</p>}
        </div>
        {image && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {filters.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFilter(i)}
                  className={`rounded-xl p-3 text-sm font-medium transition-all border ${activeFilter === i ? "border-primary bg-accent" : "border-border hover:border-primary/30"}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Download Filtered Photo</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
