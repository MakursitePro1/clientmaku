import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InvestmentCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(5000);

  const r = rate / 100;
  const futureP = principal * Math.pow(1 + r, years);
  const futureM = monthly * ((Math.pow(1 + r/12, years*12) - 1) / (r/12));
  const total = futureP + futureM;
  const invested = principal + monthly * 12 * years;
  const earnings = total - invested;

  return (
    <ToolLayout title="Investment Calculator" description="Calculate compound interest and investment growth">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-muted-foreground">Initial Investment</label><Input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Annual Rate (%)</label><Input type="number" value={rate} onChange={e => setRate(+e.target.value)} className="rounded-xl" step="0.1" /></div>
          <div><label className="text-sm text-muted-foreground">Years</label><Input type="number" value={years} onChange={e => setYears(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Monthly Contribution</label><Input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Total Value", val: total, cls: "text-primary" }, { label: "Total Invested", val: invested, cls: "text-muted-foreground" }, { label: "Total Earnings", val: earnings, cls: "text-green-600" }].map(i => (
            <div key={i.label} className="p-4 bg-accent/30 rounded-xl border border-border text-center">
              <p className="text-xs text-muted-foreground">{i.label}</p>
              <p className={`text-lg font-bold ${i.cls}`}>৳{i.val.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          ))}
        </div>
        <div className="h-4 rounded-full overflow-hidden bg-accent/30 flex">
          <div className="bg-primary/60 h-full" style={{ width: `${(invested/total)*100}%` }} title="Invested" />
          <div className="bg-green-500 h-full" style={{ width: `${(earnings/total)*100}%` }} title="Earnings" />
        </div>
        <div className="flex justify-center gap-4 text-xs"><span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/60 inline-block" /> Invested</span><span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Earnings</span></div>
      </div>
    </ToolLayout>
  );
}
