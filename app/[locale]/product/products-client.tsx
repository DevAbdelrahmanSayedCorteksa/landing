"use client";

import { PageTransition } from "@/components/page-transition";
import { ScrollSyncProvider } from "@/components/product/scroll-sync-provider";
import { FeaturesHero, FeaturesHeroImage } from "@/components/product/features-hero";
import { FeaturesTabsNav } from "@/components/product/features-tabs-nav";
import { FeaturesOverview } from "@/components/product/features-overview";
import { FeaturesWorkspace } from "@/components/product/features-workspace";
import { FeaturesIntelligence } from "@/components/product/features-intelligence";
import { FeaturesDocuments } from "@/components/product/features-documents";
import { FeaturesCollaboration } from "@/components/product/features-collaboration";
import { FeaturesSupport } from "@/components/product/features-support";
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
          <FeaturesOverview />
          <FeaturesWorkspace />
          <FeaturesIntelligence />
          <FeaturesDocuments />
          <FeaturesCollaboration />
          <FeaturesSupport />
          <FeaturesAll />
        </ScrollSyncProvider>
        <FeaturesComingSoon />
        <FeaturesMarketplace />
      </div>
    </PageTransition>
  );
}
