import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function encrypt(text: string, shift: number) {
  return text.split("").map(c => {
    const code = c.charCodeAt(0);
    return String.fromCharCode(code + shift);
  }).join("");
}
function decrypt(text: string, shift: number) {
  return encrypt(text, -shift);
}

export default function TextEncryption() {
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(3);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encrypt"|"decrypt">("encrypt");

  const process = () => {
    setOutput(mode === "encrypt" ? encrypt(input, shift) : decrypt(input, shift));
  };

  return (
    <ToolLayout title="Text Encryption Tool" description="Encrypt and decrypt text using Caesar cipher">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Button onClick={() => setMode("encrypt")} variant={mode === "encrypt" ? "default" : "outline"} className="rounded-xl">Encrypt</Button>
          <Button onClick={() => setMode("decrypt")} variant={mode === "decrypt" ? "default" : "outline"} className="rounded-xl">Decrypt</Button>
          <Input type="number" value={shift} onChange={e => setShift(Number(e.target.value))} className="w-24 rounded-xl" placeholder="Shift" />
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text..." className="min-h-[120px] rounded-xl" />
        <Button onClick={process} className="gradient-bg text-primary-foreground rounded-xl">{mode === "encrypt" ? "Encrypt" : "Decrypt"}</Button>
        {output && <Textarea value={output} readOnly className="min-h-[120px] rounded-xl bg-accent/50" />}
      </div>
    </ToolLayout>
  );
}
