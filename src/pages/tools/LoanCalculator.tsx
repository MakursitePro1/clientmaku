import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoanCalculator = () => {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const [result, setResult] = useState<{ emi: number; totalPayment: number; totalInterest: number; schedule: { month: number; principal: number; interest: number; balance: number }[] } | null>(null);

  const calculate = () => {
    const P = parseFloat(amount), R = parseFloat(rate) / 100 / 12, N = parseFloat(years) * 12;
    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || N <= 0) return;

    const emi = R === 0 ? P / N : (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
    let balance = P;
    for (let i = 1; i <= Math.min(N, 60); i++) {
      const interest = balance * R;
      const principal = emi - interest;
      balance -= principal;
      schedule.push({ month: i, principal, interest, balance: Math.max(0, balance) });
    }

    setResult({ emi, totalPayment, totalInterest, schedule });
  };

  return (
    <ToolLayout title="Loan/EMI Calculator" description="Calculate monthly EMI payments for loans">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="text-sm font-semibold mb-1 block">Loan Amount</label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="rounded-xl bg-card border-border/50" /></div>
          <div><label className="text-sm font-semibold mb-1 block">Interest Rate (%/year)</label>
            <Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="rounded-xl bg-card border-border/50" /></div>
          <div><label className="text-sm font-semibold mb-1 block">Loan Term (Years)</label>
            <Input type="number" value={years} onChange={e => setYears(e.target.value)} className="rounded-xl bg-card border-border/50" /></div>
        </div>
        <Button onClick={calculate} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Calculate EMI</Button>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-2xl border border-border/50 p-5 text-center">
                <div className="text-sm text-muted-foreground">Monthly EMI</div>
                <div className="text-2xl font-extrabold gradient-text mt-1">৳{result.emi.toFixed(2)}</div>
              </div>
              <div className="bg-card rounded-2xl border border-border/50 p-5 text-center">
                <div className="text-sm text-muted-foreground">Total Payment</div>
                <div className="text-2xl font-extrabold text-foreground mt-1">৳{result.totalPayment.toFixed(2)}</div>
              </div>
              <div className="bg-card rounded-2xl border border-border/50 p-5 text-center">
                <div className="text-sm text-muted-foreground">Total Interest</div>
                <div className="text-2xl font-extrabold mt-1" style={{ color: "hsl(0, 84%, 60%)" }}>৳{result.totalInterest.toFixed(2)}</div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border/50"><h3 className="font-bold">Amortization Schedule</h3></div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr><th className="px-4 py-2 text-left">Month</th><th className="px-4 py-2 text-right">Principal</th><th className="px-4 py-2 text-right">Interest</th><th className="px-4 py-2 text-right">Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(r => (
                      <tr key={r.month} className="border-t border-border/30">
                        <td className="px-4 py-2">{r.month}</td>
                        <td className="px-4 py-2 text-right">৳{r.principal.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">৳{r.interest.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">৳{r.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default LoanCalculator;
