"use client";

import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import {
  IconCircleCheckFilled,
  IconCheck,
  IconX,
  IconChartBar,
  IconRobot,
  IconShield,
  IconUsers,
  IconClock,
  IconSparkles,
  IconFlameFilled,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { pricingPlans, PricingPlan } from "@/lib/pricing-data";

// Type Definitions
interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  pricePerUser: number;
  icon: React.ReactNode;
  category: string;
}

interface FeatureRow {
  name: string;
  free: boolean | string;
  unlimited: boolean | string;
  business: boolean | string;
  enterprise: boolean | string;
}

interface FeatureCategory {
  name: string;
  features: FeatureRow[];
}

// Feature Comparison Data
const featureComparison: FeatureCategory[] = [
  {
    name: "Core Features",
    features: [
      { name: "Corteksa Units", free: "Up to X", unlimited: "Up to X", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Custom Fields", free: "Up to X", unlimited: true, business: "Unlimited", enterprise: "Unlimited" },
      { name: "Corteksa Assistant", free: "Up to X", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Tasks Management", free: true, unlimited: true, business: "Unlimited", enterprise: "Unlimited" },
      { name: "Kanban Boards", free: "Up to X", unlimited: true, business: "Unlimited", enterprise: "Unlimited" },
      { name: "Team Members", free: "Up to 3", unlimited: "Up to X", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Data Storage", free: "100MB", unlimited: "100MB", business: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    name: "Support & Communication",
    features: [
      { name: "Email Support", free: "24 hrs", unlimited: "4 hrs", business: false, enterprise: false },
      { name: "Chat Support", free: false, unlimited: false, business: "2 hrs", enterprise: "1 hr" },
      { name: "Comments and Mentions", free: false, unlimited: true, business: true, enterprise: true },
      { name: "Live Onboarding Training", free: false, unlimited: false, business: false, enterprise: true },
    ],
  },
  {
    name: "Integration & Data",
    features: [
      { name: "Marketplace Access", free: false, unlimited: true, business: true, enterprise: true },
      { name: "Email Integrations", free: false, unlimited: true, business: true, enterprise: true },
      { name: "Data Import and Export", free: false, unlimited: true, business: true, enterprise: true },
      { name: "Multi-language Support", free: false, unlimited: true, business: true, enterprise: true },
    ],
  },
  {
    name: "Advanced Features",
    features: [
      { name: "Smart Dashboard", free: false, unlimited: true, business: true, enterprise: true },
      { name: "Document Generation", free: false, unlimited: false, business: true, enterprise: true },
      { name: "Workflow Automation", free: false, unlimited: false, business: true, enterprise: true },
      { name: "Advanced Permissions", free: false, unlimited: false, business: true, enterprise: true },
      { name: "Audit Logging", free: false, unlimited: false, business: true, enterprise: true },
      { name: "Daily Backup", free: false, unlimited: false, business: false, enterprise: true },
      { name: "White Label", free: false, unlimited: false, business: false, enterprise: true },
      { name: "System Customization", free: false, unlimited: false, business: false, enterprise: true },
    ],
  },
];

// Marketplace Items Data
const marketplaceItems: MarketplaceItem[] = [
  {
    id: "analytics-pro",
    name: "Analytics Pro",
    description: "Advanced analytics and reporting dashboard with custom metrics",
    pricePerUser: 5,
    icon: <IconChartBar className="size-6 text-primary" />,
    category: "Analytics",
  },
  {
    id: "automation-engine",
    name: "Automation Engine",
    description: "Powerful workflow automation with AI-powered triggers",
    pricePerUser: 8,
    icon: <IconRobot className="size-6 text-primary" />,
    category: "Automation",
  },
  {
    id: "advanced-security",
    name: "Advanced Security",
    description: "Enterprise-grade security features and compliance tools",
    pricePerUser: 10,
    icon: <IconShield className="size-6 text-primary" />,
    category: "Security",
  },
  {
    id: "crm-integration",
    name: "CRM Integration",
    description: "Seamless integration with leading CRM platforms",
    pricePerUser: 6,
    icon: <IconUsers className="size-6 text-primary" />,
    category: "Integration",
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "Intelligent AI assistant for task management and insights",
    pricePerUser: 12,
    icon: <IconSparkles className="size-6 text-primary" />,
    category: "AI",
  },
  {
    id: "time-tracking",
    name: "Time Tracking",
    description: "Comprehensive time tracking with detailed reports",
    pricePerUser: 4,
    icon: <IconClock className="size-6 text-primary" />,
    category: "Productivity",
  },
];

// Duration Options
const durations = [
  { value: "6months" as const, label: "6 Months" },
  { value: "9months" as const, label: "9 Months" },
  { value: "12months" as const, label: "12 Months" },
];

// Helper Function: Render Feature Value
const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <IconCheck className="size-5 text-primary mx-auto" />
    ) : (
      <IconX className="size-5 text-neutral-300 dark:text-neutral-600 mx-auto" />
    );
  }
  return <span className="text-sm font-medium">{value}</span>;
};

// Pricing Card Component
function PricingCard({ plan }: { plan: PricingPlan }) {
  const [showAll, setShowAll] = useState(false);
  const price = plan.monthlyPrice;
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
        {price === null ? (
          <p className="text-4xl md:text-5xl font-bold font-display">Custom</p>
        ) : price === 0 ? (
          <div className="flex items-baseline gap-2">
            <p className="text-4xl md:text-5xl font-bold font-display">$0</p>
            <span className="text-base text-neutral-500 dark:text-neutral-400">
              /month
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-bold font-display">
              ${price}
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
        size="lg"
        variant={plan.ctaVariant}
        className={cn("w-full mb-8", plan.popular && "shadow-brand")}
      >
        {plan.cta}
      </Button>

      {/* Features List */}
      <ul className="space-y-4 flex-grow">
        {displayedFeatures.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <IconCircleCheckFilled className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{feature}</span>
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

// Marketplace Card Component
function MarketplaceCard({ item }: { item: MarketplaceItem }) {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary hover:shadow-lg transition-all">
      {/* Icon */}
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">{item.icon}</div>

      {/* Category Badge */}
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 mb-3">
        {item.category}
      </span>

      {/* Name */}
      <h3 className="text-lg md:text-xl font-bold font-display mb-2">{item.name}</h3>

      {/* Description */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{item.description}</p>

      {/* Price */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-bold font-display">${item.pricePerUser}</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">/user/month</span>
        </div>
      </div>

      {/* CTA */}
      <Button variant="outline" className="w-full">
        Add to workspace
      </Button>
    </div>
  );
}

// Main Pricing Page Client Component
export function PricingPageClient() {
  const [selectedDuration, setSelectedDuration] = useState<"6months" | "9months" | "12months">("12months");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Heading as="h1">
              The best work solution, <br className="hidden md:block" />
              for the best price.
            </Heading>
            <Subheading className="py-8 mx-auto">
              Flexible pricing for teams of all sizes. Start free and scale as you grow.
            </Subheading>
          </div>
        </Container>
      </section>

      {/* Pricing Controls Section */}
      <section className="pt-10 md:pt-20 pb-6 md:pb-10">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Duration Selector */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration.value)}
                  className={cn(
                    "px-6 py-2.5 rounded-full font-medium text-sm transition-all",
                    selectedDuration === duration.value
                      ? "bg-primary text-white shadow-brand"
                      : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  )}
                  aria-label={`Select ${duration.label} duration`}
                >
                  {duration.label}
                </button>
              ))}
            </div>

            {/* Money-back Guarantee */}
            <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 mb-10">
              <IconCircleCheckFilled className="size-5 text-primary" />
              <span className="text-sm font-medium">100% Money-back Guarantee</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards Grid */}
      <section className="pb-10 md:pb-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </Container>
      </section>

      {/* Complete Features Comparison Table */}
      <section className="py-8 md:py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900">
        <Container>
          <div className="text-center mb-6 md:mb-10">
            <Heading className="mb-4">Complete features list</Heading>
            <Subheading className="mx-auto">
              Compare all features across our plans to find the perfect fit
            </Subheading>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" aria-label="Feature comparison across pricing plans">
              <thead>
                <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                  <th className="text-left p-4 font-display font-bold text-lg">Feature</th>
                  <th className="text-center p-4 font-display font-bold text-lg">Free Forever</th>
                  <th className="text-center p-4 font-display font-bold text-lg">Light</th>
                  <th className="text-center p-4 font-display font-bold text-lg bg-primary/5">Advanced</th>
                  <th className="text-center p-4 font-display font-bold text-lg">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((category) => (
                  <Fragment key={category.name}>
                    {/* Category Header */}
                    <tr className="bg-neutral-100 dark:bg-neutral-800">
                      <td
                        colSpan={5}
                        className="p-4 font-display font-bold text-sm uppercase tracking-wide"
                      >
                        {category.name}
                      </td>
                    </tr>

                    {/* Category Features */}
                    {category.features.map((feature) => (
                      <tr
                        key={feature.name}
                        className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                      >
                        <td className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{feature.name}</td>
                        <td className="p-4 text-center">{renderFeatureValue(feature.free)}</td>
                        <td className="p-4 text-center">{renderFeatureValue(feature.unlimited)}</td>
                        <td className="p-4 text-center bg-primary/5">{renderFeatureValue(feature.business)}</td>
                        <td className="p-4 text-center">{renderFeatureValue(feature.enterprise)}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Marketplace Section */}
      <section className="py-8 md:py-12 lg:py-16">
        <Container>
          <div className="text-center mb-6 md:mb-10">
            <Heading className="mb-4">Marketplace Add-ons</Heading>
            <Subheading className="mx-auto">
              Extend your workspace with powerful integrations and tools
            </Subheading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
