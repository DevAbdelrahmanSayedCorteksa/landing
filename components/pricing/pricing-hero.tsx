"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { EASE } from "./pricing-data";

export function PricingHero() {
  const t = useTranslations("pricingPage");

  return (
    <section className="relative pt-20 md:pt-26 lg:pt-32 pb-8">
      {/* Subtle background lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200/80 dark:via-neutral-800/80 to-transparent" />
        <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200/80 dark:via-neutral-800/80 to-transparent" />

      </div>

      <Container className="relative z-10">
        <div className="text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm"
          >
            <IconSparkles className="size-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wide text-primary">
              {t("heroBadge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-display font-bold leading-relaxed whitespace-nowrap"
          >
            {t("heroTagline1")}
            <IconSparkles className="inline size-6 md:size-8 mx-2 text-primary align-middle" />
            {t("heroTagline3")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="mt-6 text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-inter"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Button size="lg" className="shadow-brand" asChild>
              <Link href="/signup">{t("heroCta")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact" className="gap-2">
                {t("contactSales")}
                <IconArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
