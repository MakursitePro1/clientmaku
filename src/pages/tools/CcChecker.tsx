import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { CreditCard, CheckCircle2, XCircle, Info, Trash2, Plus, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface CardResult {
  number: string;
  valid: boolean;
  brand: string;
  type: string;
  length: number;
  luhn: boolean;
}

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length === 0) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function detectBrand(num: string): string {
  const d = num.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "American Express";
  if (/^6(?:011|5)/.test(d)) return "Discover";
  if (/^3(?:0[0-5]|[68])/.test(d)) return "Diners Club";
  if (/^35/.test(d)) return "JCB";
  if (/^62/.test(d)) return "UnionPay";
  if (/^9792/.test(d)) return "Troy";
  return "Unknown";
}

function detectType(brand: string): string {
  if (brand === "Unknown") return "Unknown";
  return ["Visa", "Mastercard", "Discover", "UnionPay", "JCB", "Troy"].includes(brand)
    ? "Credit / Debit"
    : brand === "American Express"
    ? "Charge Card"
    : "Credit";
}

function getBrandColor(brand: string): string {
  const map: Record<string, string> = {
    Visa: "hsl(220, 90%, 55%)",
    Mastercard: "hsl(15, 85%, 55%)",
    "American Express": "hsl(210, 70%, 50%)",
    Discover: "hsl(30, 90%, 50%)",
    "Diners Club": "hsl(200, 60%, 45%)",
    JCB: "hsl(145, 70%, 40%)",
    UnionPay: "hsl(0, 75%, 50%)",
    Troy: "hsl(270, 60%, 50%)",
  };
  return map[brand] || "hsl(var(--muted-foreground))";
}

export default function CcChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<CardResult[]>([]);

  const checkCards = () => {
    const lines = input
      .split(/[\n,|]+/)
      .map((l) => l.trim().replace(/\D/g, ""))
      .filter((l) => l.length >= 12 && l.length <= 19);

    if (lines.length === 0) return;

    const checked = lines.map((num) => {
      const brand = detectBrand(num);
      return {
        number: num,
        valid: luhnCheck(num),
        brand,
        type: detectType(brand),
        length: num.length,
        luhn: luhnCheck(num),
      };
    });

    setResults(checked);
  };

  const formatDisplay = (num: string) =>
    num.replace(/(.{4})/g, "$1 ").trim();

  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.filter((r) => !r.valid).length;

  return (
    <ToolLayout
      title="CC Checker / Validator"
      description="Validate credit card numbers using Luhn algorithm (Educational purpose only)"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5"
        >
          <Shield className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-yellow-500">Educational Tool:</strong> This tool validates card number format using the Luhn algorithm. It does NOT verify if a card is active, has funds, or is real. For educational & testing purposes only.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Enter Card Numbers</h3>
          </div>
          <textarea
            className="w-full min-h-[140px] rounded-xl border border-border/50 bg-background/80 p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y placeholder:text-muted-foreground/60"
            placeholder={"Enter card numbers (one per line, comma or pipe separated)\n\nExample:\n4111111111111111\n5500000000000004\n378282246310005"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={checkCards} className="gap-2" disabled={!input.trim()}>
              <Zap className="w-4 h-4" /> Validate Cards
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInput("");
                setResults([]);
              }}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setInput(
                  "4111111111111111\n5500000000000004\n378282246310005\n6011111111111117\n1234567890123456"
                )
              }
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Load Samples
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{results.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Checked</p>
              </div>
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-green-500">{validCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Valid (Luhn)</p>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{invalidCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Invalid</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" /> Results
              </h3>
              {results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                    r.valid
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {r.valid ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <span className="font-mono text-sm text-foreground truncate">
                      {formatDisplay(r.number)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className="px-2.5 py-1 rounded-full font-medium text-white"
                      style={{ backgroundColor: getBrandColor(r.brand) }}
                    >
                      {r.brand}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {r.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {r.length} digits
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full font-medium ${
                        r.valid
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {r.valid ? "VALID" : "INVALID"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-card/50 p-6 space-y-3"
        >
          <h3 className="font-semibold text-foreground">How Luhn Algorithm Works</h3>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5">
            <li>Starting from the rightmost digit, double every second digit</li>
            <li>If doubling results in a number greater than 9, subtract 9</li>
            <li>Sum all the digits together</li>
            <li>If the total modulo 10 equals 0, the number is valid</li>
          </ol>
        </motion.div>
      </div>
    </ToolLayout>
  );
}
