"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import { IconLink, IconForms } from "@tabler/icons-react";
import { SectionWrapper } from "./section-wrapper";
import { CardContent, CardDescription, CardSkeleton } from "./skeletons";
import { UnitsSkeletonVisual } from "./skeletons/units";
import { KanbanSkeletonVisual } from "./skeletons/kanban";
import { FeatureIconItem } from "./feature-icon-item";

export function FeaturesOverview() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <SectionWrapper id="overview">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("overviewTitle")} <br className="hidden md:block" /> {t("overviewTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("overviewSubtitle")}
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
                {t("viewsTitle")}
              </h2>
              <CardDescription>{t("viewsDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton className="h-72 sm:h-64 md:h-72">
              <KanbanSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
        </div>

        {/* Icon features below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-10 md:mt-16">
          <FeatureIconItem
            icon={<IconForms className="size-5 text-primary" />}
            title={t("fieldsTitle")}
            description={t("fieldsDesc")}
            isRTL={isRTL}
          />
          <FeatureIconItem
            icon={<IconLink className="size-5 text-primary" />}
            title={t("relationsTitle")}
            description={t("relationsDesc")}
            isRTL={isRTL}
          />
        </div>
      </Container>
    </SectionWrapper>
  );
}
