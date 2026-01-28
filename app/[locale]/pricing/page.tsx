import type { Metadata } from "next";
import { PricingPageClient } from "./pricing-client";
import { generateAlternates, ProductSchema, BreadcrumbSchema } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("/pricing", locale as Locale);

  return {
    title: "Pricing - Corteksa CRM",
    description:
      "Flexible pricing for teams of all sizes. Start free and scale with Corteksa CRM. 100% money-back guarantee.",
    alternates,
    openGraph: {
      title: "Pricing - Corteksa CRM",
      description: "Choose the perfect plan for your team. Free forever plan available.",
      type: "website",
      url: `https://corteksa.com/${locale}/pricing`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Pricing - Corteksa CRM",
      description: "Choose the perfect plan for your team. Free forever plan available.",
    },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbSchema
        locale={locale as Locale}
        items={[
          { name: "Home", url: "" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />
      {/* Product/SaaS Schema for rich snippets */}
      <ProductSchema
        locale={locale as Locale}
        name="Corteksa CRM"
        description="AI-powered CRM platform for project management, client management, and team collaboration."
        offers={[
          {
            name: "Free Plan",
            price: "0",
            priceCurrency: "USD",
            description: "Free forever for small teams",
          },
          {
            name: "Pro Plan",
            price: "29",
            priceCurrency: "USD",
            description: "Advanced features for growing teams",
          },
          {
            name: "Enterprise Plan",
            price: "99",
            priceCurrency: "USD",
            description: "Custom solutions for large organizations",
          },
        ]}
      />
      <PricingPageClient />
    </>
  );
}
