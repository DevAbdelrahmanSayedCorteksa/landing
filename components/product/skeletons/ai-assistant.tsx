"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconSparkles, IconSend, IconCircleFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export const AssistantSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  const tasks = [
    { label: t("aiTask1"), due: t("aiTask1Due"), color: "bg-red-500" },
    { label: t("aiTask2"), due: t("aiTask2Due"), color: "bg-amber-500" },
    { label: t("aiTask3"), due: t("aiTask3Due"), color: "bg-green-500" },
  ];

  return (
    <div className="relative h-full w-full p-4 md:p-6 flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-neutral-200 dark:border-neutral-700">
          <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <IconSparkles className="size-3.5 text-primary" />
          </div>
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{t("aiCardTitle")}</span>
          <div className={cn("flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400", isRTL ? "mr-auto" : "ml-auto")}>
            <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            Online
          </div>
        </div>

        {/* Chat body */}
        <div className="p-4 space-y-3 min-h-[220px] md:min-h-[260px]">
          {/* User message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className={cn("flex", isRTL ? "justify-start" : "justify-end")}
          >
            <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2">
              <p className="text-[11px] text-white leading-relaxed">{t("aiUserPrompt")}</p>
            </div>
          </motion.div>

          {/* AI response */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
            className={cn("flex", isRTL ? "justify-end" : "justify-start")}
          >
            <div className="max-w-[90%] space-y-2">
              <div className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <IconSparkles className="size-3 text-primary" />
                </div>
                <div className="rounded-2xl rounded-tl-md bg-neutral-100 dark:bg-neutral-800 px-3.5 py-2 space-y-2">
                  <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t("aiResponseIntro")}
                  </p>

                  {/* Task list */}
                  <div className="space-y-1.5">
                    {tasks.map((task, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + idx * 0.15 }}
                        viewport={{ once: true }}
                        className={cn(
                          "flex items-center gap-2 rounded-lg bg-white dark:bg-neutral-900 px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <IconCircleFilled className={cn("size-2 shrink-0", task.color.replace("bg-", "text-"))} />
                        <span className="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 flex-1">{task.label}</span>
                        <span className="text-[9px] text-neutral-400 whitespace-nowrap">{task.due}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                    viewport={{ once: true }}
                    className={cn("flex gap-1.5 pt-1", isRTL && "justify-end")}
                  >
                    <Button size="sm" className="text-[10px] h-6 px-2.5 rounded-full">
                      {t("aiApply")}
                    </Button>
                    <Button size="sm" variant="outline" className="text-[10px] h-6 px-2.5 rounded-full">
                      {t("aiModify")}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Input bar */}
        <div className="px-4 pb-3">
          <div className={cn(
            "flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2",
            isRTL && "flex-row-reverse"
          )}>
            <span className="text-[11px] text-neutral-400 flex-1">{t("aiAskPlaceholder")}</span>
            <div className="size-6 rounded-lg bg-primary flex items-center justify-center">
              <IconSend className={cn("size-3 text-white", isRTL && "rotate-180")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
