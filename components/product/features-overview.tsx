"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import { motion } from "motion/react";
import { SectionWrapper } from "./section-wrapper";
import { CardSkeleton } from "./skeletons";
import { UnitsSkeletonVisual } from "./skeletons/units";
import { AssistantSkeletonVisual } from "./skeletons/ai-assistant";
import { CollaborationSkeletonVisual } from "./skeletons/collaboration";

export function FeaturesOverview() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  const cards = [
    {
      title: t("overviewCard1Title"),
      desc: t("overviewCard1Desc"),
      skeleton: <UnitsSkeletonVisual isRTL={isRTL} />,
      featured: false,
    },
    {
      title: t("overviewCard2Title"),
      desc: t("overviewCard2Desc"),
      skeleton: <AssistantSkeletonVisual isRTL={isRTL} />,
      featured: true,
    },
    {
      title: t("overviewCard3Title"),
      desc: t("overviewCard3Desc"),
      skeleton: <CollaborationSkeletonVisual isRTL={isRTL} />,
      featured: false,
    },
  ];

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

        <div className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-6",
          isRTL && "direction-rtl"
        )}>
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                card.featured && "shadow-brand md:-translate-y-2"
              )}
            >
              <CardSkeleton>
                {card.skeleton}
              </CardSkeleton>
              <div className={cn("p-6", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  {card.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
