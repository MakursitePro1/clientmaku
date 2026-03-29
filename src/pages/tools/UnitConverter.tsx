import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRightLeft, Ruler, Thermometer, Weight, Clock, Zap, Droplets } from "lucide-react";

const unitCategories = {
  length: {
    icon: Ruler, label: "Length",
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  },
  weight: {
    icon: Weight, label: "Weight",
    units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
  },
  temperature: {
    icon: Thermometer, label: "Temperature",
    units: { "°C": 1, "°F": 1, "K": 1 },
  },
  time: {
    icon: Clock, label: "Time",
    units: { sec: 1, min: 60, hr: 3600, day: 86400, week: 604800, month: 2592000, year: 31536000 },
  },
  speed: {
    icon: Zap, label: "Speed",
    units: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, knot: 0.514444 },
  },
  volume: {
    icon: Droplets, label: "Volume",
    units: { L: 1, mL: 0.001, gal: 3.78541, qt: 0.946353, cup: 0.236588, "fl oz": 0.0295735 },
  },
};

type Cat = keyof typeof unitCategories;

function convertTemp(val: number, from: string, to: string): number {
  let celsius: number;
  if (from === "°C") celsius = val;
  else if (from === "°F") celsius = (val - 32) * 5 / 9;
  else celsius = val - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Cat>("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");

  const cat = unitCategories[category];
  const units = Object.keys(cat.units);

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "—";
    if (category === "temperature") return convertTemp(num, fromUnit, toUnit).toFixed(4);
    const fromFactor = (cat.units as any)[fromUnit] || 1;
    const toFactor = (cat.units as any)[toUnit] || 1;
    return (num * fromFactor / toFactor).toFixed(6).replace(/\.?0+$/, "");
  }, [value, fromUnit, toUnit, category, cat.units]);

  // All conversions
  const allResults = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return [];
    return units.filter(u => u !== fromUnit).map(u => {
      let val: string;
      if (category === "temperature") val = convertTemp(num, fromUnit, u).toFixed(4);
      else {
        const fromF = (cat.units as any)[fromUnit] || 1;
        const toF = (cat.units as any)[u] || 1;
        val = (num * fromF / toF).toFixed(6).replace(/\.?0+$/, "");
      }
      return { unit: u, value: val };
    });
  }, [value, fromUnit, category, units, cat.units]);

  return (
    <ToolLayout title="Unit Converter" description="Convert between units of length, weight, temperature, time, speed & volume">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Category */}
        <div className="tool-section-card p-4">
          <h3 className="text-sm font-bold gradient-text mb-3">Select Category</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(unitCategories) as Cat[]).map(c => {
              const Icon = unitCategories[c].icon;
              return (
                <button key={c} onClick={() => { setCategory(c); setFromUnit(Object.keys(unitCategories[c].units)[0]); setToUnit(Object.keys(unitCategories[c].units)[1]); }}
                  className={`p-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${category === c ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                  <Icon className="w-4 h-4" />
                  {unitCategories[c].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversion */}
        <div className="tool-section-card p-4 space-y-4">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">From</label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="tool-input-colorful rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={value} onChange={e => setValue(e.target.value)} type="number" className="tool-input-colorful rounded-xl font-mono font-bold text-lg" />
            </div>
            <motion.button whileTap={{ rotate: 180 }} onClick={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); }}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors mb-1">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
            </motion.button>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">To</label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="tool-input-colorful rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
              <div className="tool-input-colorful rounded-xl p-2.5 font-mono font-bold text-lg text-primary bg-primary/5 border border-primary/20 text-center">{result}</div>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="tool-result-card text-center">
          <p className="text-xs text-muted-foreground font-semibold">Result</p>
          <p className="text-3xl font-black gradient-text">{value || "0"} {fromUnit} = {result} {toUnit}</p>
        </motion.div>

        {/* All conversions */}
        <div className="tool-section-card p-4">
          <h3 className="text-sm font-bold gradient-text mb-3">📊 All Conversions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allResults.map(r => (
              <div key={r.unit} className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="font-bold text-sm">{r.value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{r.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
