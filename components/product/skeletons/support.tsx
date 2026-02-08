"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconHeadset } from "@tabler/icons-react";
import { motion } from "motion/react";

export const SupportSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  return (
    <div className={cn(
      "h-60 md:h-80 perspective-distant scale-110 mask-radial-from-50% flex items-center justify-center",
      isRTL ? "rotate-z-10 rotate-y-15 rotate-x-25" : "rotate-z-10 -rotate-y-15 rotate-x-25"
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[80%] max-w-sm bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
          <IconHeadset className="size-5 text-primary" />
          <span className="text-sm font-bold">{t("supportAvailable")}</span>
        </div>
        <p className={cn("text-xs text-neutral-600 dark:text-neutral-400", isRTL && "text-right")}>
          {t("supportHelp")}
        </p>
      </motion.div>
    </div>
  );
};
