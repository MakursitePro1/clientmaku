import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ElectricityCalculator = () => {
  const [watts, setWatts] = useState("");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("8");
  const [result, setResult] = useState<{ daily: number; monthly: number; yearly: number; dailyCost: number; monthlyCost: number; yearlyCost: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(watts), h = parseFloat(hours), r = parseFloat(rate);
    if (isNaN(w) || isNaN(h) || isNaN(r)) return;
    const dailyKwh = (w * h) / 1000;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;
    setResult({
      daily: dailyKwh, monthly: monthlyKwh, yearly: yearlyKwh,
      dailyCost: dailyKwh * r, monthlyCost: monthlyKwh * r, yearlyCost: yearlyKwh * r,
    });
  };

  return (
    <ToolLayout title="Electricity Bill Calculator" description="Calculate electricity consumption and estimated costs">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="text-sm font-semibold mb-1 block">Power (Watts)</label>
            <Input type="number" value={watts} onChange={e => setWatts(e.target.value)} placeholder="e.g. 100" className="rounded-xl bg-card border-border/50" /></div>
          <div><label className="text-sm font-semibold mb-1 block">Hours/Day</label>
            <Input type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 8" className="rounded-xl bg-card border-border/50" /></div>
          <div><label className="text-sm font-semibold mb-1 block">Rate (৳/kWh)</label>
            <Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="rounded-xl bg-card border-border/50" /></div>
        </div>
        <Button onClick={calculate} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Calculate</Button>

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Daily", kwh: result.daily, cost: result.dailyCost },
              { label: "Monthly", kwh: result.monthly, cost: result.monthlyCost },
              { label: "Yearly", kwh: result.yearly, cost: result.yearlyCost },
            ].map(r => (
              <div key={r.label} className="bg-card rounded-2xl border border-border/50 p-5 text-center">
                <div className="text-sm text-muted-foreground mb-2">{r.label}</div>
                <div className="text-2xl font-extrabold gradient-text">৳{r.cost.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.kwh.toFixed(2)} kWh</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <h3 className="font-bold text-sm mb-3">Common Appliance Wattages</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { name: "LED Bulb", w: "10W" }, { name: "Fan", w: "75W" },
              { name: "AC (1 ton)", w: "1000W" }, { name: "Fridge", w: "150W" },
              { name: "TV (LED)", w: "80W" }, { name: "Laptop", w: "65W" },
              { name: "Iron", w: "1000W" }, { name: "Washing Machine", w: "500W" },
            ].map(a => (
              <button key={a.name} onClick={() => setWatts(a.w.replace("W", ""))}
                className="flex justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors text-left">
                <span className="text-muted-foreground">{a.name}</span>
                <span className="font-semibold text-primary">{a.w}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ElectricityCalculator;
