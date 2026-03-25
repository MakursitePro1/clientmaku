import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

export default function MortgageCalculator() {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return { monthly: principal / n, total: principal, interest: 0 };
    const monthly = principal * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    return { monthly, total: monthly * n, interest: monthly * n - principal };
  }, [principal, rate, years]);

  return (
    <ToolLayout title="Mortgage Calculator" description="Calculate monthly mortgage payments">
      <div className="space-y-6 max-w-md mx-auto">
        {[
          { label: "Loan Amount ($)", value: principal, set: setPrincipal },
          { label: "Interest Rate (%)", value: rate, set: setRate },
          { label: "Loan Term (Years)", value: years, set: setYears },
        ].map(f => (
          <div key={f.label}>
            <label className="text-sm font-semibold mb-1 block">{f.label}</label>
            <Input type="number" value={f.value} onChange={e => f.set(Number(e.target.value))} className="rounded-xl" />
          </div>
        ))}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Monthly Payment", value: `$${result.monthly.toFixed(2)}` },
            { label: "Total Payment", value: `$${result.total.toFixed(2)}` },
            { label: "Total Interest", value: `$${result.interest.toFixed(2)}` },
          ].map(s => (
            <div key={s.label} className="bg-accent/50 rounded-xl p-4 text-center">
              <div className="text-lg font-extrabold gradient-text">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
