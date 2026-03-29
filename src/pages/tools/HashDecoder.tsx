import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Copy, Loader2, CheckCircle2, XCircle, Shield, AlertTriangle } from "lucide-react";

const dictionary = ["password","123456","12345678","qwerty","abc123","monkey","1234567","letmein","trustno1","dragon","baseball","iloveyou","master","sunshine","ashley","bailey","shadow","123123","654321","superman","michael","football","password1","password123","welcome","hello","charlie","donald","admin","root","test","guest","info","user","login","pass","1234","12345","111111","000000","access","flower","secret","angel","junior","master1","sample","default","server","love","god","sex","money","internet","freedom","whatever","power","killer","peace","princess","starwars","matrix","solo","pass1234","hunter","buster","soccer","harley","batman","andrew","tiger","joshua","pepper","thomas","ranger","daniel","computer","coffee","cookie","winter","summer","spring","autumn","orange","banana","chicken","cheese","butter","genius","lucky","happy","magic","ninja","pirate","thunder","diamond","crystal","golden","silver","bronze","platinum","emerald","ruby","sapphire"];

async function sha256(text: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha1(text: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashDecoder() {
  const [hashInput, setHashInput] = useState("");
  const [result, setResult] = useState<{ found: boolean; plain?: string; algo?: string; attempts: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hashType, setHashType] = useState("auto");

  const identifyHash = (hash: string) => {
    const len = hash.length;
    if (len === 32) return "Likely MD5 (32 chars)";
    if (len === 40) return "Likely SHA-1 (40 chars)";
    if (len === 64) return "Likely SHA-256 (64 chars)";
    if (len === 96) return "Likely SHA-384 (96 chars)";
    if (len === 128) return "Likely SHA-512 (128 chars)";
    return `Unknown (${len} chars)`;
  };

  const crack = async () => {
    if (!hashInput.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    const target = hashInput.trim().toLowerCase();
    let found = false;
    let attempts = 0;

    // Also try common variations
    const variations: string[] = [];
    for (const word of dictionary) {
      variations.push(word, word + "1", word + "123", word + "!", word.toUpperCase(), word[0].toUpperCase() + word.slice(1));
    }

    for (let i = 0; i < variations.length; i++) {
      const word = variations[i];
      attempts++;
      if (i % 20 === 0) {
        setProgress(Math.round((i / variations.length) * 100));
        await new Promise(r => setTimeout(r, 1));
      }

      if (hashType === "auto" || hashType === "sha256") {
        const h = await sha256(word);
        if (h === target) {
          setResult({ found: true, plain: word, algo: "SHA-256", attempts });
          found = true;
          break;
        }
      }
      if (!found && (hashType === "auto" || hashType === "sha1")) {
        const h = await sha1(word);
        if (h === target) {
          setResult({ found: true, plain: word, algo: "SHA-1", attempts });
          found = true;
          break;
        }
      }
    }

    if (!found) {
      setResult({ found: false, attempts });
    }

    setProgress(100);
    setLoading(false);
    toast.success("Scan complete!");
  };

  return (
    <ToolLayout title="Hash Decoder / Cracker" description="Dictionary-based hash cracker with 600+ word variations">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-3">
          <Input
            value={hashInput}
            onChange={e => setHashInput(e.target.value)}
            placeholder="Paste hash here (SHA-1 or SHA-256)..."
            className="rounded-xl font-mono text-sm"
          />
          <div className="flex gap-2">
            <Select value={hashType} onValueChange={setHashType}>
              <SelectTrigger className="rounded-xl w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto Detect</SelectItem>
                <SelectItem value="sha256">SHA-256</SelectItem>
                <SelectItem value="sha1">SHA-1</SelectItem>
              </SelectContent>
            </Select>
            {hashInput.trim() && (
              <span className="text-xs text-muted-foreground self-center">{identifyHash(hashInput.trim())}</span>
            )}
          </div>
        </div>

        <Button onClick={crack} disabled={loading || !hashInput.trim()} className="w-full rounded-xl gap-2 gradient-bg text-primary-foreground">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? `Cracking... ${progress}%` : "Crack Hash"}
        </Button>

        {/* Progress */}
        {loading && (
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-primary h-2 rounded-full"
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-6 ${result.found ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5"}`}
            >
              <div className="text-center space-y-3">
                {result.found ? (
                  <>
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                    <h3 className="text-xl font-bold text-green-500">Hash Cracked!</h3>
                    <div className="p-4 bg-card rounded-xl border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Plain Text</p>
                      <p className="text-2xl font-black font-mono">{result.plain}</p>
                      <p className="text-xs text-muted-foreground mt-2">Algorithm: {result.algo}</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={() => { navigator.clipboard.writeText(result.plain || ""); toast.success("Copied!"); }}>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </Button>
                  </>
                ) : (
                  <>
                    <XCircle className="w-12 h-12 text-destructive mx-auto" />
                    <h3 className="text-xl font-bold text-destructive">Not Found</h3>
                    <p className="text-sm text-muted-foreground">Hash not found in our dictionary of {dictionary.length}+ words and variations.</p>
                  </>
                )}
                <p className="text-xs text-muted-foreground">{result.attempts.toLocaleString()} combinations tested</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="rounded-xl border border-border/30 bg-card p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h3 className="text-xs font-bold">Educational Tool</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            This tool uses a dictionary of {dictionary.length}+ common passwords with variations (capitalization, numbers, symbols).
            Real hash cracking requires specialized tools like Hashcat or John the Ripper with GPU acceleration.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Dictionary", val: `${dictionary.length}+` },
              { label: "Variations", val: `${dictionary.length * 6}+` },
              { label: "Algorithms", val: "SHA-1/256" },
            ].map(s => (
              <div key={s.label} className="p-2 bg-accent/20 rounded-lg text-center">
                <p className="text-xs font-bold text-primary">{s.val}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
