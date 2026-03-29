import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Lock, Unlock, RefreshCw } from "lucide-react";

type Method = "base64" | "aes" | "caesar" | "rot13" | "hex" | "binary" | "reverse" | "atbash";

const methods: { id: Method; label: string; desc: string }[] = [
  { id: "base64", label: "Base64", desc: "Standard encoding" },
  { id: "aes", label: "AES-256", desc: "Password-based encryption" },
  { id: "caesar", label: "Caesar Cipher", desc: "Shift-based cipher" },
  { id: "rot13", label: "ROT13", desc: "13-letter rotation" },
  { id: "hex", label: "Hex Encode", desc: "Hexadecimal encoding" },
  { id: "binary", label: "Binary", desc: "Binary encoding" },
  { id: "reverse", label: "Reverse", desc: "Reverse text" },
  { id: "atbash", label: "Atbash", desc: "Mirror alphabet cipher" },
];

async function aesEncrypt(text: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password.padEnd(32, "0").slice(0, 32)), "PBKDF2", false, ["deriveKey"]);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text));
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function aesDecrypt(ciphertext: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password.padEnd(32, "0").slice(0, 32)), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
  return new TextDecoder().decode(decrypted);
}

function caesarCipher(text: string, shift: number): string {
  return text.split("").map(c => {
    if (c >= "a" && c <= "z") return String.fromCharCode(((c.charCodeAt(0) - 97 + shift) % 26 + 26) % 26 + 97);
    if (c >= "A" && c <= "Z") return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
    return c;
  }).join("");
}

function atbash(text: string): string {
  return text.split("").map(c => {
    if (c >= "a" && c <= "z") return String.fromCharCode(122 - c.charCodeAt(0) + 97);
    if (c >= "A" && c <= "Z") return String.fromCharCode(90 - c.charCodeAt(0) + 65);
    return c;
  }).join("");
}

export default function TextEncryption() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [method, setMethod] = useState<Method>("base64");
  const [password, setPassword] = useState("");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const process = async () => {
    if (!input) { toast.error("Enter some text"); return; }
    try {
      let result = "";
      if (mode === "encrypt") {
        switch (method) {
          case "base64": result = btoa(unescape(encodeURIComponent(input))); break;
          case "aes": {
            if (!password) { toast.error("Enter a password for AES"); return; }
            result = await aesEncrypt(input, password);
            break;
          }
          case "caesar": result = caesarCipher(input, shift); break;
          case "rot13": result = caesarCipher(input, 13); break;
          case "hex": result = Array.from(new TextEncoder().encode(input)).map(b => b.toString(16).padStart(2, "0")).join(" "); break;
          case "binary": result = Array.from(new TextEncoder().encode(input)).map(b => b.toString(2).padStart(8, "0")).join(" "); break;
          case "reverse": result = input.split("").reverse().join(""); break;
          case "atbash": result = atbash(input); break;
        }
      } else {
        switch (method) {
          case "base64": result = decodeURIComponent(escape(atob(input))); break;
          case "aes": {
            if (!password) { toast.error("Enter the password"); return; }
            result = await aesDecrypt(input, password);
            break;
          }
          case "caesar": result = caesarCipher(input, -shift); break;
          case "rot13": result = caesarCipher(input, -13); break;
          case "hex": result = new TextDecoder().decode(new Uint8Array(input.trim().split(/\s+/).map(h => parseInt(h, 16)))); break;
          case "binary": result = new TextDecoder().decode(new Uint8Array(input.trim().split(/\s+/).map(b => parseInt(b, 2)))); break;
          case "reverse": result = input.split("").reverse().join(""); break;
          case "atbash": result = atbash(input); break;
        }
      }
      setOutput(result);
      toast.success(mode === "encrypt" ? "Encrypted!" : "Decrypted!");
    } catch (err) {
      toast.error("Failed: " + (err instanceof Error ? err.message : "Invalid input"));
    }
  };

  const swap = () => { setInput(output); setOutput(""); setMode(mode === "encrypt" ? "decrypt" : "encrypt"); };

  return (
    <ToolLayout title="Encryption / Decryption Tool" description="Encrypt and decrypt text with multiple algorithms including AES-256">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-accent/30 rounded-xl">
          <button onClick={() => setMode("encrypt")} className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${mode === "encrypt" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            <Lock className="w-3.5 h-3.5" /> Encrypt
          </button>
          <button onClick={() => setMode("decrypt")} className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${mode === "decrypt" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            <Unlock className="w-3.5 h-3.5" /> Decrypt
          </button>
        </div>

        {/* Method Selection */}
        <div className="grid grid-cols-4 gap-2">
          {methods.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`p-2 rounded-xl text-center transition-all border ${method === m.id ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-card text-muted-foreground hover:text-foreground"}`}>
              <div className="text-xs font-bold">{m.label}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Conditional Options */}
        {method === "aes" && (
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter encryption password..." className="rounded-xl" />
        )}
        {method === "caesar" && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold whitespace-nowrap">Shift:</label>
            <Input type="number" value={shift} onChange={e => setShift(Number(e.target.value))} className="w-20 rounded-xl" min={1} max={25} />
          </div>
        )}

        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter text to decrypt..."} className="min-h-[120px] rounded-xl" />

        <div className="flex gap-2">
          <Button onClick={process} className="flex-1 gradient-bg text-primary-foreground rounded-xl font-bold">
            {mode === "encrypt" ? <><Lock className="w-4 h-4 mr-1.5" /> Encrypt</> : <><Unlock className="w-4 h-4 mr-1.5" /> Decrypt</>}
          </Button>
          <Button onClick={swap} variant="outline" className="rounded-xl" title="Swap input/output">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {output && (
          <div className="space-y-2">
            <Textarea value={output} readOnly className="min-h-[120px] rounded-xl bg-accent/30 font-mono text-sm" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }}>
                <Copy className="w-3.5 h-3.5" /> Copy Result
              </Button>
              <span className="text-xs text-muted-foreground flex items-center">{output.length} characters</span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
