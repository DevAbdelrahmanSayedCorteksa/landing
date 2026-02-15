"use client";

import { PageTransition } from "@/components/page-transition";
import { ScrollSyncProvider } from "@/components/product/scroll-sync-provider";
import { FeaturesHero, FeaturesHeroImage } from "@/components/product/features-hero";
import { FeaturesTabsNav } from "@/components/product/features-tabs-nav";
import { FeaturesScrollStack } from "@/components/product/features-scroll-stack";
import { FeaturesOverview } from "@/components/product/features-overview";
import { FeaturesDocuments } from "@/components/product/features-documents";
import { FeaturesCollaboration } from "@/components/product/features-collaboration";
import { FeaturesBestFit } from "@/components/product/features-best-fit";
import { FeaturesAssistant } from "@/components/product/features-assistant";
import { FeaturesUnits } from "@/components/product/features-units";
import { FeaturesAll } from "@/components/product/features-all";
import { FeaturesComingSoon } from "@/components/product/features-coming-soon";
import { FeaturesMarketplace } from "@/components/product/features-marketplace";

export function ProductsPageClient() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <FeaturesHero />
        <ScrollSyncProvider>
          <FeaturesTabsNav />
          <FeaturesHeroImage />
          <FeaturesScrollStack />
          <FeaturesOverview />
          <FeaturesDocuments />
          <FeaturesCollaboration />
          <FeaturesAssistant />
          <FeaturesUnits />
          <FeaturesBestFit />
          <FeaturesAll />
        </ScrollSyncProvider>
        <FeaturesComingSoon />
        <FeaturesMarketplace />
      </div>
    </PageTransition>
  );
}
