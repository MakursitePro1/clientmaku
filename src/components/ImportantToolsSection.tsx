import { Link } from "react-router-dom";
import { Star, ArrowRight, Shield } from "lucide-react";
import { tools } from "@/data/tools";
import { FavoriteButton } from "@/components/FavoriteButton";

const importantToolIds = [
  "internet-speed-tester", "pdf-merger", "image-to-base64", "hash-generator",
  "css-minifier", "html-to-pdf", "regex-tester", "api-tester",
  "text-encryption", "password-strength-checker"
];

const importantTools = importantToolIds.map(id => tools.find(t => t.id === id)).filter(Boolean) as typeof tools;

// Split into two rows
const row1 = importantTools.slice(0, 5);
const row2 = importantTools.slice(5);

export function ImportantToolsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-5">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-500">Must Have</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Most <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">Important</span> Tools
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Essential tools every developer and creator needs
          </p>
        </div>

        {/* Marquee Row 1 - scrolls left */}
        <div className="relative mb-4 overflow-hidden mask-fade-x">
          <div className="flex gap-4 animate-marquee-left">
            {[...row1, ...row1, ...row1, ...row1].map((tool, i) => (
              <ToolCard key={`r1-${i}`} tool={tool} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 - scrolls right */}
        <div className="relative overflow-hidden mask-fade-x">
          <div className="flex gap-4 animate-marquee-right">
            {[...row2, ...row2, ...row2, ...row2].map((tool, i) => (
              <ToolCard key={`r2-${i}`} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  return (
    <Link
      to={tool.path}
      className="group relative shrink-0 w-[280px] block rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-5 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
      />
      <div className="absolute inset-0 animate-[shimmer_3.5s_ease-in-out_infinite]"
        style={{ background: `linear-gradient(105deg, transparent 35%, ${tool.color.replace(')', ' / 0.07)')}, transparent 65%)` }}
      />

      <div className="relative z-10 flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: tool.color.replace(')', ' / 0.12)'), color: tool.color }}
        >
          <tool.icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-sm group-hover:text-primary transition-colors truncate">{tool.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
        </div>
        <FavoriteButton toolId={tool.id} />
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-end">
        <span className="text-xs font-semibold text-muted-foreground/50 group-hover:text-primary transition-colors flex items-center gap-1">
          Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
