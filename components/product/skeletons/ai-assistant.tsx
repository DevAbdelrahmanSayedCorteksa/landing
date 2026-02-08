"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export const AssistantSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-10 -rotate-y-15 rotate-x-20" : "rotate-z-10 rotate-y-15 rotate-x-20"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("absolute bottom-18 max-w-[85%] z-30 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-primary/50 dark:border-primary/30 shadow-2xl", isRTL ? "right-14 left-8" : "left-14 right-8")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-start gap-2 mb-2", isRTL && "flex-row-reverse")}>
          <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <IconSparkles className="size-3.5 text-primary" />
          </div>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <p className="text-xs font-bold mb-1">{t("aiSuggestion")}</p>
            <p className="text-[10px] text-neutral-600 dark:text-neutral-400">
              {t("aiFocusTask")}
            </p>
          </div>
        </div>
        <div className={cn("flex gap-2", isRTL && "justify-end")}>
          <Button size="sm" className="text-[10px] h-6 px-2">
            {t("aiApply")}
          </Button>
          <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">
            {t("aiDismiss")}
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn("absolute bottom-36 max-w-[75%] z-20 bg-white dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg", isRTL ? "right-18 left-12" : "left-18 right-12")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <div className="size-1.5 rounded-full bg-green-500"></div>
          <p className="text-[10px] font-semibold">{t("aiAutoOrganized")}</p>
        </div>
      </motion.div>
    </div>
  );
};
