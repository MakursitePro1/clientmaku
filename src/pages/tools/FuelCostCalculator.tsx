import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState(100);
  const [mileage, setMileage] = useState(15);
  const [price, setPrice] = useState(110);

  const fuel = distance / mileage;
  const cost = fuel * price;

  return (
    <ToolLayout title="Fuel Cost Calculator" description="Calculate fuel cost for your trip">
      <div className="space-y-4 max-w-sm mx-auto">
        <div><label className="text-sm text-muted-foreground">Distance (km)</label><Input type="number" value={distance} onChange={e => setDistance(+e.target.value)} className="rounded-xl" /></div>
        <div><label className="text-sm text-muted-foreground">Mileage (km/L)</label><Input type="number" value={mileage} onChange={e => setMileage(+e.target.value)} className="rounded-xl" step="0.1" /></div>
        <div><label className="text-sm text-muted-foreground">Fuel Price (৳/L)</label><Input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="rounded-xl" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-accent/30 rounded-xl border border-border text-center">
            <p className="text-xs text-muted-foreground">Fuel Needed</p>
            <p className="text-xl font-bold">{fuel.toFixed(1)} L</p>
          </div>
          <div className="p-4 bg-accent/30 rounded-xl border border-border text-center">
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="text-xl font-bold text-primary">৳{cost.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
