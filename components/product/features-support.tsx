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
import { SupportSkeletonVisual } from "./skeletons/support";
import { LanguageSkeletonVisual } from "./skeletons/language";

export function FeaturesSupport() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <SectionWrapper id="support" alternate>
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("supportSectionTitle")} <br className="hidden md:block" /> {t("supportSectionTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("supportSectionSubtitle")}
          </Subheading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800">
          <div className={cn(
            "border-b md:border-b-0 border-neutral-200 dark:border-neutral-800",
            isRTL ? "md:border-l" : "md:border-r"
          )}>
            <CardContent isRTL={isRTL}>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("supportTitle")}
              </h2>
              <CardDescription>{t("supportDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton>
              <SupportSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
          <div>
            <CardContent isRTL={isRTL}>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("languageTitle")}
              </h2>
              <CardDescription>{t("languageDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton className="mask-radial-from-50% mask-t-from-50%">
              <LanguageSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
