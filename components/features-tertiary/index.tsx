"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { SkeletonOne } from "./skeletons/first";
import { SkeletonTwo } from "./skeletons/second";
import { HumanIcon, IntegrationIcon, WorkflowIcon } from "@/icons";
import { SkeletonThree } from "./skeletons/third";
import { SkeletonFour } from "./skeletons/four";
import { rtlLocales, Locale } from "@/i18n/routing";

export const FeaturesTertiary = () => {
  const t = useTranslations("featuresTertiary");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <section className="pt-10 md:pt-20 lg:py-32 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 divide-neutral-200 dark:divide-neutral-800">
          <div className={cn(
            "border-b border-neutral-200 dark:border-neutral-800",
            isRTL ? "md:border-l" : "md:border-r"
          )}>
            <CardContent>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("taskTitle")}
              </h2>
              <CardDescription>
                {t("taskDesc")}
              </CardDescription>
            </CardContent>
            <CardSkeleton>
              <SkeletonOne />
            </CardSkeleton>
          </div>
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <CardContent>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("aiTitle")}
              </h2>
              <CardDescription>
                {t("aiDesc")}
              </CardDescription>
            </CardContent>
            <CardSkeleton className="mask-radial-from-20%">
              <SkeletonTwo />
            </CardSkeleton>
          </div>
          <div className={cn(
            "border-neutral-200 dark:border-neutral-800",
            isRTL ? "md:border-l" : "md:border-r"
          )}>
            <CardContent>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("omniTitle")}
              </h2>
              <CardDescription>
                {t("omniDesc")}
              </CardDescription>
            </CardContent>
            <CardSkeleton className={cn(
              "mask-radial-from-20%",
              isRTL ? "mask-l-from-50%" : "mask-r-from-50%"
            )}>
              <SkeletonThree />
            </CardSkeleton>
          </div>
          <div className="dark:border-neutral-800">
            <CardContent>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("emailTitle")}
              </h2>
              <CardDescription>
                {t("emailDesc")}
              </CardDescription>
            </CardContent>
            <CardSkeleton>
              <SkeletonFour />
            </CardSkeleton>
          </div>
        </div>
      </Container>
    </section>
  );
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 md:p-8">{children}</div>;
};

export const CardDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">
      {children}
    </p>
  );
};

export const CardSkeleton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative h-80 sm:h-60 flex flex-col md:h-80 overflow-hidden perspective-distant",
        className
      )}
    >
      {children}
    </div>
  );
};
