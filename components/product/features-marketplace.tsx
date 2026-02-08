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
import { IconPuzzle } from "@tabler/icons-react";
import { motion } from "motion/react";

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
          <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
            <Heading className="mb-4">{t("marketplaceTitle")}</Heading>
            <Subheading className="mx-auto text-center">
              {t("marketplaceSubtitle")}
            </Subheading>
          </div>

          <div className="max-w-2xl mx-auto">
            <div
              className="text-center p-8 md:p-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <IconPuzzle className="size-8 text-primary" />
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                {t("comingSoon")}
              </span>
              <h3 className="font-bold text-xl mb-3 text-neutral-800 dark:text-neutral-200">
                {t("marketplaceName")}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t("marketplaceDesc")}
              </p>
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
              <Link href="/signup">{t("ctaCta")}</Link>
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
