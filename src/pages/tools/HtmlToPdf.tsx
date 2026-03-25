import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HtmlToPdf() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
    p { line-height: 1.8; }
    .highlight { background: #f3e8ff; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #7c3aed; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #7c3aed; color: white; }
  </style>
</head>
<body>
  <h1>My Document</h1>
  <p>This is a sample HTML document that will be converted to PDF.</p>
  <div class="highlight">You can write any HTML and CSS here!</div>
  <table>
    <tr><th>Name</th><th>Role</th></tr>
    <tr><td>John</td><td>Developer</td></tr>
    <tr><td>Jane</td><td>Designer</td></tr>
  </table>
</body>
</html>`);
  const [title, setTitle] = useState("My Document");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const preview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  };

  const downloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  return (
    <ToolLayout title="HTML to PDF" description="Convert HTML content to PDF documents">
      <div className="space-y-5">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document Title" className="rounded-xl" />
        <div>
          <label className="text-sm font-semibold mb-2 block">HTML Content</label>
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="rounded-xl font-mono text-sm"
            rows={12}
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={preview} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Preview</Button>
          <Button onClick={downloadPdf} variant="outline" className="rounded-xl">Download as PDF</Button>
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Preview</label>
          <iframe
            ref={iframeRef}
            className="w-full h-96 rounded-2xl border border-border bg-white"
            title="HTML Preview"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
