"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconUsers, IconCircleCheck } from "@tabler/icons-react";
import { motion } from "motion/react";

export const CollaborationSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-5 rotate-y-10 rotate-x-20" : "rotate-z-5 -rotate-y-10 rotate-x-20"
    )}>
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 left-6 right-6 z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <IconUsers className="size-4 text-primary" />
          </div>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <p className="text-sm font-bold mb-1">{t("collabTaskAssigned")}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("collabTaskDetail")}
            </p>
            <div className={cn("flex gap-2 mt-2", isRTL && "justify-end")}>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                {t("collabHighPriority")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute bottom-32 left-10 right-10 z-20 bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <IconCircleCheck className="size-4 text-green-500" />
          <p className="text-xs font-semibold">{t("collabCompleted")}</p>
        </div>
      </motion.div>
    </div>
  );
};
