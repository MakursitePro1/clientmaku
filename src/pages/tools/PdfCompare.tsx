import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, GitCompare } from "lucide-react";

export default function PdfCompare() {
  const [pdf1Info, setPdf1Info] = useState<{ name: string; pages: number; title: string; size: number } | null>(null);
  const [pdf2Info, setPdf2Info] = useState<{ name: string; pages: number; title: string; size: number } | null>(null);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const loadPdf = async (file: File, setter: typeof setPdf1Info) => {
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setter({ name: file.name, pages: pdf.getPageCount(), title: pdf.getTitle() || "N/A", size: file.size });
  };

  const fmt = (b: number) => b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(2) + " MB";

  return (
    <ToolLayout title="PDF Compare" description="Compare two PDF documents side by side">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input ref={input1Ref} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadPdf(e.target.files[0], setPdf1Info)} />
            <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 cursor-pointer" onClick={() => input1Ref.current?.click()}>
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-semibold text-sm">PDF 1</p>
            </div>
          </div>
          <div>
            <input ref={input2Ref} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadPdf(e.target.files[0], setPdf2Info)} />
            <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 cursor-pointer" onClick={() => input2Ref.current?.click()}>
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-semibold text-sm">PDF 2</p>
            </div>
          </div>
        </div>
        {pdf1Info && pdf2Info && (
          <div className="bg-accent/30 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><GitCompare className="w-5 h-5 text-primary" /> Comparison Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="text-left py-2 px-3">Property</th><th className="text-left py-2 px-3">PDF 1</th><th className="text-left py-2 px-3">PDF 2</th><th className="text-left py-2 px-3">Match</th></tr></thead>
                <tbody>
                  {[
                    ["File Name", pdf1Info.name, pdf2Info.name],
                    ["Pages", String(pdf1Info.pages), String(pdf2Info.pages)],
                    ["Title", pdf1Info.title, pdf2Info.title],
                    ["Size", fmt(pdf1Info.size), fmt(pdf2Info.size)],
                  ].map(([label, v1, v2]) => (
                    <tr key={label} className="border-b border-border/50">
                      <td className="py-2 px-3 font-medium">{label}</td>
                      <td className="py-2 px-3">{v1}</td>
                      <td className="py-2 px-3">{v2}</td>
                      <td className="py-2 px-3">{v1 === v2 ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
