import { FAQs } from "@/components/faqs";
import { Features } from "@/components/features";
import { FeaturesSecondary } from "@/components/features-secondary";
import { FeaturesTertiary } from "@/components/features-tertiary";
import { Hero } from "@/components/hero";
import { LogoCloud } from "@/components/logo-cloud";
import { ModeToggle } from "@/components/mode-toggle";
import { Outcomes } from "@/components/outcomes";
import { Pricing } from "@/components/pricing";
import { Speed } from "@/components/speed";
import Image from "next/image";

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
      <FAQs />
    </div>
  );
}
