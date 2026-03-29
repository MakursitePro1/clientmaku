import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Calculator, Percent, DollarSign, TrendingUp, PiggyBank, Clock } from "lucide-react";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) return null;
    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - p;
    return { monthly, totalPayment, totalInterest, months: n };
  }, [amount, rate, years]);

  return (
    <ToolLayout title="Loan Calculator" description="Calculate monthly payments, total interest, and loan amortization">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Inputs */}
        <div className="tool-section-card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Loan Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Loan Amount ($)</label>
              <Input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="tool-input-colorful rounded-xl font-bold text-lg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Interest Rate (%)</label>
              <Input value={rate} onChange={e => setRate(e.target.value)} type="number" step="0.1" className="tool-input-colorful rounded-xl font-bold text-lg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Loan Term (years)</label>
              <Input value={years} onChange={e => setYears(e.target.value)} type="number" className="tool-input-colorful rounded-xl font-bold text-lg" />
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="tool-result-card text-center space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Monthly Payment</p>
              <p className="text-4xl font-black gradient-text">${result.monthly.toFixed(2)}</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="tool-stat-card">
                <DollarSign className="w-5 h-5 mx-auto text-green-500 mb-1" />
                <div className="stat-value text-sm">${parseFloat(amount).toLocaleString()}</div>
                <div className="stat-label">Principal</div>
              </div>
              <div className="tool-stat-card">
                <TrendingUp className="w-5 h-5 mx-auto text-red-500 mb-1" />
                <div className="stat-value text-sm">${result.totalInterest.toFixed(0)}</div>
                <div className="stat-label">Interest</div>
              </div>
              <div className="tool-stat-card">
                <PiggyBank className="w-5 h-5 mx-auto text-primary mb-1" />
                <div className="stat-value text-sm">${result.totalPayment.toFixed(0)}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="tool-stat-card">
                <Clock className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                <div className="stat-value text-sm">{result.months}</div>
                <div className="stat-label">Months</div>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="tool-section-card p-4">
              <h3 className="text-sm font-bold gradient-text mb-3">📊 Payment Breakdown</h3>
              <div className="h-6 rounded-full overflow-hidden flex">
                <div className="bg-green-500 transition-all" style={{ width: `${(parseFloat(amount) / result.totalPayment) * 100}%` }} />
                <div className="bg-red-400 transition-all" style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs font-semibold">
                <span className="text-green-600">● Principal ({((parseFloat(amount) / result.totalPayment) * 100).toFixed(1)}%)</span>
                <span className="text-red-500">● Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
