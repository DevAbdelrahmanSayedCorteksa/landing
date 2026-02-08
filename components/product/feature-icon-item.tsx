"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FeatureIconItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isRTL?: boolean;
}

export function FeatureIconItem({ icon, title, description, isRTL }: FeatureIconItemProps) {
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
          {title}
        </h3>
      </div>
      <p className={cn("text-neutral-500 text-sm md:text-base", isRTL && "text-right")}>
        {description}
      </p>
    </div>
  );
}
