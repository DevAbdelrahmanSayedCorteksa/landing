import type { Metadata } from "next";
import { PrivacyPageClient } from "./privacy-client";
import { generateAlternates, BreadcrumbSchema } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("/privacy", locale as Locale);

  return {
    title: "Privacy Policy | Corteksa CRM",
    description:
      "Learn how Corteksa CRM collects, uses, and protects your personal information in compliance with GDPR, CCPA, and Saudi PDPL.",
    alternates,
    openGraph: {
      title: "Privacy Policy | Corteksa CRM",
      description: "Comprehensive privacy policy for Corteksa CRM - SaaS data protection compliance.",
      type: "website",
      url: `https://corteksa.com/${locale}/privacy`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy | Corteksa CRM",
      description: "Comprehensive privacy policy for Corteksa CRM - SaaS data protection compliance.",
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbSchema
        locale={locale as Locale}
        items={[
          { name: "Home", url: "" },
          { name: "Privacy Policy", url: "/privacy" },
        ]}
      />
      <PrivacyPageClient />
    </>
  );
}
