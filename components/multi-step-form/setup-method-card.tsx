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
  badge?: string;
}

export function SetupMethodCard({
  icon: Icon,
  title,
  description,
  isSelected,
  onSelect,
  badge,
}: SetupMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group w-full flex items-center gap-4 p-4 rounded-xl text-start transition-all duration-200",
        "border",
        isSelected
          ? "border-primary/40 bg-primary/5 dark:bg-primary/[0.08] shadow-[0_0_20px_-5px] shadow-primary/15"
          : "border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/[0.12] hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
      )}
    >
      {/* Radio indicator */}
      <div
        className={cn(
          "size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
          isSelected
            ? "border-primary bg-primary"
            : "border-neutral-300 dark:border-neutral-600"
        )}
      >
        {isSelected && (
          <div className="size-2 rounded-full bg-white" />
        )}
      </div>

      {/* Icon */}
      <div
        className={cn(
          "size-10 shrink-0 rounded-lg flex items-center justify-center transition-colors",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400"
        )}
      >
        <Icon className="size-5" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={cn(
            "font-medium text-sm",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h4>
          {badge && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}
