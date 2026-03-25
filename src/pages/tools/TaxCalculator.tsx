import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

export default function TaxCalculator() {
  const [income, setIncome] = useState(600000);
  const [country, setCountry] = useState("bd");

  const calcTax = () => {
    if (country === "bd") {
      // Bangladesh tax slabs (simplified)
      let tax = 0;
      const slabs = [
        { limit: 350000, rate: 0 },
        { limit: 100000, rate: 5 },
        { limit: 300000, rate: 10 },
        { limit: 400000, rate: 15 },
        { limit: 500000, rate: 20 },
        { limit: Infinity, rate: 25 },
      ];
      let remaining = income;
      for (const slab of slabs) {
        const taxable = Math.min(remaining, slab.limit);
        tax += taxable * slab.rate / 100;
        remaining -= taxable;
        if (remaining <= 0) break;
      }
      return tax;
    } else {
      // Generic flat 15%
      return income * 0.15;
    }
  };

  const tax = calcTax();
  const net = income - tax;
  const effectiveRate = income > 0 ? (tax / income) * 100 : 0;

  return (
    <ToolLayout title="Income Tax Calculator" description="Calculate income tax based on tax slabs">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-muted-foreground">Annual Income (৳)</label><Input type="number" value={income} onChange={e => setIncome(+e.target.value)} className="rounded-xl" /></div>
          <div>
            <label className="text-sm text-muted-foreground">Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              <option value="bd">Bangladesh</option>
              <option value="other">Other (15% flat)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-accent/30 rounded-xl border border-border text-center">
            <p className="text-xs text-muted-foreground">Gross Income</p>
            <p className="text-lg font-bold">৳{income.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-center">
            <p className="text-xs text-muted-foreground">Tax Amount</p>
            <p className="text-lg font-bold text-destructive">৳{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-center">
            <p className="text-xs text-muted-foreground">Net Income</p>
            <p className="text-lg font-bold text-green-700">৳{net.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">Effective Tax Rate: <span className="font-bold">{effectiveRate.toFixed(1)}%</span></div>
        <p className="text-center text-sm text-muted-foreground">Monthly take-home: <span className="font-bold text-foreground">৳{(net / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></p>
      </div>
    </ToolLayout>
  );
}
