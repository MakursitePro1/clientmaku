import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const templates: Record<string, string[]> = {
  travel: [
    "✈️ Adventure awaits in {topic}! 🌍 #travel #wanderlust #explore",
    "Lost in the beauty of {topic} 🗺️✨ Every journey changes you. #travelgram",
    "🌴 {topic} vibes only. Life is short, travel more! #vacation #instatravel",
    "Exploring {topic} one step at a time 👣🌎 #travelphotography #adventure",
  ],
  food: [
    "🍕 {topic} is always a good idea! Who's hungry? #foodie #yummy",
    "Feast your eyes on this {topic} 😍🍽️ #foodporn #instafood #delicious",
    "Life is too short for boring {topic} 🤤 #foodlover #homemade",
    "Made some amazing {topic} today! Recipe link in bio 👨‍🍳 #cooking",
  ],
  fitness: [
    "💪 {topic} day! No excuses, just results. #fitness #gym #motivation",
    "Crushing my {topic} goals one day at a time 🔥 #workout #fitlife",
    "Sweat is just fat crying 😅 {topic} session done! #fitnessmotivation",
    "Your body can stand almost anything. Train your mind for {topic} 🧠💪 #healthylifestyle",
  ],
  motivation: [
    "🌟 {topic} — because you deserve the best version of yourself. #motivation",
    "Dream big. Start small. Act now. {topic} 🚀 #inspire #success",
    "The only limit is your mind. {topic} awaits! 💡 #mindset #growth",
    "Every day is a new chance for {topic} ✨ #positivevibes #nevergiveup",
  ],
  lifestyle: [
    "Living my best life with {topic} ☀️ #lifestyle #blessed",
    "Simple pleasures: {topic} and good vibes 🌿 #minimalism #selfcare",
    "Coffee, {topic}, and a whole lot of gratitude ☕ #dailylife",
    "{topic} kinda day 🌸 What are you up to? #instadaily #mood",
  ],
};

export default function InstagramCaptionGen() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("motivation");
  const [captions, setCaptions] = useState<string[]>([]);

  const generate = () => {
    if (!topic.trim()) { toast.error("Enter a topic first"); return; }
    const t = templates[category] || templates.motivation;
    setCaptions(t.map(c => c.replace(/{topic}/g, topic.trim())));
  };

  return (
    <ToolLayout title="Instagram Caption Generator" description="Generate creative captions for Instagram posts">
      <div className="space-y-4 max-w-lg mx-auto">
        <div className="flex gap-3">
          <Input placeholder="Enter topic (e.g. sunset, pizza, morning run)" value={topic} onChange={e => setTopic(e.target.value)} className="rounded-xl flex-1" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(templates).map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generate} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Generate Captions</Button>
        {captions.length > 0 && (
          <div className="space-y-3">
            {captions.map((c, i) => (
              <div key={i} className="bg-accent/50 rounded-xl p-4 cursor-pointer hover:bg-accent/70 transition-colors" onClick={() => { navigator.clipboard.writeText(c); toast.success("Copied!"); }}>
                <p className="text-sm">{c}</p>
                <p className="text-[10px] text-muted-foreground mt-2">Click to copy</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
