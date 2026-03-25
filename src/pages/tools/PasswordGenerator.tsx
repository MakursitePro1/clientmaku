import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) return;
    const pw = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setPassword(pw);
  };

  const strength = () => {
    let s = 0;
    if (length >= 12) s++;
    if (length >= 16) s++;
    if (uppercase && lowercase) s++;
    if (numbers) s++;
    if (symbols) s++;
    if (s <= 2) return { label: "Weak", color: "text-red-500" };
    if (s <= 3) return { label: "Medium", color: "text-yellow-500" };
    return { label: "Strong", color: "text-green-500" };
  };

  return (
    <ToolLayout title="Password Generator" description="Generate strong and secure passwords">
      <div className="space-y-6 max-w-lg mx-auto">
        <div>
          <label className="text-sm font-semibold mb-2 block">Length: {length}</label>
          <Slider value={[length]} onValueChange={([v]) => setLength(v)} min={4} max={64} step={1} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Uppercase (A-Z)", checked: uppercase, set: setUppercase },
            { label: "Lowercase (a-z)", checked: lowercase, set: setLowercase },
            { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
            { label: "Symbols (!@#$)", checked: symbols, set: setSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={opt.checked} onCheckedChange={(c) => opt.set(!!c)} />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
        <Button onClick={generate} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold" size="lg">Generate Password</Button>
        {password && (
          <div className="bg-accent/50 rounded-2xl p-5 text-center">
            <code className="text-lg font-mono font-bold break-all">{password}</code>
            <div className={`text-sm mt-2 font-semibold ${strength().color}`}>Strength: {strength().label}</div>
            <Button variant="outline" className="mt-4 rounded-xl" onClick={() => { navigator.clipboard.writeText(password); toast({ title: "Copied!" }); }}>Copy Password</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
