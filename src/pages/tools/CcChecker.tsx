import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import {
  CreditCard, CheckCircle2, XCircle, Info, Trash2, Plus, Shield, Zap, Download,
  Copy, Filter, BarChart3, Eye, EyeOff, Hash, Clock, Search, FileJson, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface CardResult {
  number: string;
  masked: string;
  valid: boolean;
  brand: string;
  type: string;
  level: string;
  length: number;
  luhn: boolean;
  issuerCountry: string;
  checkDigit: string;
  iin: string;
  timestamp: number;
}

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length === 0) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function generateCheckDigit(partial: string): string {
  const digits = partial.replace(/\D/g, "");
  for (let d = 0; d <= 9; d++) {
    if (luhnCheck(digits + d)) return String(d);
  }
  return "?";
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
  if (/^5019/.test(d)) return "Dankort";
  if (/^6304|^6759|^6761|^6762|^6763/.test(d)) return "Maestro";
  if (/^1/.test(d)) return "UATP";
  if (/^636/.test(d)) return "InterPayment";
  return "Unknown";
}

function detectType(brand: string): string {
  if (brand === "Unknown") return "Unknown";
  if (brand === "American Express") return "Charge Card";
  if (brand === "Maestro" || brand === "Dankort") return "Debit";
  if (brand === "UATP") return "Travel Card";
  return "Credit / Debit";
}

function detectLevel(num: string, brand: string): string {
  if (brand === "Unknown") return "Unknown";
  const d = num.replace(/\D/g, "");
  if (brand === "Visa") {
    if (/^4[0-9]{5}(9|8)/.test(d)) return "Platinum / Signature";
    if (/^4[0-9]{5}[5-7]/.test(d)) return "Gold";
    return "Classic";
  }
  if (brand === "Mastercard") {
    if (/^5[1-5][0-9]{4}(9|8)/.test(d)) return "World Elite";
    if (/^5[1-5][0-9]{4}[5-7]/.test(d)) return "World";
    return "Standard";
  }
  if (brand === "American Express") {
    if (/^34/.test(d)) return "Green";
    if (/^37[0-4]/.test(d)) return "Gold";
    if (/^37[5-9]/.test(d)) return "Platinum";
    return "Standard";
  }
  return "Standard";
}

function detectCountry(num: string): string {
  const d = num.replace(/\D/g, "");
  const iin = d.substring(0, 6);
  const n = parseInt(iin, 10);
  if (n >= 400000 && n <= 499999) return "🇺🇸 United States";
  if (n >= 510000 && n <= 559999) return "🌍 International";
  if (n >= 340000 && n <= 349999) return "🇺🇸 United States";
  if (n >= 370000 && n <= 379999) return "🇺🇸 United States";
  if (n >= 620000 && n <= 629999) return "🇨🇳 China";
  if (n >= 353000 && n <= 358999) return "🇯🇵 Japan";
  return "🌐 Unknown";
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
    Maestro: "hsl(220, 70%, 45%)",
    Dankort: "hsl(350, 70%, 50%)",
    UATP: "hsl(180, 60%, 40%)",
    InterPayment: "hsl(40, 80%, 45%)",
  };
  return map[brand] || "hsl(var(--muted-foreground))";
}

function getBrandIcon(brand: string): string {
  const map: Record<string, string> = {
    Visa: "💳", Mastercard: "🔴", "American Express": "💎",
    Discover: "🔶", "Diners Club": "🎩", JCB: "🎌",
    UnionPay: "🏦", Troy: "🦁", Maestro: "🎵",
    Dankort: "🇩🇰", UATP: "✈️", InterPayment: "🌐",
  };
  return map[brand] || "❓";
}

function maskNumber(num: string): string {
  if (num.length <= 8) return num;
  return num.substring(0, 4) + " **** **** " + num.substring(num.length - 4);
}

type FilterType = "all" | "valid" | "invalid";

