"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconFileText, IconFileSpreadsheet } from "@tabler/icons-react";
import { motion } from "motion/react";

export const DocumentsSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  return (
    <div className={cn(
      "perspective-distant scale-110 h-full w-full mask-radial-from-50% flex items-center justify-center",
      isRTL ? "rotate-z-10 -rotate-y-15 rotate-x-25" : "rotate-z-10 rotate-y-15 rotate-x-25"
    )}>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl max-w-sm"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className={cn("flex items-center gap-3 mb-3", isRTL && "flex-row-reverse")}>
            <IconFileText className="size-5 text-primary" />
            <p className="text-sm font-bold">{t("docContractTemplate")}</p>
            <span className={cn("text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full", isRTL ? "mr-auto" : "ml-auto")}>
              {t("docReady")}
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn("absolute -bottom-8 z-20 bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl", isRTL ? "-right-4" : "-left-4")}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <IconFileSpreadsheet className="size-5 text-blue-500" />
            <p className="text-sm font-bold">{t("docInvoice")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
