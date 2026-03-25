import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, SplitSquareHorizontal } from "lucide-react";

export default function PdfSplitter() {
  const [totalPages, setTotalPages] = useState(0);
  const [splitAt, setSplitAt] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setTotalPages(pdf.getPageCount());
    setPdfBytes(bytes);
  };

  const split = async () => {
    if (!pdfBytes) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    const splitPage = parseInt(splitAt);
    if (isNaN(splitPage) || splitPage < 1 || splitPage >= totalPages) return;

    const part1 = await PDFDocument.create();
    const pages1 = await part1.copyPages(pdf, Array.from({ length: splitPage }, (_, i) => i));
    pages1.forEach(p => part1.addPage(p));

    const part2 = await PDFDocument.create();
    const pages2 = await part2.copyPages(pdf, Array.from({ length: totalPages - splitPage }, (_, i) => i + splitPage));
    pages2.forEach(p => part2.addPage(p));

    for (const [doc, label] of [[part1, "part1"], [part2, "part2"]] as const) {
      const output = await doc.save();
      const blob = new Blob([output as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${fileName.replace(".pdf", "")}_${label}.pdf`; a.click();
    }
  };

  return (
    <ToolLayout title="PDF Splitter" description="Split a PDF into multiple documents">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {totalPages > 0 && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold flex items-center gap-2"><SplitSquareHorizontal className="w-5 h-5 text-primary" /> {fileName} — {totalPages} pages</p>
            <Input type="number" value={splitAt} onChange={e => setSplitAt(e.target.value)} placeholder={`Split after page (1-${totalPages - 1})`} className="rounded-xl" min={1} max={totalPages - 1} />
            <Button onClick={split} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Split & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
