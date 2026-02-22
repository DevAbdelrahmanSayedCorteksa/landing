"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { IconCircleCheckFilled, IconFlameFilled } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { PeriodTabs } from "./ui/period-tabs";
import { AnimatedPrice } from "./ui/animated-price";
import * as PricingCardUI from "@/components/pricing-card";
import { STATIC_PLANS, type StaticPlan } from "./pricing/pricing-data";

function PricingCard({ plan, selectedTimePeriod }: {
  plan: StaticPlan;
  selectedTimePeriod: TimePeriod;
}) {
  const t = useTranslations("pricing");
  const tc = useTranslations("common");
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
            {tc("getStarted")}
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

export const Pricing = () => {
  const t = useTranslations("pricing");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("sixMonths");

  return (
    <section className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <Heading>
            {t("title")} <br />
            {t("title2")}
          </Heading>
          <Subheading className="mt-8 mx-auto">
            {t("subtitle")}
          </Subheading>
        </div>

        {/* Period Tabs */}
        <PeriodTabs
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={setSelectedTimePeriod}
        />

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

        {/* View Full Pricing Link */}
        <div className="text-center mt-12">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            {t("moreOptions")}
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">{t("viewAll")}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};
