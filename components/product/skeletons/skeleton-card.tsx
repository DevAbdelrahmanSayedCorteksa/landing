"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const SkeletonCard = ({
  icon,
  title,
  description,
  tags,
  className,
  isRTL,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  className?: string;
  isRTL: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={cn("flex gap-3 items-center mb-2", isRTL && "flex-row-reverse")}>
        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <p className="text-xs md:text-sm font-bold text-neutral-800 dark:text-neutral-200">
          {title}
        </p>
      </div>
      <p className={cn("text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mb-3", isRTL && "text-right")}>
        {description}
      </p>
      <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export const CardContent = ({ children, isRTL }: { children: React.ReactNode; isRTL?: boolean }) => {
  return <div className={cn("p-4 md:p-8", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>{children}</div>;
};

export const CardDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">
      {children}
    </p>
  );
};

export const CardSkeleton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative h-80 sm:h-60 md:h-80 flex flex-col overflow-hidden perspective-distant",
        className
      )}
    >
      {children}
    </div>
  );
};
