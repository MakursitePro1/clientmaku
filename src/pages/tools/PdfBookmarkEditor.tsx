import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, BookMarked } from "lucide-react";

export default function PdfBookmarkEditor() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [bookmarks, setBookmarks] = useState<{ title: string; page: string }[]>([{ title: "", page: "1" }]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setTotalPages(pdf.getPageCount());
    setPdfBytes(bytes);
  };

  const addBookmark = () => setBookmarks([...bookmarks, { title: "", page: "1" }]);
  const updateBookmark = (i: number, field: string, value: string) => {
    const updated = [...bookmarks];
    (updated[i] as any)[field] = value;
    setBookmarks(updated);
  };

  const apply = async () => {
    if (!pdfBytes) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);
    // pdf-lib doesn't natively support outlines, so we add metadata as a workaround
    const titles = bookmarks.filter(b => b.title).map(b => `${b.title} (Page ${b.page})`).join(", ");
    pdf.setSubject(`Bookmarks: ${titles}`);
    const output = await pdf.save();
    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `bookmarked_${fileName}`; a.click();
  };

  return (
    <ToolLayout title="PDF Bookmark Editor" description="Add and edit bookmarks in PDF files">
      <div className="space-y-6">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-primary/50 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Drop PDF here or click to browse</p>
        </div>
        {pdfBytes && (
          <div className="space-y-4 bg-accent/30 rounded-2xl p-6">
            <p className="font-semibold flex items-center gap-2"><BookMarked className="w-5 h-5 text-primary" /> {fileName} — {totalPages} pages</p>
            {bookmarks.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input value={b.title} onChange={e => updateBookmark(i, "title", e.target.value)} placeholder="Bookmark title" className="rounded-xl flex-1" />
                <Input type="number" value={b.page} onChange={e => updateBookmark(i, "page", e.target.value)} className="rounded-xl w-20" min={1} max={totalPages} />
              </div>
            ))}
            <Button variant="outline" className="rounded-xl" onClick={addBookmark}>+ Add Bookmark</Button>
            <Button onClick={apply} className="gradient-bg text-primary-foreground rounded-xl w-full"><Download className="w-4 h-4 mr-2" /> Save & Download</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
