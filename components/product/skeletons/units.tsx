"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconDatabase, IconTool, IconLayoutKanban } from "@tabler/icons-react";
import { SkeletonCard } from "./skeleton-card";

export const UnitsSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  return (
    <div className={cn(
      "perspective-distant scale-[1.2] h-full w-full -translate-y-10 mask-radial-from-50% mask-r-from-50%",
      isRTL ? "rotate-z-15 rotate-y-20 rotate-x-30" : "rotate-z-15 -rotate-y-20 rotate-x-30"
    )}>
      <SkeletonCard
        className={cn("absolute bottom-4 max-w-[90%] z-30", isRTL ? "right-20" : "left-20")}
        icon={<IconDatabase className="size-4 text-primary" />}
        title={t("unitClientHub")}
        description={t("unitClientHubDesc")}
        tags={[t("tagCustomFields"), t("tagRelations"), t("tagKanban")]}
        isRTL={isRTL}
      />
      <SkeletonCard
        className={cn("absolute bottom-12 z-20", isRTL ? "right-16" : "left-16")}
        icon={<IconTool className="size-4 text-primary" />}
        title={t("unitProjectWorkflow")}
        description={t("unitProjectWorkflowDesc")}
        tags={[t("tagAutomation"), t("tagTemplates")]}
        isRTL={isRTL}
      />
      <SkeletonCard
        className={cn("absolute bottom-24 max-w-[80%] z-10", isRTL ? "right-12" : "left-12")}
        icon={<IconLayoutKanban className="size-4 text-primary" />}
        title={t("unitKanbanView")}
        description={t("unitKanbanViewDesc")}
        tags={[t("tagBoardView"), t("tagProgress")]}
        isRTL={isRTL}
      />
    </div>
  );
};
