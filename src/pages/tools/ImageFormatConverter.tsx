import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImageFormatConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const load = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const convert = (format: string) => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);
      const ext = format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp";
      const a = document.createElement("a");
      a.download = `${fileName.replace(/\.[^.]+$/, "")}.${ext}`;
      a.href = canvas.toDataURL(format, 0.92);
      a.click();
      toast.success(`Converted to ${ext.toUpperCase()}`);
    };
    img.src = image;
  };

  return (
    <ToolLayout title="Image Format Converter" description="Convert images between PNG, JPG and WebP">
      <div className="space-y-4 max-w-md mx-auto text-center">
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && load(e.target.files[0])} className="text-sm" />
        {image && (
          <>
            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-xl border border-border" />
            <p className="text-sm text-muted-foreground">{fileName}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => convert("image/png")} className="rounded-xl">To PNG</Button>
              <Button onClick={() => convert("image/jpeg")} className="rounded-xl">To JPG</Button>
              <Button onClick={() => convert("image/webp")} className="rounded-xl">To WebP</Button>
            </div>
          </>
        )}
        {!image && <p className="text-muted-foreground py-8">Upload an image to convert format</p>}
      </div>
    </ToolLayout>
  );
}
