import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function generate(length: number, useUpper: boolean, useLower: boolean, useDigits: boolean, useSymbols: boolean) {
  let chars = "";
  if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (useDigits) chars += "0123456789";
  if (useSymbols) chars += "!@#$%^&*()-_=+[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join("");
}

export default function SecurePasswordManager() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const gen = () => setPasswords(Array.from({ length: count }, () => generate(length, upper, lower, digits, symbols)));

  return (
    <ToolLayout title="Bulk Password Generator" description="Generate multiple secure passwords at once">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-muted-foreground">Length</label><Input type="number" value={length} onChange={e => setLength(+e.target.value)} min={4} max={128} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Count</label><Input type="number" value={count} onChange={e => setCount(+e.target.value)} min={1} max={50} className="rounded-xl" /></div>
        </div>
        <div className="flex gap-4 flex-wrap text-sm">
          <label className="flex items-center gap-1"><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> Uppercase</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} /> Lowercase</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={digits} onChange={e => setDigits(e.target.checked)} /> Numbers</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} /> Symbols</label>
        </div>
        <Button onClick={gen} className="gradient-bg text-primary-foreground rounded-xl w-full">Generate Passwords</Button>
        <div className="space-y-2">
          {passwords.map((pw, i) => (
            <button key={i} onClick={() => { navigator.clipboard.writeText(pw); toast.success("Copied!"); }} className="w-full text-left p-3 rounded-xl border border-border hover:bg-accent/30 font-mono text-sm break-all transition-colors">{pw}</button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
