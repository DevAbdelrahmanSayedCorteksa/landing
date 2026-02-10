"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import { SectionWrapper } from "./section-wrapper";
import { CardContent, CardDescription, CardSkeleton } from "./skeletons";
import { DocumentsGenerationSkeletonVisual } from "./skeletons/doc-gen";
import { StorageSkeletonVisual } from "./skeletons/storage";

export function FeaturesDocuments() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <SectionWrapper id="documents" alternate>
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("documentsTitle")} <br className="hidden md:block" /> {t("documentsTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("documentsSubtitle")}
          </Subheading>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800">
          <div className={cn(
            "border-b md:border-b-0 border-neutral-200 dark:border-neutral-800",
            isRTL ? "md:border-l" : "md:border-r"
          )}>
            <CardContent isRTL={isRTL}>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("docGenTitle")}
              </h2>
              <CardDescription>{t("docGenDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton>
              <DocumentsGenerationSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
          <div>
            <CardContent isRTL={isRTL}>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("storageTitle")}
              </h2>
              <CardDescription>{t("storageDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton>
              <StorageSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
