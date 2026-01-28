import type { Metadata } from "next";
import { ContactClient } from "./contact-client";
import { generateAlternates, BreadcrumbSchema } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("/contact", locale as Locale);

  return {
    title: "Contact Us | Corteksa",
    description:
      "Get in touch with the Corteksa team. We're here to help with any questions about our AI-powered CRM platform.",
    alternates,
    openGraph: {
      title: "Contact Us | Corteksa",
      description: "Get in touch with the Corteksa team. We're here to help with any questions about our AI-powered CRM platform.",
      type: "website",
      url: `https://corteksa.com/${locale}/contact`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us | Corteksa",
      description: "Get in touch with the Corteksa team. We're here to help with any questions about our AI-powered CRM platform.",
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbSchema
        locale={locale as Locale}
        items={[
          { name: "Home", url: "" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <ContactClient />
    </>
  );
}
