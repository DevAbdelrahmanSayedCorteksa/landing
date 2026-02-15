"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconDatabase,
  IconForms,
  IconLink,
  IconLayoutKanban,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionWrapper } from "./section-wrapper";
import {
  UnitsSkeletonVisual,
  CustomFieldsSkeletonVisual,
  KanbanSkeletonVisual,
} from "./skeletons";
import { RelationsSkeletonVisual } from "./skeletons/relations";

type UnitFeatureKey = "units" | "fields" | "relations" | "views";

export function FeaturesUnits() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const [active, setActive] = useState<UnitFeatureKey>("units");

  const features: { key: UnitFeatureKey; icon: React.ReactNode; title: string; desc: string }[] = [
    { key: "units", icon: <IconDatabase className="size-4" />, title: t("unitsSectionUnitsTitle"), desc: t("unitsSectionUnitsDesc") },
    { key: "fields", icon: <IconForms className="size-4" />, title: t("unitsSectionFieldsTitle"), desc: t("unitsSectionFieldsDesc") },
    { key: "relations", icon: <IconLink className="size-4" />, title: t("unitsSectionRelationsTitle"), desc: t("unitsSectionRelationsDesc") },
    { key: "views", icon: <IconLayoutKanban className="size-4" />, title: t("unitsSectionViewsTitle"), desc: t("unitsSectionViewsDesc") },
  ];

  const activeFeature = features.find((f) => f.key === active)!;

  const visuals: Record<UnitFeatureKey, React.ReactNode> = {
    units: <UnitsSkeletonVisual isRTL={isRTL} />,
    fields: <CustomFieldsSkeletonVisual isRTL={isRTL} />,
    relations: <RelationsSkeletonVisual isRTL={isRTL} />,
    views: <KanbanSkeletonVisual isRTL={isRTL} />,
  };

  return (
    <SectionWrapper id="units">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("unitsSectionTitle")} <br className="hidden md:block" /> {t("unitsSectionTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("unitsSectionSubtitle")}
          </Subheading>
        </div>

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch",
          isRTL && "lg:direction-rtl"
        )}>
          {/* Visual panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="relative h-full"
          >
            <div className="h-full rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden p-5 md:p-6 flex flex-col min-h-[340px]">
              {/* Visual header */}
              <div className={cn("flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800", isRTL && "flex-row-reverse")}>
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {activeFeature.icon}
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{activeFeature.title}</span>
              </div>
              {/* Visual content */}
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {visuals[active]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Feature cards — clickable */}
          <div className="space-y-2">
            {features.map((feature, idx) => (
              <motion.button
                key={feature.key}
                type="button"
                initial={{ opacity: 0, x: isRTL ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setActive(feature.key)}
                dir={isRTL ? "rtl" : "ltr"}
                className={cn(
                  "w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer",
                  active === feature.key
                    ? "border-primary/30 bg-white dark:bg-neutral-800/80 shadow-sm"
                    : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800/50",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <div className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
                  active === feature.key ? "bg-primary/10 text-primary" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                )}>
                  {feature.icon}
                </div>
                <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                  <h3 className={cn(
                    "text-sm font-bold transition-colors duration-200",
                    active === feature.key ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {feature.title}
                  </h3>
                  <p className={cn(
                    "text-xs leading-relaxed mt-0.5 line-clamp-2 transition-colors duration-200",
                    active === feature.key ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-500"
                  )}>
                    {feature.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
