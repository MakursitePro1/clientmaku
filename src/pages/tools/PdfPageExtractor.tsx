import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";

export default function PdfPageExtractor() {
  const [totalPages, setTotalPages] = useState(0);
  const [pagesToExtract, setPagesToExtract] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setTotalPages(pdf.getPageCount());
    setPdfBytes(bytes);
  };

  const extract = async () => {
    if (!pdfBytes) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    const indices = pagesToExtract.split(",").map(s => parseInt(s.trim()) - 1).filter(n => n >= 0 && n < totalPages);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach(p => newPdf.addPage(p));
    const output = await newPdf.save();
    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `extracted_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Page Extractor" description="Extract specific pages from a PDF">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {totalPages > 0 && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold">{fileName} — {totalPages} pages</p>
            <Input value={pagesToExtract} onChange={e => setPagesToExtract(e.target.value)} placeholder="Pages to extract (e.g., 1, 3, 5-8)" className="rounded-xl" />
            <Button onClick={extract} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Extract & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
