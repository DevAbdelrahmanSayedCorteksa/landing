import type { Metadata } from "next";
import { MultiStepFormClient } from "./multi-step-form-client";
import { TimePeriod } from "@/lib/types/pricing";

export const metadata: Metadata = {
  title: "Get Started | Corteksa",
  description: "Complete your Corteksa setup and get started.",
  robots: {
    index: false,
    follow: false,
  },
};

interface MultiStepFormPageProps {
  searchParams: Promise<{ plan?: string; period?: string }>;
}

export default async function MultiStepFormPage({ searchParams }: MultiStepFormPageProps) {
  const params = await searchParams;
  const selectedPlan = params.plan;
  const period = params.period as TimePeriod | undefined;

  return <MultiStepFormClient selectedPlan={selectedPlan} period={period} />;
}
