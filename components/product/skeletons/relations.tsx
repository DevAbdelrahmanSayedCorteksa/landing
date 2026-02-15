"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { IconUsers, IconFolder, IconChecklist } from "@tabler/icons-react";

export const RelationsSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  const projects = [t("relProject1"), t("relProject2"), t("relProject3")];

  return (
    <div
      className="h-full w-full flex items-center justify-center p-4 md:p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-center gap-0 w-full max-w-[260px]">
        {/* Client card (top) */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 p-3"
        >
          <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconUsers className="size-4 text-primary" />
            </div>
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                {t("relClient")}
              </p>
              <p className="text-[9px] text-neutral-400 mt-0.5">
                {t("relClientCount")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Arrow connector */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-px h-5 bg-primary/30" />
          <div className="size-1.5 rounded-full bg-primary/50" />
        </motion.div>

        {/* Projects group */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 p-3"
        >
          <div className={cn("flex items-center gap-2 mb-2.5", isRTL && "flex-row-reverse")}>
            <IconFolder className="size-3.5 text-primary/70" />
            <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
              {t("relProjects")}
            </span>
            <span className="text-[9px] text-neutral-400 ml-auto">
              {t("relProjectsCount")}
            </span>
          </div>
          <div className="space-y-1.5">
            {projects.map((project, idx) => (
              <motion.div
                key={project}
                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.5 + idx * 0.1 }}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50",
                  isRTL && "flex-row-reverse"
                )}
              >
                <div className="size-1.5 rounded-full bg-primary/50 shrink-0" />
                <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
                  {project}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Arrow connector */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.25, delay: 0.7 }}
          className="flex flex-col items-center"
        >
          <div className="w-px h-5 bg-primary/30" />
          <div className="size-1.5 rounded-full bg-primary/50" />
        </motion.div>

        {/* Tasks card (bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.8 }}
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 p-3"
        >
          <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconChecklist className="size-4 text-primary" />
            </div>
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                {t("relTasks")}
              </p>
              <p className="text-[9px] text-neutral-400 mt-0.5">
                {t("relTasksCount")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
