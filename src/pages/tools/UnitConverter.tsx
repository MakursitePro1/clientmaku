import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeftRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UnitType = "length" | "weight" | "temperature" | "speed" | "data" | "time";

const unitData: Record<UnitType, { label: string; units: { id: string; label: string; factor?: number; convert?: (v: number, to: boolean) => number }[] }> = {
  length: {
    label: "Length",
    units: [
      { id: "m", label: "Meter", factor: 1 },
      { id: "km", label: "Kilometer", factor: 1000 },
      { id: "cm", label: "Centimeter", factor: 0.01 },
      { id: "mm", label: "Millimeter", factor: 0.001 },
      { id: "mi", label: "Mile", factor: 1609.344 },
      { id: "yd", label: "Yard", factor: 0.9144 },
      { id: "ft", label: "Foot", factor: 0.3048 },
      { id: "in", label: "Inch", factor: 0.0254 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { id: "kg", label: "Kilogram", factor: 1 },
      { id: "g", label: "Gram", factor: 0.001 },
      { id: "mg", label: "Milligram", factor: 0.000001 },
      { id: "lb", label: "Pound", factor: 0.453592 },
      { id: "oz", label: "Ounce", factor: 0.0283495 },
      { id: "ton", label: "Metric Ton", factor: 1000 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { id: "c", label: "Celsius", convert: (v, to) => to ? v : v },
      { id: "f", label: "Fahrenheit", convert: (v, to) => to ? (v * 9/5) + 32 : (v - 32) * 5/9 },
      { id: "k", label: "Kelvin", convert: (v, to) => to ? v + 273.15 : v - 273.15 },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { id: "ms", label: "m/s", factor: 1 },
      { id: "kmh", label: "km/h", factor: 1/3.6 },
      { id: "mph", label: "mph", factor: 0.44704 },
      { id: "kn", label: "Knots", factor: 0.514444 },
    ],
  },
  data: {
    label: "Data",
    units: [
      { id: "b", label: "Bytes", factor: 1 },
      { id: "kb", label: "Kilobytes", factor: 1024 },
      { id: "mb", label: "Megabytes", factor: 1024**2 },
      { id: "gb", label: "Gigabytes", factor: 1024**3 },
      { id: "tb", label: "Terabytes", factor: 1024**4 },
    ],
  },
  time: {
    label: "Time",
    units: [
      { id: "s", label: "Seconds", factor: 1 },
      { id: "min", label: "Minutes", factor: 60 },
      { id: "h", label: "Hours", factor: 3600 },
      { id: "d", label: "Days", factor: 86400 },
      { id: "w", label: "Weeks", factor: 604800 },
      { id: "y", label: "Years", factor: 31536000 },
    ],
  },
};

const UnitConverter = () => {
  const [unitType, setUnitType] = useState<UnitType>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");

  const convert = useCallback((value: string, from: string, to: string, type: UnitType) => {
    const num = parseFloat(value);
    if (isNaN(num)) { setToValue(""); return; }

    const units = unitData[type].units;
    const fromU = units.find(u => u.id === from);
    const toU = units.find(u => u.id === to);
    if (!fromU || !toU) return;

    let result: number;
    if (type === "temperature") {
      const toCelsius = fromU.convert ? fromU.convert(num, false) : num;
      result = toU.convert ? toU.convert(toCelsius, true) : toCelsius;
    } else {
      const base = num * (fromU.factor || 1);
      result = base / (toU.factor || 1);
    }
    setToValue(result % 1 === 0 ? result.toString() : result.toPrecision(10).replace(/\.?0+$/, ""));
  }, []);

  const handleFromChange = (val: string) => {
    setFromValue(val);
    convert(val, fromUnit, toUnit, unitType);
  };

  const handleTypeChange = (type: UnitType) => {
    setUnitType(type);
    const units = unitData[type].units;
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id || units[0].id);
    setFromValue("1");
    convert("1", units[0].id, units[1]?.id || units[0].id, type);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    convert(toValue, toUnit, fromUnit, unitType);
  };

  // Init
  useState(() => { convert("1", "m", "km", "length"); });

  const copyResult = () => {
    navigator.clipboard.writeText(toValue);
    toast({ title: "Copied!", description: "Result copied to clipboard" });
  };

  return (
    <ToolLayout title="Unit Converter" description="Convert between different units of measurement">
      <div className="space-y-6">
        {/* Type selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(unitData) as UnitType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                unitType === type
                  ? "gradient-bg text-primary-foreground shadow-lg"
                  : "bg-card text-muted-foreground border border-border/50 hover:border-primary/30"
              )}
            >
              {unitData[type].label}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div className="space-y-3">
            <label className="text-sm font-semibold">From</label>
            <select
              value={fromUnit}
              onChange={(e) => { setFromUnit(e.target.value); convert(fromValue, e.target.value, toUnit, unitType); }}
              className="w-full rounded-xl bg-card border border-border/50 px-4 py-2.5 text-sm"
            >
              {unitData[unitType].units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <Input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              className="rounded-xl bg-card border-border/50 text-lg font-bold"
            />
          </div>

          <Button variant="outline" size="icon" onClick={swap} className="rounded-full w-10 h-10 mx-auto mb-2">
            <ArrowLeftRight className="w-4 h-4" />
          </Button>

          <div className="space-y-3">
            <label className="text-sm font-semibold">To</label>
            <select
              value={toUnit}
              onChange={(e) => { setToUnit(e.target.value); convert(fromValue, fromUnit, e.target.value, unitType); }}
              className="w-full rounded-xl bg-card border border-border/50 px-4 py-2.5 text-sm"
            >
              {unitData[unitType].units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <div className="relative">
              <Input
                value={toValue}
                readOnly
                className="rounded-xl bg-card border-border/50 text-lg font-bold pr-12"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={copyResult}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {toValue && (
          <div className="text-center p-4 bg-accent/30 rounded-xl border border-primary/10">
            <span className="text-lg font-bold">{fromValue} {unitData[unitType].units.find(u => u.id === fromUnit)?.label}</span>
            <span className="text-muted-foreground mx-2">=</span>
            <span className="text-lg font-bold gradient-text">{toValue} {unitData[unitType].units.find(u => u.id === toUnit)?.label}</span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default UnitConverter;
