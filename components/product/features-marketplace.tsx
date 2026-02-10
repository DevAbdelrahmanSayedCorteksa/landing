"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import {
  IconPuzzle,
  IconCloud,
  IconMail,
  IconBrandSlack,
  IconFileSpreadsheet,
  IconCalendar,
  IconCreditCard,
  IconArrowRight,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const integrations = [
  { icon: IconCloud, delay: 0 },
  { icon: IconMail, delay: 0.05 },
  { icon: IconBrandSlack, delay: 0.1 },
  { icon: IconFileSpreadsheet, delay: 0.15 },
  { icon: IconCalendar, delay: 0.2 },
  { icon: IconCreditCard, delay: 0.25 },
];

export function FeaturesMarketplace() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        {/* Marketplace */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          <div
            className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-900/80 p-8 md:p-14"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Subtle grid bg */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.neutral.200/0.4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.neutral.200/0.4)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,theme(colors.neutral.800/0.3)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.neutral.800/0.3)_1px,transparent_1px)]" />

            <div className="relative">
              {/* Top: badge + heading */}
              <div className="text-center mb-10">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-5"
                >
                  <IconPuzzle className="size-4" />
                  {t("comingSoon")}
                </motion.span>
                <Heading className="mb-3">{t("marketplaceTitle")}</Heading>
                <Subheading className="mx-auto text-center max-w-lg">
                  {t("marketplaceSubtitle")}
                </Subheading>
              </div>

              {/* Integration icons grid */}
              <div className="flex justify-center gap-4 md:gap-6 mb-10 flex-wrap">
                {integrations.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + item.delay }}
                    viewport={{ once: true }}
                    className="size-14 md:size-16 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <item.icon className="size-6 md:size-7 text-neutral-500 dark:text-neutral-400" />
                  </motion.div>
                ))}
              </div>

              {/* Bottom card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
                className="max-w-xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 p-6 md:p-8 text-center"
              >
                <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-neutral-200">
                  {t("marketplaceName")}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t("marketplaceDesc")}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 text-center max-w-3xl mx-auto"
        >
          <Heading>{t("ctaTitle")}</Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("ctaSubtitle")}
          </Subheading>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button className="shadow-brand" asChild>
              <Link href="/signup">
                {t("ctaCta")}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">{t("ctaSecondaryCta")}</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