export default function CcChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<CardResult[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showMasked, setShowMasked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkDigitInput, setCheckDigitInput] = useState("");
  const [singleCardInput, setSingleCardInput] = useState("");
  const [singleResult, setSingleResult] = useState<CardResult | null>(null);
  const [history, setHistory] = useState<{ count: number; valid: number; time: string }[]>([]);

  const checkCards = () => {
    const lines = input
      .split(/[\n,|;]+/)
      .map((l) => l.trim().replace(/[\s\-]/g, "").replace(/\D/g, ""))
      .filter((l) => l.length >= 12 && l.length <= 19);

    if (lines.length === 0) {
      toast.error("No valid card numbers found. Enter numbers with 12-19 digits.");
      return;
    }

    const unique = [...new Set(lines)];
    const checked: CardResult[] = unique.map((num) => {
      const brand = detectBrand(num);
      return {
        number: num,
        masked: maskNumber(num),
        valid: luhnCheck(num),
        brand,
        type: detectType(brand),
        level: detectLevel(num, brand),
        length: num.length,
        luhn: luhnCheck(num),
        issuerCountry: detectCountry(num),
        checkDigit: num[num.length - 1],
        iin: num.substring(0, 6),
        timestamp: Date.now(),
      };
    });

    setResults(checked);
    setHistory(prev => [...prev, {
      count: checked.length,
      valid: checked.filter(r => r.valid).length,
      time: new Date().toLocaleTimeString()
    }]);
    toast.success(`Validated ${checked.length} card(s) — ${checked.filter(r => r.valid).length} valid`);
  };

  const checkSingleCard = () => {
    const num = singleCardInput.replace(/[\s\-]/g, "").replace(/\D/g, "");
    if (num.length < 12 || num.length > 19) {
      toast.error("Enter a valid card number (12-19 digits)");
      return;
    }
    const brand = detectBrand(num);
    setSingleResult({
      number: num,
      masked: maskNumber(num),
      valid: luhnCheck(num),
      brand,
      type: detectType(brand),
      level: detectLevel(num, brand),
      length: num.length,
      luhn: luhnCheck(num),
      issuerCountry: detectCountry(num),
      checkDigit: num[num.length - 1],
      iin: num.substring(0, 6),
      timestamp: Date.now(),
    });
  };

  const exportCsv = () => {
    if (filteredResults.length === 0) return;
    const header = "Card Number,Valid,Brand,Type,Level,Length,IIN,Country,Check Digit\n";
    const rows = filteredResults.map((r) =>
      `${showMasked ? r.masked : r.number},${r.valid ? "VALID" : "INVALID"},${r.brand},${r.type},${r.level},${r.length},${r.iin},${r.issuerCountry},${r.checkDigit}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cc-check-results.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const exportJson = () => {
    if (filteredResults.length === 0) return;
    const data = filteredResults.map(r => ({
      number: showMasked ? r.masked : r.number,
      valid: r.valid, brand: r.brand, type: r.type, level: r.level,
      length: r.length, iin: r.iin, country: r.issuerCountry, checkDigit: r.checkDigit
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cc-check-results.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported successfully!");
  };

  const copyResults = () => {
    const text = filteredResults.map(r =>
      `${showMasked ? r.masked : r.number} | ${r.valid ? "VALID" : "INVALID"} | ${r.brand} | ${r.type}`
    ).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Results copied to clipboard!");
  };

  const formatDisplay = (num: string) => num.replace(/(.{4})/g, "$1 ").trim();

  const filteredResults = useMemo(() => {
    let filtered = results;
    if (filter === "valid") filtered = filtered.filter(r => r.valid);
    if (filter === "invalid") filtered = filtered.filter(r => !r.valid);
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.number.includes(searchQuery) || r.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [results, filter, searchQuery]);

  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.filter((r) => !r.valid).length;

  const brandStats = useMemo(() => {
    const map: Record<string, number> = {};
    results.forEach(r => { map[r.brand] = (map[r.brand] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [results]);

  return (
    <ToolLayout
      title="CC Checker / Validator"
      description="Advanced credit card number validator with Luhn algorithm (Educational purpose only)"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
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

        {/* Tabs */}
        <Tabs defaultValue="bulk" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="bulk" className="gap-1.5 text-xs sm:text-sm">
              <Zap className="w-3.5 h-3.5" /> Bulk Check
            </TabsTrigger>
            <TabsTrigger value="single" className="gap-1.5 text-xs sm:text-sm">
              <CreditCard className="w-3.5 h-3.5" /> Single Check
            </TabsTrigger>
            <TabsTrigger value="checkdigit" className="gap-1.5 text-xs sm:text-sm">
              <Hash className="w-3.5 h-3.5" /> Check Digit
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5" /> History
            </TabsTrigger>
          </TabsList>

          {/* Bulk Check Tab */}
          <TabsContent value="bulk" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Bulk Card Validation</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  Supports: comma, pipe, semicolon, newline separated
                </span>
              </div>
              <textarea
                className="w-full min-h-[160px] rounded-xl border border-border/50 bg-background/80 p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y placeholder:text-muted-foreground/60"
                placeholder={"Enter card numbers (one per line, comma, pipe or semicolon separated)\nSpaces and dashes are auto-removed\n\nExample:\n4111 1111 1111 1111\n5500-0000-0000-0004\n378282246310005"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {input.trim() ? `~${input.split(/[\n,|;]+/).filter(l => l.trim()).length} entries detected` : "No entries"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={checkCards} className="gap-2" disabled={!input.trim()}>
                  <Zap className="w-4 h-4" /> Validate All
                </Button>
                <Button variant="outline" onClick={() => { setInput(""); setResults([]); setFilter("all"); setSearchQuery(""); }} className="gap-2">
                  <Trash2 className="w-4 h-4" /> Clear
                </Button>
                <Button variant="outline" onClick={() => setInput(
                  "4111111111111111\n5500000000000004\n378282246310005\n6011111111111117\n3530111333300000\n6200000000000005\n1234567890123456\n4000056655665556\n5105105105105100\n30569309025904"
                )} className="gap-2">
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
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                  <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{results.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Checked</p>
                  </div>
                  <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-center">
                    <p className="text-2xl font-bold text-green-500">{validCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Valid (Luhn ✓)</p>
                  </div>
                  <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
                    <p className="text-2xl font-bold text-red-500">{invalidCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Invalid (Luhn ✗)</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {results.length > 0 ? Math.round((validCount / results.length) * 100) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Success Rate</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand Distribution */}
            <AnimatePresence>
              {brandStats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-3"
                >
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Brand Distribution
                  </h3>
                  <div className="space-y-2">
                    {brandStats.map(([brand, count]) => (
                      <div key={brand} className="flex items-center gap-3">
                        <span className="text-lg">{getBrandIcon(brand)}</span>
                        <span className="text-sm font-medium text-foreground w-32 truncate">{brand}</span>
                        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / results.length) * 100}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: getBrandColor(brand) }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono w-12 text-right">
                          {count} ({Math.round((count / results.length) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toolbar & Results */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3">
                    <div className="relative flex-1 min-w-[180px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by number or brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                      />
                    </div>
                    <div className="flex gap-1">
                      {(["all", "valid", "invalid"] as FilterType[]).map(f => (
                        <Button
                          key={f}
                          size="sm"
                          variant={filter === f ? "default" : "outline"}
                          onClick={() => setFilter(f)}
                          className="text-xs capitalize"
                        >
                          <Filter className="w-3 h-3 mr-1" />
                          {f === "all" ? `All (${results.length})` : f === "valid" ? `Valid (${validCount})` : `Invalid (${invalidCount})`}
                        </Button>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setShowMasked(!showMasked)} className="gap-1 text-xs">
                      {showMasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showMasked ? "Show" : "Mask"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyResults} className="gap-1 text-xs">
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={exportCsv} className="gap-1 text-xs">
                      <Download className="w-3 h-3" /> CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={exportJson} className="gap-1 text-xs">
                      <FileJson className="w-3 h-3" /> JSON
                    </Button>
                  </div>

                  {/* Results count */}
                  <p className="text-xs text-muted-foreground">
                    Showing {filteredResults.length} of {results.length} results
                  </p>

                  {/* Result Cards */}
                  {filteredResults.map((r, i) => (
                    <motion.div
                      key={`${r.number}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`rounded-xl border p-4 space-y-3 ${
                        r.valid ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {r.valid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                          )}
                          <span className="text-lg">{getBrandIcon(r.brand)}</span>
                          <span className="font-mono text-sm text-foreground truncate">
                            {showMasked ? r.masked : formatDisplay(r.number)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-full font-medium text-white" style={{ backgroundColor: getBrandColor(r.brand) }}>
                            {r.brand}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full font-medium ${r.valid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {r.valid ? "VALID ✓" : "INVALID ✗"}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium text-foreground">{r.type}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">Level</p>
                          <p className="font-medium text-foreground">{r.level}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">IIN / BIN</p>
                          <p className="font-medium text-foreground font-mono">{r.iin}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">Country</p>
                          <p className="font-medium text-foreground">{r.issuerCountry}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">Length</p>
                          <p className="font-medium text-foreground">{r.length} digits</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">Check Digit</p>
                          <p className="font-medium text-foreground font-mono">{r.checkDigit}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">Luhn</p>
                          <p className={`font-medium ${r.luhn ? "text-green-500" : "text-red-500"}`}>
                            {r.luhn ? "Pass ✓" : "Fail ✗"}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-muted-foreground">Algorithm</p>
                          <p className="font-medium text-foreground">Luhn (Mod 10)</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Single Check Tab */}
          <TabsContent value="single" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Single Card Deep Analysis</h3>
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter a single card number (e.g. 4111 1111 1111 1111)"
                  value={singleCardInput}
                  onChange={(e) => setSingleCardInput(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={checkSingleCard} disabled={!singleCardInput.trim()} className="gap-2 shrink-0">
                  <Zap className="w-4 h-4" /> Analyze
                </Button>
              </div>

              <AnimatePresence>
                {singleResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 mt-4"
                  >
                    {/* Visual Card */}
                    <div
                      className="relative rounded-2xl p-6 text-white overflow-hidden h-52"
                      style={{
                        background: `linear-gradient(135deg, ${getBrandColor(singleResult.brand)}, ${getBrandColor(singleResult.brand)}dd, hsl(var(--primary)))`,
                      }}
                    >
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30" />
                        <div className="absolute top-8 right-8 w-24 h-24 rounded-full border-2 border-white/20" />
                      </div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="text-3xl">{getBrandIcon(singleResult.brand)}</span>
                          <div className="text-right">
                            <p className="text-sm opacity-80">{singleResult.brand}</p>
                            <p className="text-xs opacity-60">{singleResult.level}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-mono text-xl tracking-[0.2em]">{formatDisplay(singleResult.number)}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs opacity-60">Status</p>
                            <p className="text-sm font-bold">{singleResult.valid ? "✓ VALID" : "✗ INVALID"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-60">Type</p>
                            <p className="text-sm">{singleResult.type}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Brand", value: singleResult.brand, icon: "💳" },
                        { label: "Type", value: singleResult.type, icon: "🏷️" },
                        { label: "Level", value: singleResult.level, icon: "⭐" },
                        { label: "IIN / BIN", value: singleResult.iin, icon: "🔢" },
                        { label: "Country", value: singleResult.issuerCountry, icon: "🌍" },
                        { label: "Length", value: `${singleResult.length} digits`, icon: "📏" },
                        { label: "Check Digit", value: singleResult.checkDigit, icon: "🔑" },
                        { label: "Luhn Check", value: singleResult.luhn ? "Pass ✓" : "Fail ✗", icon: "🧮" },
                        { label: "Algorithm", value: "Mod 10 (Luhn)", icon: "⚙️" },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="rounded-xl border border-border/50 bg-card/50 p-3"
                        >
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{item.icon}</span> {item.label}
                          </p>
                          <p className="font-medium text-foreground text-sm mt-1">{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* Check Digit Calculator Tab */}
          <TabsContent value="checkdigit" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Luhn Check Digit Calculator</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a partial card number (without the last digit) and this tool will calculate the correct check digit using the Luhn algorithm.
              </p>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. 411111111111111 (15 digits for 16-digit card)"
                  value={checkDigitInput}
                  onChange={(e) => setCheckDigitInput(e.target.value.replace(/\D/g, ""))}
                  className="font-mono"
                />
              </div>
              {checkDigitInput.length >= 11 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2"
                >
                  <p className="text-sm text-muted-foreground">Input: <span className="font-mono text-foreground">{formatDisplay(checkDigitInput)}</span></p>
                  <p className="text-sm text-muted-foreground">
                    Check Digit: <span className="text-2xl font-bold text-primary font-mono ml-2">{generateCheckDigit(checkDigitInput)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Full Number: <span className="font-mono text-foreground font-medium">{formatDisplay(checkDigitInput + generateCheckDigit(checkDigitInput))}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Brand: <span className="text-foreground font-medium">{getBrandIcon(detectBrand(checkDigitInput))} {detectBrand(checkDigitInput)}</span>
                  </p>
                  <p className="text-sm">
                    Luhn Valid: <span className="text-green-500 font-medium">
                      {luhnCheck(checkDigitInput + generateCheckDigit(checkDigitInput)) ? "✓ Yes" : "✗ No"}
                    </span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Validation History</h3>
                </div>
                {history.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => setHistory([])} className="gap-1 text-xs">
                    <Trash2 className="w-3 h-3" /> Clear
                  </Button>
                )}
              </div>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No validation history yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Run a bulk check to see history</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                        <span className="text-sm text-foreground">{h.count} cards checked</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-green-500">{h.valid} valid</span>
                        <span className="text-xs text-red-500">{h.count - h.valid} invalid</span>
                        <span className="text-xs text-muted-foreground">{h.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-card/50 p-6 space-y-4"
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" /> How Luhn Algorithm Works
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>Starting from the rightmost digit, double every second digit</li>
              <li>If doubling results in a number greater than 9, subtract 9</li>
              <li>Sum all the digits together</li>
              <li>If the total modulo 10 equals 0, the number is valid</li>
            </ol>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Supported Card Networks:</p>
              <div className="flex flex-wrap gap-2">
                {["Visa", "Mastercard", "American Express", "Discover", "JCB", "UnionPay", "Diners Club", "Troy", "Maestro", "Dankort", "UATP"].map(brand => (
                  <span key={brand} className="px-2 py-1 rounded-full text-xs text-white font-medium" style={{ backgroundColor: getBrandColor(brand) }}>
                    {getBrandIcon(brand)} {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-yellow-500">Disclaimer:</strong> This tool is for educational and development testing purposes only. 
                It validates number format using mathematical algorithms. It cannot check if a card is real, active, or has available balance. 
                Never use this for fraudulent activities.
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
}
