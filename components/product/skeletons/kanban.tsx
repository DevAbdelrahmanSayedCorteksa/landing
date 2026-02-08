"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const KanbanSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  const columns = [
    {
      title: t("kanbanTodo"),
      color: "bg-blue-500",
      cards: [
        { w: "w-full", h: "h-8" },
        { w: "w-3/4", h: "h-6" },
      ],
    },
    {
      title: t("kanbanInProgress"),
      color: "bg-yellow-500",
      cards: [
        { w: "w-full", h: "h-6" },
        { w: "w-5/6", h: "h-8" },
        { w: "w-2/3", h: "h-6" },
      ],
    },
    {
      title: t("kanbanDone"),
      color: "bg-green-500",
      cards: [
        { w: "w-full", h: "h-6" },
      ],
    },
  ];

  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-10 -rotate-y-15 rotate-x-25" : "rotate-z-10 rotate-y-15 rotate-x-25"
    )}>
      <div className="absolute inset-6 flex gap-2 justify-center items-start pt-4">
        {columns.map((col, colIdx) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: colIdx * 0.15 }}
            className="flex-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg p-2 max-w-[120px]"
          >
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <div className={cn("size-2 rounded-full", col.color)} />
              <span className="text-[9px] font-bold text-neutral-700 dark:text-neutral-300 truncate">
                {col.title}
              </span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map((card, cardIdx) => (
                <motion.div
                  key={cardIdx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: colIdx * 0.15 + cardIdx * 0.1 }}
                  className={cn(
                    "rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700",
                    card.h
                  )}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
