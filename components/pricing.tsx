"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { IconCircleCheckFilled, IconFlameFilled } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PricingPlan, TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { PRICING_KEY, pricingService } from "@/lib/services/PricingService";
import { PeriodTabs } from "./ui/period-tabs";
import { AnimatedPrice } from "./ui/animated-price";

interface PricingCardProps {
  plan: PricingPlan;
  selectedTimePeriod: TimePeriod;
}

function PricingCard({ plan, selectedTimePeriod }: PricingCardProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedFeatures = showAll ? plan.features : plan.features.slice(0, 4);
  const hasMoreFeatures = plan.features.length > 4;

  const price = plan.timePeriodPricing[selectedTimePeriod];
  const periodLabel = TIME_PERIOD_LABELS[selectedTimePeriod];

  // Build the CTA link with URL params
  const ctaHref = `/multi-step-form?plan=${plan.slug}&period=${selectedTimePeriod}`;

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 md:p-10 transition-all h-full flex flex-col",
        plan.isPopular
          ? "bg-primary/10 border-2 border-primary/30"
          : "bg-neutral-100 dark:bg-neutral-800"
      )}
    >
      {/* Popular Icon */}
      {plan.isPopular && (
        <div className="absolute top-4 right-4">
          <IconFlameFilled className="size-6 text-primary" />
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
        {plan.name}
      </h3>

      {/* Price with Animation */}
      <div className="mb-4">
        {price === null || price === undefined ? (
          <p className="text-4xl md:text-5xl font-bold font-display">Custom</p>
        ) : price === 0 ? (
          <div className="flex items-baseline gap-2">
            <p className="text-4xl md:text-5xl font-bold font-display">$0</p>
            <span className="text-base text-neutral-500 dark:text-neutral-400">
              /{periodLabel}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <AnimatedPrice
              value={price}
              className="text-4xl md:text-5xl font-bold font-display"
            />
            <span className="text-base text-neutral-500 dark:text-neutral-400">
              /{periodLabel}
            </span>
          </div>
        )}
      </div>

      {/* Description - wrapper with fixed height for button alignment */}
      <div className="h-[72px] overflow-hidden mb-6">
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          {plan.description}
        </p>
      </div>

      {/* CTA Button */}
      <Button
        asChild
        size="lg"
        variant={plan.buttonVariant === "contained" ? "default" : "outline"}
        className={cn("w-full mb-8", plan.isPopular && "shadow-brand")}
      >
        <Link href={ctaHref}>{plan.buttonText}</Link>
      </Button>

      {/* Features List */}
      <ul className="space-y-4 flex-grow">
        {displayedFeatures.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <IconCircleCheckFilled className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Show More Button */}
      {hasMoreFeatures && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          {showAll ? "Show less" : `Show more (${plan.features.length - 4} more)`}
          <svg
            className={cn("size-4 transition-transform", showAll && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export const Pricing = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("sixMonths");

  const { data, isLoading } = useQuery({
    queryKey: [PRICING_KEY],
    queryFn: pricingService.getPricingPlans,
  });

  const plans = data?.data || [];

  return (
    <section className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <Heading>
            Start free. <br />
            Scale as you grow.
          </Heading>
          <Subheading className="mt-8 mx-auto">
            Begin with our free plan and upgrade when you need more power. No
            hidden fees, no surprises.
          </Subheading>
        </div>

        {/* Period Tabs */}
        <PeriodTabs
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={setSelectedTimePeriod}
        />

        {/* Pricing Cards Grid - 4 columns on desktop */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <PricingCard
                key={plan.slug}
                plan={plan}
                selectedTimePeriod={selectedTimePeriod}
              />
            ))}
          </div>
        )}

        {/* View Full Pricing Link */}
        <div className="text-center mt-12">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            Need more options? View our complete pricing plans
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">View all pricing plans</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};
