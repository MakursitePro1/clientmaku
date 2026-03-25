import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, GripVertical, Download, FileText } from "lucide-react";

interface PdfFile {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PdfMerger() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: PdfFile[] = Array.from(fileList)
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({ id: crypto.randomUUID(), name: f.name, size: f.size, file: f }));
    if (newFiles.length === 0) { setError("Please select PDF files only"); return; }
    setError("");
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setFiles((prev) => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const mergePdfs = async () => {
    if (files.length < 2) { setError("Add at least 2 PDF files"); return; }
    setMerging(true);
    setError("");
    try {
      // Dynamic import of pdf-lib
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const bytes = await pdfFile.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError("Failed to merge: " + (err.message || "Unknown error"));
    }
    setMerging(false);
  };

  return (
    <ToolLayout title="PDF Merger" description="Merge multiple PDF files into one document">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

        <div
          className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">Drop PDF files here or click to browse</p>
          <p className="text-sm text-muted-foreground">Select multiple PDF files to merge</p>
        </div>

        {error && <div className="text-destructive bg-destructive/10 rounded-xl p-4 text-sm">{error}</div>}

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, idx) => (
              <div key={f.id} className="flex items-center gap-3 bg-accent/30 rounded-xl border border-border/50 p-4">
                <button onClick={() => moveUp(idx)} className="text-muted-foreground hover:text-foreground" title="Move up">
                  <GripVertical className="w-5 h-5" />
                </button>
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{formatSize(f.size)}</div>
                </div>
                <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-lg">#{idx + 1}</span>
                <button onClick={() => remove(f.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={mergePdfs} disabled={files.length < 2 || merging} className="gradient-bg text-primary-foreground rounded-xl font-semibold">
            <Download className="w-4 h-4 mr-2" /> {merging ? "Merging..." : `Merge ${files.length} PDFs`}
          </Button>
          {files.length > 0 && (
            <Button variant="outline" className="rounded-xl" onClick={() => setFiles([])}>Clear All</Button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
