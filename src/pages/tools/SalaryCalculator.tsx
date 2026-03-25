import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SalaryCalculator() {
  const [amount, setAmount] = useState(50000);
  const [period, setPeriod] = useState("yearly");

  const results = useMemo(() => {
    let yearly = amount;
    if (period === "monthly") yearly = amount * 12;
    if (period === "weekly") yearly = amount * 52;
    if (period === "hourly") yearly = amount * 2080;
    return {
      yearly, monthly: yearly / 12, weekly: yearly / 52, daily: yearly / 260, hourly: yearly / 2080
    };
  }, [amount, period]);

  const items = [
    { label: "Yearly", value: results.yearly },
    { label: "Monthly", value: results.monthly },
    { label: "Weekly", value: results.weekly },
    { label: "Daily", value: results.daily },
    { label: "Hourly", value: results.hourly },
  ];

  return (
    <ToolLayout title="Salary Calculator" description="Convert salary between different time periods">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex gap-3">
          <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="rounded-xl flex-1" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["yearly","monthly","weekly","hourly"].map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.label} className="flex justify-between bg-accent/50 rounded-xl px-5 py-3">
              <span className="font-semibold text-sm">{i.label}</span>
              <span className="font-mono font-bold gradient-text">${i.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
