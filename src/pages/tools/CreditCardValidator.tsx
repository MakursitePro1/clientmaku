import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreditCardValidator() {
  const [number, setNumber] = useState("");

  const luhn = (num: string) => {
    const digits = num.replace(/\D/g, "").split("").reverse().map(Number);
    let sum = 0;
    digits.forEach((d, i) => { if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; } sum += d; });
    return sum % 10 === 0;
  };

  const getType = (num: string) => {
    const n = num.replace(/\D/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^5[1-5]/.test(n)) return "MasterCard";
    if (/^3[47]/.test(n)) return "American Express";
    if (/^6(?:011|5)/.test(n)) return "Discover";
    if (/^3(?:0[0-5]|[68])/.test(n)) return "Diners Club";
    if (/^35/.test(n)) return "JCB";
    return "Unknown";
  };

  const clean = number.replace(/\D/g, "");
  const valid = clean.length >= 13 && clean.length <= 19 && luhn(clean);
  const type = getType(clean);

  const format = (n: string) => n.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  return (
    <ToolLayout title="Credit Card Validator" description="Validate credit card numbers using Luhn algorithm">
      <div className="space-y-4 max-w-md mx-auto">
        <Input value={format(number)} onChange={e => setNumber(e.target.value)} placeholder="Enter card number..." className="rounded-xl text-lg font-mono tracking-wider" maxLength={23} />
        {clean.length > 0 && (
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border text-center ${valid ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30"}`}>
              <p className="text-2xl font-bold">{valid ? "✅ Valid" : "❌ Invalid"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-accent/30 rounded-xl border border-border text-center">
                <p className="text-xs text-muted-foreground">Card Type</p>
                <p className="font-bold">{type}</p>
              </div>
              <div className="p-3 bg-accent/30 rounded-xl border border-border text-center">
                <p className="text-xs text-muted-foreground">Digits</p>
                <p className="font-bold">{clean.length}</p>
              </div>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center">⚠️ This tool only validates the format using the Luhn algorithm. No real card data is processed.</p>
      </div>
    </ToolLayout>
  );
}
