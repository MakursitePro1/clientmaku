import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WireframeGenerator() {
  const [layout, setLayout] = useState("landing");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");

  const layouts: Record<string, { name: string; sections: string[] }> = {
    landing: { name: "Landing Page", sections: ["Navigation Bar", "Hero Section", "Features Grid (3 cols)", "Testimonials", "CTA Section", "Footer"] },
    blog: { name: "Blog Page", sections: ["Navigation Bar", "Featured Post", "Post Grid (2 cols)", "Sidebar", "Newsletter", "Footer"] },
    dashboard: { name: "Dashboard", sections: ["Top Bar", "Side Navigation", "Stats Cards (4)", "Chart Area", "Data Table", "Footer"] },
    ecommerce: { name: "E-Commerce", sections: ["Navigation + Search", "Category Banner", "Product Grid (4 cols)", "Featured Products", "Reviews", "Footer"] },
  };

  const selected = layouts[layout];

  return (
    <ToolLayout title="Wireframe Generator" description="Create quick wireframe mockups for web pages">
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex gap-3 flex-wrap">
          <Select value={layout} onValueChange={setLayout}>
            <SelectTrigger className="w-48 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(layouts).map(([k, v]) => <SelectItem key={k} value={k}>{v.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-16 h-10 rounded-xl cursor-pointer p-1" />
        </div>
        <div className="border-2 border-border rounded-2xl overflow-hidden bg-background">
          <div className="p-2 text-xs text-center border-b border-border bg-accent/30 font-medium">{selected.name} Wireframe</div>
          <div className="p-4 space-y-3">
            {selected.sections.map((section, i) => (
              <div key={i} className="rounded-xl border-2 border-dashed p-4 text-center text-sm font-medium" style={{ borderColor: primaryColor + "40", backgroundColor: primaryColor + "08" }}>
                <div className="text-muted-foreground">{section}</div>
                <div className="mt-2 flex gap-2 justify-center">
                  {Array.from({ length: section.includes("cols") ? parseInt(section.match(/\d/)?.[0] || "2") : section.includes("Cards") ? 4 : 1 }, (_, j) => (
                    <div key={j} className="h-8 rounded-lg flex-1 max-w-[120px]" style={{ backgroundColor: primaryColor + "20" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => { const el = document.querySelector(".border-2.border-border.rounded-2xl"); if (el) navigator.clipboard.writeText(`Wireframe: ${selected.name}\nSections: ${selected.sections.join(" → ")}`); }} className="gradient-bg text-primary-foreground rounded-xl">Copy Structure</Button>
      </div>
    </ToolLayout>
  );
}
