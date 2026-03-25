import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, FileEdit } from "lucide-react";

export default function PdfMetadataEditor() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setTitle(pdf.getTitle() || "");
    setAuthor(pdf.getAuthor() || "");
    setSubject(pdf.getSubject() || "");
    setKeywords(pdf.getKeywords() || "");
    setPdfBytes(bytes);
  };

  const save = async () => {
    if (!pdfBytes) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    if (title) pdf.setTitle(title);
    if (author) pdf.setAuthor(author);
    if (subject) pdf.setSubject(subject);
    if (keywords) pdf.setKeywords([keywords]);
    const output = await pdf.save();
    const blob = new Blob([output], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fileName; a.click();
  };

  return (
    <ToolLayout title="PDF Metadata Editor" description="Edit title, author, and metadata of PDFs">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold flex items-center gap-2"><FileEdit className="w-5 h-5 text-primary" /> {fileName}</p>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="rounded-xl" />
            <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" className="rounded-xl" />
            <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="rounded-xl" />
            <Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Keywords" className="rounded-xl" />
            <Button onClick={save} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Save & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
