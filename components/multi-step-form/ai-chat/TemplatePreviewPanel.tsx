"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale } from "next-intl";
import { Check, AlertCircle } from "lucide-react";
import { IconLoader2, IconRocket } from "@tabler/icons-react";
import { Unbounded } from "next/font/google";
import { WorkspaceSimulation } from "./WorkspaceSimulation";
import { templateService } from "@/lib/services/TemplateService";
import { GeneratedTemplatePreview, TemplateWithSchema } from "@/lib/types/workspace";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "600", "700"] });

const rtlLocales = ["ar", "fa"];

interface TemplatePreviewPanelProps {
  slug: string;
  confirmedSlug?: string;
  onUseTemplate?: (slug: string) => void;
  onCompleteSetup?: () => Promise<void>;
}

export function TemplatePreviewPanel({ slug, confirmedSlug, onUseTemplate, onCompleteSetup }: TemplatePreviewPanelProps) {
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale);

  const [template, setTemplate] = useState<TemplateWithSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProceeding, setIsProceeding] = useState(false);

  const isConfirmed = !!confirmedSlug && confirmedSlug === slug;

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    // Keep old template visible during load — no blank flash

    templateService
      .getTemplateBySlug(slug)
      .then((res) => setTemplate(res.data))
      .catch(() => {
        setError("Failed to load template preview.");
        setTemplate(null);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const preview: GeneratedTemplatePreview | null = template
    ? {
        template_name: template.name,
        category: template.category || "general",
        schema: {
          objects: template.schema.objects ?? [],
          relations: template.schema.relations ?? [],
          sample_data: template.schema.sample_data,
        },
      }
    : null;

  const objectCount = preview?.schema.objects?.length ?? 0;
  const relationCount = preview?.schema.relations?.length ?? 0;
  const isInitialLoad = isLoading && !template;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#1e1e22] relative">

      {/* Header — static, no AnimatePresence, content updates in-place */}
      {template && (
        <div className="mx-6 mt-5 mb-1 flex-shrink-0">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#27272a]/80 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <div className={`size-5 rounded-full flex items-center justify-center flex-shrink-0 ${isConfirmed ? "bg-emerald-500/15" : "bg-[#7c3aed]/15"}`}>
                  <Check className={`size-3 ${isConfirmed ? "text-emerald-400" : "text-[#a78bfa]"}`} strokeWidth={3} />
                </div>
                <p className="text-sm font-semibold text-[#fafafa] truncate">
                  {template.name}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#71717a] flex-wrap ps-7">
                {template.category && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7c3aed]/10 text-[#a78bfa]">
                    {template.category.replace(/_/g, " ")}
                  </span>
                )}
                <span className="text-[#3f3f46]">·</span>
                <span>{objectCount} {objectCount === 1 ? "Object" : "Objects"}</span>
                <span className="text-[#3f3f46]">·</span>
                <span>{relationCount} {relationCount === 1 ? "Relation" : "Relations"}</span>
              </div>
            </div>

            {isConfirmed ? (
              <button
                onClick={async () => {
                  if (!onCompleteSetup) return;
                  setIsProceeding(true);
                  try { await onCompleteSetup(); }
                  catch { setIsProceeding(false); }
                }}
                disabled={isProceeding || !onCompleteSetup}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-[0_0_16px_rgba(16,185,129,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProceeding ? (
                  <IconLoader2 className="size-3.5 animate-spin" />
                ) : (
                  <IconRocket className="size-3.5" />
                )}
                Complete Setup
              </button>
            ) : onUseTemplate ? (
              <button
                onClick={() => onUseTemplate(slug)}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-[0_0_16px_rgba(124,58,237,0.25)]"
              >
                <IconRocket className="size-3.5" />
                Use Template
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-h-0 relative">

        {/* Initial loading */}
        {isInitialLoad && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <IconLoader2 className="size-8 text-[#7c3aed] animate-spin" />
              <p className="text-sm text-[#71717a]">Loading preview…</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-center px-8">
              <AlertCircle className="size-8 text-[#71717a]" />
              <p className="text-sm text-[#71717a]">{error}</p>
            </div>
          </div>
        )}

        {/* Preview — keyed by slug, crossfades in-place, no layout shift */}
        <AnimatePresence mode="wait">
          {preview && !isInitialLoad && (
            <motion.div
              key={`preview-${slug}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 px-6 pb-6 pt-3"
            >
              <WorkspaceSimulation
                template={preview}
                isRTL={isRTL}
                skipAnimation={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Switching overlay */}
        <AnimatePresence>
          {isLoading && !!template && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-[#1e1e22]/50"
            >
              <IconLoader2 className="size-6 text-[#7c3aed] animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Cortex AI branding */}
      <span
        className={`${unbounded.className} absolute bottom-4 end-5 text-xs font-normal tracking-wider text-[#fafafa]/30`}
      >
        Cortex <span className="text-[#7c3aed]/50">AI</span>
      </span>
    </div>
  );
}
