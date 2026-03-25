import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tlds = [".com",".net",".org",".io",".dev",".app",".co",".xyz",".me",".info",".tech",".online",".site",".store",".blog"];

export default function DomainNameGenerator() {
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const generate = () => {
    const words = keywords.split(",").map(w => w.trim().toLowerCase()).filter(Boolean);
    if (!words.length) return;
    const names: string[] = [];
    const prefixes = ["get","try","use","my","the","go","hey","just"];
    const suffixes = ["hub","lab","base","ly","ify","io","stack","flow","app","hq"];

    words.forEach(w => {
      tlds.slice(0, 5).forEach(t => names.push(w + t));
      prefixes.forEach(p => names.push(p + w + ".com"));
      suffixes.forEach(s => names.push(w + s + ".com"));
      if (words.length > 1) {
        for (let i = 0; i < words.length - 1; i++) {
          names.push(words[i] + words[i + 1] + ".com");
        }
      }
    });
    setResults([...new Set(names)].slice(0, 30));
  };

  return (
    <ToolLayout title="Domain Name Generator" description="Generate creative domain name ideas">
      <div className="space-y-4 max-w-md mx-auto">
        <Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Enter keywords (comma-separated)" className="rounded-xl" />
        <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl w-full">Generate Domains</Button>
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-auto">
            {results.map(d => (
              <button key={d} onClick={() => { navigator.clipboard.writeText(d); toast.success("Copied!"); }} className="p-3 rounded-xl border border-border hover:bg-accent/30 text-left font-mono text-sm transition-colors">{d}</button>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
