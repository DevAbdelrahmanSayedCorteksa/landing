import type { Metadata } from "next";
import { PricingPageClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing - Corteksa CRM",
  description:
    "Flexible pricing for teams of all sizes. Start free and scale with Corteksa CRM. 100% money-back guarantee.",
  openGraph: {
    title: "Pricing - Corteksa CRM",
    description: "Choose the perfect plan for your team. Free forever plan available.",
    type: "website",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
