import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Lock, Unlock, RefreshCw, ArrowLeftRight, Download, Shield, Clock } from "lucide-react";

type Method = "base64" | "aes" | "caesar" | "rot13" | "hex" | "binary" | "reverse" | "atbash" | "url" | "morse";

const methods: { id: Method; label: string; desc: string; icon: string }[] = [
  { id: "base64", label: "Base64", desc: "Standard encoding", icon: "📦" },
  { id: "aes", label: "AES-256", desc: "Password encryption", icon: "🔐" },
  { id: "caesar", label: "Caesar", desc: "Shift cipher", icon: "🏛️" },
  { id: "rot13", label: "ROT13", desc: "13-letter rotation", icon: "🔄" },
  { id: "hex", label: "Hex", desc: "Hexadecimal", icon: "🔢" },
  { id: "binary", label: "Binary", desc: "Binary encoding", icon: "⚡" },
  { id: "reverse", label: "Reverse", desc: "Reverse text", icon: "↩️" },
  { id: "atbash", label: "Atbash", desc: "Mirror alphabet", icon: "🪞" },
  { id: "url", label: "URL", desc: "URL encoding", icon: "🌐" },
  { id: "morse", label: "Morse", desc: "Morse code", icon: "📡" },
];

const morseMap: Record<string, string> = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", " ": "/" };
const reverseMorse = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));

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
  const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password.padEnd(32, "0").slice(0, 32)), "PBKDF2", false, ["deriveKey"]);
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

function toMorse(text: string): string {
  return text.toUpperCase().split("").map(c => morseMap[c] || c).join(" ");
}

function fromMorse(text: string): string {
  return text.split(" ").map(code => reverseMorse[code] || code).join("");
}

