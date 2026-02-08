"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  IconDatabase,
  IconLayoutKanban,
  IconBrain,
  IconFileText,
  IconUsers,
  IconHeadset,
} from "@tabler/icons-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const heroTabs = [
  { key: "workspace", icon: IconDatabase, image: "/images/corteksa-product.svg" },
  { key: "intelligence", icon: IconBrain, image: "/product/intelligence.png" },
  { key: "documents", icon: IconFileText, image: "/product/documents.png" },
  {
    key: "collaboration",
    icon: IconUsers,
    image: "/product/collaboration.png",
  },
  { key: "kanban", icon: IconLayoutKanban, image: "/product/kanban.png" },
  { key: "support", icon: IconHeadset, image: "/product/support.png" },
] as const;

export function FeaturesHero() {
  const t = useTranslations("product");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative pt-24 md:pt-32 lg:pt-40 pb-8 overflow-hidden">
      {/* Subtle background lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200/50 dark:via-neutral-800/50 to-transparent" />
        <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200/50 dark:via-neutral-800/50 to-transparent" />
        <div className="absolute left-0 right-0 top-[60%] h-px bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-neutral-800/50 to-transparent" />
      </div>

      <Container className="relative z-10">
        {/* Text content */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-display font-bold leading-[1.15] text-balance"
          >
            {t("heroTitle")} {t("heroTitle2")}
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
            className="mt-8"
          >
            <Button size="lg" className="shadow-brand" asChild>
              <Link href="/signup">{t("heroCta")}</Link>
            </Button>
          </motion.div>
        </div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
          className="mt-12 flex items-center justify-center gap-1 md:gap-2 flex-wrap"
        >
          {heroTabs.map((tab, idx) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeTab === idx
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  activeTab === idx
                    ? "bg-primary-foreground"
                    : "bg-neutral-300 dark:bg-neutral-600"
                )}
              />
              {t(
                `heroTab${tab.key.charAt(0).toUpperCase() + tab.key.slice(1)}`
              )}
            </button>
          ))}
        </motion.div>

        {/* Showcase card with BorderBeam */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          className="mt-10 md:mt-12"
        >
          <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl shadow-neutral-900/5 dark:shadow-black/30 overflow-hidden">
            <BorderBeam
              size={250}
              duration={12}
              colorFrom="oklch(0.63 0.27 285)"
              colorTo="oklch(0.75 0.2 300)"
              borderWidth={1.5}
            />

            {/* Tab images */}
            <div className="relative w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <Image
                    src={heroTabs[activeTab].image}
                    alt={t(
                      `heroTab${heroTabs[activeTab].key.charAt(0).toUpperCase() + heroTabs[activeTab].key.slice(1)}`
                    )}
                    width={1440}
                    height={901}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority={activeTab === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
