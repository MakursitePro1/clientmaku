import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Type } from "lucide-react";

export default function FaviconGenerator() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [letter, setLetter] = useState("A");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [textColor, setTextColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(20);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

  const drawFavicon = useCallback(
    (size: number, canvas?: HTMLCanvasElement) => {
      const c = canvas || canvasRef.current;
      if (!c) return "";
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d")!;

      const r = (borderRadius / 100) * (size / 2);
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, r);
      ctx.clip();

      if (mode === "text") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = textColor;
        ctx.font = `bold ${size * 0.6}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(letter.slice(0, 2), size / 2, size / 2 + size * 0.04);
      } else if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        ctx.drawImage(img, 0, 0, size, size);
      }

      return c.toDataURL("image/png");
    },
    [mode, letter, bgColor, textColor, borderRadius, imageSrc]
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
      setMode("image");
    };
    reader.readAsDataURL(file);
  };

  const downloadFavicon = (size: number) => {
    const tempCanvas = document.createElement("canvas");
    drawFavicon(size, tempCanvas);
    const link = document.createElement("a");
    link.download = `favicon-${size}x${size}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  const downloadAll = () => sizes.forEach((s) => downloadFavicon(s));

  // Draw preview
  const previewUrl = (() => {
    const c = document.createElement("canvas");
    return drawFavicon(192, c);
  })();

  return (
    <ToolLayout title="Favicon Generator" description="Create favicons from text or images in all standard sizes">
      <div className="space-y-6">
        <div className="flex gap-3">
          <Button variant={mode === "text" ? "default" : "outline"} className="rounded-xl" onClick={() => setMode("text")}>
            <Type className="w-4 h-4 mr-2" /> Text Mode
          </Button>
          <Button variant={mode === "image" ? "default" : "outline"} className="rounded-xl" onClick={() => setMode("image")}>
            <Upload className="w-4 h-4 mr-2" /> Image Mode
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {mode === "text" ? (
              <>
                <div className="space-y-2">
                  <Label>Letter(s) (max 2)</Label>
                  <Input value={letter} onChange={(e) => setLetter(e.target.value.slice(0, 2))} className="rounded-xl text-2xl text-center font-bold" maxLength={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                      <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="rounded-xl font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                      <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="rounded-xl font-mono" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="rounded-xl" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Border Radius: {borderRadius}%</Label>
              <input type="range" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-accent/30 rounded-2xl p-8 border border-border/50">
              <img src={previewUrl} alt="Favicon preview" className="w-32 h-32" />
            </div>
            <span className="text-sm text-muted-foreground">Preview (192×192)</span>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <Button onClick={downloadAll} className="gradient-bg text-primary-foreground rounded-xl font-semibold">
          <Download className="w-4 h-4 mr-2" /> Download All Sizes
        </Button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sizes.map((s) => (
            <Button key={s} variant="outline" className="rounded-xl" onClick={() => downloadFavicon(s)}>
              <Download className="w-3 h-3 mr-1" /> {s}×{s}
            </Button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
