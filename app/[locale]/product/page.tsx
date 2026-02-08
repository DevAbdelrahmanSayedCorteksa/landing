import type { Metadata } from "next";
import { ProductsPageClient } from "./products-client";
import { generateAlternates, BreadcrumbSchema } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("/product", locale as Locale);

  return {
    title: "Products & Features - Corteksa CRM",
    description:
      "Hundreds of powerful tools in one platform. Explore Corteksa's features: customizable units, Cortex AI, document management, team collaboration, Kanban boards, and more.",
    alternates,
    openGraph: {
      title: "Products & Features - Corteksa CRM",
      description: "Everything you need to run your business, organized and accessible",
      type: "website",
      url: `https://corteksa.com/${locale}/product`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Products & Features - Corteksa CRM",
      description: "Everything you need to run your business, organized and accessible",
    },
  };
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbSchema
        locale={locale as Locale}
        items={[
          { name: "Home", url: "" },
          { name: "Products", url: "/product" },
        ]}
      />
      <ProductsPageClient />
    </>
  );
}
