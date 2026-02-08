"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const DashboardSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  const bars = [40, 65, 45, 80, 55, 70, 50];

  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-5 -rotate-y-10 rotate-x-20" : "rotate-z-5 rotate-y-10 rotate-x-20"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center justify-between mb-3", isRTL && "flex-row-reverse")}>
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
            {t("dashboardOverview")}
          </span>
          <span className="text-[10px] text-neutral-400">{t("dashboardThisWeek")}</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { value: "156", label: t("dashboardTasks"), color: "text-primary" },
            { value: "89%", label: t("dashboardComplete"), color: "text-green-500" },
            { value: "12", label: t("dashboardActive"), color: "text-blue-500" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
              className="text-center p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800"
            >
              <p className={cn("text-sm font-bold", stat.color)}>{stat.value}</p>
              <p className="text-[8px] text-neutral-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex items-end gap-1 h-16 px-1">
          {bars.map((height, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 rounded-sm bg-primary/60"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
