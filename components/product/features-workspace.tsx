"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconAdjustments,
  IconChartBar,
  IconFileText,
} from "@tabler/icons-react";
import { SectionWrapper } from "./section-wrapper";
import { CardContent, CardDescription, CardSkeleton } from "./skeletons";
import { UnitsSkeletonVisual } from "./skeletons/units";
import { KanbanSkeletonVisual } from "./skeletons/kanban";
import { FeatureIconItem } from "./feature-icon-item";

export function FeaturesWorkspace() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <SectionWrapper id="workspace" alternate>
      <Container>
        <div className={cn(
          "text-center mb-12 md:mb-16",
        )}>
          <Heading>
            {t("workspaceTitle")} <br className="hidden md:block" /> {t("workspaceTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("workspaceSubtitle")}
          </Subheading>
        </div>

        {/* Two-column feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800">
          <div className={cn(
            "border-b md:border-b-0 border-neutral-200 dark:border-neutral-800",
            isRTL ? "md:border-l" : "md:border-r"
          )}>
            <CardContent isRTL={isRTL}>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("unitsTitle")}
              </h2>
              <CardDescription>{t("unitsDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton>
              <UnitsSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
          <div>
            <CardContent isRTL={isRTL}>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("kanbanTitle")}
              </h2>
              <CardDescription>{t("kanbanDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton>
              <KanbanSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
        </div>

        {/* Icon features below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-10 md:mt-16">
          <FeatureIconItem
            icon={<IconAdjustments className="size-5 text-primary" />}
            title={t("customFieldsTitle")}
            description={t("customFieldsDesc")}
            isRTL={isRTL}
          />
          <FeatureIconItem
            icon={<IconChartBar className="size-5 text-primary" />}
            title={t("dashboardTitle")}
            description={t("dashboardDesc")}
            isRTL={isRTL}
          />
          <FeatureIconItem
            icon={<IconFileText className="size-5 text-primary" />}
            title={t("docGenShortTitle")}
            description={t("docGenShortDesc")}
            isRTL={isRTL}
          />
        </div>
      </Container>
    </SectionWrapper>
  );
}
