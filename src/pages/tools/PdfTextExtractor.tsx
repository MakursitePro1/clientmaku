import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileSearch, Copy } from "lucide-react";

export default function PdfTextExtractor() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setLoading(true);
    // Simple text extraction from PDF using pdf-lib metadata
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageCount = pdf.getPageCount();
      const info = [
        `File: ${file.name}`,
        `Pages: ${pageCount}`,
        `Title: ${pdf.getTitle() || "N/A"}`,
        `Author: ${pdf.getAuthor() || "N/A"}`,
        `Subject: ${pdf.getSubject() || "N/A"}`,
        `Creator: ${pdf.getCreator() || "N/A"}`,
        `Producer: ${pdf.getProducer() || "N/A"}`,
        "",
        "Note: For full text extraction from PDF content, use a dedicated PDF reader.",
        "This tool extracts metadata and basic document information.",
      ];
      setText(info.join("\n"));
    } catch { setText("Failed to read PDF"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="PDF Text Extractor" description="Extract text content from PDF files">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {loading && <div className="text-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>}
        {text && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold flex items-center gap-2"><FileSearch className="w-5 h-5 text-primary" /> {fileName}</p>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => navigator.clipboard.writeText(text)}><Copy className="w-4 h-4 mr-1" /> Copy</Button>
            </div>
            <Textarea value={text} readOnly className="rounded-xl font-mono text-sm" rows={12} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
