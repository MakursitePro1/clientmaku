import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

export default function ProfitMarginCalc() {
  const [cost, setCost] = useState(500);
  const [selling, setSelling] = useState(800);

  const profit = selling - cost;
  const margin = selling > 0 ? (profit / selling) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return (
    <ToolLayout title="Profit Margin Calculator" description="Calculate profit margin and markup percentage">
      <div className="space-y-4 max-w-sm mx-auto">
        <div><label className="text-sm text-muted-foreground">Cost Price (৳)</label><Input type="number" value={cost} onChange={e => setCost(+e.target.value)} className="rounded-xl" /></div>
        <div><label className="text-sm text-muted-foreground">Selling Price (৳)</label><Input type="number" value={selling} onChange={e => setSelling(+e.target.value)} className="rounded-xl" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border text-center ${profit >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-destructive/10 border-destructive/20"}`}>
            <p className="text-xs text-muted-foreground">Profit</p>
            <p className={`text-lg font-bold ${profit >= 0 ? "text-green-700" : "text-destructive"}`}>৳{profit.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-accent/30 rounded-xl border border-border text-center">
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="text-lg font-bold">{margin.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-accent/30 rounded-xl border border-border text-center">
            <p className="text-xs text-muted-foreground">Markup</p>
            <p className="text-lg font-bold">{markup.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
