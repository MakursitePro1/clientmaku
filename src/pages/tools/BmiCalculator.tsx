import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BmiCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || h <= 0) return;

    let bmi: number;
    if (unit === "metric") {
      bmi = w / ((h / 100) ** 2);
    } else {
      bmi = (w / (h ** 2)) * 703;
    }

    let category: string, color: string;
    if (bmi < 18.5) { category = "Underweight"; color = "hsl(199, 89%, 48%)"; }
    else if (bmi < 25) { category = "Normal weight"; color = "hsl(142, 71%, 45%)"; }
    else if (bmi < 30) { category = "Overweight"; color = "hsl(25, 95%, 53%)"; }
    else { category = "Obese"; color = "hsl(0, 84%, 60%)"; }

    setResult({ bmi: Math.round(bmi * 10) / 10, category, color });
  };

  return (
    <ToolLayout title="BMI Calculator" description="Calculate your Body Mass Index">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button key={u} onClick={() => { setUnit(u); setResult(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${unit === u ? "gradient-bg text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground"}`}>
              {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/in)"}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "70" : "154"} className="rounded-xl bg-card border-border/50" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Height ({unit === "metric" ? "cm" : "inches"})</label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={unit === "metric" ? "175" : "69"} className="rounded-xl bg-card border-border/50" />
          </div>
          <Button onClick={calculate} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Calculate BMI</Button>
        </div>
        {result && (
          <div className="bg-card rounded-2xl border border-border/50 p-6 text-center space-y-3">
            <div className="text-5xl font-extrabold" style={{ color: result.color }}>{result.bmi}</div>
            <div className="text-lg font-bold" style={{ color: result.color }}>{result.category}</div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((result.bmi / 40) * 100, 100)}%`, backgroundColor: result.color }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Underweight<br/>&lt;18.5</span><span>Normal<br/>18.5-24.9</span><span>Overweight<br/>25-29.9</span><span>Obese<br/>30+</span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default BmiCalculator;
