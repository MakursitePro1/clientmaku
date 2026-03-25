import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

export default function PdfPageNumber() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setPdfBytes(await file.arrayBuffer());
  };

  const addPageNumbers = async () => {
    if (!pdfBytes) return;
    const { PDFDocument, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();
    pages.forEach((page, i) => {
      const { width } = page.getSize();
      page.drawText(`${i + 1}`, { x: width / 2 - 5, y: 20, size: 12, color: rgb(0.3, 0.3, 0.3) });
    });
    const output = await pdf.save();
    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `numbered_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Page Numberer" description="Add page numbers to PDF documents">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold">{fileName}</p>
            <Button onClick={addPageNumbers} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Add Page Numbers & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
