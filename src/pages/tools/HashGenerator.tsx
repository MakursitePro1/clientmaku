import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy, Hash, RefreshCw } from "lucide-react";

type Algorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [compareHash, setCompareHash] = useState("");

  const generateHash = async (algorithm: string, data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const md5 = (str: string): string => {
    // Simple MD5 implementation
    const rotateLeft = (val: number, bits: number) => (val << bits) | (val >>> (32 - bits));
    const addUnsigned = (x: number, y: number) => {
      const result = (x & 0x7FFFFFFF) + (y & 0x7FFFFFFF);
      if (x & 0x80000000) return y & 0x80000000 ? (result ^ 0x80000000) ^ 0x80000000 : result ^ 0x80000000;
      return y & 0x80000000 ? result ^ 0x80000000 : result;
    };

    const msg = Array.from(new TextEncoder().encode(str));
    const len = msg.length;
    msg.push(0x80);
    while (msg.length % 64 !== 56) msg.push(0);
    const bits = len * 8;
    msg.push(bits & 0xff, (bits >> 8) & 0xff, (bits >> 16) & 0xff, (bits >> 24) & 0xff, 0, 0, 0, 0);

    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
    const K = Array.from({length: 64}, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000));

    for (let i = 0; i < msg.length; i += 64) {
      const M = Array.from({length: 16}, (_, j) => msg[i+j*4] | (msg[i+j*4+1] << 8) | (msg[i+j*4+2] << 16) | (msg[i+j*4+3] << 24));
      let [A, B, C, D] = [a0, b0, c0, d0];
      for (let j = 0; j < 64; j++) {
        let F, g;
        if (j < 16) { F = (B & C) | (~B & D); g = j; }
        else if (j < 32) { F = (D & B) | (~D & C); g = (5*j+1) % 16; }
        else if (j < 48) { F = B ^ C ^ D; g = (3*j+5) % 16; }
        else { F = C ^ (B | ~D); g = (7*j) % 16; }
        F = addUnsigned(addUnsigned(A, F), addUnsigned(K[j], M[g]));
        A = D; D = C; C = B; B = addUnsigned(B, rotateLeft(F, S[j]));
      }
      a0 = addUnsigned(a0, A); b0 = addUnsigned(b0, B); c0 = addUnsigned(c0, C); d0 = addUnsigned(d0, D);
    }
    const toHex = (n: number) => Array.from({length: 4}, (_, i) => ((n >> (i*8)) & 0xff).toString(16).padStart(2, "0")).join("");
    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
  };

  const generateAll = async () => {
    if (!input) {
      toast({ title: "Error", description: "Please enter some text", variant: "destructive" });
      return;
    }
    const results: Record<string, string> = {};
    results["MD5"] = md5(input);
    results["SHA-1"] = await generateHash("SHA-1", input);
    results["SHA-256"] = await generateHash("SHA-256", input);
    results["SHA-384"] = await generateHash("SHA-384", input);
    results["SHA-512"] = await generateHash("SHA-512", input);
    setHashes(results);
    toast({ title: "Generated!", description: "All hashes generated successfully" });
  };

  const copyHash = (algo: string) => {
    navigator.clipboard.writeText(hashes[algo]);
    toast({ title: "Copied!", description: `${algo} hash copied` });
  };

  const matchResult = compareHash && Object.values(hashes).length > 0
    ? Object.entries(hashes).find(([, v]) => v.toLowerCase() === compareHash.toLowerCase().trim())
    : null;

  return (
    <ToolLayout title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Input Text</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] rounded-xl bg-card border-border/50 resize-none"
            placeholder="Enter text to hash..."
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={generateAll} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2">
            <Hash className="w-4 h-4" /> Generate Hashes
          </Button>
          <Button onClick={() => { setInput(""); setHashes({}); setCompareHash(""); }} variant="outline" className="rounded-xl gap-2">
            <RefreshCw className="w-4 h-4" /> Clear
          </Button>
        </div>

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="bg-card rounded-xl border border-border/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-primary">{algo}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyHash(algo)} className="gap-1.5 h-7">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                </div>
                <code className="text-xs text-muted-foreground break-all font-mono select-all">{hash}</code>
              </div>
            ))}
          </div>
        )}

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-semibold">Compare Hash</label>
            <Input
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              className="rounded-xl bg-card border-border/50 font-mono text-sm"
              placeholder="Paste a hash to compare..."
            />
            {compareHash && (
              <p className={`text-sm font-medium ${matchResult ? "text-green-500" : "text-destructive"}`}>
                {matchResult ? `✅ Match found: ${matchResult[0]}` : "❌ No match found"}
              </p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default HashGenerator;
