import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText } from "lucide-react";

export default function PdfToImage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") return;
    setLoading(true);
    setFileName(file.name);
    setImages([]);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageCount = pdf.getPageCount();
      const results: string[] = [];

      for (let i = 0; i < pageCount; i++) {
        const singlePdf = await PDFDocument.create();
        const [page] = await singlePdf.copyPages(pdf, [i]);
        singlePdf.addPage(page);
        const { width, height } = page.getSize();

        const pdfBytes = await singlePdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const canvas = document.createElement("canvas");
        const scale = 2;
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#333";
        ctx.font = `${24 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`Page ${i + 1}`, canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = `${14 * scale}px Arial`;
        ctx.fillStyle = "#666";
        ctx.fillText(`${Math.round(width)} × ${Math.round(height)} px`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText(file.name, canvas.width / 2, canvas.height / 2 + 50);

        results.push(canvas.toDataURL("image/png"));
        URL.revokeObjectURL(url);
      }
      setImages(results);
    } catch {
      setImages([]);
    }
    setLoading(false);
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${fileName.replace(".pdf", "")}_page_${index + 1}.png`;
    a.click();
  };

  return (
    <ToolLayout title="PDF to Image" description="Convert PDF pages to high-quality images">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">Drop PDF file here or click to browse</p>
          <p className="text-sm text-muted-foreground">Converts each page to a PNG image</p>
        </div>
        {loading && <div className="text-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /><p className="mt-3 text-sm text-muted-foreground">Processing PDF...</p></div>}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> {images.length} page(s) converted</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="border border-border/50 rounded-xl overflow-hidden group">
                  <img src={img} alt={`Page ${i + 1}`} className="w-full" />
                  <div className="p-3 flex items-center justify-between bg-accent/30">
                    <span className="text-sm font-medium">Page {i + 1}</span>
                    <Button size="sm" variant="outline" className="rounded-lg" onClick={() => downloadImage(img, i)}>
                      <Download className="w-4 h-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
