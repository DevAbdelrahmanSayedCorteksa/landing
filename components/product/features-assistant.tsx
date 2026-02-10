"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import { IconArrowsSort, IconFolderCog, IconFocus2 } from "@tabler/icons-react";
import { motion } from "motion/react";
import { SectionWrapper } from "./section-wrapper";
import { AssistantSkeletonVisual } from "./skeletons/ai-assistant";

export function FeaturesAssistant() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  const capabilities = [
    { icon: <IconArrowsSort className="size-5" />, title: t("aiPrioritizeTitle"), desc: t("aiPrioritizeDesc") },
    { icon: <IconFolderCog className="size-5" />, title: t("aiOrganizeTitle"), desc: t("aiOrganizeDesc") },
    { icon: <IconFocus2 className="size-5" />, title: t("aiFocusTitle"), desc: t("aiFocusDesc") },
  ];

  return (
    <SectionWrapper id="assistant">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("assistantTitle")} <br className="hidden md:block" /> {t("assistantTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("assistantSubtitle")}
          </Subheading>
        </div>

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center",
          isRTL && "lg:direction-rtl"
        )}>
          {/* AI Chat mockup — takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative"
          >
            <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden">
              <AssistantSkeletonVisual isRTL={isRTL} />
            </div>
            {/* Subtle glow behind */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
          </motion.div>

          {/* Capabilities — takes 2 cols, stacked vertically */}
          <div className="lg:col-span-2 space-y-6">
            {capabilities.map((cap, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.12 }}
                viewport={{ once: true }}
                className="group"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className={cn(
                  "flex items-start gap-4 p-4 rounded-xl transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                  isRTL && "flex-row-reverse"
                )}>
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    {cap.icon}
                  </div>
                  <div className={cn(isRTL && "text-right")}>
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                      {cap.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
