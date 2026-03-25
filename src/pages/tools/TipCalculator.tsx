import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

const TipCalculator = () => {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState("1");

  const billAmount = parseFloat(bill) || 0;
  const numPeople = parseInt(people) || 1;
  const tipAmount = billAmount * (tipPercent / 100);
  const total = billAmount + tipAmount;
  const perPerson = total / numPeople;
  const tipPerPerson = tipAmount / numPeople;

  const presets = [5, 10, 15, 18, 20, 25];

  return (
    <ToolLayout title="Tip Calculator" description="Calculate tips and split bills between people">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Bill Amount</label>
          <Input type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="0.00" className="rounded-xl bg-card border-border/50 text-2xl font-bold h-14" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Tip Percentage: {tipPercent}%</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {presets.map(p => (
              <button key={p} onClick={() => setTipPercent(p)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tipPercent === p ? "gradient-bg text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"}`}>
                {p}%
              </button>
            ))}
          </div>
          <input type="range" min="0" max="50" value={tipPercent} onChange={e => setTipPercent(parseInt(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Split Between</label>
          <Input type="number" min="1" value={people} onChange={e => setPeople(e.target.value)} className="rounded-xl bg-card border-border/50" />
        </div>

        {billAmount > 0 && (
          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Tip Amount</span><span className="font-bold text-lg">${tipAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-lg">${total.toFixed(2)}</span></div>
            {numPeople > 1 && (<>
              <hr className="border-border/30" />
              <div className="flex justify-between"><span className="text-muted-foreground">Tip per Person</span><span className="font-bold">${tipPerPerson.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total per Person</span><span className="font-extrabold text-xl gradient-text">${perPerson.toFixed(2)}</span></div>
            </>)}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default TipCalculator;
