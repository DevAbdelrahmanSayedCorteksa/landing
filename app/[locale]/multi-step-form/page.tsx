import { getTranslations } from "next-intl/server";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Logo } from "@/components/logo";
import { LandingImages } from "@/components/landing-images";
import { MultiStepForm } from "@/components/multi-step-form/multi-step-form";
import { TimePeriod } from "@/lib/types/pricing";

interface MultiStepFormPageProps {
  searchParams: Promise<{ plan?: string; period?: string }>;
}

export default async function MultiStepFormPage({ searchParams }: MultiStepFormPageProps) {
  const params = await searchParams;
  const selectedPlan = params.plan;
  const period = params.period as TimePeriod | undefined;
  const t = await getTranslations("multiStepForm");

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background relative">
      {/* Logo - Top Left */}
      <div className="absolute top-6 start-6 z-50">
        <Logo />
      </div>

      {/* Left Section - Multi-Step Form */}
      <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 lg:border-e border-border">
        <div className="w-full max-w-lg">
          <MultiStepForm selectedPlan={selectedPlan} period={period} />
        </div>
      </div>

      {/* Right Section - Images */}
      <section className="hidden lg:flex flex-col justify-start pt-8 md:pt-12 lg:pt-16 relative overflow-hidden min-h-screen">
        <div className="w-full px-8 md:px-12 lg:px-16 mb-16">
          <div className="text-start max-w-2xl">
            <Heading as="h2" className="text-2xl md:text-3xl lg:text-4xl mb-3">
              {t("sideTitle")}
            </Heading>
            <Subheading className="text-base">
              {t("sideSubtitle")}
            </Subheading>
          </div>
        </div>

        <div className="w-full">
          <LandingImages />
        </div>
      </section>
    </main>
  );
}
