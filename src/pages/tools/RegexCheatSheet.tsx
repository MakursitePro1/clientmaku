import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Copy, Check, Search } from "lucide-react";

const sections = [
  {
    title: "Character Classes",
    items: [
      { pattern: ".", desc: "Any character except newline" },
      { pattern: "\\w", desc: "Word character [a-zA-Z0-9_]" },
      { pattern: "\\W", desc: "Non-word character" },
      { pattern: "\\d", desc: "Digit [0-9]" },
      { pattern: "\\D", desc: "Non-digit" },
      { pattern: "\\s", desc: "Whitespace (space, tab, newline)" },
      { pattern: "\\S", desc: "Non-whitespace" },
      { pattern: "[abc]", desc: "Any of a, b, or c" },
      { pattern: "[^abc]", desc: "Not a, b, or c" },
      { pattern: "[a-z]", desc: "Range: a to z" },
    ],
  },
  {
    title: "Anchors",
    items: [
      { pattern: "^", desc: "Start of string" },
      { pattern: "$", desc: "End of string" },
      { pattern: "\\b", desc: "Word boundary" },
      { pattern: "\\B", desc: "Non-word boundary" },
    ],
  },
  {
    title: "Quantifiers",
    items: [
      { pattern: "*", desc: "0 or more" },
      { pattern: "+", desc: "1 or more" },
      { pattern: "?", desc: "0 or 1 (optional)" },
      { pattern: "{n}", desc: "Exactly n times" },
      { pattern: "{n,}", desc: "n or more times" },
      { pattern: "{n,m}", desc: "Between n and m times" },
      { pattern: "*?", desc: "0 or more (lazy)" },
      { pattern: "+?", desc: "1 or more (lazy)" },
    ],
  },
  {
    title: "Groups & Lookaround",
    items: [
      { pattern: "(abc)", desc: "Capture group" },
      { pattern: "(?:abc)", desc: "Non-capture group" },
      { pattern: "(?=abc)", desc: "Positive lookahead" },
      { pattern: "(?!abc)", desc: "Negative lookahead" },
      { pattern: "(?<=abc)", desc: "Positive lookbehind" },
      { pattern: "(?<!abc)", desc: "Negative lookbehind" },
      { pattern: "a|b", desc: "Alternation (a or b)" },
    ],
  },
  {
    title: "Flags",
    items: [
      { pattern: "g", desc: "Global search" },
      { pattern: "i", desc: "Case-insensitive" },
      { pattern: "m", desc: "Multiline" },
      { pattern: "s", desc: "Dotall (. matches newline)" },
      { pattern: "u", desc: "Unicode" },
    ],
  },
  {
    title: "Common Patterns",
    items: [
      { pattern: "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", desc: "Email address" },
      { pattern: "^https?://[\\w.-]+(?:\\.[\\w]{2,})(?:/.*)?$", desc: "URL" },
      { pattern: "^\\+?[\\d\\s-]{7,15}$", desc: "Phone number" },
      { pattern: "^\\d{4}-\\d{2}-\\d{2}$", desc: "Date (YYYY-MM-DD)" },
      { pattern: "^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$", desc: "Hex color" },
      { pattern: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$", desc: "IPv4 address" },
    ],
  },
];

export default function RegexCheatSheet() {
  const [search, setSearch] = useState("");
  const [copiedPattern, setCopiedPattern] = useState("");

  const copy = (pattern: string) => {
    navigator.clipboard.writeText(pattern);
    setCopiedPattern(pattern);
    setTimeout(() => setCopiedPattern(""), 1500);
  };

  const filtered = sections
    .map((s) => ({
      ...s,
      items: s.items.filter(
        (i) =>
          i.pattern.toLowerCase().includes(search.toLowerCase()) ||
          i.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <ToolLayout title="Regex Cheat Sheet" description="Quick reference for regular expressions with common patterns">
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns..."
            className="pl-12 rounded-xl"
          />
        </div>

        {filtered.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-lg mb-3 gradient-text">{section.title}</h3>
            <div className="grid gap-2">
              {section.items.map((item) => (
                <div
                  key={item.pattern + item.desc}
                  className="flex items-center justify-between bg-accent/30 rounded-xl border border-border/50 p-3 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <code className="bg-background px-3 py-1.5 rounded-lg text-sm font-mono text-primary font-semibold shrink-0">
                      {item.pattern}
                    </code>
                    <span className="text-sm text-muted-foreground truncate">{item.desc}</span>
                  </div>
                  <button
                    onClick={() => copy(item.pattern)}
                    className="ml-2 p-2 rounded-lg hover:bg-accent transition-colors shrink-0"
                  >
                    {copiedPattern === item.pattern ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
