"use client";

import { cn } from "@/lib/utils";
import { WorkspaceSetupMethod } from "@/lib/types/workspace";
import type { Icon } from "@tabler/icons-react";

interface SetupMethodCardProps {
  method: WorkspaceSetupMethod;
  icon: Icon;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function SetupMethodCard({
  icon: Icon,
  title,
  description,
  isSelected,
  onSelect,
}: SetupMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "p-4 rounded-lg text-start transition-all duration-200",
        "bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800",
        "border-2 border-transparent",
        isSelected && "border-primary shadow-[0_4px_20px_rgba(124,58,237,0.15)]"
      )}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className={cn(
            "size-12 rounded-xl flex items-center justify-center transition-colors",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-6" strokeWidth={2} />
        </div>
        <div>
          <h4 className={cn(
            "font-semibold text-sm mb-0.5",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
