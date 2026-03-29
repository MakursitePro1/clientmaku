import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText, Eye, Code, Copy } from "lucide-react";
import { toast } from "sonner";

const sampleMd = `# Markdown Preview

## Features
- **Bold text** and *italic text*
- [Links](https://example.com)
- Inline \`code\` blocks

### Code Block
\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

### Lists
1. First item
2. Second item
3. Third item

> This is a blockquote

---

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
`;

function mdToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2 gradient-text">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black mt-6 mb-3 gradient-text">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-primary/10 rounded text-xs font-mono text-primary">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80" target="_blank">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-2">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="border-t border-primary/20 my-4" />')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n/g, '<br />');
  return html;
}

export default function MarkdownPreview() {
  const [md, setMd] = useState(sampleMd);
  const [view, setView] = useState<"split" | "preview" | "editor">("split");

  const html = mdToHtml(md);

  return (
    <ToolLayout title="Markdown Preview" description="Write markdown and see the preview in real-time">
      <div className="space-y-5 max-w-3xl mx-auto">
        {/* View Toggle */}
        <div className="flex gap-2">
          {([
            { id: "editor", icon: Code, label: "Editor" },
            { id: "split", icon: Eye, label: "Split" },
            { id: "preview", icon: FileText, label: "Preview" },
          ] as const).map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${view === v.id ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
              <v.icon className="w-3.5 h-3.5" /> {v.label}
            </button>
          ))}
          <button onClick={() => { navigator.clipboard.writeText(md); toast.success("Copied!"); }} className="tool-btn-primary px-4 py-2.5 text-xs flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        {/* Editor & Preview */}
        <div className={`grid gap-4 ${view === "split" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {view !== "preview" && (
            <div className="tool-section-card p-4">
              <h3 className="text-xs font-bold gradient-text mb-2">✍️ Markdown</h3>
              <Textarea value={md} onChange={e => setMd(e.target.value)} className="tool-input-colorful rounded-xl font-mono text-xs min-h-[400px] resize-y" />
            </div>
          )}
          {view !== "editor" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tool-section-card p-4">
              <h3 className="text-xs font-bold gradient-text mb-2">👁️ Preview</h3>
              <div className="prose prose-sm max-w-none p-4 bg-primary/5 rounded-xl border border-primary/10 min-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: html }} />
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="tool-stat-card"><div className="stat-value text-lg">{md.split(/\s+/).filter(Boolean).length}</div><div className="stat-label">Words</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg">{md.length}</div><div className="stat-label">Characters</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg">{md.split("\n").length}</div><div className="stat-label">Lines</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg">{new Blob([md]).size}B</div><div className="stat-label">Size</div></div>
        </div>
      </div>
    </ToolLayout>
  );
}
