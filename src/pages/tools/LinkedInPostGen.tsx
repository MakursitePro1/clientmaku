import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const frameworks = [
  { name: "AIDA", build: (topic: string, detail: string) => `🔥 Attention: Did you know that ${topic} is changing the game?\n\n💡 Interest: ${detail}\n\n🎯 Desire: Imagine the impact this could have on your career and business.\n\n👉 Action: Share your thoughts below! What's your take on ${topic}?\n\n#${topic.replace(/\s+/g, "")} #Professional #Growth #LinkedIn` },
  { name: "Story", build: (topic: string, detail: string) => `📖 Let me tell you a story about ${topic}.\n\nA year ago, I had no idea about this. Then I discovered something that changed everything.\n\n${detail}\n\nThe lesson? Never stop learning.\n\n🔑 Key takeaway: ${topic} matters more than you think.\n\nAgree? ♻️ Repost to help others!\n\n#${topic.replace(/\s+/g, "")} #CareerGrowth #Insights` },
  { name: "Listicle", build: (topic: string, detail: string) => `📋 ${topic}: 5 Things I Wish I Knew Earlier\n\n1️⃣ Start before you're ready\n2️⃣ ${detail}\n3️⃣ Consistency beats perfection\n4️⃣ Network is net worth\n5️⃣ Always keep learning\n\nWhich one resonates most with you? Drop a number below! 👇\n\n#${topic.replace(/\s+/g, "")} #Tips #Leadership` },
  { name: "Hot Take", build: (topic: string, detail: string) => `🔥 Unpopular opinion about ${topic}:\n\n${detail}\n\nI know this might be controversial, but hear me out.\n\nMost people focus on the wrong things. The real game-changer is understanding the fundamentals.\n\nAm I wrong? Let's debate! 👇\n\n#${topic.replace(/\s+/g, "")} #UnpopularOpinion #Debate` },
];

export default function LinkedInPostGen() {
  const [topic, setTopic] = useState("");
  const [detail, setDetail] = useState("");
  const [posts, setPosts] = useState<{ name: string; text: string }[]>([]);

  const generate = () => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    setPosts(frameworks.map(f => ({ name: f.name, text: f.build(topic.trim(), detail.trim() || "This insight could transform how you think about it.") })));
  };

  return (
    <ToolLayout title="LinkedIn Post Generator" description="Create engaging LinkedIn posts with proven frameworks">
      <div className="space-y-4 max-w-lg mx-auto">
        <Input placeholder="Topic (e.g. Remote Work, AI, Leadership)" value={topic} onChange={e => setTopic(e.target.value)} className="rounded-xl" />
        <Textarea placeholder="Key detail or insight (optional)" value={detail} onChange={e => setDetail(e.target.value)} className="rounded-xl" rows={2} />
        <Button onClick={generate} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Generate Posts</Button>
        {posts.map((p, i) => (
          <div key={i} className="bg-accent/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">{p.name} Framework</span>
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(p.text); toast.success("Copied!"); }}>Copy</Button>
            </div>
            <p className="text-sm whitespace-pre-line">{p.text}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
