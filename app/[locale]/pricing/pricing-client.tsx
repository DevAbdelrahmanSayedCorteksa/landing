"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { AnimatedPrice } from "@/components/ui/animated-price";
import * as PricingCardUI from "@/components/pricing-card";

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
  IconMinus,
  IconPlus,
  IconArrowRight,
  IconArrowDown,
  IconCalculator,
} from "@tabler/icons-react";

import Image from "next/image";
import CreditCard from "@/components/credit-card-1";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { PricingPlan, TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { PRICING_KEY, pricingService } from "@/lib/services/PricingService";
import { useLocale, useTranslations } from "next-intl";
import { rtlLocales, Locale } from "@/i18n/routing";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

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
    name: "Team & Permissions",
    features: [
      { name: "Recommended team size", free: "Individuals & small teams", unlimited: "Up to 5 members", business: "Up to 12 members", enterprise: "Large teams" },
      { name: "User roles", free: "1 admin + 3 members", unlimited: "Up to 3 custom roles", business: "Unlimited custom roles", enterprise: "Unlimited custom roles" },
      { name: "Member permissions", free: "Edit assigned only", unlimited: "Role-based", business: "Fully customizable", enterprise: "Fully customizable" },
      { name: "View-only users", free: "Unlimited", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    name: "Core Features",
    features: [
      { name: "Corteksa Units", free: "Up to 3", unlimited: "Up to 10", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Tasks", free: "Limited (TBD)", unlimited: "Limited (TBD)", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Custom fields", free: "15", unlimited: "35", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Comments & mentions", free: true, unlimited: true, business: true, enterprise: true },
    ],
  },
  {
    name: "AI & Documents",
    features: [
      { name: "WhatsApp / Corteksa Assistant", free: "100 tasks", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Document generation", free: "30 documents", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Document templates", free: "2 templates", unlimited: "5 templates", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Watermark on documents", free: "Yes", unlimited: "No", business: "No", enterprise: "No" },
    ],
  },
  {
    name: "Storage & Data",
    features: [
      { name: "Data storage", free: "100 MB", unlimited: "1 GB", business: "10 GB", enterprise: "Custom" },
      { name: "Data import & export", free: false, unlimited: true, business: true, enterprise: true },
      { name: "Marketplace access", free: false, unlimited: true, business: true, enterprise: true },
      { name: "API integrations", free: false, unlimited: false, business: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    name: "Advanced Features",
    features: [
      { name: "Audit logs", free: false, unlimited: false, business: true, enterprise: true },
      { name: "Daily backups", free: false, unlimited: false, business: false, enterprise: true },
      { name: "Smart dashboard", free: "—", unlimited: "—", business: "Coming soon", enterprise: "Coming soon" },
      { name: "White-labeling", free: false, unlimited: false, business: false, enterprise: true },
      { name: "System customization", free: false, unlimited: false, business: false, enterprise: true },
    ],
  },
  {
    name: "Security & Compliance",
    features: [
      { name: "Local data residency", free: false, unlimited: false, business: false, enterprise: true },
      { name: "SSO (SAML-based)", free: false, unlimited: false, business: false, enterprise: true },
      { name: "2FA enforcement", free: false, unlimited: false, business: false, enterprise: true },
    ],
  },
  {
    name: "Support & Training",
    features: [
      { name: "Support", free: "Email (48 hrs)", unlimited: "Email + AI chat (24 hrs)", business: "Chat (90 min SLA)", enterprise: "Chat (45 min SLA)" },
      { name: "Live onboarding & training", free: false, unlimited: false, business: false, enterprise: true },
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

// Static Pricing Plans
interface StaticPlan {
  slug: string;
  name: string;
  description: string;
  isPopular: boolean;
  buttonVariant: "outline" | "contained";
  pricing: Record<TimePeriod, number | null>;
  features: string[];
}

const STATIC_PLANS: StaticPlan[] = [
  {
    slug: "free",
    name: "Free Forever",
    description: "For individuals & small teams",
    isPopular: false,
    buttonVariant: "outline",
    pricing: { sixMonths: 0, nineMonths: 0, twelveMonths: 0 },
    features: [
      "1 admin + 3 members",
      "Unlimited viewers",
      "Up to 3 Corteksa Units",
      "100 AI assistant tasks",
      "30 documents, 2 templates",
      "15 custom fields",
      "100 MB storage",
      "Email support (48h)",
    ],
  },
  {
    slug: "basic",
    name: "Basic",
    description: "For growing teams up to 5 members",
    isPopular: false,
    buttonVariant: "outline",
    pricing: { sixMonths: 12, nineMonths: 10, twelveMonths: 8 },
    features: [
      "5 members, 3 custom roles",
      "Up to 10 Corteksa Units",
      "Unlimited AI & documents",
      "5 templates, no watermark",
      "35 custom fields",
      "1 GB storage",
      "Import & export",
      "Marketplace access",
    ],
  },
  {
    slug: "advanced",
    name: "Advanced",
    description: "For teams up to 12 members",
    isPopular: true,
    buttonVariant: "contained",
    pricing: { sixMonths: 29, nineMonths: 24, twelveMonths: 19 },
    features: [
      "Unlimited roles, units & tasks",
      "Unlimited docs & templates",
      "Full custom permissions",
      "API integrations & audit logs",
      "10 GB storage",
      "Marketplace access",
      "Audit logs included",
      "Chat support (90 min SLA)",
    ],
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    isPopular: false,
    buttonVariant: "outline",
    pricing: { sixMonths: null, nineMonths: null, twelveMonths: null },
    features: [
      "Everything in Advanced",
      "White-label & customization",
      "SSO, 2FA & data residency",
      "Daily backups",
      "Onboarding & training",
      "Unlimited API access",
      "Smart dashboard (soon)",
      "Chat support (45 min SLA)",
    ],
  },
];

// Pricing Hero — matches product page hero style
function PricingHero({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="relative pt-24 md:pt-32 lg:pt-40 pb-8">
      {/* Subtle background lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200/80 dark:via-neutral-800/80 to-transparent" />
        <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200/80 dark:via-neutral-800/80 to-transparent" />

      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-display font-bold leading-relaxed"
          >
            {t("heroTagline1")}
            <span className="mx-2 text-primary">·</span>
            {t("heroTagline2")}
            <span className="mx-2 text-primary">·</span>
            {t("heroTagline3")}
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
                {t("contactSales")}
                <IconArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// Helper Function: Render Feature Value
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

// Pricing Card Component
function PricingCard({ plan, selectedTimePeriod, t }: {
  plan: StaticPlan;
  selectedTimePeriod: TimePeriod;
  t: ReturnType<typeof useTranslations>;
}) {
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

// Marketplace Card Component
function MarketplaceCard({ item, t, index }: { item: MarketplaceItem; t: ReturnType<typeof useTranslations>; index: number }) {
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
        {item.icon}
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

// FAQ Question Component
function FAQQuestion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        "w-full rounded-2xl overflow-hidden border p-4 md:p-6 transition-all duration-200 text-start",
        open
          ? "border-primary/30 bg-white dark:bg-neutral-800/80 shadow-sm"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base md:text-lg font-bold font-display text-neutral-800 dark:text-neutral-200">
          {question}
        </h3>
        <div className={cn(
          "size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200",
          open ? "bg-primary/10 text-primary" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
        )}>
          <IconMinus
            className={cn(
              "size-4 absolute transition-all duration-200",
              open ? "scale-100 rotate-0" : "scale-0 rotate-90"
            )}
          />
          <IconPlus
            className={cn(
              "size-4 absolute transition-all duration-200",
              open ? "scale-0 -rotate-90" : "scale-100 rotate-0"
            )}
          />
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <motion.p
          key={String(open)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
        >
          {answer}
        </motion.p>
      </motion.div>
    </button>
  );
}

// Cost Calculator — competitor apps data
const COMPETITOR_APPS = [
  { id: "google-drive", name: "Google Drive", price: 13, icon: "/icons/Google Drive.svg" },
  { id: "slack", name: "Slack", price: 9, icon: "/icons/Slack.svg" },
  { id: "salesforce", name: "Salesforce", price: 25, icon: "/icons/Salesforce.svg" },
  { id: "teams", name: "Teams", price: 8, icon: "/icons/Teams.svg" },
  { id: "hubspot", name: "HubSpot", price: 20, icon: "/icons/HubSpot.svg" },
  { id: "chatgpt", name: "ChatGPT", price: 20, icon: "/icons/ChatGPT.svg" },
  { id: "asana", name: "Asana", price: 15, icon: "/icons/Asana.svg" },
  { id: "trello", name: "Trello", price: 11, icon: "/icons/Trello.svg" },
  { id: "monday", name: "Monday", price: 12, icon: "/icons/Monday.svg" },
  { id: "notion", name: "Notion", price: 12, icon: "/icons/Notion.svg" },
  { id: "loom", name: "Loom", price: 12, icon: "/icons/Loom.svg" },
  { id: "jira", name: "Jira", price: 12, icon: "/icons/Jira.svg" },
  { id: "smartsheet", name: "Smartsheet", price: 16, icon: "/icons/Smartsheet.svg" },
  { id: "airtable", name: "Airtable", price: 15, icon: "/icons/Airtable.svg" },
  { id: "linear", name: "Linear", price: 11, icon: "/icons/Linear.svg" },
  { id: "productboard", name: "ProductBoard", price: 20, icon: "/icons/ProductBoard.svg" },
  { id: "lattice", name: "Lattice", price: 15, icon: "/icons/Lattice.svg" },
  { id: "mural", name: "Mural", price: 13, icon: "/icons/Mural.svg" },
  { id: "clockify", name: "Clockify", price: 9, icon: "/icons/Clockify.svg" },
  { id: "hourstack", name: "HourStack", price: 13, icon: "/icons/HourStack.svg" },
  { id: "confluence", name: "Confluence", price: 9, icon: "/icons/Confluence.svg" },
  { id: "sharepoint", name: "SharePoint", price: 14, icon: "/icons/SharePoint.svg" },
  { id: "coda", name: "Coda", price: 15, icon: "/icons/Coda.svg" },
  { id: "miro", name: "Miro", price: 12, icon: "/icons/Miro.svg" },
];

const DEFAULT_SELECTED = new Set(["slack", "asana", "notion", "jira", "google-drive", "confluence"]);
const CORTEKSA_PRICE_PER_USER_MONTH = 12;

function CostCalculator({ t }: { t: ReturnType<typeof useTranslations> }) {
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(() => new Set(DEFAULT_SELECTED));
  const [teamSize, setTeamSize] = useState(1);

  const toggleApp = (id: string) => {
    setSelectedApps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedList = useMemo(
    () => COMPETITOR_APPS.filter(app => selectedApps.has(app.id)),
    [selectedApps]
  );

  const competitorMonthly = useMemo(
    () => selectedList.reduce((sum, app) => sum + app.price, 0),
    [selectedList]
  );

  const competitorAnnual = competitorMonthly * teamSize * 12;
  const corteksaAnnual = CORTEKSA_PRICE_PER_USER_MONTH * teamSize * 12;
  const savings = Math.max(0, competitorAnnual - corteksaAnnual);

  const handleTeamSize = (val: number) => setTeamSize(Math.min(10000, Math.max(1, val)));
  const step = teamSize < 10 ? 1 : teamSize < 100 ? 10 : 50;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString("en-US")}`;

  return (
    <section className={cn(
      "py-12 md:py-16 lg:py-20",
      "bg-neutral-50/50 dark:bg-neutral-900/30",
    )}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Container>
          {/* Badge */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              <IconCalculator className="size-4" />
              {t("costCalcTitle")}
            </span>
          </div>

          <div className="text-center mb-10 md:mb-14">
            <Heading className="mb-4">{t("costCalcTitle")}</Heading>
            <Subheading className="mx-auto">{t("costCalcSubtitle")}</Subheading>
          </div>

          {/* Gradient border wrapper with shadow */}
          <div className="rounded-3xl p-[2px] bg-gradient-to-br from-primary via-purple-400 to-blue-500 shadow-xl shadow-primary/5">
            <div className="rounded-[calc(1.5rem-2px)] bg-white dark:bg-neutral-950 overflow-hidden">
              <div className={cn(
                "grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]",
                isRTL && "lg:direction-rtl"
              )}>
                {/* LEFT — App Selection */}
                <div className="p-6 md:p-8 lg:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-display font-bold">
                      {t("costCalcWhichApps")}
                    </h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary tabular-nums">
                      {selectedApps.size}/{COMPETITOR_APPS.length}
                    </span>
                  </div>

                  {/* App grid — tiles */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {COMPETITOR_APPS.map((app, index) => {
                      const isSelected = selectedApps.has(app.id);
                      return (
                        <motion.button
                          key={app.id}
                          onClick={() => toggleApp(app.id)}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.02, ease: EASE }}
                          viewport={{ once: true }}
                          className={cn(
                            "group relative flex flex-col items-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all duration-200",
                            isSelected
                              ? "border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10"
                              : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary/30 hover:shadow-sm"
                          )}
                        >
                          {/* Checkmark badge */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1.5 -end-1.5 size-5 rounded-full bg-primary text-white flex items-center justify-center shadow-sm"
                            >
                              <IconCheck className="size-3" />
                            </motion.div>
                          )}
                          {/* Icon */}
                          <div className={cn(
                            "size-10 rounded-xl flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-primary/10"
                              : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-700"
                          )}>
                            <Image
                              src={app.icon}
                              alt={app.name}
                              width={28}
                              height={28}
                              className="size-7 object-contain"
                            />
                          </div>
                          {/* Name */}
                          <span className={cn(
                            "text-[11px] leading-tight text-center w-full truncate transition-colors",
                            isSelected ? "text-primary font-semibold" : "text-muted-foreground"
                          )}>
                            {app.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Team size — card style */}
                  <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <label className="text-sm font-display font-bold block">
                          {t("costCalcTeamSize")}
                        </label>
                        <span className="text-xs text-muted-foreground">{t("costCalcUsers")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleTeamSize(teamSize - step)}
                          disabled={teamSize <= 1}
                          className="rounded-xl size-9"
                        >
                          <IconMinus className="size-4" />
                        </Button>
                        <input
                          type="number"
                          value={teamSize}
                          onChange={e => handleTeamSize(parseInt(e.target.value) || 1)}
                          className="w-20 h-9 text-center text-base font-display font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min={1}
                          max={10000}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleTeamSize(teamSize + step)}
                          disabled={teamSize >= 10000}
                          className="rounded-xl size-9"
                        >
                          <IconPlus className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Cost Summary */}
                <div className={cn(
                  "border-t lg:border-t-0 lg:border-s border-neutral-200 dark:border-neutral-800",
                  "bg-gradient-to-b from-neutral-50 to-neutral-100/50 dark:from-neutral-900/80 dark:to-neutral-900/40",
                  "p-6 md:p-8 lg:p-10 flex flex-col"
                )}>
                  <div className="mb-3">
                    <h3 className="text-lg font-display font-bold">
                      {t("costCalcAppsToReplace")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("costCalcForUsers", { users: teamSize.toLocaleString() })}
                    </p>
                  </div>

                  {/* Selected apps list */}
                  <div className="flex-1 min-h-0 max-h-60 overflow-y-auto overflow-x-hidden my-3 pe-1 [scrollbar-width:thin] [scrollbar-color:var(--color-neutral-300)_transparent] dark:[scrollbar-color:var(--color-neutral-700)_transparent]">
                    <AnimatePresence initial={false}>
                      {selectedList.map(app => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                            <Image
                              src={app.icon}
                              alt={app.name}
                              width={20}
                              height={20}
                              className="size-5 object-contain flex-shrink-0"
                            />
                            <span className="text-sm flex-1 truncate">{app.name}</span>
                            <span className="text-sm font-medium text-muted-foreground tabular-nums">
                              ${app.price}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {selectedList.length === 0 && (
                      <p className="text-sm text-muted-foreground py-10 text-center">
                        {t("costCalcWhichApps")}
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3 mt-auto">
                    {/* Competitor total */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{t("costCalcTotal")}</span>
                      <span className="text-lg font-display font-bold text-red-500 dark:text-red-400">
                        <AnimatedPrice value={competitorAnnual} className="" />
                        <span className="text-xs font-normal text-muted-foreground ms-1">{t("costCalcYear")}</span>
                      </span>
                    </div>

                    {/* Corteksa total */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("costCalcCorteksaFor", { users: teamSize.toLocaleString() })}
                      </span>
                      <span className="text-base font-display font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(corteksaAnnual)}
                        <span className="text-xs font-normal text-muted-foreground ms-1">{t("costCalcYear")}</span>
                      </span>
                    </div>

                    {/* Savings highlight */}
                    {savings > 0 && (
                      <motion.div
                        key={savings}
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 dark:from-primary/15 dark:via-purple-500/15 dark:to-blue-500/15 border border-primary/20 p-5"
                      >
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1 block">
                          {t("costCalcSave")}
                        </span>
                        <div className="text-3xl md:text-4xl font-display font-bold italic bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">
                          {formatCurrency(savings)}{t("costCalcYear")}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t("costCalcSaveDescription", {
                            users: teamSize.toLocaleString(),
                            savings: formatCurrency(savings),
                          })}
                        </p>
                      </motion.div>
                    )}

                    <Button size="lg" className="w-full shadow-brand mt-2" asChild>
                      <Link href="/signup" className="gap-2">
                        {t("costCalcCta")}
                        <IconArrowRight className="size-4 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}

// FAQ keys
const FAQ_KEYS = Array.from({ length: 11 }, (_, i) => i + 1);

// Main Pricing Page Client Component
export function PricingPageClient() {
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const t = useTranslations("pricingPage");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("sixMonths");
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
    <PageTransition>
      <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <PricingHero t={t} />

        <div>

        {/* Pricing Controls + Cards Section */}
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
                    t={t}
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

        {/* No Credit Card Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <Container>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-100 via-purple-50 to-neutral-100 dark:from-neutral-900 dark:via-purple-950/30 dark:to-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
              {/* Background orbs */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 md:p-12 lg:p-16">
                {/* Text content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <IconCircleCheckFilled className="size-4" />
                    {t("noCreditCardBadge")}
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
                    {t("noCreditCardTitle")}
                  </h2>

                  <p className="text-lg text-muted-foreground mb-8 max-w-md">
                    {t("noCreditCardDescription")}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" asChild>
                      <Link href="/signup">{t("heroCta")}</Link>
                    </Button>
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/contact" className="gap-2">
                        {t("contactSales")}
                        <IconArrowRight className="size-4 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>

                {/* Credit card visual */}
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="relative">
                    {/* Strike-through line over the card */}
                    <CreditCard
                      cardHolder="YOUR NAME"
                      cardNumber="0000 0000 0000 0000"
                      expiryDate="--/--"
                      variant="gradient"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>

        {/* Cost Calculator Section */}
        <CostCalculator t={t} />

        {/* Complete Features Comparison Table - alternate bg */}
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

        {/* Marketplace Section - with grid background like product page marketplace */}
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
                    <MarketplaceCard key={item.id} item={item} t={t} index={index} />
                  ))}
                </div>
              </div>
            </Container>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-6 md:py-8 lg:py-12 bg-neutral-50/50 dark:bg-neutral-900/30">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Container>
              <div className="text-center mb-8 md:mb-10">
                <Heading>{t("faqTitle")}</Heading>
              </div>

              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {FAQ_KEYS.map((i) => (
                  <FAQQuestion
                    key={i}
                    question={t(`faq${i}Q`)}
                    answer={t(`faq${i}A`)}
                  />
                ))}
              </div>
            </Container>
          </motion.div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-6 md:py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Container>
              <div className="text-center max-w-3xl mx-auto">
                <Heading className="mb-4">{t("heroTagline")}</Heading>
                <Subheading className="mx-auto mb-8">
                  {t("heroSubtitle")}
                </Subheading>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Button size="lg" className="shadow-brand" asChild>
                    <Link href="/signup">{t("heroCta")}</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact" className="gap-2">
                      {t("contactSales")}
                      <IconArrowRight className="size-4 rtl:rotate-180" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        </section>

        </div>{/* end content sections wrapper */}
      </div>
    </PageTransition>
  );
}
