import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SavingsGoalCalculator() {
  const [goal, setGoal] = useState(500000);
  const [current, setCurrent] = useState(50000);
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(6);

  const remaining = goal - current;
  const monthlyRate = rate / 100 / 12;
  let months = 0;
  let balance = current;
  while (balance < goal && months < 600) {
    balance = balance * (1 + monthlyRate) + monthly;
    months++;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  return (
    <ToolLayout title="Savings Goal Calculator" description="Plan how long to reach your savings goal">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-muted-foreground">Savings Goal (৳)</label><Input type="number" value={goal} onChange={e => setGoal(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Current Savings (৳)</label><Input type="number" value={current} onChange={e => setCurrent(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Monthly Deposit (৳)</label><Input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Annual Rate (%)</label><Input type="number" value={rate} onChange={e => setRate(+e.target.value)} className="rounded-xl" step="0.1" /></div>
        </div>
        <div className="h-4 rounded-full bg-accent/30 overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (current / goal) * 100)}%` }} />
        </div>
        <p className="text-center text-sm text-muted-foreground">৳{current.toLocaleString()} of ৳{goal.toLocaleString()} ({((current / goal) * 100).toFixed(1)}%)</p>
        <div className="p-5 bg-primary/10 rounded-xl border border-primary/20 text-center">
          <p className="text-sm text-muted-foreground mb-1">Time to reach goal</p>
          <p className="text-3xl font-bold text-primary">{years > 0 ? `${years} year${years > 1 ? "s" : ""} ` : ""}{remMonths} month{remMonths !== 1 ? "s" : ""}</p>
          <p className="text-sm text-muted-foreground mt-2">Remaining: ৳{remaining.toLocaleString()}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
