import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, ArrowUpDown } from "lucide-react";

export default function PdfPageReorder() {
  const [totalPages, setTotalPages] = useState(0);
  const [order, setOrder] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const count = pdf.getPageCount();
    setTotalPages(count);
    setOrder(Array.from({ length: count }, (_, i) => i + 1).join(", "));
    setPdfBytes(bytes);
  };

  const reorder = async () => {
    if (!pdfBytes) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    const indices = order.split(",").map(s => parseInt(s.trim()) - 1).filter(n => n >= 0 && n < totalPages);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach(p => newPdf.addPage(p));
    const output = await newPdf.save();
    const blob = new Blob([output], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `reordered_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Page Reorder" description="Rearrange pages in your PDF document">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {totalPages > 0 && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold flex items-center gap-2"><ArrowUpDown className="w-5 h-5 text-primary" /> {fileName} — {totalPages} pages</p>
            <Input value={order} onChange={e => setOrder(e.target.value)} placeholder="New page order (e.g., 3, 1, 2)" className="rounded-xl" />
            <p className="text-xs text-muted-foreground">Enter the desired page order separated by commas</p>
            <Button onClick={reorder} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Reorder & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
