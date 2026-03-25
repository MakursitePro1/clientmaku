import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

export default function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [time, setTime] = useState(5);
  const [compound, setCompound] = useState(12);

  const amount = principal * Math.pow(1 + rate / (100 * compound), compound * time);
  const interest = amount - principal;
  const simpleInterest = principal * rate * time / 100;

  return (
    <ToolLayout title="Compound Interest Calculator" description="Calculate compound vs simple interest with detailed breakdown">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-muted-foreground">Principal (৳)</label><Input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Rate (%/year)</label><Input type="number" value={rate} onChange={e => setRate(+e.target.value)} className="rounded-xl" step="0.1" /></div>
          <div><label className="text-sm text-muted-foreground">Time (years)</label><Input type="number" value={time} onChange={e => setTime(+e.target.value)} className="rounded-xl" /></div>
          <div>
            <label className="text-sm text-muted-foreground">Compound</label>
            <select value={compound} onChange={e => setCompound(+e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              <option value={1}>Yearly</option>
              <option value={2}>Semi-Annual</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-center">
            <p className="text-xs text-muted-foreground">Compound Amount</p>
            <p className="text-xl font-bold text-primary">৳{amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-muted-foreground mt-1">Interest: ৳{interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-4 bg-accent/30 rounded-xl border border-border text-center">
            <p className="text-xs text-muted-foreground">Simple Interest</p>
            <p className="text-xl font-bold">৳{(principal + simpleInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-muted-foreground mt-1">Interest: ৳{simpleInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
        <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-center text-sm">
          <span className="text-green-700 font-bold">Extra earned: ৳{(interest - simpleInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> with compound interest
        </div>
      </div>
    </ToolLayout>
  );
}
