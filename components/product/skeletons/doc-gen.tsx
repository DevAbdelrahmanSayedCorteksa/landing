"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconFileSpreadsheet, IconFileText } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export const DocumentsGenerationSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  return (
    <div className={cn(
      "perspective-distant scale-110 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-10 rotate-y-15 rotate-x-25" : "rotate-z-10 -rotate-y-15 rotate-x-25"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("absolute bottom-12 max-w-[70%] mx-auto z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl", isRTL ? "right-8 left-8" : "left-8 right-8")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center justify-between mb-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <IconFileSpreadsheet className="size-5 text-primary" />
            <p className="text-sm font-bold">{t("docGenPriceOffer")}</p>
          </div>
          <Button size="sm" className="text-xs h-7 px-3">
            {t("docGenGenerate")}
          </Button>
        </div>
        <div className="space-y-2">
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{t("docGenClient")}</span>
          </div>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{t("docGenItems")}</span>
          </div>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{t("docGenTotal")}</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn("absolute bottom-44 max-w-[60%] z-20 bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg", isRTL ? "right-12" : "left-12")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <IconFileText className="size-4 text-blue-500" />
          <p className="text-xs font-semibold">{t("docGenContract")}</p>
        </div>
      </motion.div>
    </div>
  );
};
