import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SocialMediaBioGenerator() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [interests, setInterests] = useState("");
  const [bios, setBios] = useState<string[]>([]);

  const generate = () => {
    const i = interests.split(",").map(s => s.trim()).filter(Boolean);
    const emojis = ["🚀","💡","🎯","✨","🔥","💪","🌟","⚡","🎨","📱","💻","🌍"];
    const templates = [
      `${emojis[Math.floor(Math.random()*emojis.length)]} ${profession} | ${i.slice(0,2).join(" & ")} enthusiast | ${name}`,
      `${name} • ${profession}\n${i.map(x => `✦ ${x}`).join(" ")}`,
      `Hey, I'm ${name}! ${emojis[Math.floor(Math.random()*emojis.length)]}\n${profession} passionate about ${i.join(", ")}`,
      `${profession} ${emojis[Math.floor(Math.random()*emojis.length)]} | Lover of ${i.slice(0, 3).join(", ")} | DM for collabs 📩`,
      `✨ ${name} ✨\n📍 ${profession}\n❤️ ${i.join(" | ")}`,
      `${emojis[Math.floor(Math.random()*emojis.length)]} ${name}\n🔹 ${profession}\n🔹 ${i.join(" • ")}`,
    ];
    setBios(templates);
  };

  return (
    <ToolLayout title="Social Media Bio Generator" description="Generate creative bios for social media profiles">
      <div className="space-y-4 max-w-md mx-auto">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="rounded-xl" />
        <Input value={profession} onChange={e => setProfession(e.target.value)} placeholder="Your profession" className="rounded-xl" />
        <Input value={interests} onChange={e => setInterests(e.target.value)} placeholder="Interests (comma-separated)" className="rounded-xl" />
        <Button onClick={generate} disabled={!name || !profession} className="gradient-bg text-primary-foreground rounded-xl w-full">Generate Bios</Button>
        <div className="space-y-2">
          {bios.map((bio, i) => (
            <button key={i} onClick={() => { navigator.clipboard.writeText(bio); toast.success("Copied!"); }} className="w-full text-left p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors">
              <pre className="text-sm whitespace-pre-wrap">{bio}</pre>
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
