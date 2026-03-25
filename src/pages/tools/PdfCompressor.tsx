import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download, Shrink } from "lucide-react";

export default function PdfCompressor() {
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (b: number) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(2) + " MB";

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") return;
    setLoading(true);
    setFileName(file.name);
    setOriginalSize(file.size);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => newPdf.addPage(p));
      const compressed = await newPdf.save({ useObjectStreams: true });
      setCompressedSize(compressed.length);
      const blob = new Blob([compressed], { type: "application/pdf" });
      setCompressedUrl(URL.createObjectURL(blob));
    } catch { setCompressedUrl(""); }
    setLoading(false);
  };

  const reduction = originalSize > 0 ? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100)) : 0;

  return (
    <ToolLayout title="PDF Compressor" description="Compress PDF files to reduce file size">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">Drop PDF file here or click to browse</p>
        </div>
        {loading && <div className="text-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>}
        {compressedUrl && (
          <div className="bg-accent/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3"><Shrink className="w-6 h-6 text-primary" /><div><p className="font-semibold">{fileName}</p><p className="text-sm text-muted-foreground">Compression complete</p></div></div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold">{formatSize(originalSize)}</p><p className="text-xs text-muted-foreground">Original</p></div>
              <div><p className="text-2xl font-bold text-primary">{formatSize(compressedSize)}</p><p className="text-xs text-muted-foreground">Compressed</p></div>
              <div><p className="text-2xl font-bold text-green-500">{reduction}%</p><p className="text-xs text-muted-foreground">Reduced</p></div>
            </div>
            <Button className="gradient-bg text-primary-foreground rounded-xl w-full" onClick={() => { const a = document.createElement("a"); a.href = compressedUrl; a.download = `compressed_${fileName}`; a.click(); }}>
              <Download className="w-4 h-4 mr-2" /> Download Compressed PDF
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
