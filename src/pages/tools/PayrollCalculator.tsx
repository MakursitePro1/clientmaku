import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PayrollCalculator() {
  const [gross, setGross] = useState(50000);
  const [taxRate, setTaxRate] = useState(10);
  const [insurance, setInsurance] = useState(2000);
  const [provident, setProvident] = useState(5);
  const [bonus, setBonus] = useState(0);

  const providentAmt = gross * provident / 100;
  const taxAmt = gross * taxRate / 100;
  const deductions = taxAmt + insurance + providentAmt;
  const net = gross + bonus - deductions;

  return (
    <ToolLayout title="Payroll Calculator" description="Calculate net salary with tax and deductions">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-muted-foreground">Gross Salary</label><Input type="number" value={gross} onChange={e => setGross(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Tax Rate (%)</label><Input type="number" value={taxRate} onChange={e => setTaxRate(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Insurance</label><Input type="number" value={insurance} onChange={e => setInsurance(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Provident Fund (%)</label><Input type="number" value={provident} onChange={e => setProvident(+e.target.value)} className="rounded-xl" /></div>
          <div className="col-span-2"><label className="text-sm text-muted-foreground">Bonus</label><Input type="number" value={bonus} onChange={e => setBonus(+e.target.value)} className="rounded-xl" /></div>
        </div>
        <div className="space-y-2">
          {[
            { label: "Gross Salary", val: gross },
            { label: "Bonus", val: bonus },
            { label: "Tax Deduction", val: -taxAmt },
            { label: "Insurance", val: -insurance },
            { label: "Provident Fund", val: -providentAmt },
          ].map(i => (
            <div key={i.label} className="flex justify-between p-2 text-sm">
              <span className="text-muted-foreground">{i.label}</span>
              <span className={i.val < 0 ? "text-destructive" : ""}>{i.val < 0 ? "-" : ""}৳{Math.abs(i.val).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 font-bold">
            <span>Net Salary</span>
            <span className="text-primary text-lg">৳{net.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
