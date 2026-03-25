import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function YouTubeTagGenerator() {
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const generate = () => {
    const words = topic.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const result = new Set<string>();
    words.forEach(w => {
      result.add(w);
      result.add(`${w} tutorial`);
      result.add(`${w} guide`);
      result.add(`${w} tips`);
      result.add(`${w} 2024`);
      result.add(`how to ${w}`);
      result.add(`best ${w}`);
      result.add(`${w} for beginners`);
    });
    if (words.length >= 2) {
      result.add(words.join(" "));
      result.add(`${words.join(" ")} tutorial`);
    }
    setTags([...result].slice(0, 25));
  };

  const copyAll = () => { navigator.clipboard.writeText(tags.join(", ")); toast.success("Tags copied!"); };

  return (
    <ToolLayout title="YouTube Tag Generator" description="Generate SEO tags for YouTube videos">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex gap-2">
          <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter video topic..." className="rounded-xl" />
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl shrink-0">Generate</Button>
        </div>
        {tags.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-accent/50 text-sm border border-border">{t}</span>
              ))}
            </div>
            <div className="p-3 bg-accent/30 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground mb-1">Copy-ready format:</p>
              <p className="text-sm font-mono break-all">{tags.join(", ")}</p>
            </div>
            <Button onClick={copyAll} variant="outline" className="rounded-xl w-full">Copy All Tags</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
