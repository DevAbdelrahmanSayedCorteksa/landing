"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { AnimatedPrice } from "@/components/ui/animated-price";
import * as PricingCardUI from "@/components/pricing-card";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  IconCircleCheckFilled,
  IconFlameFilled,
  IconArrowDown,
} from "@tabler/icons-react";
import { useTimePeriod } from "./pricing-context";
import { EASE, STATIC_PLANS, type StaticPlan } from "./pricing-data";

function PricingCard({ plan, selectedTimePeriod }: {
  plan: StaticPlan;
  selectedTimePeriod: TimePeriod;
}) {
  const t = useTranslations("pricingPage");
  const price = plan.pricing[selectedTimePeriod];
  const periodLabel = TIME_PERIOD_LABELS[selectedTimePeriod];
  const ctaHref = `/multi-step-form?plan=${plan.slug}&period=${selectedTimePeriod}`;

  return (
    <PricingCardUI.Card className={cn(
      "max-w-none h-full flex flex-col",
      plan.isPopular
        ? "border-primary/40 dark:border-primary/30 shadow-[0_0_30px_-5px] shadow-primary/20 dark:shadow-primary/10"
        : ""
    )}>
      <PricingCardUI.Header className={cn(
        "flex flex-col justify-between min-h-[11rem]",
        plan.isPopular && "bg-primary/5 dark:bg-primary/10 border-primary/15 dark:border-primary/20"
      )}>
        <PricingCardUI.Plan>
          <PricingCardUI.PlanName>
            {plan.isPopular && <IconFlameFilled className="size-4 text-primary" />}
            {plan.name}
          </PricingCardUI.PlanName>
          {plan.isPopular && <PricingCardUI.Badge>{t("popular")}</PricingCardUI.Badge>}
        </PricingCardUI.Plan>

        <PricingCardUI.Price>
          {price === null ? (
            <>
              <PricingCardUI.MainPrice>{t("custom")}</PricingCardUI.MainPrice>
              <PricingCardUI.Period className="invisible">/{periodLabel}</PricingCardUI.Period>
            </>
          ) : price === 0 ? (
            <>
              <AnimatedPrice
                value={0}
                className="text-4xl font-bold font-display tracking-tight"
              />
              <PricingCardUI.Period>/{periodLabel}</PricingCardUI.Period>
            </>
          ) : (
            <>
              <AnimatedPrice
                value={price}
                className="text-4xl font-bold font-display tracking-tight"
              />
              <PricingCardUI.Period>/{periodLabel}</PricingCardUI.Period>
            </>
          )}
        </PricingCardUI.Price>

        <PricingCardUI.Description>{plan.description}</PricingCardUI.Description>
      </PricingCardUI.Header>

      <PricingCardUI.Body className="flex-grow flex flex-col">
        <Button
          asChild
          size="lg"
          variant={plan.isPopular ? "default" : "secondary"}
          className={cn(
            "w-full",
            plan.isPopular && "shadow-brand",
            price === 0 && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          <Link href={ctaHref}>
            {price === null ? t("contactSales") : price === 0 ? t("heroCta") : t("getStarted")}
          </Link>
        </Button>

        <PricingCardUI.List className="flex-grow">
          {plan.features.map((feature, idx) => (
            <PricingCardUI.ListItem key={idx}>
              <IconCircleCheckFilled className="size-4 text-primary flex-shrink-0 mt-0.5" />
              {feature}
            </PricingCardUI.ListItem>
          ))}
        </PricingCardUI.List>
      </PricingCardUI.Body>
    </PricingCardUI.Card>
  );
}

export function PricingCardsSection() {
  const t = useTranslations("pricingPage");
  const { selectedTimePeriod, setSelectedTimePeriod } = useTimePeriod();

  return (
    <section className="pt-0 pb-6 md:pb-8 lg:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Container>
          {/* Guarantee Badge (left) + Period Tabs (right) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              <IconCircleCheckFilled className="size-4" />
              {t("moneyBackGuarantee")}
            </span>

            <PeriodTabs
              selectedTimePeriod={selectedTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
              className="justify-end mb-0"
            />
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATIC_PLANS.map((plan) => (
              <PricingCard
                key={plan.slug}
                plan={plan}
                selectedTimePeriod={selectedTimePeriod}
              />
            ))}
          </div>
        </Container>
      </motion.div>

      {/* See plans comparison link */}
      <motion.div
        className="flex justify-center pt-8 md:pt-10 pb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        viewport={{ once: true }}
      >
        <button
          onClick={() => document.getElementById("features-comparison")?.scrollIntoView({ behavior: "smooth" })}
          className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
        >
          {t("seeComparison")}
          <IconArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
        </button>
      </motion.div>
    </section>
  );
}
