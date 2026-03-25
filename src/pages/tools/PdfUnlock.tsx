import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, LockKeyhole } from "lucide-react";

export default function PdfUnlock() {
  const [password, setPassword] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setPdfBytes(await file.arrayBuffer());
    setError("");
  };

  const unlock = async () => {
    if (!pdfBytes) return;
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => newPdf.addPage(p));
      const output = await newPdf.save();
      const blob = new Blob([output as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `unlocked_${fileName}`; a.click();
      setError("");
    } catch { setError("Failed to unlock PDF. Check the password."); }
  };

  return (
    <ToolLayout title="PDF Unlocker" description="Remove password protection from PDFs">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {error && <div className="text-destructive bg-destructive/10 rounded-xl p-4 text-sm">{error}</div>}
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold flex items-center gap-2"><LockKeyhole className="w-5 h-5 text-primary" /> {fileName}</p>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="PDF password (if any)" className="rounded-xl" />
            <Button onClick={unlock} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Unlock & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
