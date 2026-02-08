"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { IconCircleCheck } from "@tabler/icons-react";
import { motion } from "motion/react";

export const LanguageSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const languages = ["English", "العربية", "Español"];
  return (
    <div className="h-60 md:h-80 flex items-center justify-center">
      <div className="space-y-3 w-full max-w-xs">
        {languages.map((lang, idx) => (
          <motion.div
            key={lang}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.15 }}
            className={cn("bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between", isRTL && "flex-row-reverse")}
          >
            <span className="text-sm font-medium">{lang}</span>
            <IconCircleCheck className="size-4 text-primary" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
