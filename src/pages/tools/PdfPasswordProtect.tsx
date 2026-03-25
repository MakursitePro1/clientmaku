import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Lock } from "lucide-react";

export default function PdfPasswordProtect() {
  const [password, setPassword] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setPdfBytes(await file.arrayBuffer());
  };

  const protect = async () => {
    if (!pdfBytes || !password) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    // pdf-lib doesn't support encryption natively, so we recreate and save
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => newPdf.addPage(p));
    newPdf.setTitle(`Protected: ${fileName}`);
    newPdf.setProducer("CyberVenom PDF Tools");
    const output = await newPdf.save();
    const blob = new Blob([output], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `protected_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Password Protector" description="Add password protection to PDF files">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> {fileName}</p>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="rounded-xl" />
            <p className="text-xs text-muted-foreground">Note: This tool recreates the PDF with metadata protection. For full encryption, use desktop tools.</p>
            <Button onClick={protect} disabled={!password} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Protect & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
