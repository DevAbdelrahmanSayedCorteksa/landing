"use client";

import { PageTransition } from "@/components/page-transition";
import { PricingProvider } from "@/components/pricing/pricing-context";
import { PricingHero } from "@/components/pricing/pricing-hero";
import { PricingCardsSection } from "@/components/pricing/pricing-cards";
import { PricingNoCreditCard } from "@/components/pricing/pricing-no-credit-card";
import { PricingCostCalculator } from "@/components/pricing/pricing-cost-calculator";
import { PricingFeaturesTable } from "@/components/pricing/pricing-features-table";
import { PricingMarketplace } from "@/components/pricing/pricing-marketplace";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { PricingCta } from "@/components/pricing/pricing-cta";
import { useLocale } from "next-intl";
import { rtlLocales, Locale } from "@/i18n/routing";

export function PricingPageClient() {
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <PageTransition>
      <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <PricingHero />

        <div>
          <PricingProvider>
            <PricingCardsSection />
            <PricingNoCreditCard />
            <PricingFeaturesTable />
          </PricingProvider>
          <PricingCostCalculator />
          <PricingMarketplace />
          <PricingFaq />
          <PricingCta />
        </div>
      </div>
    </PageTransition>
  );
}
