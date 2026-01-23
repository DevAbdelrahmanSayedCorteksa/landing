"use client";

import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { AnimatedPrice } from "@/components/ui/animated-price";
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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { PricingPlan, TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { PRICING_KEY, pricingService } from "@/lib/services/PricingService";
import { useLocale, useTranslations } from "next-intl";
import { rtlLocales, Locale } from "@/i18n/routing";

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
      { name: "Cortex AI", free: "Up to X", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
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
interface PricingCardProps {
  plan: PricingPlan;
  selectedTimePeriod: TimePeriod;
  t: ReturnType<typeof useTranslations>;
}

function PricingCard({ plan, selectedTimePeriod, t }: PricingCardProps) {
  const [showAll, setShowAll] = useState(false);
  const price = plan.timePeriodPricing[selectedTimePeriod];
  const periodLabel = TIME_PERIOD_LABELS[selectedTimePeriod];
  const displayedFeatures = showAll ? plan.features : plan.features.slice(0, 4);
  const hasMoreFeatures = plan.features.length > 4;

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
        <div className="absolute top-4 end-4">
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
          <p className="text-4xl md:text-5xl font-bold font-display">{t("custom")}</p>
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
          {showAll ? t("showLess") : t("showMore", { count: plan.features.length - 4 })}
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
function MarketplaceCard({ item, t }: { item: MarketplaceItem; t: ReturnType<typeof useTranslations> }) {
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
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{t("perUserMonth")}</span>
        </div>
      </div>

      {/* CTA */}
      <Button variant="outline" className="w-full">
        {t("addToWorkspace")}
      </Button>
    </div>
  );
}

// Main Pricing Page Client Component
export function PricingPageClient() {
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const t = useTranslations("pricingPage");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("sixMonths");

  const { data, isLoading } = useQuery({
    queryKey: [PRICING_KEY],
    queryFn: pricingService.getPricingPlans,
  });

  const plans = data?.data || [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Heading as="h1">
              {t("heroTitle")} <br className="hidden md:block" />
              {t("heroTitle2")}
            </Heading>
            <Subheading className="py-8 mx-auto">
              {t("heroSubtitle")}
            </Subheading>
          </div>
        </Container>
      </section>

      {/* Pricing Controls Section */}
      <section className="pt-10 md:pt-20 pb-6 md:pb-10">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Period Tabs */}
            <PeriodTabs
              selectedTimePeriod={selectedTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
            />

            {/* Money-back Guarantee */}
            <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 mb-10">
              <IconCircleCheckFilled className="size-5 text-primary" />
              <span className="text-sm font-medium">{t("moneyBackGuarantee")}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards Grid */}
      <section className="pb-10 md:pb-20">
        <Container>
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
                  t={t}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Complete Features Comparison Table */}
      <section className="py-8 md:py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900">
        <Container>
          <div className="text-center mb-6 md:mb-10">
            <Heading className="mb-4">{t("featuresTitle")}</Heading>
            <Subheading className="mx-auto">
              {t("featuresSubtitle")}
            </Subheading>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" aria-label="Feature comparison across pricing plans">
              <thead>
                <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                  <th className="text-start p-4 font-display font-bold text-lg">{t("tableFeature")}</th>
                  <th className="text-center p-4 font-display font-bold text-lg">{t("tableFree")}</th>
                  <th className="text-center p-4 font-display font-bold text-lg">{t("tableLight")}</th>
                  <th className="text-center p-4 font-display font-bold text-lg bg-primary/5">{t("tableAdvanced")}</th>
                  <th className="text-center p-4 font-display font-bold text-lg">{t("tableEnterprise")}</th>
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
            <Heading className="mb-4">{t("marketplaceTitle")}</Heading>
            <Subheading className="mx-auto">
              {t("marketplaceSubtitle")}
            </Subheading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map((item) => (
              <MarketplaceCard key={item.id} item={item} t={t} />
            ))}
          </div>
        </Container>
      </section>
      </div>
    </PageTransition>
  );
}
