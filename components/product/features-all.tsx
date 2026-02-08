"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconDatabase,
  IconLayoutKanban,
  IconAdjustments,
  IconChartBar,
  IconSparkles,
  IconFileText,
  IconFileSpreadsheet,
  IconFolders,
  IconCheckbox,
  IconProgress,
  IconMessage,
  IconClock,
  IconShield,
  IconUsers,
  IconHeadset,
  IconLanguage,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionWrapper } from "./section-wrapper";

interface FeatureItem {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
}

const ALL_FEATURES: FeatureItem[] = [
  { icon: <IconHeadset className="size-5" />, titleKey: "allFeatureSupport", descKey: "allFeatureSupportDesc" },
  { icon: <IconSparkles className="size-5" />, titleKey: "allFeatureAI", descKey: "allFeatureAIDesc" },
  { icon: <IconUsers className="size-5" />, titleKey: "allFeatureCollaboration", descKey: "allFeatureCollaborationDesc" },
  { icon: <IconAdjustments className="size-5" />, titleKey: "allFeatureCustomFields", descKey: "allFeatureCustomFieldsDesc" },
  { icon: <IconChartBar className="size-5" />, titleKey: "allFeatureDashboard", descKey: "allFeatureDashboardDesc" },
  { icon: <IconMessage className="size-5" />, titleKey: "allFeatureDiscussion", descKey: "allFeatureDiscussionDesc" },
  { icon: <IconFileText className="size-5" />, titleKey: "allFeatureDocuments", descKey: "allFeatureDocumentsDesc" },
  { icon: <IconFileSpreadsheet className="size-5" />, titleKey: "allFeatureDocGen", descKey: "allFeatureDocGenDesc" },
  { icon: <IconLanguage className="size-5" />, titleKey: "allFeatureLanguage", descKey: "allFeatureLanguageDesc" },
  { icon: <IconLayoutKanban className="size-5" />, titleKey: "allFeatureKanban", descKey: "allFeatureKanbanDesc" },
  { icon: <IconShield className="size-5" />, titleKey: "allFeaturePermissions", descKey: "allFeaturePermissionsDesc" },
  { icon: <IconProgress className="size-5" />, titleKey: "allFeatureProgress", descKey: "allFeatureProgressDesc" },
  { icon: <IconFolders className="size-5" />, titleKey: "allFeatureStorage", descKey: "allFeatureStorageDesc" },
  { icon: <IconCheckbox className="size-5" />, titleKey: "allFeatureTasks", descKey: "allFeatureTasksDesc" },
  { icon: <IconClock className="size-5" />, titleKey: "allFeatureTimeline", descKey: "allFeatureTimelineDesc" },
  { icon: <IconDatabase className="size-5" />, titleKey: "allFeatureUnits", descKey: "allFeatureUnitsDesc" },
];

export function FeaturesAll() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleFeatures = isExpanded ? ALL_FEATURES : ALL_FEATURES.slice(0, 8);

  return (
    <SectionWrapper id="all-features">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>{t("allFeaturesTitle")}</Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("allFeaturesSubtitle")}
          </Subheading>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleFeatures.map((feature, idx) => (
              <motion.div
                key={feature.titleKey}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx < 8 ? 0 : (idx - 8) * 0.05 }}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                    {t(feature.titleKey)}
                  </h3>
                </div>
                <p className={cn("text-xs text-neutral-500 dark:text-neutral-400", isRTL && "text-right")}>
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            {isExpanded ? (
              <>
                {t("collapseFeatures")}
                <IconChevronUp className="size-4" />
              </>
            ) : (
              <>
                {t("viewAllFeatures")}
                <IconChevronDown className="size-4" />
              </>
            )}
          </Button>
        </div>
      </Container>
    </SectionWrapper>
  );
}
