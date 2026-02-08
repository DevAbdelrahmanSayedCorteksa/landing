"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const CustomFieldsSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  const fields = [
    { type: t("fieldText"), color: "bg-blue-500", width: "w-2/3" },
    { type: t("fieldDropdown"), color: "bg-purple-500", width: "w-1/2" },
    { type: t("fieldDate"), color: "bg-green-500", width: "w-3/5" },
    { type: t("fieldNumber"), color: "bg-orange-500", width: "w-2/5" },
  ];

  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-5 rotate-y-10 rotate-x-20" : "rotate-z-5 -rotate-y-10 rotate-x-20"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2 mb-4", isRTL && "flex-row-reverse")}>
          <div className="size-2 rounded-full bg-primary" />
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
            {t("fieldBuilder")}
          </span>
        </div>
        <div className="space-y-2.5">
          {fields.map((field, idx) => (
            <motion.div
              key={field.type}
              initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.12 }}
              className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
            >
              <div className={cn("size-5 rounded flex items-center justify-center shrink-0", field.color, "bg-opacity-20")}>
                <div className={cn("size-2 rounded-sm", field.color)} />
              </div>
              <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 w-14 shrink-0">
                {field.type}
              </span>
              <div className={cn("h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700", field.width)} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
