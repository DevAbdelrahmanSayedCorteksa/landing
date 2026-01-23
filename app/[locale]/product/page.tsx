import type { Metadata } from "next";
import { ProductsPageClient } from "./products-client";

export const metadata: Metadata = {
  title: "Products & Features - Corteksa CRM",
  description:
    "Discover Corteksa's powerful features: customizable units, document management, team collaboration, and more — all in one platform",
  openGraph: {
    title: "Products & Features - Corteksa CRM",
    description: "Everything you need to run your business, organized and accessible",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
