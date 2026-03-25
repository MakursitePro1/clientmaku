import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NumberBaseConverter() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);

  let decimal = 0;
  let error = "";
  try { decimal = parseInt(input, fromBase); if (isNaN(decimal)) error = "Invalid input"; } catch { error = "Invalid input"; }

  const bases = [
    { label: "Binary (2)", base: 2 },
    { label: "Octal (8)", base: 8 },
    { label: "Decimal (10)", base: 10 },
    { label: "Hexadecimal (16)", base: 16 },
    { label: "Base-32", base: 32 },
    { label: "Base-36", base: 36 },
  ];

  return (
    <ToolLayout title="Number Base Converter" description="Convert numbers between binary, octal, decimal, hex and more">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number..." className="rounded-xl font-mono flex-1" />
          <select value={fromBase} onChange={e => setFromBase(+e.target.value)} className="rounded-xl border border-input bg-background px-3 text-sm">
            {bases.map(b => <option key={b.base} value={b.base}>Base {b.base}</option>)}
          </select>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        {!error && (
          <div className="space-y-2">
            {bases.map(b => (
              <button key={b.base} onClick={() => { navigator.clipboard.writeText(decimal.toString(b.base).toUpperCase()); toast.success("Copied!"); }} className="w-full flex justify-between p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors">
                <span className="text-sm text-muted-foreground">{b.label}</span>
                <span className="font-mono font-bold">{decimal.toString(b.base).toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
