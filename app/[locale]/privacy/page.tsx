import type { Metadata } from "next";
import { PrivacyPageClient } from "./privacy-client";

export const metadata: Metadata = {
  title: "Privacy Policy | Corteksa CRM",
  description: "Learn how Corteksa CRM collects, uses, and protects your personal information in compliance with GDPR, CCPA, and Saudi PDPL.",
  openGraph: {
    title: "Privacy Policy | Corteksa CRM",
    description: "Comprehensive privacy policy for Corteksa CRM - SaaS data protection compliance.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
