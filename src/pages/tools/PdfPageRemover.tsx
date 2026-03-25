import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Trash2 } from "lucide-react";

export default function PdfPageRemover() {
  const [totalPages, setTotalPages] = useState(0);
  const [pagesToRemove, setPagesToRemove] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") return;
    setFileName(file.name);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setTotalPages(pdf.getPageCount());
    setPdfBytes(bytes);
  };

  const removePagesAndDownload = async () => {
    if (!pdfBytes) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(pdfBytes);
      const removeSet = new Set(pagesToRemove.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= totalPages));
      const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter(i => !removeSet.has(i + 1));
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, keepIndices);
      pages.forEach(p => newPdf.addPage(p));
      const output = await newPdf.save();
      const blob = new Blob([output as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `edited_${fileName}`; a.click();
    } catch {}
    setLoading(false);
  };

  return (
    <ToolLayout title="PDF Page Remover" description="Remove specific pages from PDF files">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {totalPages > 0 && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold">{fileName} — {totalPages} pages</p>
            <Input value={pagesToRemove} onChange={e => setPagesToRemove(e.target.value)} placeholder="Pages to remove (e.g., 1, 3, 5)" className="rounded-xl" />
            <Button onClick={removePagesAndDownload} disabled={loading} className="gradient-bg text-primary-foreground rounded-xl">
              <Trash2 className="w-4 h-4 mr-2" /> Remove Pages & Download
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
