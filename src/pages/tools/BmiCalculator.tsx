import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Calculator, Activity, Heart, Ruler, Weight, Target } from "lucide-react";

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500", advice: "You may need to gain some weight. Consult a healthcare provider." };
  if (bmi < 25) return { label: "Normal Weight", color: "text-green-500", bg: "bg-green-500", advice: "Your weight is in the healthy range. Maintain a balanced diet." };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-500", bg: "bg-yellow-500", advice: "Consider lifestyle changes like more exercise and balanced diet." };
  return { label: "Obese", color: "text-red-500", bg: "bg-red-500", advice: "Consult a healthcare professional for personalized guidance." };
}

export default function BmiCalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState<"male" | "female">("male");

  const bmi = (() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return 0;
    if (unit === "metric") return w / ((h / 100) ** 2);
    return (w * 703) / (h ** 2); // imperial: lbs / inches²
  })();

  const cat = bmi > 0 ? getBmiCategory(bmi) : null;
  const idealMin = unit === "metric" ? (18.5 * ((parseFloat(height) / 100) ** 2)).toFixed(1) : "—";
  const idealMax = unit === "metric" ? (24.9 * ((parseFloat(height) / 100) ** 2)).toFixed(1) : "—";

  // BMR calculation
  const bmr = (() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (!w || !h || !a) return 0;
    if (gender === "male") return 10 * w + 6.25 * h - 5 * a + 5;
    return 10 * w + 6.25 * h - 5 * a - 161;
  })();

  const pct = Math.min(bmi / 40, 1);

  return (
    <ToolLayout title="BMI Calculator" description="Calculate your Body Mass Index, ideal weight range, and daily calorie needs">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Input */}
        <div className="tool-section-card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Your Details</h3>
          </div>
          <div className="flex gap-2 mb-2">
            {(["metric", "imperial"] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${unit === u ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                {u === "metric" ? "🌍 Metric (kg/cm)" : "🇺🇸 Imperial (lbs/in)"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}</label>
              <Input value={weight} onChange={e => setWeight(e.target.value)} type="number" className="tool-input-colorful rounded-xl font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{unit === "metric" ? "Height (cm)" : "Height (inches)"}</label>
              <Input value={height} onChange={e => setHeight(e.target.value)} type="number" className="tool-input-colorful rounded-xl font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Age</label>
              <Input value={age} onChange={e => setAge(e.target.value)} type="number" className="tool-input-colorful rounded-xl font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Gender</label>
              <div className="flex gap-2">
                {(["male", "female"] as const).map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${gender === g ? "bg-primary text-primary-foreground" : "bg-primary/10 hover:bg-primary/20"}`}>
                    {g === "male" ? "♂ Male" : "♀ Female"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BMI Result */}
        {bmi > 0 && cat && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="tool-result-card text-center space-y-4">
            <p className="text-xs text-muted-foreground font-semibold">Your BMI</p>
            <p className={`text-5xl font-black ${cat.color}`}>{bmi.toFixed(1)}</p>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white ${cat.bg}`}>{cat.label}</span>
            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 relative overflow-hidden">
              <motion.div initial={{ left: 0 }} animate={{ left: `${pct * 100}%` }}
                className="absolute top-0 w-4 h-full rounded-full bg-white border-2 border-foreground shadow-lg" style={{ transform: "translateX(-50%)" }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
          </motion.div>
        )}

        {/* Detail Stats */}
        {bmi > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="tool-stat-card">
              <Target className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <div className="stat-value text-sm">{idealMin}–{idealMax}</div>
              <div className="stat-label">Ideal (kg)</div>
            </div>
            <div className="tool-stat-card">
              <Activity className="w-5 h-5 mx-auto text-orange-500 mb-1" />
              <div className="stat-value text-lg">{bmr.toFixed(0)}</div>
              <div className="stat-label">BMR (cal)</div>
            </div>
            <div className="tool-stat-card">
              <Heart className="w-5 h-5 mx-auto text-red-500 mb-1" />
              <div className="stat-value text-lg">{(bmr * 1.55).toFixed(0)}</div>
              <div className="stat-label">Active Cal</div>
            </div>
            <div className="tool-stat-card">
              <Weight className="w-5 h-5 mx-auto text-primary mb-1" />
              <div className="stat-value text-lg">{bmi.toFixed(1)}</div>
              <div className="stat-label">BMI</div>
            </div>
          </div>
        )}

        {/* Advice */}
        {cat && (
          <div className="tool-section-card p-4">
            <h3 className="text-sm font-bold gradient-text mb-2">💡 Health Advice</h3>
            <p className="text-sm text-muted-foreground">{cat.advice}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center tool-badge mx-auto">
          ⚠️ BMI is a general indicator. Consult healthcare professionals for medical advice.
        </p>
      </div>
    </ToolLayout>
  );
}
