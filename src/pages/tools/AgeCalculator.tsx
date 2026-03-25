import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<null | { years: number; months: number; days: number; totalDays: number; nextBirthday: number }>(null);

  const calculate = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const nextBd = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBd < now) nextBd.setFullYear(nextBd.getFullYear() + 1);
    const nextBirthday = Math.floor((nextBd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setResult({ years, months, days, totalDays, nextBirthday });
  };

  return (
    <ToolLayout title="Age Calculator" description="Calculate your exact age in years, months, days">
      <div className="space-y-6 max-w-lg mx-auto">
        <div>
          <label className="text-sm font-semibold mb-2 block">Date of Birth</label>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-xl" />
        </div>
        <Button onClick={calculate} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Calculate Age</Button>
        {result && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/50 rounded-2xl p-5 text-center">
              <div className="text-3xl font-extrabold text-primary">{result.years}</div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
            <div className="bg-accent/50 rounded-2xl p-5 text-center">
              <div className="text-3xl font-extrabold text-primary">{result.months}</div>
              <div className="text-sm text-muted-foreground">Months</div>
            </div>
            <div className="bg-accent/50 rounded-2xl p-5 text-center">
              <div className="text-3xl font-extrabold text-primary">{result.days}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div className="bg-accent/50 rounded-2xl p-5 text-center">
              <div className="text-3xl font-extrabold text-primary">{result.totalDays}</div>
              <div className="text-sm text-muted-foreground">Total Days</div>
            </div>
            <div className="col-span-2 bg-accent/50 rounded-2xl p-5 text-center">
              <div className="text-xl font-bold text-primary">🎂 Next birthday in {result.nextBirthday} days</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
