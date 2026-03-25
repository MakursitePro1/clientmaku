import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function OnlineImageEditor() {
  const [image, setImage] = useState<string>("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
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
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = image;
  };

  const reset = () => { setBrightness(100); setContrast(100); setSaturation(100); setBlur(0); setRotation(0); };

  return (
    <ToolLayout title="Online Image Editor" description="Edit images with filters, crop, resize and more">
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {image ? (
            <img src={image} alt="Edit" className="max-h-64 mx-auto rounded-xl" style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`, transform: `rotate(${rotation}deg)` }} />
          ) : <p className="text-muted-foreground">Click to upload an image</p>}
        </div>
        {image && (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: "Brightness", value: brightness, set: setBrightness, min: 0, max: 200 },
                { label: "Contrast", value: contrast, set: setContrast, min: 0, max: 200 },
                { label: "Saturation", value: saturation, set: setSaturation, min: 0, max: 200 },
                { label: "Blur", value: blur, set: setBlur, min: 0, max: 20 },
                { label: "Rotation", value: rotation, set: setRotation, min: 0, max: 360 },
              ].map((s) => (
                <div key={s.label}>
                  <label className="text-sm font-semibold mb-2 block">{s.label}: {s.value}</label>
                  <Slider value={[s.value]} onValueChange={([v]) => s.set(v)} min={s.min} max={s.max} step={1} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Download</Button>
              <Button onClick={reset} variant="outline" className="rounded-xl">Reset</Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
