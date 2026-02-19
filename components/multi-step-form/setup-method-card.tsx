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
        "text-start w-full rounded-xl p-5 transition-all duration-200 cursor-pointer",
        "bg-neutral-50 dark:bg-white/[0.04]",
        "border border-neutral-100 dark:border-white/[0.06]",
        isSelected
          ? "border-primary/40 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-[0_0_20px_-5px] shadow-primary/20"
          : "hover:border-neutral-300 dark:hover:border-neutral-700"
      )}
    >
      {/* Top row: icon + badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "size-11 rounded-xl flex items-center justify-center transition-colors duration-200",
            isSelected
              ? "bg-primary/15 text-primary"
              : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400"
          )}
        >
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
        {badge && (
          <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium border-primary/30 text-primary bg-primary/10">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
        {title}
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
        {description}
      </p>
    </button>
  );
}
