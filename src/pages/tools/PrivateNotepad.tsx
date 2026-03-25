import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PrivateNotepad() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [locked, setLocked] = useState(false);

  const xor = (t: string, k: string) => t.split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(i % k.length))).join("");

  const lock = () => {
    if (!key) { toast.error("Enter a password first"); return; }
    const encrypted = btoa(xor(text, key));
    localStorage.setItem("cv-private-note", encrypted);
    setLocked(true);
    toast.success("Note encrypted and saved!");
  };

  const unlock = () => {
    const stored = localStorage.getItem("cv-private-note");
    if (!stored) { toast.error("No saved note found"); return; }
    try {
      const decrypted = xor(atob(stored), key);
      setText(decrypted);
      setLocked(false);
      toast.success("Note decrypted!");
    } catch { toast.error("Wrong password or corrupted data"); }
  };

  return (
    <ToolLayout title="Private Encrypted Notepad" description="Write notes that are encrypted with your password">
      <div className="space-y-4 max-w-2xl mx-auto">
        <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="Enter encryption password..." className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
        <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write your private note..." className="min-h-[200px] rounded-xl" disabled={locked} />
        <div className="flex gap-2">
          <Button onClick={lock} className="gradient-bg text-primary-foreground rounded-xl">🔒 Encrypt & Save</Button>
          <Button onClick={unlock} variant="outline" className="rounded-xl">🔓 Decrypt & Load</Button>
          <Button onClick={() => { setText(""); setLocked(false); }} variant="outline" className="rounded-xl">Clear</Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">Notes are encrypted locally. If you forget the password, the note cannot be recovered.</p>
      </div>
    </ToolLayout>
  );
}
