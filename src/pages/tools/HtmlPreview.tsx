import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";

export default function HtmlPreview() {
  const [html, setHtml] = useState('<h1 style="color: #6c5ce7;">Hello World!</h1>\n<p>This is a <b>live HTML preview</b> tool.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>');

  return (
    <ToolLayout title="HTML Live Preview" description="Write HTML and see live preview instantly">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div>
          <label className="text-sm font-medium mb-1 block">HTML Code</label>
          <Textarea value={html} onChange={e => setHtml(e.target.value)} className="min-h-[350px] rounded-xl font-mono text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Preview</label>
          <div className="min-h-[350px] rounded-xl border border-border bg-white p-4 overflow-auto">
            <iframe srcDoc={html} className="w-full h-full min-h-[320px] border-0" sandbox="allow-scripts" title="preview" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
