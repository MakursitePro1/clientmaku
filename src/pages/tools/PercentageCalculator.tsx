import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PercentageCalculator = () => {
  const [v1, setV1] = useState(""); const [v2, setV2] = useState("");
  const [r1, setR1] = useState("");
  const [a1, setA1] = useState(""); const [a2, setA2] = useState("");
  const [r2, setR2] = useState("");
  const [b1, setB1] = useState(""); const [b2, setB2] = useState("");
  const [r3, setR3] = useState("");
  const [c1, setC1] = useState(""); const [c2, setC2] = useState("");
  const [r4, setR4] = useState("");

  const calc1 = () => { const p = parseFloat(v1), n = parseFloat(v2); if (!isNaN(p) && !isNaN(n)) setR1(((p / 100) * n).toFixed(2)); };
  const calc2 = () => { const n = parseFloat(a1), t = parseFloat(a2); if (!isNaN(n) && !isNaN(t) && t !== 0) setR2(((n / t) * 100).toFixed(2) + "%"); };
  const calc3 = () => { const f = parseFloat(b1), t = parseFloat(b2); if (!isNaN(f) && !isNaN(t) && f !== 0) setR3((((t - f) / Math.abs(f)) * 100).toFixed(2) + "%"); };
  const calc4 = () => { const n = parseFloat(c1), p = parseFloat(c2); if (!isNaN(n) && !isNaN(p) && p !== 0) setR4((n / (p / 100)).toFixed(2)); };

  const Section = ({ title, inputs, result, onCalc }: { title: string; inputs: React.ReactNode; result: string; onCalc: () => void }) => (
    <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
      <h3 className="font-bold text-lg">{title}</h3>
      <div className="flex flex-wrap items-center gap-2">{inputs}</div>
      <div className="flex items-center gap-3">
        <Button onClick={onCalc} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Calculate</Button>
        {result && <span className="text-xl font-bold gradient-text">{result}</span>}
      </div>
    </div>
  );

  return (
    <ToolLayout title="Percentage Calculator" description="Calculate percentages easily with multiple modes">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="What is X% of Y?" result={r1} onCalc={calc1}
          inputs={<>
            <span className="text-sm font-medium">What is</span>
            <Input type="number" value={v1} onChange={e => setV1(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="%" />
            <span className="text-sm font-medium">% of</span>
            <Input type="number" value={v2} onChange={e => setV2(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="number" />
          </>} />
        <Section title="X is what % of Y?" result={r2} onCalc={calc2}
          inputs={<>
            <Input type="number" value={a1} onChange={e => setA1(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="X" />
            <span className="text-sm font-medium">is what % of</span>
            <Input type="number" value={a2} onChange={e => setA2(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="Y" />
          </>} />
        <Section title="% Change from X to Y" result={r3} onCalc={calc3}
          inputs={<>
            <span className="text-sm font-medium">From</span>
            <Input type="number" value={b1} onChange={e => setB1(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="X" />
            <span className="text-sm font-medium">to</span>
            <Input type="number" value={b2} onChange={e => setB2(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="Y" />
          </>} />
        <Section title="X is Y% of what?" result={r4} onCalc={calc4}
          inputs={<>
            <Input type="number" value={c1} onChange={e => setC1(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="X" />
            <span className="text-sm font-medium">is</span>
            <Input type="number" value={c2} onChange={e => setC2(e.target.value)} className="w-24 rounded-xl bg-card border-border/50" placeholder="%" />
            <span className="text-sm font-medium">% of what?</span>
          </>} />
      </div>
    </ToolLayout>
  );
};

export default PercentageCalculator;
