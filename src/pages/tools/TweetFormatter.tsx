import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TweetFormatter() {
  const [text, setText] = useState("");
  const limit = 280;
  const remaining = limit - text.length;
  const threads = text.length > limit ? text.match(/.{1,270}(?:\s|$)/g) || [text] : [text];

  return (
    <ToolLayout title="Tweet/Thread Formatter" description="Format and split text into tweet threads">
      <div className="space-y-4 max-w-md mx-auto">
        <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write your tweet or long text..." className="min-h-[150px] rounded-xl" />
        <div className="flex justify-between text-sm">
          <span className={remaining < 0 ? "text-destructive font-bold" : "text-muted-foreground"}>{remaining} characters remaining</span>
          <span className="text-muted-foreground">{threads.length} tweet{threads.length > 1 ? "s" : ""}</span>
        </div>
        {threads.length > 1 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Thread Preview:</p>
            {threads.map((tweet, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-accent/20">
                <p className="text-xs text-muted-foreground mb-1">Tweet {i + 1}/{threads.length}</p>
                <p className="text-sm">{tweet.trim()} {threads.length > 1 ? `(${i + 1}/${threads.length})` : ""}</p>
                <p className="text-xs text-muted-foreground mt-1">{tweet.trim().length + (threads.length > 1 ? `(${i + 1}/${threads.length})`.length + 1 : 0)}/280</p>
              </div>
            ))}
          </div>
        )}
        <Button onClick={() => { navigator.clipboard.writeText(threads.map((t, i) => threads.length > 1 ? `${t.trim()} (${i + 1}/${threads.length})` : t.trim()).join("\n\n")); toast.success("Copied!"); }} className="gradient-bg text-primary-foreground rounded-xl w-full">Copy {threads.length > 1 ? "Thread" : "Tweet"}</Button>
      </div>
    </ToolLayout>
  );
}
