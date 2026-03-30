import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { FileCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { tools as staticTools, categories as staticCategories, type Tool, type ToolCategory } from "@/data/tools";

type ToolCategoryMeta = (typeof staticCategories)[number];

interface ToolCatalogContextValue {
  tools: Tool[];
  customTools: Tool[];
  categories: ToolCategoryMeta[];
  totalTools: number;
  totalCategories: number;
  getCategoryCount: (categoryId: ToolCategory) => number;
  loading: boolean;
}

const ToolCatalogContext = createContext<ToolCatalogContextValue>({
  tools: staticTools,
  customTools: [],
  categories: staticCategories.filter((category) => category.id === "all"),
  totalTools: staticTools.length,
  totalCategories: 0,
  getCategoryCount: () => 0,
  loading: true,
});

export function ToolCatalogProvider({ children }: { children: ReactNode }) {
  const [customTools, setCustomTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("custom_tools")
      .select("*")
      .eq("is_enabled", true)
      .is("deleted_at", null)
      .then(({ data, error }) => {
        if (!mounted) return;

        if (!error && data) {
          setCustomTools(
            data.map((tool: any) => ({
              id: `custom-${tool.slug}`,
              name: tool.name,
              description: tool.description || "Custom tool",
              icon: FileCode,
              category: (tool.category || "utility") as ToolCategory,
              path: `/tools/custom/${tool.slug}`,
              color: tool.color || "hsl(263, 85%, 58%)",
            }))
          );
        }

        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const tools = useMemo(() => {
    const seen = new Set<string>();

    return [...staticTools, ...customTools].filter((tool) => {
      if (seen.has(tool.id)) return false;
      seen.add(tool.id);
      return true;
    });
  }, [customTools]);

  const categoryCounts = useMemo(() => {
    return tools.reduce<Record<string, number>>((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {});
  }, [tools]);

  const categories = useMemo(() => {
    return staticCategories.filter(
      (category) => category.id === "all" || (categoryCounts[category.id] ?? 0) > 0
    );
  }, [categoryCounts]);

  const totalTools = tools.length;
  const totalCategories = categories.filter((category) => category.id !== "all").length;

  const value = useMemo<ToolCatalogContextValue>(() => ({
    tools,
    customTools,
    categories,
    totalTools,
    totalCategories,
    getCategoryCount: (categoryId: ToolCategory) =>
      categoryId === "all" ? totalTools : categoryCounts[categoryId] ?? 0,
    loading,
  }), [tools, customTools, categories, totalTools, totalCategories, categoryCounts, loading]);

  return <ToolCatalogContext.Provider value={value}>{children}</ToolCatalogContext.Provider>;
}

export function useToolCatalog() {
  return useContext(ToolCatalogContext);
}
