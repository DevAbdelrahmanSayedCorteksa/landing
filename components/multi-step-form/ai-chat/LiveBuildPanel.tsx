"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import { Check, ExternalLink } from "lucide-react";
import { IconLoader2, IconSearch, IconRocket } from "@tabler/icons-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TypewriterMarkdown } from "./TypewriterMarkdown";
import { useAITemplateChatContext } from "@/lib/contexts/AITemplateChatContext";
import { WorkspaceSimulation } from "./WorkspaceSimulation";
import { StreamingPreview } from "./StreamingPreview";
import { TemplatePlanResult } from "@/lib/types/aiChat";
import dynamic from "next/dynamic";
import { Unbounded } from "next/font/google";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "600", "700"] });

const PlasmaGlobe = dynamic(() => import("@/components/lightswind/plasma-globe"), { ssr: false });

const rtlLocales = ["ar", "fa"];

interface LiveBuildPanelProps {
  onProceedToWorkspace?: () => Promise<void>;
  workspaceDomain?: string;
}

export function LiveBuildPanel({ onProceedToWorkspace, workspaceDomain }: LiveBuildPanelProps) {
  const t = useTranslations("multiStepForm");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale);

  const {
    currentTemplate,
    savedTemplateSlug,
    saveTemplate,
    builderState,
    streamingContent,
    planResult,
    confirmPlan,
  } = useAITemplateChatContext();

  const [isSaving, setIsSaving] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const wasStreamingRef = useRef(false);

  if (streamingContent) {
    wasStreamingRef.current = true;
  }

  const handleSave = () => {
    setIsSaving(true);
    saveTemplate();
    setTimeout(() => setIsSaving(false), 1000);
  };

  const hasTemplate = !!currentTemplate && !savedTemplateSlug;
  const objectCount = currentTemplate?.schema.objects?.length || 0;
  const relationCount = currentTemplate?.schema.relations?.length || 0;

  const isThinking = builderState === "thinking";
  const isAnalyzing = builderState === "analyzing";
  const isPlanReview = builderState === "plan_review" && !!planResult;
  const isStreaming = streamingContent.length > 0 && builderState !== "completed" && builderState !== "idle";
  const showComplete = builderState === "completed" && !!currentTemplate;
  const skipAnimation = showComplete && wasStreamingRef.current;

  const showHeader = isThinking || isAnalyzing || isPlanReview || (isStreaming && !isAnalyzing) || showComplete;

  // Plasma globe: always visible at slow speed, fast during thinking/analyzing
  const showPlasma = !isStreaming && !showComplete && !isPlanReview;
  const plasmaSpeed = (isThinking || isAnalyzing) ? 5.0 : 0.4;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#1e1e22] relative">
      {/* Unified Header */}
      <AnimatePresence mode="wait">
        {showHeader && !showComplete && (
          <motion.div
            key={isPlanReview ? "plan-header" : isStreaming ? "stream-header" : `${builderState}-header`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-8 pt-6 mb-4"
          >
            <div className={`${isPlanReview ? "flex items-center justify-between gap-4" : ""}`}>
              <div className="text-start max-w-2xl">
                {isPlanReview && planResult ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7c3aed] mb-1.5">
                      {planResult.category.replace(/_/g, " ")}
                    </p>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-[#fafafa]">
                      {planResult.template_name}
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-1.5">
                      {isAnalyzing && <IconSearch className="size-5 text-[#a78bfa]" />}
                      {isStreaming && !isAnalyzing && <IconLoader2 className="size-5 text-[#a78bfa] animate-spin" />}
                      <h2 className="text-lg md:text-xl font-display font-semibold text-[#fafafa]">
                        {isThinking ? (
                          <TextShimmer
                            duration={1.8}
                            className="[--base-color:#a1a1aa] [--base-gradient-color:#fafafa]"
                          >
                            {t("sideSubtitle")}
                          </TextShimmer>
                        ) : isAnalyzing ? (
                          <TextShimmer
                            duration={1.8}
                            className="[--base-color:#a1a1aa] [--base-gradient-color:#fafafa]"
                          >
                            {t("analyzing")}
                          </TextShimmer>
                        ) : (
                          t("buildingWorkspace")
                        )}
                      </h2>
                    </div>
                    {(isAnalyzing || (isStreaming && !isAnalyzing)) && (
                      <p className="text-[13px] text-[#71717a]">
                        {t("sideSubtitle")}
                      </p>
                    )}
                  </>
                )}
              </div>

              {isPlanReview && (
                <button
                  onClick={confirmPlan}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-[0_0_16px_rgba(124,58,237,0.25)]"
                >
                  <IconRocket className="size-3.5" />
                  {t("confirmAndBuild")}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {showComplete && currentTemplate && (
          <motion.div
            key="complete-header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-6 mt-5"
          >
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#27272a]/80 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="size-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <Check className="size-3 text-emerald-400" strokeWidth={3} />
                  </div>
                  <p className="text-sm font-semibold text-[#fafafa] truncate">
                    {currentTemplate.template_name}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#71717a] flex-wrap ps-7">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7c3aed]/10 text-[#a78bfa]">
                    {currentTemplate.category}
                  </span>
                  <span className="text-[#3f3f46]">·</span>
                  <span>{objectCount} {objectCount === 1 ? "Object" : "Objects"}</span>
                  <span className="text-[#3f3f46]">·</span>
                  <span>{relationCount} {relationCount === 1 ? "Relation" : "Relations"}</span>
                </div>
              </div>

              {savedTemplateSlug && onProceedToWorkspace ? (
                <div className="flex items-center gap-3">
                  {workspaceDomain && (
                    <code className="text-xs text-[#a78bfa] bg-[#7c3aed]/10 px-2.5 py-1 rounded" dir="ltr">
                      {workspaceDomain}.corteksa.net
                    </code>
                  )}
                  <button
                    onClick={async () => {
                      setIsProceeding(true);
                      try { await onProceedToWorkspace(); }
                      catch { setIsProceeding(false); }
                    }}
                    disabled={isProceeding}
                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer shadow-[0_0_16px_rgba(124,58,237,0.25)]"
                  >
                    {isProceeding ? (
                      <>
                        <IconLoader2 className="size-3.5 animate-spin" />
                        {t("creatingWorkspace")}
                      </>
                    ) : (
                      <>
                        <IconRocket className="size-3.5" />
                        {t("proceedToWorkspace")}
                        <ExternalLink className="size-3" />
                      </>
                    )}
                  </button>
                </div>
              ) : hasTemplate ? (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer shadow-[0_0_16px_rgba(124,58,237,0.25)]"
                >
                  {isSaving ? (
                    <>
                      <IconLoader2 className="size-3.5 animate-spin" />
                      {t("saving")}
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      {t("useThisTemplate")}
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className={`flex-1 overflow-hidden ${
          showPlasma
            ? ""
            : showComplete
              ? "px-6 pb-6 pt-3"
              : "px-6 pb-6"
        }`}
      >
        {/* PlasmaGlobe — always visible at slow speed, fast only during analyzing */}
        {showPlasma && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center">
              <div className="relative size-[280px] mb-5">
                <PlasmaGlobe speed={plasmaSpeed} intensity={1.0} />
              </div>

              <AnimatePresence mode="wait">
                {!isThinking && !isAnalyzing && (
                  <motion.div
                    key="idle-text"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextShimmer duration={2} className="text-2xl font-semibold [--base-color:#52525b] [--base-gradient-color:#7c3aed]">
                      {t("previewPlaceholder")}
                    </TextShimmer>
                  </motion.div>
                )}

                {isThinking && (
                  <motion.div
                    key="thinking-text"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextShimmer duration={2} className="text-2xl font-semibold [--base-color:#52525b] [--base-gradient-color:#a78bfa]">
                      {t("thinking")}
                    </TextShimmer>
                  </motion.div>
                )}

                {isAnalyzing && (
                  <motion.div
                    key="analyzing-dots"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="size-2 rounded-full bg-[#7c3aed]"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isPlanReview && planResult && !isStreaming && !showComplete && (
            <motion.div
              key="plan-review"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full"
            >
              <PlanObjectsGrid planResult={planResult} />
            </motion.div>
          )}

          {isStreaming && !isAnalyzing && (
            <motion.div
              key="streaming"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full"
            >
              <StreamingPreview streamingContent={streamingContent} isRTL={isRTL} />
            </motion.div>
          )}

          {showComplete && currentTemplate && (
            <motion.div
              key={`complete-${currentTemplate.template_name}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full"
            >
              <WorkspaceSimulation template={currentTemplate} isRTL={isRTL} skipAnimation={skipAnimation} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cortex AI — bottom right */}
      <span className={`${unbounded.className} absolute bottom-4 end-5 text-xs font-normal tracking-wider text-[#fafafa]/30`}>
        Cortex <span className="text-[#7c3aed]/50">AI</span>
      </span>
    </div>
  );
}

// ── Plan Objects Grid ──

function PlanObjectsGrid({
  planResult,
}: {
  planResult: TemplatePlanResult;
}) {
  const planText = planResult.description
    || planResult.objects.map((o) => `- **${o.name}** — ${o.description}`).join("\n");

  return (
    <div className="w-full px-2 pb-6 overflow-y-auto max-h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/[0.06] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/10">
      <TypewriterMarkdown content={planText} speed={3} interval={10} size="sm" showCursor={false} />
    </div>
  );
}
