"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pb-1 scrollbar-none">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected === category
              ? "bg-foreground text-background"
              : "bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
