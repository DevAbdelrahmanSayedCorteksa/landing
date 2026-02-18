"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/logo";
import { LandingImages } from "@/components/landing-images";
import { MultiStepForm, WorkspaceData } from "@/components/multi-step-form/multi-step-form";
import { TimePeriod } from "@/lib/types/pricing";
import { useTranslations } from "next-intl";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { AITemplateChatProvider } from "@/lib/contexts/AITemplateChatContext";
import { LiveBuildPanel } from "@/components/multi-step-form/ai-chat/LiveBuildPanel";
import { steperService } from "@/lib/services/SteperService";
import { getToken, getRefreshToken, buildSSORedirectUrl, saveWorkspaceSubdomain } from "@/lib/services/AuthLocalService";
import { WorkspaceCreationPayload } from "@/lib/types/workspace";

interface MultiStepFormClientProps {
  selectedPlan?: string;
  period?: TimePeriod;
}

export function MultiStepFormClient({ selectedPlan, period }: MultiStepFormClientProps) {
  const t = useTranslations("multiStepForm");
  const [isAIChatActive, setIsAIChatActive] = useState(false);
  const [hasAIMessages, setHasAIMessages] = useState(false);
  const [wsData, setWsData] = useState<WorkspaceData | null>(null);

  const workspaceDomain = wsData ? (wsData.isFreePlan ? "app" : wsData.subdomain) : "";

  const proceedToWorkspace = useCallback(async () => {
    if (!wsData) return;
    const payload: WorkspaceCreationPayload = {
      workspace_name: wsData.workspace_name,
      pricing_plan_slug: wsData.pricing_plan_slug,
    };
    if (!wsData.isFreePlan) {
      payload.subdomain = wsData.subdomain;
      payload.pricing_period = wsData.pricing_plan_period;
    }
    if (wsData.template_slug) {
      payload.template_slug = wsData.template_slug;
    }

    const response = await steperService(payload) as any;
    const subdomain = response.data?.subdomain || wsData.subdomain;

    const token = getToken();
    const refreshToken = getRefreshToken();
    if (token) {
      const ssoUrl = buildSSORedirectUrl(subdomain, token, refreshToken || "", false);
      saveWorkspaceSubdomain(subdomain);
      window.location.href = ssoUrl;
    }
  }, [wsData]);

  // Show 2-panel layout only after first message is sent
  const showTwoPanel = isAIChatActive && hasAIMessages;

  const gridContent = (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`grid transition-[grid-template-columns] duration-700 ease-out ${
        isAIChatActive
          ? showTwoPanel
            ? "lg:grid-cols-[1fr_2fr] h-screen"
            : "grid-cols-1 h-screen"
          : "lg:grid-cols-2 min-h-screen"
      }`}
    >
      {/* Left Section - Chat / Form */}
      <motion.div
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`flex items-center justify-center transition-all duration-700 ease-out ${
          isAIChatActive
            ? showTwoPanel
              ? "h-screen p-0 pt-14"
              : "h-screen p-0"
            : "p-8 md:p-12 lg:p-16 lg:border-e border-border"
        }`}
      >
        <motion.div
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`w-full transition-all duration-700 ease-out ${isAIChatActive ? "h-full" : "max-w-3xl"}`}
        >
          <MultiStepForm
            selectedPlan={selectedPlan}
            period={period}
            onAIChatActiveChange={setIsAIChatActive}
            onAIHasMessagesChange={setHasAIMessages}
            onWorkspaceDataReady={setWsData}
          />
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <AnimatePresence mode="wait">
        {showTwoPanel ? (
          <motion.section
            key="live-build"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex flex-col justify-start relative h-screen p-3 ps-0"
          >
            <div className="flex-1 rounded-2xl border border-white/[0.06] bg-[#1e1e22] overflow-hidden">
              <LiveBuildPanel
                onProceedToWorkspace={wsData ? proceedToWorkspace : undefined}
                workspaceDomain={workspaceDomain}
              />
            </div>
          </motion.section>
        ) : !isAIChatActive ? (
          <motion.section
            key="default-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex flex-col justify-start relative overflow-hidden min-h-screen pt-8 md:pt-12 lg:pt-16"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full px-8 md:px-12 lg:px-16 mb-16"
            >
              <div className="text-start max-w-2xl">
                <Heading as="h2" className="text-2xl md:text-3xl lg:text-4xl mb-3">
                  {t("sideTitle")}
                </Heading>
                <Subheading className="text-base">
                  {t("sideSubtitle")}
                </Subheading>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full"
            >
              <LandingImages />
            </motion.div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <main className={`relative ${isAIChatActive ? "bg-[#0f0f0f] h-screen overflow-hidden" : "bg-background min-h-screen overflow-hidden"}`}>
      {/* Background Glow - Top Corner */}
      <div
        className="absolute top-0 start-0 w-[300px] h-[300px] bg-primary/35 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 -translate-y-1/2"
      />

      {/* Logo - Top Left */}
      <motion.div
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-6 start-6 z-50"
      >
        <Logo />
      </motion.div>

      <AITemplateChatProvider>{gridContent}</AITemplateChatProvider>
    </main>
  );
}
