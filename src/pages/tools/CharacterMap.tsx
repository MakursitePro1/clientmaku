import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Search, Copy, Check } from "lucide-react";

const charSets: { name: string; range: [number, number] }[] = [
  { name: "Latin Letters", range: [65, 122] },
  { name: "Numbers & Math", range: [48, 57] },
  { name: "Arrows", range: [8592, 8703] },
  { name: "Currency", range: [8352, 8399] },
  { name: "Box Drawing", range: [9472, 9599] },
  { name: "Geometric Shapes", range: [9632, 9727] },
  { name: "Miscellaneous Symbols", range: [9728, 9983] },
  { name: "Dingbats", range: [9984, 10175] },
  { name: "Math Operators", range: [8704, 8959] },
  { name: "Greek Letters", range: [913, 969] },
];

export default function CharacterMap() {
  const [search, setSearch] = useState("");
  const [activeSet, setActiveSet] = useState(charSets[0].name);
  const [copied, setCopied] = useState("");

  const chars = useMemo(() => {
    const set = charSets.find((s) => s.name === activeSet);
    if (!set) return [];
    const arr: { char: string; code: number }[] = [];
    for (let i = set.range[0]; i <= set.range[1]; i++) {
      const char = String.fromCodePoint(i);
      arr.push({ char, code: i });
    }
    if (search) {
      return arr.filter(
        (c) =>
          c.char.includes(search) ||
          c.code.toString().includes(search) ||
          `U+${c.code.toString(16).toUpperCase()}`.includes(search.toUpperCase())
      );
    }
    return arr;
  }, [activeSet, search]);

  const copy = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopied(char);
    setTimeout(() => setCopied(""), 1200);
  };

  return (
    <ToolLayout title="Character Map" description="Browse and copy Unicode characters, symbols, and special characters">
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search characters..." className="pl-12 rounded-xl" />
        </div>

        <div className="flex flex-wrap gap-2">
          {charSets.map((s) => (
            <button
              key={s.name}
              onClick={() => setActiveSet(s.name)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeSet === s.name
                  ? "gradient-bg text-primary-foreground glow-shadow"
                  : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {chars.map((c) => (
            <button
              key={c.code}
              onClick={() => copy(c.char)}
              className="relative group aspect-square flex flex-col items-center justify-center rounded-xl border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all text-lg"
              title={`U+${c.code.toString(16).toUpperCase().padStart(4, "0")} (${c.code})`}
            >
              {copied === c.char ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <>
                  <span className="text-xl">{c.char}</span>
                  <span className="absolute bottom-0.5 text-[8px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {c.code.toString(16).toUpperCase()}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>

        {chars.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No characters found</div>
        )}

        <p className="text-sm text-muted-foreground text-center">Click any character to copy it to clipboard</p>
      </div>
    </ToolLayout>
  );
}
