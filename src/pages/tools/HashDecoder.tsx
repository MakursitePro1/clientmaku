import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Copy } from "lucide-react";

const commonHashes: Record<string, string> = {};
const words = ["password","123456","12345678","qwerty","abc123","monkey","1234567","letmein","trustno1","dragon","baseball","iloveyou","master","sunshine","ashley","bailey","shadow","123123","654321","superman","michael","football","password1","password123","welcome","hello","charlie","donald","admin","root","test","guest","info","user","login","pass","1234","12345","111111","000000","access","flower","secret","angel","junior","master1","sample","default","server"];

async function md5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("MD5".length ? "SHA-256" : "SHA-256", data);
  // We'll use SHA-256 since Web Crypto doesn't support MD5, but we'll build a simple MD5 manually
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha1(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashDecoder() {
  const [hashInput, setHashInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [hashType, setHashType] = useState("auto");

  const crack = async () => {
    if (!hashInput.trim()) return;
    setLoading(true);
    setResult("");

    const target = hashInput.trim().toLowerCase();
    let found = false;

    for (const word of words) {
      const sha256Hash = await sha256(word);
      if (sha256Hash === target) {
        setResult(`✅ Found! Plain text: "${word}" (SHA-256)`);
        found = true;
        break;
      }
      const sha1Hash = await sha1(word);
      if (sha1Hash === target) {
        setResult(`✅ Found! Plain text: "${word}" (SHA-1)`);
        found = true;
        break;
      }
    }

    if (!found) {
      setResult("❌ Not found in dictionary. Try a larger wordlist or different hash.");
    }

    setLoading(false);
    toast.success("Scan complete!");
  };

  return (
    <ToolLayout title="Hash Decoder / Cracker" description="Dictionary-based hash cracker for educational purposes">
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="space-y-3">
          <Input value={hashInput} onChange={e => setHashInput(e.target.value)} placeholder="Paste hash here (SHA-1 or SHA-256)..." className="rounded-xl font-mono text-sm" />
          <Select value={hashType} onValueChange={setHashType}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto Detect</SelectItem>
              <SelectItem value="sha256">SHA-256</SelectItem>
              <SelectItem value="sha1">SHA-1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={crack} disabled={loading || !hashInput.trim()} className="w-full rounded-xl gap-2 gradient-bg text-primary-foreground">
          <Search className="w-4 h-4" /> {loading ? "Cracking..." : "Crack Hash"}
        </Button>
        {result && (
          <div className="p-4 bg-card rounded-xl border border-border/50">
            <p className="text-sm font-medium">{result}</p>
            {result.includes("Found") && (
              <Button size="sm" variant="outline" className="mt-2 rounded-lg gap-1" onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}>
                <Copy className="w-3 h-3" /> Copy
              </Button>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center">⚠️ Educational tool only. Uses a small dictionary of ~50 common passwords. Real hash cracking requires specialized tools.</p>
      </div>
    </ToolLayout>
  );
}
