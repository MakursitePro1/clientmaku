import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileUp, Trash2 } from "lucide-react";

export default function PdfMergeImages() {
  const [images, setImages] = useState<{ name: string; dataUrl: string; width: number; height: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          setImages(prev => [...prev, { name: file.name, dataUrl: reader.result as string, width: img.width, height: img.height }]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const createPdf = async () => {
    if (images.length === 0) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    for (const img of images) {
      const imgBytes = await fetch(img.dataUrl).then(r => r.arrayBuffer());
      let embeddedImg;
      if (img.dataUrl.includes("image/png")) {
        embeddedImg = await pdf.embedPng(imgBytes);
      } else {
        embeddedImg = await pdf.embedJpg(imgBytes);
      }
      const page = pdf.addPage([embeddedImg.width, embeddedImg.height]);
      page.drawImage(embeddedImg, { x: 0, y: 0, width: embeddedImg.width, height: embeddedImg.height });
    }
    const output = await pdf.save();
    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "images_to_pdf.pdf"; a.click();
  };

  return (
    <ToolLayout title="Images to PDF" description="Convert multiple images into a single PDF">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addImages(e.target.files)} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop images here or click to browse</p>
          <p className="text-sm text-muted-foreground">Supports JPG, PNG images</p>
        </div>
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group border border-border/50 rounded-xl overflow-hidden">
                  <img src={img.dataUrl} alt={img.name} className="w-full h-32 object-cover" />
                  <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="p-2 text-xs truncate">{img.name}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={createPdf} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Create PDF ({images.length} images)</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setImages([])}>Clear All</Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
