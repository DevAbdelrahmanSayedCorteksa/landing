"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { IconCheck, IconX, IconFlameFilled } from "@tabler/icons-react";
import { useTimePeriod } from "./pricing-context";
import { EASE, STATIC_PLANS, featureComparison } from "./pricing-data";

const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
        <IconCheck className="size-4 text-primary" />
      </div>
    ) : (
      <IconX className="size-5 text-neutral-300 dark:text-neutral-600 mx-auto" />
    );
  }
  return (
    <span className="text-sm text-neutral-700 dark:text-neutral-300">
      {value}
    </span>
  );
};

export function PricingFeaturesTable() {
  const t = useTranslations("pricingPage");
  const { selectedTimePeriod } = useTimePeriod();
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sentinelRef.current) {
        setIsSticky(sentinelRef.current.getBoundingClientRect().top < 0);
      }
    };
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    handleScroll();
    return () => document.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  return (
    <section id="features-comparison" className="py-6 md:py-8 lg:py-12 bg-neutral-50/50 dark:bg-neutral-900/30 scroll-mt-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Container>
          <div className="text-center mb-8 md:mb-10">
            <Heading className="mb-4">{t("featuresTitle")}</Heading>
            <Subheading className="mx-auto">
              {t("featuresSubtitle")}
            </Subheading>
          </div>

          {/* Sentinel for sticky detection */}
          <div ref={sentinelRef} className="h-px -mt-px" />

          {/* Feature comparison table */}
          <div>
            <table className="w-full border-collapse" aria-label="Feature comparison across pricing plans">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="bg-transparent" />
                  {STATIC_PLANS.map((plan, planIdx) => {
                    const price = plan.pricing[selectedTimePeriod];
                    const isHighlighted = plan.isPopular;
                    const isFirst = planIdx === 0;
                    const isLast = planIdx === STATIC_PLANS.length - 1;
                    return (
                      <th key={plan.slug} className={cn(
                        "p-0 align-bottom",
                        isSticky ? cn(
                          "bg-neutral-50 dark:bg-[#0E0E0E] pt-3 pb-1.5",
                          isFirst && "[clip-path:inset(0_0_0_0_round_0_0_0_0.75rem)]",
                          isLast && "[clip-path:inset(0_0_0_0_round_0_0_0.75rem_0)]",
                        ) : "bg-transparent"
                      )}>
                        <div className={cn(
                          "rounded-t-xl p-4 mx-1.5 text-center transition-[border-radius] duration-200",
                          isSticky ? "rounded-b-xl" : "rounded-b-none",
                          isHighlighted
                            ? "bg-gradient-to-b from-primary/15 to-primary/8 dark:from-primary/20 dark:to-primary/10 ring-1 ring-primary/20"
                            : "bg-neutral-50 dark:bg-white/[0.04] ring-1 ring-neutral-200/60 dark:ring-white/[0.06]"
                        )}>
                          <div className="flex items-center justify-center gap-1.5 mb-1.5">
                            {isHighlighted && <IconFlameFilled className="size-3.5 text-primary" />}
                            <span className={cn(
                              "text-sm font-bold font-display",
                              isHighlighted ? "text-primary" : "text-neutral-700 dark:text-neutral-200"
                            )}>
                              {plan.name}
                            </span>
                          </div>
                          <div className="mb-3">
                            {price === null ? (
                              <span className="text-2xl font-bold font-display">{t("custom")}</span>
                            ) : price === 0 ? (
                              <span className="text-2xl font-bold font-display">$0</span>
                            ) : (
                              <span className="text-2xl font-bold font-display">${price}<span className="text-sm font-normal text-neutral-400 ms-1">/{TIME_PERIOD_LABELS[selectedTimePeriod]}</span></span>
                            )}
                          </div>
                          <Button
                            asChild
                            size="sm"
                            variant={isHighlighted ? "default" : "secondary"}
                            className={cn(
                              "w-full",
                              isHighlighted && "shadow-brand",
                              price === 0 && "bg-primary/10 text-primary hover:bg-primary/20"
                            )}
                          >
                            <Link href={`/multi-step-form?plan=${plan.slug}&period=${selectedTimePeriod}`}>
                              {price === null ? t("contactSales") : price === 0 ? t("heroCta") : t("getStarted")}
                            </Link>
                          </Button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
                <tbody>
                  {featureComparison.map((category) => (
                    <Fragment key={category.name}>
                      {/* Category Header */}
                      <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                        <td
                          colSpan={5}
                          className="p-4 md:px-5 font-display font-bold text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400"
                        >
                          {category.name}
                        </td>
                      </tr>

                      {/* Category Features */}
                      {category.features.map((feature) => (
                        <tr
                          key={feature.name}
                          className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors"
                        >
                          <td className="p-4 md:px-5 text-sm text-neutral-700 dark:text-neutral-300 font-medium">{feature.name}</td>
                          <td className="p-4 text-center">{renderFeatureValue(feature.free)}</td>
                          <td className="p-4 text-center">{renderFeatureValue(feature.unlimited)}</td>
                          <td className="p-4 text-center bg-primary/5 border-x border-primary/10">{renderFeatureValue(feature.business)}</td>
                          <td className="p-4 text-center">{renderFeatureValue(feature.enterprise)}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
            </table>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
