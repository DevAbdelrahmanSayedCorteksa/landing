"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import { IconBrain, IconFolderCog, IconTrendingUp } from "@tabler/icons-react";
import { motion } from "motion/react";
import { SectionWrapper } from "./section-wrapper";
import { CardContent, CardDescription, CardSkeleton } from "./skeletons";
import { AssistantSkeletonVisual } from "./skeletons/ai-assistant";

export function FeaturesIntelligence() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  const capabilities = [
    {
      icon: <IconBrain className="size-5 text-primary" />,
      title: t("aiCapability1Title"),
      desc: t("aiCapability1Desc"),
    },
    {
      icon: <IconFolderCog className="size-5 text-primary" />,
      title: t("aiCapability2Title"),
      desc: t("aiCapability2Desc"),
    },
    {
      icon: <IconTrendingUp className="size-5 text-primary" />,
      title: t("aiCapability3Title"),
      desc: t("aiCapability3Desc"),
    },
  ];

  return (
    <SectionWrapper id="intelligence">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("intelligenceTitle")} <br className="hidden md:block" /> {t("intelligenceTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("intelligenceSubtitle")}
          </Subheading>
        </div>

        {/* Featured AI card */}
        <div className="rounded-2xl border border-primary/20 dark:border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 overflow-hidden">
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2",
            isRTL && "md:direction-rtl"
          )}>
            <div className="order-2 md:order-1">
              <CardContent isRTL={isRTL}>
                <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                  {t("aiTitle")}
                </h2>
                <CardDescription>{t("aiDesc")}</CardDescription>
              </CardContent>
            </div>
            <div className="order-1 md:order-2">
              <CardSkeleton>
                <AssistantSkeletonVisual isRTL={isRTL} />
              </CardSkeleton>
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 md:mt-16">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className={cn("flex items-center gap-3 mb-3", isRTL && "flex-row-reverse")}>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {cap.icon}
                </div>
                <h3 className="font-bold text-neutral-800 dark:text-neutral-200">{cap.title}</h3>
              </div>
              <p className={cn("text-neutral-500 dark:text-neutral-400 text-sm", isRTL && "text-right")}>
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
