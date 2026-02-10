"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconUsers, IconCircleCheck, IconMessage, IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";

export const CollaborationSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  return (
    <div className="relative h-full w-full p-4 md:p-6 flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden">
        {/* Header with project name + avatars */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="size-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <IconUsers className="size-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{t("collabProjectName")}</span>
          <div className={cn("flex items-center", isRTL ? "mr-auto -space-x-reverse -space-x-1.5" : "ml-auto -space-x-1.5")}>
            <div className="size-5 rounded-full bg-blue-500 ring-2 ring-white dark:ring-neutral-900" />
            <div className="size-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
            <div className="size-5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-neutral-900" />
            <span className="text-[9px] text-neutral-400 pl-1.5">{t("collabMembers")}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2.5">
          {/* Task card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-800/50"
          >
            <div className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
              <IconCircleCheck className="size-4 text-primary mt-0.5 shrink-0" />
              <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">{t("collabTaskAssigned")}</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{t("collabTaskDetail")}</p>
                <div className={cn("flex items-center gap-1.5 mt-1.5", isRTL && "flex-row-reverse")}>
                  <span className="text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full font-medium">
                    {t("collabHighPriority")}
                  </span>
                  <div className={cn("flex items-center gap-1 text-[9px] text-neutral-400", isRTL && "flex-row-reverse")}>
                    <IconArrowRight className="size-2.5" />
                    <span>{t("collabStatusChange")}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Discussion thread */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-1.5"
          >
            {/* Comment 1 */}
            <div className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
              <div className="size-5 rounded-full bg-blue-500 shrink-0 mt-0.5" />
              <div className={cn("rounded-xl bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5", isRTL && "text-right")}>
                <p className="text-[10px] text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold">Sarah: </span>{t("collabComment1")}
                </p>
              </div>
            </div>
            {/* Comment 2 */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              viewport={{ once: true }}
              className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}
            >
              <div className="size-5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
              <div className={cn("rounded-xl bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5", isRTL && "text-right")}>
                <p className="text-[10px] text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold">Ahmed: </span>{t("collabComment2")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Activity entry */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            viewport={{ once: true }}
            className={cn("flex items-center gap-2 px-2 py-1.5 text-[9px] text-neutral-400", isRTL && "flex-row-reverse")}
          >
            <IconCircleCheck className="size-3 text-green-500" />
            <span>{t("collabCompleted")}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
