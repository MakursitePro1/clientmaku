import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Link, Image, Code, Eye, Edit3, Copy, Quote } from "lucide-react";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor

## Features
- **Bold text** and *italic text*
- [Links](https://example.com)
- Images, lists, and more!

### Code Block
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

> This is a blockquote

1. First item
2. Second item
3. Third item

---

Enjoy writing in Markdown! ✨`);
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("md-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + (selected || "text") + after + markdown.substring(end);
    setMarkdown(newText);
  };

  const renderMarkdown = (text: string): string => {
    let html = text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-extrabold mt-6 mb-3">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`{3}(\w*)\n([\s\S]*?)`{3}/g, '<pre class="bg-secondary rounded-lg p-4 my-3 overflow-x-auto"><code>$2</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm text-primary">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2" />')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 my-3 text-muted-foreground italic">$1</blockquote>')
      .replace(/^---$/gm, '<hr class="my-4 border-border" />')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/\n/g, '<br />');
    return html;
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    toast({ title: "Copied!", description: "Markdown copied to clipboard" });
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(renderMarkdown(markdown));
    toast({ title: "Copied!", description: "HTML copied to clipboard" });
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**"), label: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), label: "Italic" },
    { icon: Heading1, action: () => insertMarkdown("# "), label: "H1" },
    { icon: Heading2, action: () => insertMarkdown("## "), label: "H2" },
    { icon: List, action: () => insertMarkdown("- "), label: "Bullet List" },
    { icon: ListOrdered, action: () => insertMarkdown("1. "), label: "Numbered List" },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), label: "Link" },
    { icon: Image, action: () => insertMarkdown("![alt](", ")"), label: "Image" },
    { icon: Code, action: () => insertMarkdown("`", "`"), label: "Code" },
    { icon: Quote, action: () => insertMarkdown("> "), label: "Quote" },
  ];

  return (
    <ToolLayout title="Markdown Editor" description="Write and preview Markdown with a live editor">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 bg-card rounded-xl p-2 border border-border/50">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              title={btn.label}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <btn.icon className="w-4 h-4" />
            </button>
          ))}
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={copyMarkdown} className="rounded-lg gap-1.5">
            <Copy className="w-3.5 h-3.5" /> MD
          </Button>
          <Button variant="outline" size="sm" onClick={copyHtml} className="rounded-lg gap-1.5">
            <Copy className="w-3.5 h-3.5" /> HTML
          </Button>
          <Button
            variant={isPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="rounded-lg gap-1.5"
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>

        {/* Editor / Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
          {!isPreview && (
            <Textarea
              id="md-editor"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[500px] font-mono text-sm rounded-xl bg-card border-border/50 resize-none"
              placeholder="Write your markdown here..."
            />
          )}
          <div
            className={`bg-card rounded-xl border border-border/50 p-6 overflow-auto prose-sm ${isPreview ? "lg:col-span-2" : ""}`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Words: {markdown.trim().split(/\s+/).filter(Boolean).length} • Characters: {markdown.length}
        </p>
      </div>
    </ToolLayout>
  );
};

export default MarkdownEditor;
