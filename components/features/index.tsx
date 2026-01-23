"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "../container";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { Card, CardContent, CardCTA, CardSkeleton, CardTitle } from "./card";
import { IconPlus } from "@tabler/icons-react";
import { SkeletonOne } from "./skeletons/first";
import { SkeletonThree } from "./skeletons/third";
import { SkeletonTwo } from "./skeletons/second";
import { rtlLocales, Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const Features = () => {
  const t = useTranslations("features");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <Container className="py-10 md:py-20 lg:py-32">
      <div className="flex xl:flex-row flex-col xl:items-baseline-last justify-between gap-10">
        <Heading className="text-center lg:text-start">{t("title")}</Heading>
        <Subheading className="text-center lg:text-start mx-auto lg:mx-0">
          {t("subtitle")}
        </Subheading>
      </div>
      <div className={cn(
        "flex flex-col lg:flex-row gap-4 my-10 md:my-20",
        isRTL && "lg:flex-row-reverse"
      )}>
        <Card className={cn(
          "flex-1",
          isRTL
            ? "lg:rounded-tr-3xl lg:rounded-br-3xl"
            : "lg:rounded-tl-3xl lg:rounded-bl-3xl"
        )}>
          <CardSkeleton>
            <SkeletonOne />
          </CardSkeleton>
          <CardContent>
            <CardTitle>{t("card1Title")}</CardTitle>
            <CardCTA>
              <IconPlus />
            </CardCTA>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardSkeleton>
            <SkeletonTwo />
          </CardSkeleton>
          <CardContent>
            <CardTitle>{t("card2Title")}</CardTitle>
            <CardCTA>
              <IconPlus />
            </CardCTA>
          </CardContent>
        </Card>
        <Card className={cn(
          "flex-1",
          isRTL
            ? "lg:rounded-tl-3xl lg:rounded-bl-3xl"
            : "lg:rounded-tr-3xl lg:rounded-br-3xl"
        )}>
          <CardSkeleton>
            <SkeletonThree />
          </CardSkeleton>
          <CardContent>
            <CardTitle>{t("card3Title")}</CardTitle>
            <CardCTA>
              <IconPlus />
            </CardCTA>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
