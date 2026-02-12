"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  IconChartBar,
  IconRobot,
  IconShield,
  IconUsers,
  IconSparkles,
  IconClock,
} from "@tabler/icons-react";
import { EASE, marketplaceItems, type MarketplaceItem } from "./pricing-data";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "chart-bar": IconChartBar,
  "robot": IconRobot,
  "shield": IconShield,
  "users": IconUsers,
  "sparkles": IconSparkles,
  "clock": IconClock,
};

function MarketplaceCard({ item, index }: { item: MarketplaceItem; index: number }) {
  const t = useTranslations("pricingPage");
  const Icon = ICON_MAP[item.iconName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
      viewport={{ once: true, margin: "-50px" }}
      className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary/30 hover:shadow-md transition-all duration-200"
    >
      {/* Icon */}
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        {Icon && <Icon className="size-6 text-primary" />}
      </div>

      {/* Category Badge */}
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 mb-3">
        {item.category}
      </span>

      {/* Name */}
      <h3 className="text-lg font-bold font-display text-neutral-800 dark:text-neutral-200 mb-2">{item.name}</h3>

      {/* Description */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">{item.description}</p>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-bold font-display">${item.pricePerUser}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">{t("perUserMonth")}</span>
      </div>

      {/* CTA */}
      <Button variant="outline" className="w-full hover:border-primary/30">
        {t("addToWorkspace")}
      </Button>
    </motion.div>
  );
}

export function PricingMarketplace() {
  const t = useTranslations("pricingPage");

  return (
    <section className="py-6 md:py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Container>
          <div className={cn(
            "rounded-3xl border border-neutral-200 dark:border-neutral-800",
            "bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-900/80",
            "bg-[linear-gradient(to_right,theme(colors.neutral.200/0.4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.neutral.200/0.4)_1px,transparent_1px)]",
            "bg-[size:40px_40px]",
            "dark:bg-[linear-gradient(to_right,theme(colors.neutral.800/0.3)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.neutral.800/0.3)_1px,transparent_1px)]",
            "p-8 md:p-14"
          )}>
            {/* Badge */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                <IconSparkles className="size-4" />
                {t("marketplaceTitle")}
              </span>
            </div>

            <div className="text-center mb-8 md:mb-10">
              <Heading className="mb-4">{t("marketplaceTitle")}</Heading>
              <Subheading className="mx-auto">
                {t("marketplaceSubtitle")}
              </Subheading>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceItems.map((item, index) => (
                <MarketplaceCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
