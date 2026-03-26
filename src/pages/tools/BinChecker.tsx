import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const binDatabase: Record<string, { brand: string; type: string; level: string; bank: string; country: string }> = {
  "4": { brand: "Visa", type: "Credit/Debit", level: "Classic", bank: "Various Banks", country: "Worldwide" },
  "51": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide" },
  "52": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide" },
  "53": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide" },
  "54": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide" },
  "55": { brand: "MasterCard", type: "Credit", level: "World", bank: "Various Banks", country: "Worldwide" },
  "34": { brand: "American Express", type: "Credit", level: "Standard", bank: "American Express", country: "USA" },
  "37": { brand: "American Express", type: "Credit", level: "Gold/Platinum", bank: "American Express", country: "USA" },
  "6011": { brand: "Discover", type: "Credit", level: "Standard", bank: "Discover Financial", country: "USA" },
  "65": { brand: "Discover", type: "Credit", level: "Standard", bank: "Discover Financial", country: "USA" },
  "35": { brand: "JCB", type: "Credit", level: "Standard", bank: "JCB Co.", country: "Japan" },
  "30": { brand: "Diners Club", type: "Credit", level: "Standard", bank: "Diners Club", country: "USA" },
  "36": { brand: "Diners Club", type: "Credit", level: "International", bank: "Diners Club", country: "Worldwide" },
  "38": { brand: "Diners Club", type: "Credit", level: "Standard", bank: "Diners Club", country: "USA" },
  "62": { brand: "UnionPay", type: "Credit/Debit", level: "Standard", bank: "Various Banks", country: "China" },
  "22": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide" },
};

function lookupBin(bin: string) {
  const clean = bin.replace(/\D/g, "");
  // Try longest prefix first
  for (let len = 4; len >= 1; len--) {
    const prefix = clean.substring(0, len);
    if (binDatabase[prefix]) {
      return binDatabase[prefix];
    }
  }
  return null;
}

export default function BinChecker() {
  const [bin, setBin] = useState("");
  const [result, setResult] = useState<ReturnType<typeof lookupBin>>(null);
  const [searched, setSearched] = useState(false);

  const check = () => {
    const clean = bin.replace(/\D/g, "");
    if (clean.length < 6) return;
    setResult(lookupBin(clean));
    setSearched(true);
  };

  const fields = result ? [
    { label: "Card Brand", value: result.brand },
    { label: "Card Type", value: result.type },
    { label: "Card Level", value: result.level },
    { label: "Issuing Bank", value: result.bank },
    { label: "Country", value: result.country },
    { label: "BIN", value: bin.replace(/\D/g, "").substring(0, 6) },
  ] : [];

  return (
    <ToolLayout title="BIN Checker" description="Look up Bank Identification Number (BIN) details">
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex gap-2">
          <Input
            value={bin}
            onChange={e => { setBin(e.target.value); setSearched(false); }}
            placeholder="Enter first 6-8 digits of card..."
            className="rounded-xl font-mono text-lg tracking-wider"
            maxLength={8}
            onKeyDown={e => e.key === "Enter" && check()}
          />
          <Button onClick={check} className="rounded-xl px-5" disabled={bin.replace(/\D/g, "").length < 6}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {searched && result && (
          <div className="rounded-2xl border border-border/50 bg-accent/20 overflow-hidden">
            <div className="p-4 bg-primary/10 border-b border-border/30">
              <h3 className="text-lg font-bold text-center">{result.brand}</h3>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border/30">
              {fields.map(f => (
                <div key={f.label} className="p-3 bg-card">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">{f.label}</p>
                  <p className="font-semibold text-sm mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && !result && (
          <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
            <p className="text-lg font-bold">❌ BIN Not Found</p>
            <p className="text-sm text-muted-foreground mt-1">Could not identify this BIN in our database.</p>
          </div>
        )}

        <div className="p-4 rounded-xl bg-card border border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>What is a BIN?</strong> The Bank Identification Number (BIN) is the first 6-8 digits of a payment card number. It identifies the card brand, issuing bank, card type, and country of origin.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
