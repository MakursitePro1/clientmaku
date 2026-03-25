import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const generate = () => {
    const words = topic.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const tags = new Set<string>();
    words.forEach(w => {
      tags.add(`#${w}`);
      tags.add(`#${w}life`);
      tags.add(`#${w}tips`);
      tags.add(`#${w}lovers`);
      tags.add(`#best${w}`);
    });
    // Combined tags
    if (words.length >= 2) {
      tags.add(`#${words.join("")}`);
      tags.add(`#${words[0]}and${words[1]}`);
    }
    // Popular generic tags
    ["#trending", "#viral", "#explore", "#instagood", "#photooftheday", "#love", "#beautiful", "#happy", "#followme", "#like4like"].forEach(t => tags.add(t));
    setHashtags([...tags].slice(0, 30));
  };

  const copyAll = () => { navigator.clipboard.writeText(hashtags.join(" ")); toast.success("All hashtags copied!"); };

  return (
    <ToolLayout title="Hashtag Generator" description="Generate trending hashtags for social media">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex gap-2">
          <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter topic (e.g. travel, food)..." className="rounded-xl" />
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl shrink-0">Generate</Button>
        </div>
        {hashtags.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2">
              {hashtags.map(h => (
                <button key={h} onClick={() => { navigator.clipboard.writeText(h); toast.success(`${h} copied!`); }} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">{h}</button>
              ))}
            </div>
            <Button onClick={copyAll} variant="outline" className="rounded-xl w-full">Copy All ({hashtags.length} hashtags)</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
