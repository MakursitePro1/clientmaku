import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <>
      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto gradient-bg rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-90 mb-4 bg-primary-foreground/10 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" /> Start Now
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4 tracking-tight">
              Start Using Free Tools Today
            </h2>
            <p className="opacity-90 max-w-xl mx-auto mb-8 text-lg">
              33+ free tools ready to use instantly. No signup, no payment — just pure productivity.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-2xl px-10 py-6 font-bold text-base hover:scale-105 transition-transform"
              onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore All Tools
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text">Cyber</span> Venom
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cyber Venom. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
