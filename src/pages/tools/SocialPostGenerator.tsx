import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const templates = [
  { name: "Product Launch", text: "🚀 Exciting news! Introducing [Product] — [description]. Available now at [link]! #launch #newproduct" },
  { name: "Motivational", text: "💪 [Quote]. Remember, every great achievement starts with a single step. #motivation #success" },
  { name: "Engagement", text: "🤔 Quick question: [Question]? Drop your answer below! 👇 #community #question" },
  { name: "Tips/How-to", text: "💡 Pro tip: [Tip]. This simple trick can save you [benefit]! Save for later 🔖 #tips #howto" },
  { name: "Announcement", text: "📢 Big announcement! [News]. We're thrilled to share this with you! Stay tuned for more. #news #update" },
  { name: "Behind the Scenes", text: "🎬 Behind the scenes look at [topic]. Here's how we [process]... #bts #behindthescenes" },
];

export default function SocialPostGenerator() {
  const [platform, setPlatform] = useState("twitter");
  const [topic, setTopic] = useState("");
  const [posts, setPosts] = useState<string[]>([]);

  const generate = () => {
    const results = templates.map(t =>
      t.text.replace(/\[.*?\]/g, () => topic || "[your topic]")
    );
    setPosts(results);
  };

  const limits: Record<string, number> = { twitter: 280, instagram: 2200, facebook: 63206, linkedin: 3000 };

  return (
    <ToolLayout title="Social Media Post Generator" description="Generate engaging posts for social media platforms">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex gap-2 flex-wrap">
          {["twitter", "instagram", "facebook", "linkedin"].map(p => (
            <Button key={p} onClick={() => setPlatform(p)} variant={platform === p ? "default" : "outline"} size="sm" className="rounded-xl capitalize">{p}</Button>
          ))}
        </div>
        <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter your topic or keyword..." className="rounded-xl" />
        <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl w-full">Generate Posts</Button>
        <div className="space-y-2">
          {posts.map((post, i) => (
            <button key={i} onClick={() => { navigator.clipboard.writeText(post); toast.success("Copied!"); }} className="w-full text-left p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors">
              <p className="text-sm">{post}</p>
              <p className={`text-xs mt-1 ${post.length > limits[platform] ? "text-destructive" : "text-muted-foreground"}`}>{post.length}/{limits[platform]}</p>
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
