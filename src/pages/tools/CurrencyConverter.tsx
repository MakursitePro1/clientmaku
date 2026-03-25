import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy, ArrowLeftRight } from "lucide-react";

const currencies: { code: string; name: string; rate: number }[] = [
  { code: "USD", name: "US Dollar", rate: 1 },
  { code: "EUR", name: "Euro", rate: 0.92 },
  { code: "GBP", name: "British Pound", rate: 0.79 },
  { code: "BDT", name: "Bangladeshi Taka", rate: 110.5 },
  { code: "INR", name: "Indian Rupee", rate: 83.12 },
  { code: "PKR", name: "Pakistani Rupee", rate: 278.5 },
  { code: "JPY", name: "Japanese Yen", rate: 149.8 },
  { code: "CNY", name: "Chinese Yuan", rate: 7.24 },
  { code: "AED", name: "UAE Dirham", rate: 3.67 },
  { code: "SAR", name: "Saudi Riyal", rate: 3.75 },
  { code: "MYR", name: "Malaysian Ringgit", rate: 4.47 },
  { code: "SGD", name: "Singapore Dollar", rate: 1.34 },
  { code: "AUD", name: "Australian Dollar", rate: 1.53 },
  { code: "CAD", name: "Canadian Dollar", rate: 1.36 },
  { code: "CHF", name: "Swiss Franc", rate: 0.88 },
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("BDT");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    if (isNaN(a)) return "";
    const fromRate = currencies.find(c => c.code === from)!.rate;
    const toRate = currencies.find(c => c.code === to)!.rate;
    return ((a / fromRate) * toRate).toFixed(4);
  }, [amount, from, to]);

  const swap = () => { setFrom(to); setTo(from); };
  const copy = () => { navigator.clipboard.writeText(result); toast({ title: "Copied!" }); };

  return (
    <ToolLayout title="Currency Converter" description="Convert between world currencies with offline rates">
      <div className="max-w-lg mx-auto space-y-6">
        <p className="text-xs text-muted-foreground text-center bg-accent/30 rounded-lg p-2">⚠️ Rates are approximate and for reference only. Not real-time.</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Amount</label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="rounded-xl bg-card border-border/50 text-lg font-bold" />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
            <div>
              <label className="text-sm font-semibold mb-1 block">From</label>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="w-full rounded-xl bg-card border border-border/50 px-3 py-2.5 text-sm">
                {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
              </select>
            </div>
            <Button variant="outline" size="icon" onClick={swap} className="rounded-full mb-0.5"><ArrowLeftRight className="w-4 h-4" /></Button>
            <div>
              <label className="text-sm font-semibold mb-1 block">To</label>
              <select value={to} onChange={e => setTo(e.target.value)}
                className="w-full rounded-xl bg-card border border-border/50 px-3 py-2.5 text-sm">
                {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-card rounded-2xl border border-border/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">{amount} {from} =</p>
            <p className="text-4xl font-extrabold gradient-text mt-2">{result} {to}</p>
            <Button variant="ghost" size="sm" onClick={copy} className="mt-3 gap-1.5"><Copy className="w-3.5 h-3.5" /> Copy</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default CurrencyConverter;
