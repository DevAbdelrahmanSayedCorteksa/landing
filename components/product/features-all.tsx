"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { SectionWrapper } from "./section-wrapper";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconDatabase,
  IconLayoutKanban,
  IconAdjustments,
  IconChartBar,
  IconSparkles,
  IconFileText,
  IconFileSpreadsheet,
  IconCheckbox,
  IconProgress,
  IconMessage,
  IconClock,
  IconUsers,
} from "@tabler/icons-react";
import RadialOrbitalTimeline, {
  type TimelineItem,
} from "@/components/ui/radial-orbital-timeline";

function useFeatureData(): TimelineItem[] {
  const t = useTranslations("product");
  return [
    {
      id: 1,
      title: t("allFeatureAI"),
      content: t("allFeatureAIDesc"),
      category: "ai",
      icon: IconSparkles,
      relatedIds: [5, 4],
      status: "completed",
      energy: 90,
    },
    {
      id: 2,
      title: t("allFeatureCollaboration"),
      content: t("allFeatureCollaborationDesc"),
      category: "collaboration",
      icon: IconUsers,
      relatedIds: [3, 9],
      status: "completed",
      energy: 88,
    },
    {
      id: 3,
      title: t("allFeatureDiscussion"),
      content: t("allFeatureDiscussionDesc"),
      category: "collaboration",
      icon: IconMessage,
      relatedIds: [2, 9],
      status: "completed",
      energy: 78,
    },
    {
      id: 4,
      title: t("allFeatureCustomFields"),
      content: t("allFeatureCustomFieldsDesc"),
      category: "management",
      icon: IconAdjustments,
      relatedIds: [12, 5],
      status: "completed",
      energy: 82,
    },
    {
      id: 5,
      title: t("allFeatureDashboard"),
      content: t("allFeatureDashboardDesc"),
      category: "analytics",
      icon: IconChartBar,
      relatedIds: [8, 1],
      status: "completed",
      energy: 92,
    },
    {
      id: 6,
      title: t("allFeatureDocuments"),
      content: t("allFeatureDocumentsDesc"),
      category: "documents",
      icon: IconFileText,
      relatedIds: [7, 12],
      status: "completed",
      energy: 85,
    },
    {
      id: 7,
      title: t("allFeatureDocGen"),
      content: t("allFeatureDocGenDesc"),
      category: "documents",
      icon: IconFileSpreadsheet,
      relatedIds: [6, 1],
      status: "completed",
      energy: 80,
    },
    {
      id: 8,
      title: t("allFeatureKanban"),
      content: t("allFeatureKanbanDesc"),
      category: "management",
      icon: IconLayoutKanban,
      relatedIds: [9, 10],
      status: "completed",
      energy: 88,
    },
    {
      id: 9,
      title: t("allFeatureTasks"),
      content: t("allFeatureTasksDesc"),
      category: "management",
      icon: IconCheckbox,
      relatedIds: [8, 10],
      status: "completed",
      energy: 90,
    },
    {
      id: 10,
      title: t("allFeatureTimeline"),
      content: t("allFeatureTimelineDesc"),
      category: "management",
      icon: IconClock,
      relatedIds: [9, 8],
      status: "completed",
      energy: 83,
    },
    {
      id: 11,
      title: t("allFeatureProgress"),
      content: t("allFeatureProgressDesc"),
      category: "analytics",
      icon: IconProgress,
      relatedIds: [5, 8],
      status: "completed",
      energy: 85,
    },
    {
      id: 12,
      title: t("allFeatureUnits"),
      content: t("allFeatureUnitsDesc"),
      category: "management",
      icon: IconDatabase,
      relatedIds: [4, 6],
      status: "completed",
      energy: 78,
    },
  ];
}

export function FeaturesAll() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const timelineData = useFeatureData();

  return (
    <SectionWrapper id="all-features">
      <div dir={isRTL ? "rtl" : "ltr"}>
        <Container>
          <div className="text-center mb-4 md:mb-8">
            <Heading>{t("allFeaturesTitle")}</Heading>
            <Subheading className="mt-4 mx-auto text-center">
              {t("allFeaturesSubtitle")}
            </Subheading>
          </div>
        </Container>

        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </SectionWrapper>
  );
}
