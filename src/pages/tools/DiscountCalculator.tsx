import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

const DiscountCalculator = () => {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");

  const original = parseFloat(price) || 0;
  const discountPercent = parseFloat(discount) || 0;
  const taxPercent = parseFloat(tax) || 0;

  const savings = original * (discountPercent / 100);
  const afterDiscount = original - savings;
  const taxAmount = afterDiscount * (taxPercent / 100);
  const finalPrice = afterDiscount + taxAmount;

  const presets = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70];

  return (
    <ToolLayout title="Discount Calculator" description="Calculate discount prices with optional tax">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <label className="text-sm font-semibold mb-1 block">Original Price</label>
          <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="rounded-xl bg-card border-border/50 text-xl font-bold h-14" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Discount: {discountPercent}%</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {presets.map(p => (
              <button key={p} onClick={() => setDiscount(p.toString())}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${parseFloat(discount) === p ? "gradient-bg text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground"}`}>
                {p}%
              </button>
            ))}
          </div>
          <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Discount %" className="rounded-xl bg-card border-border/50" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block">Tax % (optional)</label>
          <Input type="number" value={tax} onChange={e => setTax(e.target.value)} placeholder="0" className="rounded-xl bg-card border-border/50" />
        </div>

        {original > 0 && discountPercent > 0 && (
          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Original Price</span><span className="font-bold">৳{original.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-500"><span>Discount ({discountPercent}%)</span><span className="font-bold">-৳{savings.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">After Discount</span><span className="font-bold">৳{afterDiscount.toFixed(2)}</span></div>
            {taxPercent > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tax ({taxPercent}%)</span><span className="font-bold">+৳{taxAmount.toFixed(2)}</span></div>}
            <hr className="border-border/30" />
            <div className="flex justify-between"><span className="font-bold text-lg">Final Price</span><span className="text-2xl font-extrabold gradient-text">৳{finalPrice.toFixed(2)}</span></div>
            <p className="text-sm text-green-500 text-center font-semibold">You save ৳{savings.toFixed(2)}!</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default DiscountCalculator;
