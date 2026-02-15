"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { Link } from "@/i18n/routing";
import { motion } from "motion/react";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import Image from "next/image";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function FeaturesHero() {
  const t = useTranslations("product");

  return (
    <section className="relative pt-20 md:pt-26 lg:pt-32 pb-8 overflow-hidden">
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
            className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-display font-bold leading-[1.15] text-balance"
          >
            {t("heroTitle")}
            <br />
            <span className="text-primary">{t("heroTitle2")}</span>
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
                {t("heroSecondaryCta")}
                <IconArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export function FeaturesHeroImage() {
  return (
    <section className="pb-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="mt-8 md:mt-10"
        >
          <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl shadow-neutral-900/5 dark:shadow-black/30 overflow-hidden">
            <BorderBeam
              size={250}
              duration={12}
              colorFrom="oklch(0.63 0.27 285)"
              colorTo="oklch(0.75 0.2 300)"
              borderWidth={1.5}
            />

            <Image
              src="/images/corteksa-product.svg"
              alt="Corteksa Dashboard"
              width={1440}
              height={901}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
