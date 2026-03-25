import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

export default function PdfSign() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [drawing, setDrawing] = useState(false);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setPdfBytes(await file.arrayBuffer());
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#333";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    setDrawing(false);
    if (canvasRef.current) setSignatureDataUrl(canvasRef.current.toDataURL("image/png"));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl("");
  };

  const applySignature = async () => {
    if (!pdfBytes || !signatureDataUrl) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    const pngBytes = await fetch(signatureDataUrl).then(r => r.arrayBuffer());
    const sigImage = await pdf.embedPng(pngBytes);
    const lastPage = pdf.getPages()[pdf.getPageCount() - 1];
    const { width } = lastPage.getSize();
    lastPage.drawImage(sigImage, { x: width - 200, y: 50, width: 150, height: 50 });
    const output = await pdf.save();
    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `signed_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Signature Tool" description="Add digital signatures to PDF documents">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold">{fileName}</p>
            <p className="text-sm text-muted-foreground">Draw your signature below:</p>
            <canvas ref={canvasRef} width={400} height={150} className="border border-border rounded-xl bg-white w-full cursor-crosshair" onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} />
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl" onClick={clearSignature}>Clear</Button>
              <Button onClick={applySignature} disabled={!signatureDataUrl} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Sign & Download</Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
