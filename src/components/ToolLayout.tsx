import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { SEOHead } from "./SEOHead";
import { FavoriteButton } from "./FavoriteButton";
import { tools } from "@/data/tools";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const location = useLocation();

  const currentTool = useMemo(() => tools.find(t => t.path === location.pathname), [location.pathname]);

  const relatedTools = useMemo(() => {
    if (!currentTool) return [];
    return tools
      .filter(t => t.category === currentTool.category && t.id !== currentTool.id)
      .slice(0, 4);
  }, [currentTool]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} path={location.pathname} type="website" />
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Tools
            </Button>
          </Link>
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {currentTool && (
              <FavoriteButton
                toolId={currentTool.id}
                className="mt-1 p-2.5 rounded-xl border border-border/50 bg-card hover:bg-accent"
              />
            )}
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 card-shadow">
            {children}
          </div>

          {relatedTools.length > 0 && (
            <div className="mt-14">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full gradient-bg" />
                Similar Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedTools.map(tool => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className={cn(
                      "group relative block rounded-2xl p-5 border border-border/40 transition-all duration-300 overflow-hidden",
                      "bg-card hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
                    )}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                    />
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: tool.color.replace(')', ' / 0.1)'), color: tool.color }}
                      >
                        <tool.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors truncate">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                      </div>
                      <FavoriteButton toolId={tool.id} />
                    </div>
                    <div className="flex items-center mt-3 pt-3 border-t border-border/30 group-hover:border-primary/20 transition-colors">
                      <span className="text-xs font-semibold text-primary/70 group-hover:text-primary flex items-center transition-colors">
                        Open <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
