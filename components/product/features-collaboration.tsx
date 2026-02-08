"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconCheckbox,
  IconProgress,
  IconMessage,
  IconClock,
  IconShield,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { SectionWrapper } from "./section-wrapper";
import { CardContent, CardDescription, CardSkeleton } from "./skeletons";
import { CollaborationSkeletonVisual } from "./skeletons/collaboration";
import { FeatureIconItem } from "./feature-icon-item";

export function FeaturesCollaboration() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  const subFeatures = [
    { icon: <IconCheckbox className="size-5 text-primary" />, title: t("tasksTitle"), desc: t("tasksDesc") },
    { icon: <IconProgress className="size-5 text-primary" />, title: t("progressTitle"), desc: t("progressDesc") },
    { icon: <IconMessage className="size-5 text-primary" />, title: t("discussionTitle"), desc: t("discussionDesc") },
  ];

  const bottomFeatures = [
    { icon: <IconClock className="size-5 text-primary" />, title: t("timelineTitle"), desc: t("timelineDesc") },
    { icon: <IconShield className="size-5 text-primary" />, title: t("permissionsTitle"), desc: t("permissionsDesc") },
  ];

  return (
    <SectionWrapper id="collaboration">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("collaborationSectionTitle")} <br className="hidden md:block" /> {t("collaborationSectionTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("collaborationSectionSubtitle")}
          </Subheading>
        </div>

        {/* Featured collaboration card */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
          <div className={cn("grid grid-cols-1 md:grid-cols-2", isRTL && "md:direction-rtl")}>
            <CardContent isRTL={isRTL}>
              <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                {t("collaborationTitle")}
              </h2>
              <CardDescription>{t("collaborationDesc")}</CardDescription>
            </CardContent>
            <CardSkeleton className="mask-radial-from-20%">
              <CollaborationSkeletonVisual isRTL={isRTL} />
            </CardSkeleton>
          </div>
        </div>

        {/* Sub-features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-10 md:mt-16">
          {subFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureIconItem
                icon={feature.icon}
                title={feature.title}
                description={feature.desc}
                isRTL={isRTL}
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6">
          {bottomFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureIconItem
                icon={feature.icon}
                title={feature.title}
                description={feature.desc}
                isRTL={isRTL}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
