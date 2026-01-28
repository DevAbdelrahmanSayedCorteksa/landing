import type { Metadata } from "next";
import { AboutClient } from "./about-client";
import { generateAlternates, BreadcrumbSchema } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("/about", locale as Locale);

  return {
    title: "About Us | Corteksa",
    description:
      "Learn about Corteksa - the AI-powered CRM platform transforming how teams work together.",
    alternates,
    openGraph: {
      title: "About Us | Corteksa",
      description: "Learn about Corteksa - the AI-powered CRM platform transforming how teams work together.",
      type: "website",
      url: `https://corteksa.com/${locale}/about`,
    },
    twitter: {
      card: "summary_large_image",
      title: "About Us | Corteksa",
      description: "Learn about Corteksa - the AI-powered CRM platform transforming how teams work together.",
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbSchema
        locale={locale as Locale}
        items={[
          { name: "Home", url: "" },
          { name: "About", url: "/about" },
        ]}
      />
      <AboutClient />
    </>
  );
}
