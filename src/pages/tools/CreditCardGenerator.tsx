import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";

const prefixes: Record<string, { prefix: string[]; length: number }> = {
  Visa: { prefix: ["4"], length: 16 },
  MasterCard: { prefix: ["51", "52", "53", "54", "55"], length: 16 },
  "American Express": { prefix: ["34", "37"], length: 15 },
  Discover: { prefix: ["6011", "65"], length: 16 },
  JCB: { prefix: ["35"], length: 16 },
};

function generateCard(type: string): string {
  const info = prefixes[type];
  if (!info) return "";
  const prefix = info.prefix[Math.floor(Math.random() * info.prefix.length)];
  let num = prefix;
  while (num.length < info.length - 1) {
    num += Math.floor(Math.random() * 10).toString();
  }
  // Luhn check digit
  const digits = num.split("").reverse().map(Number);
  let sum = 0;
  digits.forEach((d, i) => {
    let v = i % 2 === 0 ? d * 2 : d;
    if (v > 9) v -= 9;
    sum += v;
  });
  const check = (10 - (sum % 10)) % 10;
  return num + check.toString();
}

function formatCard(n: string) {
  return n.replace(/(.{4})/g, "$1 ").trim();
}

function generateExpiry() {
  const m = Math.floor(Math.random() * 12) + 1;
  const y = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
  return `${m.toString().padStart(2, "0")}/${y.toString().slice(-2)}`;
}

function generateCVV(type: string) {
  const len = type === "American Express" ? 4 : 3;
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");
}

export default function CreditCardGenerator() {
  const [type, setType] = useState("Visa");
  const [count, setCount] = useState(5);
  const [cards, setCards] = useState<{ number: string; expiry: string; cvv: string }[]>([]);

  const generate = () => {
    const result = Array.from({ length: count }, () => ({
      number: generateCard(type),
      expiry: generateExpiry(),
      cvv: generateCVV(type),
    }));
    setCards(result);
  };

  const copyAll = () => {
    const text = cards.map(c => `${formatCard(c.number)} | ${c.expiry} | ${c.cvv}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("All cards copied!");
  };

  const copyOne = (c: typeof cards[0]) => {
    navigator.clipboard.writeText(`${formatCard(c.number)} | ${c.expiry} | ${c.cvv}`);
    toast.success("Copied!");
  };

  return (
    <ToolLayout title="CC Generator" description="Generate test credit card numbers for development">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Card Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(prefixes).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quantity</label>
            <Select value={count.toString()} onValueChange={v => setCount(Number(v))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 5, 10, 20, 50].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={generate} className="w-full rounded-xl gap-2">
              <RefreshCw className="w-4 h-4" /> Generate
            </Button>
          </div>
        </div>

        {cards.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{cards.length} cards generated</p>
              <Button variant="outline" size="sm" onClick={copyAll} className="rounded-lg gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy All
              </Button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {cards.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/30 border border-border/50 hover:border-border transition-colors">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-mono text-sm font-semibold">{formatCard(c.number)}</span>
                    <span className="text-xs text-muted-foreground">EXP: {c.expiry}</span>
                    <span className="text-xs text-muted-foreground">CVV: {c.cvv}</span>
                  </div>
                  <button onClick={() => copyOne(c)} className="p-1.5 rounded-lg hover:bg-accent transition-colors shrink-0">
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          ⚠️ These are test numbers generated using the Luhn algorithm. They are NOT real credit cards and cannot be used for transactions.
        </p>
      </div>
    </ToolLayout>
  );
}
