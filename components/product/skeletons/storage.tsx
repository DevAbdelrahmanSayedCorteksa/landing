"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconFolders } from "@tabler/icons-react";
import { motion } from "motion/react";

export const StorageSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  const folders = [
    { name: t("folderContracts"), count: 24, color: "bg-blue-500" },
    { name: t("folderInvoices"), count: 156, color: "bg-green-500" },
    { name: t("folderReports"), count: 42, color: "bg-purple-500" },
  ];

  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-5 -rotate-y-10 rotate-x-20" : "rotate-z-5 rotate-y-10 rotate-x-20"
    )}>
      <div className="absolute inset-x-8 top-8 bottom-12 flex flex-col gap-3 justify-center max-w-[70%] mx-auto">
        {folders.map((folder, idx) => (
          <motion.div
            key={folder.name}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.15 }}
            className={cn("bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg flex items-center gap-3", isRTL && "flex-row-reverse")}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className={cn("size-8 rounded-lg flex items-center justify-center", folder.color, "bg-opacity-20")}>
              <IconFolders className={cn("size-4", folder.color.replace("bg-", "text-"))} />
            </div>
            <div className={cn("flex-1", isRTL && "text-right")}>
              <p className="text-sm font-bold">{folder.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{folder.count} {t("files")}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