export default function TextEncryption() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [method, setMethod] = useState<Method>("base64");
  const [password, setPassword] = useState("");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [history, setHistory] = useState<{ method: string; mode: string; time: string }[]>([]);

  const process = async () => {
    if (!input) { toast.error("Enter some text"); return; }
    try {
      let result = "";
      if (mode === "encrypt") {
        switch (method) {
          case "base64": result = btoa(unescape(encodeURIComponent(input))); break;
          case "aes": if (!password) { toast.error("Enter a password"); return; } result = await aesEncrypt(input, password); break;
          case "caesar": result = caesarCipher(input, shift); break;
          case "rot13": result = caesarCipher(input, 13); break;
          case "hex": result = Array.from(new TextEncoder().encode(input)).map(b => b.toString(16).padStart(2, "0")).join(" "); break;
          case "binary": result = Array.from(new TextEncoder().encode(input)).map(b => b.toString(2).padStart(8, "0")).join(" "); break;
          case "reverse": result = input.split("").reverse().join(""); break;
          case "atbash": result = atbash(input); break;
          case "url": result = encodeURIComponent(input); break;
          case "morse": result = toMorse(input); break;
        }
      } else {
        switch (method) {
          case "base64": result = decodeURIComponent(escape(atob(input))); break;
          case "aes": if (!password) { toast.error("Enter the password"); return; } result = await aesDecrypt(input, password); break;
          case "caesar": result = caesarCipher(input, -shift); break;
          case "rot13": result = caesarCipher(input, -13); break;
          case "hex": result = new TextDecoder().decode(new Uint8Array(input.trim().split(/\s+/).map(h => parseInt(h, 16)))); break;
          case "binary": result = new TextDecoder().decode(new Uint8Array(input.trim().split(/\s+/).map(b => parseInt(b, 2)))); break;
          case "reverse": result = input.split("").reverse().join(""); break;
          case "atbash": result = atbash(input); break;
          case "url": result = decodeURIComponent(input); break;
          case "morse": result = fromMorse(input); break;
        }
      }
      setOutput(result);
      setHistory(prev => [{ method, mode, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
      toast.success(mode === "encrypt" ? "Encrypted!" : "Decrypted!");
    } catch (err) {
      toast.error("Failed: " + (err instanceof Error ? err.message : "Invalid input"));
    }
  };

  const swap = () => { setInput(output); setOutput(""); setMode(mode === "encrypt" ? "decrypt" : "encrypt"); };

  return (
    <ToolLayout title="Encryption / Decryption Tool" description="Encrypt and decrypt text with 10 methods including AES-256 and Morse code">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-accent/30 rounded-xl">
          <button onClick={() => setMode("encrypt")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${mode === "encrypt" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
            <Lock className="w-3.5 h-3.5" /> Encrypt
          </button>
          <button onClick={() => setMode("decrypt")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${mode === "decrypt" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
            <Unlock className="w-3.5 h-3.5" /> Decrypt
          </button>
        </div>

        {/* Method Selection */}
        <div className="grid grid-cols-5 gap-2">
          {methods.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`p-2.5 rounded-xl text-center transition-all border ${method === m.id ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30" : "border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
              <span className="text-lg block">{m.icon}</span>
              <div className="text-[10px] font-bold mt-0.5">{m.label}</div>
            </button>
          ))}
        </div>

        {/* Options */}
        {method === "aes" && (
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Encryption password..." className="rounded-xl" />
        )}
        {method === "caesar" && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold whitespace-nowrap">Shift:</label>
            <div className="flex gap-1">
              {[1, 3, 5, 7, 13, 19, 25].map(s => (
                <button key={s} onClick={() => setShift(s)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold ${shift === s ? "bg-primary text-primary-foreground" : "bg-accent/50 text-muted-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input/Output */}
        <div className="space-y-3">
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter text to decrypt..."} className="min-h-[100px] rounded-xl font-mono text-sm" />

          <div className="flex gap-2">
            <Button onClick={process} className="flex-1 gradient-bg text-primary-foreground rounded-xl font-bold gap-1.5">
              {mode === "encrypt" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>
            <Button onClick={swap} variant="outline" className="rounded-xl" title="Swap">
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </div>

          <AnimatePresence>
            {output && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Textarea value={output} readOnly className="min-h-[100px] rounded-xl bg-accent/30 font-mono text-sm" />
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }}>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={() => {
                    const blob = new Blob([output], { type: "text/plain" });
                    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${mode}ed-text.txt`; a.click();
                    toast.success("Downloaded!");
                  }}>
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>
                  <span className="text-xs text-muted-foreground flex items-center ml-auto">{output.length} characters</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Method Info */}
        <div className="rounded-xl border border-border/30 bg-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold">About {methods.find(m => m.id === method)?.label}</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {method === "aes" && "AES-256-GCM with PBKDF2 key derivation. Military-grade encryption using Web Crypto API. Requires a password for both encryption and decryption."}
            {method === "base64" && "Base64 is an encoding scheme that converts binary data to ASCII. Not encryption — anyone can decode it. Use for data transport, not security."}
            {method === "caesar" && `Classic substitution cipher that shifts each letter by ${shift} positions. Easy to crack but historically significant.`}
            {method === "rot13" && "ROT13 is a special case of Caesar cipher with a shift of 13. Applying it twice returns the original text."}
            {method === "hex" && "Hexadecimal encoding represents each byte as two hex digits (0-9, a-f). Common in programming and cryptography."}
            {method === "binary" && "Binary encoding converts each character to its 8-bit binary representation. The fundamental language of computers."}
            {method === "reverse" && "Simply reverses the order of all characters in the text. A basic obfuscation technique."}
            {method === "atbash" && "Ancient Hebrew cipher that maps A→Z, B→Y, C→X, etc. One of the earliest known ciphers."}
            {method === "url" && "URL encoding replaces unsafe characters with % followed by hex values. Essential for web URLs and query strings."}
            {method === "morse" && "Morse code represents characters as dots and dashes. Invented for telegraph communication in the 1830s."}
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
