import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";

export default function PdfWatermark() {
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setPdfBytes(await file.arrayBuffer());
  };

  const addWatermark = async () => {
    if (!pdfBytes || !watermarkText) return;
    const { PDFDocument, rgb, degrees } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2 - watermarkText.length * 8,
        y: height / 2,
        size: 40,
        color: rgb(0.75, 0.75, 0.75),
        rotate: degrees(45),
        opacity: 0.3,
      });
    }
    const output = await pdf.save();
    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `watermarked_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Watermark Adder" description="Add text watermarks to PDF documents">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold">{fileName}</p>
            <Input value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="Watermark text" className="rounded-xl" />
            <Button onClick={addWatermark} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Add Watermark & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
