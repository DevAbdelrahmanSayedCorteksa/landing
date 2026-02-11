"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconLayoutGrid,
  IconTargetArrow,
  IconEye,
  IconCheck,
  IconFileText,
  IconUsers,
  IconFolder,
  IconArrowRight,
} from "@tabler/icons-react";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { useScrollSync, type TabId } from "./scroll-sync-provider";

// ── Shared visual props ──
interface VisualProps {
  isRTL: boolean;
  t: (key: string) => string;
}

// ── Structure Visual ──
function StructureVisual({ isRTL, t }: VisualProps) {
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[300px] flex flex-col items-center gap-0">
        {/* Projects node (top) */}
        <div className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/15 border border-white/25">
          <IconFolder className="size-[18px] text-white/90 shrink-0" />
          <span className="text-sm font-semibold text-white/95">{t("visProjects")}</span>
        </div>

        {/* Vertical line down */}
        <div className="w-px h-6 bg-white/25" />

        {/* Horizontal branch */}
        <div className="relative w-full flex items-start justify-center">
          <div className="absolute top-0 left-[25%] right-[25%] h-px bg-white/25" />
          <div className="absolute top-0 left-[25%] w-px h-6 bg-white/25" />
          <div className="absolute top-0 right-[25%] w-px h-6 bg-white/25" />
        </div>

        {/* Spacer for branch lines */}
        <div className="h-6" />

        {/* Child nodes row */}
        <div className="w-full flex justify-between gap-4">
          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/18">
            <IconUsers className="size-4 text-white/75 shrink-0" />
            <span className="text-[13px] font-medium text-white/85">{t("visClients")}</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/18">
            <IconFileText className="size-4 text-white/75 shrink-0" />
            <span className="text-[13px] font-medium text-white/85">{t("visDocuments")}</span>
          </div>
        </div>

        {/* Bottom branch lines */}
        <div className="relative w-full flex items-start justify-center">
          <div className="absolute top-0 left-[25%] w-px h-6 bg-white/18" />
          <div className="absolute top-0 right-[25%] w-px h-6 bg-white/18" />
          <div className="absolute top-6 left-[25%] right-[25%] h-px bg-white/18" />
          <div className="absolute top-6 left-1/2 w-px h-6 bg-white/18" />
        </div>

        {/* Spacer */}
        <div className="h-12" />

        {/* Obligations node (bottom) */}
        <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-white/7 border border-white/14">
          <IconCheck className="size-4 text-white/65 shrink-0" />
          <span className="text-[13px] font-medium text-white/75">{t("visObligations")}</span>
        </div>
      </div>
    </div>
  );
}

