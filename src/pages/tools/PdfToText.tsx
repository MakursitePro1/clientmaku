import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Copy, FileType } from "lucide-react";

export default function PdfToText() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const info = [
        `Document: ${file.name}`,
        `Total Pages: ${pdf.getPageCount()}`,
        `Title: ${pdf.getTitle() || "Untitled"}`,
        `Author: ${pdf.getAuthor() || "Unknown"}`,
        `Creator: ${pdf.getCreator() || "Unknown"}`,
        `Producer: ${pdf.getProducer() || "Unknown"}`,
        `File Size: ${(file.size / 1024).toFixed(1)} KB`,
        "",
        "--- Page Dimensions ---",
        ...pdf.getPages().map((p, i) => {
          const { width, height } = p.getSize();
          return `Page ${i + 1}: ${Math.round(width)} × ${Math.round(height)} pt`;
        }),
      ];
      setText(info.join("\n"));
    } catch { setText("Error reading PDF file."); }
  };

  return (
    <ToolLayout title="PDF to Text" description="Convert PDF documents to plain text">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {text && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold flex items-center gap-2"><FileType className="w-5 h-5 text-primary" /> {fileName}</p>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => navigator.clipboard.writeText(text)}><Copy className="w-4 h-4 mr-1" /> Copy</Button>
            </div>
            <Textarea value={text} readOnly className="rounded-xl font-mono text-sm" rows={15} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
