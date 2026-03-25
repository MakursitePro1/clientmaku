import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";

export default function PdfHeaderFooter() {
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setPdfBytes(await file.arrayBuffer());
  };

  const apply = async () => {
    if (!pdfBytes) return;
    const { PDFDocument, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      if (headerText) page.drawText(headerText, { x: 50, y: height - 30, size: 10, color: rgb(0.3, 0.3, 0.3) });
      if (footerText) page.drawText(footerText, { x: 50, y: 15, size: 10, color: rgb(0.3, 0.3, 0.3) });
    });
    const output = await pdf.save();
    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `hf_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Header/Footer Adder" description="Add custom headers and footers to PDFs">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold">{fileName}</p>
            <Input value={headerText} onChange={e => setHeaderText(e.target.value)} placeholder="Header text" className="rounded-xl" />
            <Input value={footerText} onChange={e => setFooterText(e.target.value)} placeholder="Footer text" className="rounded-xl" />
            <Button onClick={apply} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Apply & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
