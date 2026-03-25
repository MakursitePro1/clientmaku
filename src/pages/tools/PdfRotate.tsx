import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, RotateCcw } from "lucide-react";

export default function PdfRotate() {
  const [totalPages, setTotalPages] = useState(0);
  const [rotation, setRotation] = useState("90");
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

  const rotate = async () => {
    if (!pdfBytes) return;
    const { PDFDocument, degrees } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    pdf.getPages().forEach(page => page.setRotation(degrees(page.getRotation().angle + parseInt(rotation))));
    const output = await pdf.save();
    const blob = new Blob([output], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `rotated_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Page Rotator" description="Rotate PDF pages to any angle">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {totalPages > 0 && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold">{fileName} — {totalPages} pages</p>
            <Select value={rotation} onValueChange={setRotation}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° Clockwise</SelectItem>
                <SelectItem value="180">180°</SelectItem>
                <SelectItem value="270">270° Clockwise</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={rotate} className="gradient-bg text-primary-foreground rounded-xl"><RotateCcw className="w-4 h-4 mr-2" /> Rotate & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
