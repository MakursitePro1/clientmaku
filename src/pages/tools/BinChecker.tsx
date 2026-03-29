import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CreditCard, Globe, Building, Shield } from "lucide-react";

interface BinInfo {
  brand: string;
  type: string;
  level: string;
  bank: string;
  country: string;
  countryCode: string;
  currency?: string;
  luhn?: boolean;
}

const binDatabase: Record<string, BinInfo> = {
  // Visa
  "4000": { brand: "Visa", type: "Credit", level: "Classic", bank: "Various Banks", country: "United States", countryCode: "US", currency: "USD" },
  "4012": { brand: "Visa", type: "Credit", level: "Classic", bank: "Various Banks", country: "United States", countryCode: "US", currency: "USD" },
  "4111": { brand: "Visa", type: "Credit", level: "Classic", bank: "Citibank", country: "United States", countryCode: "US", currency: "USD" },
  "4147": { brand: "Visa", type: "Debit", level: "Classic", bank: "US Bank", country: "United States", countryCode: "US", currency: "USD" },
  "4242": { brand: "Visa", type: "Credit", level: "Classic", bank: "Stripe Test", country: "United States", countryCode: "US", currency: "USD" },
  "4263": { brand: "Visa", type: "Credit", level: "Gold", bank: "Various Banks", country: "United Kingdom", countryCode: "GB", currency: "GBP" },
  "4462": { brand: "Visa", type: "Credit", level: "Platinum", bank: "HSBC", country: "United Kingdom", countryCode: "GB", currency: "GBP" },
  "4532": { brand: "Visa", type: "Credit", level: "Classic", bank: "Various Banks", country: "Canada", countryCode: "CA", currency: "CAD" },
  "4539": { brand: "Visa", type: "Credit", level: "Classic", bank: "RBC Royal Bank", country: "Canada", countryCode: "CA", currency: "CAD" },
  "4556": { brand: "Visa", type: "Credit", level: "Classic", bank: "Various Banks", country: "Germany", countryCode: "DE", currency: "EUR" },
  "4571": { brand: "Visa", type: "Debit", level: "Electron", bank: "Various Banks", country: "India", countryCode: "IN", currency: "INR" },
  "4659": { brand: "Visa", type: "Credit", level: "Signature", bank: "State Bank of India", country: "India", countryCode: "IN", currency: "INR" },
  "4711": { brand: "Visa", type: "Credit", level: "Classic", bank: "Various Banks", country: "France", countryCode: "FR", currency: "EUR" },
  "4844": { brand: "Visa", type: "Credit", level: "Classic", bank: "Various Banks", country: "Australia", countryCode: "AU", currency: "AUD" },
  "4903": { brand: "Visa", type: "Debit", level: "Electron", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "4917": { brand: "Visa", type: "Debit", level: "Electron", bank: "Various Banks", country: "United Kingdom", countryCode: "GB", currency: "GBP" },
  "4": { brand: "Visa", type: "Credit/Debit", level: "Classic", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  // Mastercard
  "5100": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "United States", countryCode: "US", currency: "USD" },
  "5123": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "ICICI Bank", country: "India", countryCode: "IN", currency: "INR" },
  "5200": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "5211": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Germany", countryCode: "DE", currency: "EUR" },
  "5254": { brand: "MasterCard", type: "Debit", level: "Standard", bank: "Dutch-Bangla Bank", country: "Bangladesh", countryCode: "BD", currency: "BDT" },
  "5300": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Japan", countryCode: "JP", currency: "JPY" },
  "5399": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Brazil", countryCode: "BR", currency: "BRL" },
  "5425": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "United Kingdom", countryCode: "GB", currency: "GBP" },
  "5431": { brand: "MasterCard", type: "Credit", level: "World", bank: "HDFC Bank", country: "India", countryCode: "IN", currency: "INR" },
  "5500": { brand: "MasterCard", type: "Credit", level: "World", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "5555": { brand: "MasterCard", type: "Credit", level: "World Elite", bank: "Various Banks", country: "United States", countryCode: "US", currency: "USD" },
  "51": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "52": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "53": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "54": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "55": { brand: "MasterCard", type: "Credit", level: "World", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "2221": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "2720": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  // Amex
  "3400": { brand: "American Express", type: "Credit", level: "Green", bank: "American Express", country: "United States", countryCode: "US", currency: "USD" },
  "3468": { brand: "American Express", type: "Credit", level: "Blue", bank: "American Express", country: "United States", countryCode: "US", currency: "USD" },
  "3700": { brand: "American Express", type: "Credit", level: "Gold", bank: "American Express", country: "United States", countryCode: "US", currency: "USD" },
  "3715": { brand: "American Express", type: "Credit", level: "Platinum", bank: "American Express", country: "United States", countryCode: "US", currency: "USD" },
  "3742": { brand: "American Express", type: "Credit", level: "Centurion", bank: "American Express", country: "United States", countryCode: "US", currency: "USD" },
  "34": { brand: "American Express", type: "Credit", level: "Standard", bank: "American Express", country: "USA", countryCode: "US", currency: "USD" },
  "37": { brand: "American Express", type: "Credit", level: "Gold/Platinum", bank: "American Express", country: "USA", countryCode: "US", currency: "USD" },
  // Discover
  "6011": { brand: "Discover", type: "Credit", level: "Standard", bank: "Discover Financial", country: "United States", countryCode: "US", currency: "USD" },
  "6221": { brand: "Discover", type: "Credit", level: "Standard", bank: "Discover Financial", country: "United States", countryCode: "US", currency: "USD" },
  "6440": { brand: "Discover", type: "Credit", level: "it Card", bank: "Discover Financial", country: "United States", countryCode: "US", currency: "USD" },
  "65": { brand: "Discover", type: "Credit", level: "Standard", bank: "Discover Financial", country: "USA", countryCode: "US", currency: "USD" },
  // JCB
  "3528": { brand: "JCB", type: "Credit", level: "Standard", bank: "JCB Co.", country: "Japan", countryCode: "JP", currency: "JPY" },
  "3566": { brand: "JCB", type: "Credit", level: "Gold", bank: "JCB Co.", country: "Japan", countryCode: "JP", currency: "JPY" },
  "35": { brand: "JCB", type: "Credit", level: "Standard", bank: "JCB Co.", country: "Japan", countryCode: "JP", currency: "JPY" },
  // Diners Club
  "3000": { brand: "Diners Club", type: "Credit", level: "Carte Blanche", bank: "Diners Club", country: "Worldwide", countryCode: "WW" },
  "3056": { brand: "Diners Club", type: "Credit", level: "International", bank: "Diners Club", country: "Worldwide", countryCode: "WW" },
  "30": { brand: "Diners Club", type: "Credit", level: "Standard", bank: "Diners Club", country: "USA", countryCode: "US" },
  "36": { brand: "Diners Club", type: "Credit", level: "International", bank: "Diners Club", country: "Worldwide", countryCode: "WW" },
  "38": { brand: "Diners Club", type: "Credit", level: "Standard", bank: "Diners Club", country: "USA", countryCode: "US" },
  // UnionPay
  "6200": { brand: "UnionPay", type: "Credit", level: "Standard", bank: "Bank of China", country: "China", countryCode: "CN", currency: "CNY" },
  "6210": { brand: "UnionPay", type: "Debit", level: "Standard", bank: "ICBC", country: "China", countryCode: "CN", currency: "CNY" },
  "6240": { brand: "UnionPay", type: "Credit", level: "Platinum", bank: "CCB", country: "China", countryCode: "CN", currency: "CNY" },
  "6250": { brand: "UnionPay", type: "Debit", level: "Standard", bank: "ABC", country: "China", countryCode: "CN", currency: "CNY" },
  "6280": { brand: "UnionPay", type: "Credit", level: "Diamond", bank: "Various Banks", country: "China", countryCode: "CN", currency: "CNY" },
  "62": { brand: "UnionPay", type: "Credit/Debit", level: "Standard", bank: "Various Banks", country: "China", countryCode: "CN", currency: "CNY" },
  // Maestro
  "5018": { brand: "Maestro", type: "Debit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "5020": { brand: "Maestro", type: "Debit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "5038": { brand: "Maestro", type: "Debit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "6304": { brand: "Maestro", type: "Debit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  "6759": { brand: "Maestro", type: "Debit", level: "Standard", bank: "Various Banks", country: "United Kingdom", countryCode: "GB", currency: "GBP" },
  "6761": { brand: "Maestro", type: "Debit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  // Rupay
  "6521": { brand: "RuPay", type: "Debit", level: "Classic", bank: "Various Banks", country: "India", countryCode: "IN", currency: "INR" },
  "6522": { brand: "RuPay", type: "Credit", level: "Platinum", bank: "Various Banks", country: "India", countryCode: "IN", currency: "INR" },
  // Mir
  "2200": { brand: "Mir", type: "Debit", level: "Standard", bank: "Sberbank", country: "Russia", countryCode: "RU", currency: "RUB" },
  "2204": { brand: "Mir", type: "Credit", level: "Premium", bank: "Various Banks", country: "Russia", countryCode: "RU", currency: "RUB" },
  "22": { brand: "MasterCard", type: "Credit", level: "Standard", bank: "Various Banks", country: "Worldwide", countryCode: "WW" },
  // Verve
  "5060": { brand: "Verve", type: "Debit", level: "Standard", bank: "Various Banks", country: "Nigeria", countryCode: "NG", currency: "NGN" },
  "6500": { brand: "Verve", type: "Debit", level: "Standard", bank: "Various Banks", country: "Nigeria", countryCode: "NG", currency: "NGN" },
};

function lookupBin(bin: string): BinInfo | null {
  const clean = bin.replace(/\D/g, "");
  for (let len = 4; len >= 1; len--) {
    const prefix = clean.substring(0, len);
    if (binDatabase[prefix]) return binDatabase[prefix];
  }
  return null;
}

const brandColors: Record<string, string> = {
  "Visa": "from-blue-600 to-blue-800",
  "MasterCard": "from-red-500 to-orange-500",
  "American Express": "from-blue-400 to-cyan-500",
  "Discover": "from-orange-400 to-orange-600",
  "JCB": "from-green-500 to-teal-500",
  "Diners Club": "from-gray-500 to-gray-700",
  "UnionPay": "from-red-600 to-red-800",
  "Maestro": "from-blue-500 to-red-500",
  "RuPay": "from-green-600 to-blue-600",
  "Mir": "from-green-400 to-blue-500",
  "Verve": "from-purple-500 to-blue-500",
};

export default function BinChecker() {
  const [bin, setBin] = useState("");
  const [result, setResult] = useState<BinInfo | null>(null);
  const [searched, setSearched] = useState(false);

  const check = () => {
    const clean = bin.replace(/\D/g, "");
    if (clean.length < 6) return;
    setResult(lookupBin(clean));
    setSearched(true);
  };

  const binClean = bin.replace(/\D/g, "").substring(0, 8);
  const gradient = result ? (brandColors[result.brand] || "from-primary to-primary/80") : "";

  return (
    <ToolLayout title="BIN Checker" description="Look up Bank Identification Number (BIN) details — supports 70+ prefixes">
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
          <div className="rounded-2xl border border-border/50 overflow-hidden shadow-lg">
            <div className={`p-5 bg-gradient-to-r ${gradient} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-80 uppercase tracking-wider">Card Network</p>
                  <h3 className="text-2xl font-bold">{result.brand}</h3>
                </div>
                <CreditCard className="w-10 h-10 opacity-60" />
              </div>
              <p className="font-mono mt-2 text-lg tracking-widest opacity-90">{binClean.padEnd(8, "•")} •••• ••••</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border/30">
              {[
                { icon: <CreditCard className="w-3.5 h-3.5" />, label: "Card Type", value: result.type },
                { icon: <Shield className="w-3.5 h-3.5" />, label: "Card Level", value: result.level },
                { icon: <Building className="w-3.5 h-3.5" />, label: "Issuing Bank", value: result.bank },
                { icon: <Globe className="w-3.5 h-3.5" />, label: "Country", value: `${result.country}${result.countryCode !== "WW" ? ` (${result.countryCode})` : ""}` },
                ...(result.currency ? [{ icon: <span className="text-xs">💰</span>, label: "Currency", value: result.currency }] : []),
                { icon: <span className="text-xs font-mono">#</span>, label: "BIN", value: binClean.substring(0, 6) },
              ].map(f => (
                <div key={f.label} className="p-3 bg-card flex items-start gap-2">
                  <span className="mt-0.5 text-muted-foreground">{f.icon}</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">{f.label}</p>
                    <p className="font-semibold text-sm mt-0.5">{f.value}</p>
                  </div>
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

        <div className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
          <p className="text-xs text-muted-foreground">
            <strong>What is a BIN?</strong> The Bank Identification Number (BIN) is the first 6-8 digits of a payment card number. It identifies the card brand, issuing bank, card type, and country of origin.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Supported Networks:</strong> Visa, MasterCard, American Express, Discover, JCB, Diners Club, UnionPay, Maestro, RuPay, Mir, Verve
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
