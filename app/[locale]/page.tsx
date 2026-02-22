import type { Metadata } from "next";
import { FAQsWithSchema } from "@/components/faqs-with-schema";
import { Features } from "@/components/features";
import { FeaturesSecondary } from "@/components/features-secondary";
import { FeaturesTertiary } from "@/components/features-tertiary";
import { Hero } from "@/components/hero";
import { LogoCloud } from "@/components/logo-cloud";
import { Outcomes } from "@/components/outcomes";
import { Pricing } from "@/components/pricing";
import { Speed } from "@/components/speed";
import { generateAlternates } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("", locale as Locale);

  return {
    title: "Corteksa - Organized Work. Made Simple.",
    description:
      "Projects, responsibilities, and documents — unified in one clear, practical system. Manage your work with clarity and structure.",
    alternates,
    openGraph: {
      title: "Corteksa - Organized Work. Made Simple.",
      description:
        "Projects, responsibilities, and documents — unified in one clear, practical system. Start free today.",
      type: "website",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Corteksa - Organized Work. Made Simple.",
      description:
        "Projects, responsibilities, and documents — unified in one clear, practical system.",
      images: ["/og-image.png"],
    },
  };
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <LogoCloud />
      <Features />
      <Speed />
      <FeaturesSecondary />
      <Outcomes />
      <FeaturesTertiary />
      <Pricing />
      <FAQsWithSchema />
    </div>
  );
}
