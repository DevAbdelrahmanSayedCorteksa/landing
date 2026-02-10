"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import { motion } from "motion/react";
import { SectionWrapper } from "./section-wrapper";
import { CardSkeleton } from "./skeletons";
import { UnitsSkeletonVisual } from "./skeletons/units";
import { LanguageSkeletonVisual } from "./skeletons/language";
import { SupportSkeletonVisual } from "./skeletons/support";

export function FeaturesBestFit() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  const cards = [
    {
      title: t("bestFitSystemTitle"),
      desc: t("bestFitSystemDesc"),
      skeleton: <UnitsSkeletonVisual isRTL={isRTL} />,
    },
    {
      title: t("bestFitLanguageTitle"),
      desc: t("bestFitLanguageDesc"),
      skeleton: <LanguageSkeletonVisual isRTL={isRTL} />,
    },
    {
      title: t("bestFitPartnerTitle"),
      desc: t("bestFitPartnerDesc"),
      skeleton: <SupportSkeletonVisual isRTL={isRTL} />,
    },
  ];

  return (
    <SectionWrapper id="best-fit" alternate>
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("bestFitTitle")} <br className="hidden md:block" /> {t("bestFitTitle2")}
          </Heading>
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
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
