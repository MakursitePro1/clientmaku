import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const knownFrauds = ["fakecourier", "scamdelivery", "fraudexpress", "fakepost"];

export default function CourierFraudChecker() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<null | { safe: boolean; message: string }>(null);

  const check = () => {
    const q = query.toLowerCase().replace(/\s/g, "");
    const isFraud = knownFrauds.some((f) => q.includes(f));
    if (!query.trim()) return;
    setResult({
      safe: !isFraud,
      message: isFraud
        ? "⚠️ This courier name matches known fraudulent services. Be careful!"
        : "✅ This courier name does not match any known fraudulent services. However, always verify independently.",
    });
  };

  return (
    <ToolLayout title="Courier Fraud Checker" description="Check if a courier service is potentially fraudulent">
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex gap-3">
          <Input placeholder="Enter courier name or tracking ID..." value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-xl" />
          <Button onClick={check} className="gradient-bg text-primary-foreground rounded-xl font-semibold shrink-0">Check</Button>
        </div>
        {result && (
          <div className={`p-6 rounded-2xl border ${result.safe ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <Badge variant={result.safe ? "secondary" : "destructive"} className="mb-3">
              {result.safe ? "Likely Safe" : "Suspicious"}
            </Badge>
            <p className="text-sm">{result.message}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
