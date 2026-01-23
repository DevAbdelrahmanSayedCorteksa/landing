"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { SkeletonOne } from "./skeletons/first";
import { SkeletonTwo } from "./skeletons/second";
import { HumanIcon, IntegrationIcon, WorkflowIcon } from "@/icons";

export const FeaturesSecondary = () => {
  const t = useTranslations("featuresSecondary");

  return (
    <section className="pt-10 md:pt-20 lg:py-32 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-neutral-200 dark:divide-neutral-800">
          <div>
            <CardContent>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("unitsTitle")}
              </h2>
              <CardDescription>{t("unitsDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton>
              <SkeletonOne />
            </CardSkeleton>
          </div>
          <div>
            <CardContent>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {t("kanbanTitle")}
              </h2>
              <CardDescription>{t("kanbanDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton className="mask-radial-from-50% mask-t-from-50%">
              <SkeletonTwo />
            </CardSkeleton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 md:mt-20">
          <div>
            <div className="flex items-center gap-2">
              <WorkflowIcon />
              <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                {t("docGenTitle")}
              </h3>
            </div>

            <p className="text-neutral-500 text-base mt-2">{t("docGenDesc")}</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <IntegrationIcon />
              <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                {t("customFieldsTitle")}
              </h3>
            </div>

            <p className="text-neutral-500 text-base mt-2">
              {t("customFieldsDesc")}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <HumanIcon />
              <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                {t("dashboardTitle")}
              </h3>
            </div>

            <p className="text-neutral-500 text-base mt-2">
              {t("dashboardDesc")}
            </p>
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
    <p className="text-neutral-600 mt-2 max-w-md text-balance">{children}</p>
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
