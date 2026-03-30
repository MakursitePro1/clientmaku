import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import {
  CreditCard, CheckCircle2, XCircle, Info, Trash2, Plus, Shield, Zap, Download,
  Copy, Filter, BarChart3, Eye, EyeOff, Hash, Clock, Search, FileJson, AlertTriangle,
  Globe, Building2, Loader2, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface BinData {
  scheme?: string;
  type?: string;
  brand?: string;
  prepaid?: boolean;
  country?: { name?: string; emoji?: string; alpha2?: string; currency?: string; latitude?: number; longitude?: number };
  bank?: { name?: string; url?: string; phone?: string; city?: string };
  number?: { length?: number; luhn?: boolean };
}

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
  binData?: BinData | null;
  binLoading?: boolean;
}

// BIN cache to avoid duplicate API calls
const binCache: Record<string, BinData | null> = {};

async function fetchBinData(bin: string): Promise<BinData | null> {
  const key = bin.substring(0, 6);
  if (binCache[key] !== undefined) return binCache[key];
  try {
    const res = await fetch(`https://lookup.binlist.net/${key}`, {
      headers: { "Accept-Version": "3" },
    });
    if (!res.ok) { binCache[key] = null; return null; }
    const data = await res.json();
    binCache[key] = data;
    return data;
  } catch {
    binCache[key] = null;
    return null;
  }
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

// BIN Info Display Component
function BinInfoCard({ binData, loading }: { binData?: BinData | null; loading?: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Looking up BIN data...</span>
      </div>
    );
  }
  if (!binData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="border-t border-border/30 pt-3 mt-2"
    >
      <p className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-2">
        <Database className="w-3.5 h-3.5" /> BIN Lookup — Real Data
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {binData.bank?.name && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground flex items-center gap-1"><Building2 className="w-3 h-3" /> Bank</p>
            <p className="font-medium text-foreground">{binData.bank.name}</p>
          </div>
        )}
        {binData.country?.name && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> Country</p>
            <p className="font-medium text-foreground">{binData.country.emoji} {binData.country.name}</p>
          </div>
        )}
        {binData.scheme && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Scheme</p>
            <p className="font-medium text-foreground capitalize">{binData.scheme}</p>
          </div>
        )}
        {binData.type && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Card Type</p>
            <p className="font-medium text-foreground capitalize">{binData.type}</p>
          </div>
        )}
        {binData.brand && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Brand</p>
            <p className="font-medium text-foreground">{binData.brand}</p>
          </div>
        )}
        {binData.prepaid !== undefined && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Prepaid</p>
            <p className="font-medium text-foreground">{binData.prepaid ? "Yes" : "No"}</p>
          </div>
        )}
        {binData.country?.currency && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Currency</p>
            <p className="font-medium text-foreground">{binData.country.currency}</p>
          </div>
        )}
        {binData.bank?.url && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Bank URL</p>
            <p className="font-medium text-foreground text-primary truncate">{binData.bank.url}</p>
          </div>
        )}
        {binData.bank?.phone && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Bank Phone</p>
            <p className="font-medium text-foreground">{binData.bank.phone}</p>
          </div>
        )}
        {binData.country?.alpha2 && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-muted-foreground">Country Code</p>
            <p className="font-medium text-foreground">{binData.country.alpha2}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CcChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<CardResult[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showMasked, setShowMasked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkDigitInput, setCheckDigitInput] = useState("");
  const [singleCardInput, setSingleCardInput] = useState("");
  const [singleResult, setSingleResult] = useState<CardResult | null>(null);
  const [singleBinLoading, setSingleBinLoading] = useState(false);
  const [history, setHistory] = useState<{ count: number; valid: number; time: string }[]>([]);
  const [binLookupInput, setBinLookupInput] = useState("");
  const [binLookupResult, setBinLookupResult] = useState<BinData | null>(null);
  const [binLookupLoading, setBinLookupLoading] = useState(false);
  const [bulkBinLoading, setBulkBinLoading] = useState(false);

  const checkCards = useCallback(async () => {
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
        issuerCountry: "Loading...",
        checkDigit: num[num.length - 1],
        iin: num.substring(0, 6),
        timestamp: Date.now(),
        binData: null,
        binLoading: true,
      };
    });

    setResults(checked);
    setBulkBinLoading(true);
    setHistory(prev => [...prev, {
      count: checked.length,
      valid: checked.filter(r => r.valid).length,
      time: new Date().toLocaleTimeString()
    }]);
    toast.success(`Validated ${checked.length} card(s) — ${checked.filter(r => r.valid).length} valid. Fetching BIN data...`);

    // Fetch BIN data for unique BINs (rate-limited)
    const uniqueBins = [...new Set(checked.map(r => r.iin))];
    const binResults: Record<string, BinData | null> = {};
    
    for (const bin of uniqueBins) {
      binResults[bin] = await fetchBinData(bin);
      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 300));
    }

    setResults(prev => prev.map(r => {
      const bd = binResults[r.iin];
      return {
        ...r,
        binData: bd,
        binLoading: false,
        issuerCountry: bd?.country ? `${bd.country.emoji || "🌐"} ${bd.country.name || "Unknown"}` : r.issuerCountry === "Loading..." ? "🌐 Unknown" : r.issuerCountry,
        brand: bd?.scheme ? (bd.scheme.charAt(0).toUpperCase() + bd.scheme.slice(1)) : r.brand,
        type: bd?.type ? (bd.type.charAt(0).toUpperCase() + bd.type.slice(1)) : r.type,
      };
    }));
    setBulkBinLoading(false);
  }, [input]);

  const checkSingleCard = useCallback(async () => {
    const num = singleCardInput.replace(/[\s\-]/g, "").replace(/\D/g, "");
    if (num.length < 12 || num.length > 19) {
      toast.error("Enter a valid card number (12-19 digits)");
      return;
    }
    const brand = detectBrand(num);
    const result: CardResult = {
      number: num,
      masked: maskNumber(num),
      valid: luhnCheck(num),
      brand,
      type: detectType(brand),
      level: detectLevel(num, brand),
      length: num.length,
      luhn: luhnCheck(num),
      issuerCountry: "Loading...",
      checkDigit: num[num.length - 1],
      iin: num.substring(0, 6),
      timestamp: Date.now(),
      binData: null,
      binLoading: true,
    };
    setSingleResult(result);
    setSingleBinLoading(true);

    const bd = await fetchBinData(num);
    setSingleResult(prev => prev ? {
      ...prev,
      binData: bd,
      binLoading: false,
      issuerCountry: bd?.country ? `${bd.country.emoji || "🌐"} ${bd.country.name || "Unknown"}` : "🌐 Unknown",
      brand: bd?.scheme ? (bd.scheme.charAt(0).toUpperCase() + bd.scheme.slice(1)) : prev.brand,
      type: bd?.type ? (bd.type.charAt(0).toUpperCase() + bd.type.slice(1)) : prev.type,
    } : prev);
    setSingleBinLoading(false);
  }, [singleCardInput]);

  const lookupBin = useCallback(async () => {
    const bin = binLookupInput.replace(/\D/g, "").substring(0, 8);
    if (bin.length < 6) {
      toast.error("Enter at least 6 digits for BIN lookup");
      return;
    }
    setBinLookupLoading(true);
    setBinLookupResult(null);
    const data = await fetchBinData(bin);
    setBinLookupResult(data);
    setBinLookupLoading(false);
    if (!data) toast.error("No BIN data found for this number");
    else toast.success("BIN data retrieved successfully!");
  }, [binLookupInput]);

  const exportCsv = () => {
    if (filteredResults.length === 0) return;
    const header = "Card Number,Valid,Brand,Type,Level,Length,IIN,Country,Bank,Prepaid,Currency,Check Digit\n";
    const rows = filteredResults.map((r) =>
      `${showMasked ? r.masked : r.number},${r.valid ? "VALID" : "INVALID"},${r.brand},${r.type},${r.level},${r.length},${r.iin},"${r.issuerCountry}","${r.binData?.bank?.name || "N/A"}",${r.binData?.prepaid ?? "N/A"},${r.binData?.country?.currency || "N/A"},${r.checkDigit}`
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
      length: r.length, iin: r.iin, country: r.issuerCountry, checkDigit: r.checkDigit,
      bank: r.binData?.bank?.name || null,
      prepaid: r.binData?.prepaid ?? null,
      currency: r.binData?.country?.currency || null,
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
      `${showMasked ? r.masked : r.number} | ${r.valid ? "VALID" : "INVALID"} | ${r.brand} | ${r.type} | ${r.binData?.bank?.name || "N/A"} | ${r.issuerCountry}`
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
        r.number.includes(searchQuery) ||
        r.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.binData?.bank?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.binData?.country?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
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
      description="Advanced credit card validator with BIN Lookup & Luhn algorithm (Educational only)"
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
            <strong className="text-yellow-500">Educational Tool:</strong> Validates card format using Luhn algorithm + real BIN database lookup. Does NOT verify if a card is active, has funds, or is real.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="bulk" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="bulk" className="gap-1.5 text-xs sm:text-sm">
              <Zap className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Bulk</span> Check
            </TabsTrigger>
            <TabsTrigger value="single" className="gap-1.5 text-xs sm:text-sm">
              <CreditCard className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Single</span> Card
            </TabsTrigger>
            <TabsTrigger value="binlookup" className="gap-1.5 text-xs sm:text-sm">
              <Database className="w-3.5 h-3.5" /> BIN <span className="hidden sm:inline">Lookup</span>
            </TabsTrigger>
            <TabsTrigger value="checkdigit" className="gap-1.5 text-xs sm:text-sm">
              <Hash className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Check</span> Digit
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
                  + Real BIN Lookup
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
                {bulkBinLoading && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Fetching BIN data...
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={checkCards} className="gap-2" disabled={!input.trim() || bulkBinLoading}>
                  {bulkBinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Validate All
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
                        placeholder="Search number, brand, bank, country..."
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
                          <p className="text-muted-foreground">Bank</p>
                          <p className="font-medium text-foreground truncate">
                            {r.binLoading ? "..." : r.binData?.bank?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      {/* BIN Info */}
                      <BinInfoCard binData={r.binData} loading={r.binLoading} />
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
                <h3 className="font-semibold text-foreground">Single Card Deep Analysis + BIN Lookup</h3>
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter a single card number (e.g. 4111 1111 1111 1111)"
                  value={singleCardInput}
                  onChange={(e) => setSingleCardInput(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={checkSingleCard} disabled={!singleCardInput.trim() || singleBinLoading} className="gap-2 shrink-0">
                  {singleBinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Analyze
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
                      className="relative rounded-2xl p-6 text-white overflow-hidden h-56"
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
                          {singleResult.binData?.bank?.name && (
                            <p className="text-xs opacity-70 mt-1 flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {singleResult.binData.bank.name}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs opacity-60">Status</p>
                            <p className="text-sm font-bold">{singleResult.valid ? "✓ VALID" : "✗ INVALID"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-60">Country</p>
                            <p className="text-sm">{singleResult.issuerCountry}</p>
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
                        { label: "Prepaid", value: singleResult.binData?.prepaid !== undefined ? (singleResult.binData.prepaid ? "Yes" : "No") : "N/A", icon: "💰" },
                        { label: "Bank", value: singleResult.binData?.bank?.name || (singleBinLoading ? "Loading..." : "N/A"), icon: "🏦" },
                        { label: "Currency", value: singleResult.binData?.country?.currency || "N/A", icon: "💱" },
                        { label: "Bank URL", value: singleResult.binData?.bank?.url || "N/A", icon: "🔗" },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.04 }}
                          className="rounded-xl border border-border/50 bg-card/50 p-3"
                        >
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{item.icon}</span> {item.label}
                          </p>
                          <p className="font-medium text-foreground text-sm mt-1 truncate">{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* BIN Lookup Tab */}
          <TabsContent value="binlookup" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">BIN / IIN Lookup</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the first 6-8 digits of a card number (BIN/IIN) to look up the issuing bank, country, card type, and more from a real database.
              </p>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter BIN (first 6-8 digits, e.g. 411111)"
                  value={binLookupInput}
                  onChange={(e) => setBinLookupInput(e.target.value.replace(/\D/g, "").substring(0, 8))}
                  className="font-mono"
                  maxLength={8}
                />
                <Button onClick={lookupBin} disabled={binLookupInput.length < 6 || binLookupLoading} className="gap-2 shrink-0">
                  {binLookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Lookup
                </Button>
              </div>

              {/* Quick BIN Examples */}
              <div className="flex flex-wrap gap-2">
                <p className="text-xs text-muted-foreground mr-1 mt-1">Try:</p>
                {["411111", "550000", "378282", "601111", "353011", "620000", "400005"].map(bin => (
                  <Button
                    key={bin}
                    size="sm"
                    variant="outline"
                    className="text-xs font-mono h-7"
                    onClick={() => { setBinLookupInput(bin); }}
                  >
                    {bin}
                  </Button>
                ))}
              </div>

              <AnimatePresence>
                {binLookupLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-3 py-8"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Looking up BIN database...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {binLookupResult && !binLookupLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Summary Card */}
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getBrandIcon(binLookupResult.scheme ? binLookupResult.scheme.charAt(0).toUpperCase() + binLookupResult.scheme.slice(1) : "Unknown")}</span>
                        <div>
                          <p className="font-semibold text-foreground text-lg capitalize">
                            {binLookupResult.scheme || "Unknown Scheme"}
                          </p>
                          {binLookupResult.brand && (
                            <p className="text-sm text-muted-foreground">{binLookupResult.brand}</p>
                          )}
                        </div>
                        {binLookupResult.country?.emoji && (
                          <span className="text-4xl ml-auto">{binLookupResult.country.emoji}</span>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {binLookupResult.bank?.name && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="w-3 h-3" /> Issuing Bank</p>
                          <p className="font-medium text-foreground text-sm mt-1">{binLookupResult.bank.name}</p>
                        </div>
                      )}
                      {binLookupResult.country?.name && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> Country</p>
                          <p className="font-medium text-foreground text-sm mt-1">{binLookupResult.country.emoji} {binLookupResult.country.name}</p>
                        </div>
                      )}
                      {binLookupResult.type && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Card Type</p>
                          <p className="font-medium text-foreground text-sm mt-1 capitalize">{binLookupResult.type}</p>
                        </div>
                      )}
                      {binLookupResult.scheme && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Scheme / Network</p>
                          <p className="font-medium text-foreground text-sm mt-1 capitalize">{binLookupResult.scheme}</p>
                        </div>
                      )}
                      {binLookupResult.brand && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Brand</p>
                          <p className="font-medium text-foreground text-sm mt-1">{binLookupResult.brand}</p>
                        </div>
                      )}
                      {binLookupResult.prepaid !== undefined && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Prepaid</p>
                          <p className={`font-medium text-sm mt-1 ${binLookupResult.prepaid ? "text-yellow-500" : "text-green-500"}`}>
                            {binLookupResult.prepaid ? "Yes (Prepaid)" : "No (Regular)"}
                          </p>
                        </div>
                      )}
                      {binLookupResult.country?.currency && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Currency</p>
                          <p className="font-medium text-foreground text-sm mt-1">{binLookupResult.country.currency}</p>
                        </div>
                      )}
                      {binLookupResult.country?.alpha2 && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Country Code</p>
                          <p className="font-medium text-foreground text-sm mt-1">{binLookupResult.country.alpha2}</p>
                        </div>
                      )}
                      {binLookupResult.bank?.url && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Bank Website</p>
                          <p className="font-medium text-primary text-sm mt-1 truncate">{binLookupResult.bank.url}</p>
                        </div>
                      )}
                      {binLookupResult.bank?.phone && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Bank Phone</p>
                          <p className="font-medium text-foreground text-sm mt-1">{binLookupResult.bank.phone}</p>
                        </div>
                      )}
                      {binLookupResult.number?.length && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Card Length</p>
                          <p className="font-medium text-foreground text-sm mt-1">{binLookupResult.number.length} digits</p>
                        </div>
                      )}
                      {binLookupResult.number?.luhn !== undefined && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Luhn Verified</p>
                          <p className={`font-medium text-sm mt-1 ${binLookupResult.number.luhn ? "text-green-500" : "text-red-500"}`}>
                            {binLookupResult.number.luhn ? "Yes ✓" : "No ✗"}
                          </p>
                        </div>
                      )}
                      {(binLookupResult.country?.latitude !== undefined && binLookupResult.country?.longitude !== undefined) && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
                          <p className="text-xs text-muted-foreground">Coordinates</p>
                          <p className="font-medium text-foreground text-sm mt-1 font-mono">
                            {binLookupResult.country.latitude}°, {binLookupResult.country.longitude}°
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Country Map */}
                    {binLookupResult.country?.latitude !== undefined && binLookupResult.country?.longitude !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-border/50 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-card/80 border-b border-border/30">
                          <Globe className="w-4 h-4 text-primary" />
                          <p className="text-sm font-medium text-foreground">
                            {binLookupResult.country.emoji} {binLookupResult.country.name} — Issuer Location
                          </p>
                        </div>
                        <iframe
                          title="Country Map"
                          width="100%"
                          height="280"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${binLookupResult.country.longitude! - 8},${binLookupResult.country.latitude! - 5},${binLookupResult.country.longitude! + 8},${binLookupResult.country.latitude! + 5}&layer=mapnik&marker=${binLookupResult.country.latitude},${binLookupResult.country.longitude}`}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {binLookupResult === null && !binLookupLoading && binLookupInput.length >= 6 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click "Lookup" to search the BIN database
                </p>
              )}
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
                Enter a partial card number (without the last digit) to calculate the correct check digit.
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
                        <span className="text-sm text-foreground">{h.count} cards</span>
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
            <Info className="w-4 h-4 text-primary" /> How It Works
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Luhn Algorithm:</p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5">
                <li>Double every second digit from right</li>
                <li>If result &gt; 9, subtract 9</li>
                <li>Sum all digits</li>
                <li>Valid if sum mod 10 = 0</li>
              </ol>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">BIN Lookup:</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>First 6 digits = BIN (Bank ID Number)</li>
                <li>Identifies issuing bank & country</li>
                <li>Shows card type, brand & prepaid status</li>
                <li>Uses real banking database (binlist.net)</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Visa", "Mastercard", "American Express", "Discover", "JCB", "UnionPay", "Diners Club", "Maestro"].map(brand => (
              <span key={brand} className="px-2 py-1 rounded-full text-xs text-white font-medium" style={{ backgroundColor: getBrandColor(brand) }}>
                {getBrandIcon(brand)} {brand}
              </span>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-yellow-500">Disclaimer:</strong> Educational & development testing only. Cannot check if a card is real, active, or funded.
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
}
