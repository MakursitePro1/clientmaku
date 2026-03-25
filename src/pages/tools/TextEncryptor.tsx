import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TextEncryptor() {
  const [input, setInput] = useState("");
  const [key, setKey] = useState("secret");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const xorCipher = (text: string, k: string) =>
    text.split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(i % k.length))).join("");

  const encrypt = () => {
    const encrypted = btoa(xorCipher(input, key));
    setOutput(encrypted);
  };

  const decrypt = () => {
    try {
      const decrypted = xorCipher(atob(input), key);
      setOutput(decrypted);
    } catch { setOutput("Invalid encrypted text"); }
  };

  return (
    <ToolLayout title="AES-like Text Encryptor" description="Encrypt and decrypt text with a secret key">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Button onClick={() => setMode("encrypt")} variant={mode === "encrypt" ? "default" : "outline"} className="rounded-xl">Encrypt</Button>
          <Button onClick={() => setMode("decrypt")} variant={mode === "decrypt" ? "default" : "outline"} className="rounded-xl">Decrypt</Button>
        </div>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="Secret Key" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" type="password" />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter encrypted text..."} className="min-h-[120px] rounded-xl" />
        <Button onClick={mode === "encrypt" ? encrypt : decrypt} className="gradient-bg text-primary-foreground rounded-xl w-full">{mode === "encrypt" ? "Encrypt" : "Decrypt"}</Button>
        {output && (
          <>
            <Textarea value={output} readOnly className="min-h-[120px] rounded-xl bg-accent/50 font-mono" />
            <Button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} variant="outline" className="rounded-xl">Copy</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
