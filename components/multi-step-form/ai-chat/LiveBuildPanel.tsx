"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useAITemplateChatContext } from "@/lib/contexts/AITemplateChatContext";
import { WorkspaceSimulation } from "./WorkspaceSimulation";
import { WorkspaceSimulationSkeleton } from "./WorkspaceSimulationSkeleton";

const rtlLocales = ["ar", "fa"];

type PanelState = "idle" | "building" | "complete";

interface LiveBuildPanelProps {
  isPreviewReady?: boolean;
}

export function LiveBuildPanel({ isPreviewReady = false }: LiveBuildPanelProps) {
  const t = useTranslations("multiStepForm");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale);

  const { currentTemplate, savedTemplateSlug, saveTemplate, setPreviewBuildComplete } = useAITemplateChatContext();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    saveTemplate();
    setTimeout(() => setIsSaving(false), 1000);
  };

  const hasTemplate = !!currentTemplate && !savedTemplateSlug;

  // Panel state gated by isPreviewReady (timer in parent) — never shows early
  const panelState: PanelState = isPreviewReady
    ? currentTemplate ? "complete" : "building"
    : "idle";

  const objectCount = currentTemplate?.schema.objects?.length || 0;
  const relationCount = currentTemplate?.schema.relations?.length || 0;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0f0f0f]">
      {/* Header — only for building + complete states */}
      <AnimatePresence mode="wait">
        {panelState === "building" && (
          <motion.div
            key="building-header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16 mb-6"
          >
            <div className="text-start max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="size-5 text-[#7c3aed] animate-spin" />
                <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                  {t("buildingWorkspacePreview")}
                </h2>
              </div>
              <p className="text-sm text-[#8a8a8f]">
                {t("sideSubtitle")}
              </p>
            </div>
          </motion.div>
        )}

        {panelState === "complete" && (
          <motion.div
            key="complete-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mx-8 md:mx-12 lg:mx-16 mt-6 md:mt-8"
          >
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#7c3aed]/20 bg-gradient-to-r from-[#7c3aed]/10 to-transparent px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="size-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <Check className="size-3 text-emerald-500" strokeWidth={3} />
                  </div>
                  <p className="text-sm font-semibold text-[#a78bfa] truncate">
                    {currentTemplate?.template_name}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6a6a6f] flex-wrap ps-7">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e22] text-[#a0a0a5]">
                    {currentTemplate?.category}
                  </span>
                  <span>·</span>
                  <span>{objectCount} {objectCount === 1 ? "Object" : "Objects"}</span>
                  <span>·</span>
                  <span>{relationCount} {relationCount === 1 ? "Relation" : "Relations"}</span>
                </div>
              </div>

              {hasTemplate && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className={`flex-1 overflow-hidden ${panelState === "idle" ? "" : panelState === "complete" ? "px-8 md:px-12 lg:px-16 pb-8 pt-4" : "px-8 md:px-12 lg:px-16 pb-8"}`}>
        <AnimatePresence mode="wait">
          {panelState === "idle" && (
            <motion.div
              key="idle-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.15, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mx-auto mb-6"
                >
                  <Image
                    src="/Corteksa.svg"
                    alt=""
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <TextShimmer
                    duration={2}
                    className="text-base [--base-color:#3a3a3f] [--base-gradient-color:#7c3aed]"
                  >
                    {t("previewPlaceholder")}
                  </TextShimmer>
                </motion.div>
              </div>
            </motion.div>
          )}

          {panelState === "building" && (
            <motion.div
              key="building-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <WorkspaceSimulationSkeleton isRTL={isRTL} />
            </motion.div>
          )}

          {panelState === "complete" && currentTemplate && (
            <motion.div
              key={`complete-${currentTemplate.template_name}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <WorkspaceSimulation template={currentTemplate} isRTL={isRTL} onComplete={() => setPreviewBuildComplete(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
