import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, FileCheck } from "lucide-react";

export default function PdfFormFiller() {
  const [html, setHtml] = useState(`<div style="font-family:Arial;padding:40px;max-width:600px;margin:0 auto">
  <h2 style="color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:8px">Application Form</h2>
  <div style="margin:20px 0"><label style="font-weight:bold">Full Name:</label><br/><input type="text" style="width:100%;padding:8px;margin-top:4px;border:1px solid #ccc;border-radius:4px" /></div>
  <div style="margin:20px 0"><label style="font-weight:bold">Email:</label><br/><input type="email" style="width:100%;padding:8px;margin-top:4px;border:1px solid #ccc;border-radius:4px" /></div>
  <div style="margin:20px 0"><label style="font-weight:bold">Phone:</label><br/><input type="tel" style="width:100%;padding:8px;margin-top:4px;border:1px solid #ccc;border-radius:4px" /></div>
  <div style="margin:20px 0"><label style="font-weight:bold">Address:</label><br/><textarea style="width:100%;padding:8px;margin-top:4px;border:1px solid #ccc;border-radius:4px" rows="3"></textarea></div>
  <div style="margin:20px 0"><label style="font-weight:bold">Date:</label><br/><input type="date" style="width:100%;padding:8px;margin-top:4px;border:1px solid #ccc;border-radius:4px" /></div>
</div>`);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const preview = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.open(); doc.write(html); doc.close();
  };

  const downloadPdf = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.onload = () => setTimeout(() => w.print(), 500);
  };

  return (
    <ToolLayout title="PDF Form Filler" description="Fill out PDF forms directly in browser">
      <div className="space-y-5">
        <Textarea value={html} onChange={e => setHtml(e.target.value)} className="rounded-xl font-mono text-sm" rows={10} />
        <div className="flex gap-3">
          <Button onClick={preview} className="gradient-bg text-primary-foreground rounded-xl">Preview</Button>
          <Button onClick={downloadPdf} variant="outline" className="rounded-xl">Print / Save as PDF</Button>
        </div>
        <iframe ref={iframeRef} className="w-full h-96 rounded-2xl border border-border bg-white" title="Form Preview" />
      </div>
    </ToolLayout>
  );
}