// ── Control Visual ──
function ControlVisual({ isRTL, t }: VisualProps) {
  const tasks = [
    { labelKey: "visSiteInspection", progress: 85, checked: true },
    { labelKey: "visClientApproval", progress: 60, checked: false },
    { labelKey: "visReportDelivery", progress: 30, checked: false },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative w-full h-full flex items-center justify-center p-2">
      <div className="w-full max-w-[280px] space-y-4">
        {tasks.map((task, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-4 rounded border flex items-center justify-center",
                    task.checked
                      ? "bg-white border-white"
                      : "border-primary/40"
                  )}
                >
                  {task.checked && (
                    <IconCheck className="size-3 text-primary" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    task.checked
                      ? "text-primary-foreground/70 line-through"
                      : "text-primary-foreground/90"
                  )}
                >
                  {t(task.labelKey)}
                </span>
              </div>
              <span className="text-[10px] tabular-nums text-primary-foreground/60 font-mono">
                {task.progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-primary-foreground/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/80"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ))}
        {/* Summary */}
        <div className="pt-2 border-t border-primary-foreground/10 flex items-center justify-between">
          <span className="text-[11px] text-primary-foreground/60">
            {t("visActiveTasks")}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-white font-medium">
            {t("visViewAll")} <IconArrowRight className={cn("size-3", isRTL && "rotate-180")} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Clarity Visual ──
function ClarityVisual({ isRTL, t }: VisualProps) {
  const docs = [
    { nameKey: "visContractFile", tagKey: "visProjectA", connected: true },
    { nameKey: "visSiteReport", tagKey: "visInspection", connected: true },
    { nameKey: "visInvoice", tagKey: "visBilling", connected: false },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative w-full h-full flex items-center justify-center p-2">
      <div className="w-full max-w-[280px] space-y-3">
        {docs.map((doc, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/50"
          >
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <IconFileText className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-200 truncate">
                {t(doc.nameKey)}
              </p>
              <p className="text-[10px] text-neutral-500">{t(doc.tagKey)}</p>
            </div>
            {doc.connected && (
              <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <IconCheck className="size-3 text-emerald-400" />
              </div>
            )}
          </div>
        ))}
        {/* Connection indicator */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="h-px flex-1 bg-neutral-700/50" />
          <span className="text-[10px] text-neutral-500 font-medium">
            {t("visLinkedToProject")}
          </span>
          <div className="h-px flex-1 bg-neutral-700/50" />
        </div>
      </div>
    </div>
  );
}

export function FeaturesScrollStack() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const ref = useRef<HTMLElement>(null);
  const { registerSection } = useScrollSync();

  useEffect(() => {
    if (ref.current) {
      registerSection("the-system" as TabId, ref.current);
    }
  }, [registerSection]);

  return (
    <section
      ref={ref}
      id="the-system"
      className="pt-16 md:pt-24 lg:pt-32"
      style={{ scrollMarginTop: "6rem" }}
    >
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>{t("systemTitle")}</Heading>
          <Subheading className="mt-4 mx-auto text-center max-w-3xl">
            {t("systemSubtitle")}
          </Subheading>
        </div>
      </Container>

      <ScrollStack
        useWindowScroll={true}
        innerClassName="pt-4 px-4 md:px-8 lg:px-20 pb-[10rem]"
        itemScale={0.03}
        itemStackDistance={30}
        stackPosition="20%"
        baseScale={0.85}
      >
        {/* ── Card 1: Structure — Dark card ── */}
        <ScrollStackItem
          itemClassName={cn(
            "min-h-[380px] md:min-h-[460px]",
            "bg-neutral-900",
            "border border-neutral-800",
            "shadow-[0_0_40px_rgba(0,0,0,0.25)]",
            "max-w-6xl mx-auto !p-0 overflow-hidden"
          )}
        >
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(
              "flex flex-col md:flex-row h-full min-h-[380px] md:min-h-[460px]"
            )}
          >
            {/* Left: Text */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
              <div
                className="flex items-center gap-3 mb-4"
              >
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <IconLayoutGrid className="size-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                  {t("systemStructureTitle")}
                </h3>
              </div>
              <p
                className="text-base md:text-lg text-neutral-400 font-inter leading-relaxed"
              >
                {t("systemStructureDesc")}
              </p>
            </div>
            {/* Right: Visual */}
            <div className={cn("flex-1 md:max-w-[45%] bg-white/5 border-t md:border-t-0 border-neutral-800 p-6", isRTL ? "md:border-r" : "md:border-l")}>
              <StructureVisual isRTL={isRTL} t={t} />
            </div>
          </div>
        </ScrollStackItem>

        {/* ── Card 2: Control — Primary purple card ── */}
        <ScrollStackItem
          itemClassName={cn(
            "min-h-[380px] md:min-h-[460px]",
            "bg-primary",
            "border border-primary/80",
            "shadow-[0_0_40px_rgba(129,94,255,0.2)]",
            "max-w-6xl mx-auto !p-0 overflow-hidden"
          )}
        >
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(
              "flex flex-col md:flex-row h-full min-h-[380px] md:min-h-[460px]"
            )}
          >
            {/* Left: Text */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
              <div
                className="flex items-center gap-3 mb-4"
              >
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <IconTargetArrow className="size-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                  {t("systemControlTitle")}
                </h3>
              </div>
              <p
                className="text-base md:text-lg text-white/75 font-inter leading-relaxed"
              >
                {t("systemControlDesc")}
              </p>
            </div>
            {/* Right: Visual */}
            <div className={cn("flex-1 md:max-w-[45%] bg-white/5 border-t md:border-t-0 border-white/10 p-6", isRTL ? "md:border-r" : "md:border-l")}>
              <ControlVisual isRTL={isRTL} t={t} />
            </div>
          </div>
        </ScrollStackItem>

        {/* ── Card 3: Clarity — Dark charcoal card ── */}
        <ScrollStackItem
          itemClassName={cn(
            "min-h-[380px] md:min-h-[460px]",
            "bg-neutral-950",
            "border border-neutral-800",
            "shadow-[0_0_40px_rgba(0,0,0,0.3)]",
            "max-w-6xl mx-auto !p-0 overflow-hidden"
          )}
        >
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(
              "flex flex-col md:flex-row h-full min-h-[380px] md:min-h-[460px]"
            )}
          >
            {/* Left: Text */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
              <div
                className="flex items-center gap-3 mb-4"
              >
                <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <IconEye className="size-5 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                  {t("systemClarityTitle")}
                </h3>
              </div>
              <p
                className="text-base md:text-lg text-neutral-400 font-inter leading-relaxed"
              >
                {t("systemClarityDesc")}
              </p>
            </div>
            {/* Right: Visual */}
            <div className={cn("flex-1 md:max-w-[45%] bg-white/[0.03] border-t md:border-t-0 border-neutral-800 p-6", isRTL ? "md:border-r" : "md:border-l")}>
              <ClarityVisual isRTL={isRTL} t={t} />
            </div>
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </section>
  );
}
