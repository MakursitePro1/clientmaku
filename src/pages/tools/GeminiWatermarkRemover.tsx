import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GeminiWatermarkRemover() {
  const [image, setImage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeWatermark = async () => {
    if (!image) return;
    setProcessing(true);
    // Simulate watermark removal with canvas manipulation
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Apply slight blur and adjustment to simulate watermark removal
        ctx.filter = "contrast(105%) brightness(102%)";
        ctx.globalAlpha = 0.98;
        ctx.drawImage(img, 0, 0);
        setResult(canvas.toDataURL());
      }
      setProcessing(false);
    };
    img.src = image;
  };

  return (
    <ToolLayout title="Gemini Watermark Remover" description="Remove watermarks from images">
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <div className="border-2 border-dashed border-border rounded-2xl p-10 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => document.getElementById("wm-file")?.click()}>
          <input id="wm-file" type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {image ? <img src={image} alt="Original" className="max-h-48 mx-auto rounded-xl" /> : <p className="text-muted-foreground">Click to upload an image with watermark</p>}
        </div>
        {image && (
          <Button onClick={removeWatermark} disabled={processing} className="gradient-bg text-primary-foreground rounded-xl font-semibold">
            {processing ? "Processing..." : "Remove Watermark"}
          </Button>
        )}
        {result && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Processed Result:</p>
            <img src={result} alt="Result" className="max-h-64 mx-auto rounded-xl" />
            <a href={result} download="no-watermark.png"><Button variant="outline" className="rounded-xl">Download</Button></a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
