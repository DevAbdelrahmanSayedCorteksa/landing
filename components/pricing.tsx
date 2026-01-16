"use client";

import { useState } from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { IconCircleCheckFilled, IconFlameFilled } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { pricingPlans, PricingPlan } from "@/lib/pricing-data";

function PricingCard({ plan }: { plan: PricingPlan }) {
  const [showAll, setShowAll] = useState(false);
  const displayedFeatures = showAll ? plan.features : plan.features.slice(0, 4);
  const hasMoreFeatures = plan.features.length > 4;

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 md:p-10 transition-all h-full flex flex-col",
        plan.popular
          ? "bg-primary/10 border-2 border-primary/30"
          : "bg-neutral-100 dark:bg-neutral-800"
      )}
    >
      {/* Popular Icon */}
      {plan.popular && (
        <div className="absolute top-4 right-4">
          <IconFlameFilled className="size-6 text-primary" />
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
        {plan.name}
      </h3>

      {/* Price */}
      <div className="mb-4">
        {plan.monthlyPrice === null ? (
          <p className="text-4xl md:text-5xl font-bold font-display">Custom</p>
        ) : plan.monthlyPrice === 0 ? (
          <div className="flex items-baseline gap-2">
            <p className="text-4xl md:text-5xl font-bold font-display">$0</p>
            <span className="text-base text-neutral-500 dark:text-neutral-400">
              /month
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-bold font-display">
              ${plan.monthlyPrice}
            </span>
            <span className="text-base text-neutral-500 dark:text-neutral-400">
              /user/month
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-base text-neutral-600 dark:text-neutral-400 mb-8">
        {plan.description}
      </p>

      {/* CTA Button */}
      <Button
        asChild
        size="lg"
        variant={plan.ctaVariant}
        className={cn("w-full mb-8", plan.popular && "shadow-brand")}
      >
        <Link href={plan.ctaLink}>{plan.cta}</Link>
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

        {/* Pricing Cards Grid - 4 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* View Full Pricing Link */}
        <div className="text-center mt-12">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            Need more options? We have Light plan starting at $29/month
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">View all pricing plans</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};
