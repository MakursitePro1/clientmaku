import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

const romanMap: [number, string][] = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];

function toRoman(n: number): string {
  if (n <= 0 || n > 3999) return "Invalid (1-3999)";
  let r = ""; for (const [v, s] of romanMap) { while (n >= v) { r += s; n -= v; } } return r;
}
function fromRoman(s: string): number {
  const map: Record<string, number> = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 };
  let r = 0; for (let i = 0; i < s.length; i++) { const c = map[s[i].toUpperCase()] || 0; const n = map[s[i+1]?.toUpperCase()] || 0; r += c < n ? -c : c; } return r;
}

export default function RomanNumeralConverter() {
  const [num, setNum] = useState("42");
  const [roman, setRoman] = useState("XLII");

  return (
    <ToolLayout title="Roman Numeral Converter" description="Convert between numbers and Roman numerals">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="bg-accent/50 rounded-xl p-5 space-y-3">
          <label className="text-sm font-semibold">Number</label>
          <Input type="number" value={num} onChange={e => { setNum(e.target.value); setRoman(toRoman(Number(e.target.value))); }} className="rounded-xl" />
        </div>
        <div className="bg-accent/50 rounded-xl p-5 space-y-3">
          <label className="text-sm font-semibold">Roman Numeral</label>
          <Input value={roman} onChange={e => { setRoman(e.target.value); setNum(String(fromRoman(e.target.value))); }} className="rounded-xl font-mono text-lg" />
        </div>
      </div>
    </ToolLayout>
  );
}
