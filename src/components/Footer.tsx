import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <>
      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto gradient-bg rounded-3xl p-12 text-center text-primary-foreground">
          <span className="text-sm font-semibold uppercase tracking-wider opacity-90">Start Now</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-4">
            Start Using Free Tools Today
          </h2>
          <p className="opacity-90 max-w-xl mx-auto mb-8">
            29+ free tools ready to use instantly. No signup, no payment — just pure productivity.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-xl px-8 font-semibold"
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore All Tools
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">WebTools</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WebTools. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
