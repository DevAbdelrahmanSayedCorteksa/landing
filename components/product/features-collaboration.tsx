"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconCheckbox,
  IconProgress,
  IconMessage,
  IconClock,
  IconShield,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionWrapper } from "./section-wrapper";

type FeatureKey = "tasks" | "progress" | "discussion" | "timeline" | "permissions";

/* ------------------------------------------------------------------ */
/*  Tasks Visual                                                       */
/* ------------------------------------------------------------------ */
function TasksVisual({ isRTL, t }: { isRTL: boolean; t: (key: string) => string }) {
  const tasks = [
    { name: t("collabTask1"), assignee: t("collabTask1Assignee"), due: t("collabTask1Due"), priority: t("collabHighPriority") },
    { name: t("collabTask2"), assignee: t("collabTask2Assignee"), due: t("collabTask2Due"), priority: "Medium" },
    { name: t("collabTask3"), assignee: t("collabTask3Assignee"), due: t("collabTask3Due"), priority: "Low" },
  ];
  return (
    <div className="space-y-2" dir={isRTL ? "rtl" : "ltr"}>
      {tasks.map((task, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.08 }}
          className={cn("flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50", isRTL && "flex-row-reverse")}
        >
          <IconCheckbox className="size-4 text-primary shrink-0" />
          <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
            <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">{task.name}</p>
            <div className={cn("flex items-center gap-2 mt-1", isRTL && "flex-row-reverse")}>
              <div className="size-4 rounded-full bg-primary/20 shrink-0" />
              <span className="text-[9px] text-neutral-400">{task.assignee}</span>
              <span className="text-[9px] text-neutral-400">&middot;</span>
              <span className="text-[9px] text-neutral-400">{task.due}</span>
            </div>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 bg-primary/10 text-primary">
            {task.priority}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Visual                                                    */
/* ------------------------------------------------------------------ */
function ProgressVisual({ isRTL, t }: { isRTL: boolean; t: (key: string) => string }) {
  const stats = [
    { label: t("collabProgressDone"), value: 8, pct: "67%" },
    { label: t("collabProgressActive"), value: 3, pct: "25%" },
    { label: t("collabProgressOverdue"), value: 1, pct: "8%" },
  ];
  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <p className="text-2xl font-bold text-primary">67%</p>
        <p className="text-[10px] text-neutral-400">{t("collabProgressTotal")}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex">
        <motion.div initial={{ width: 0 }} animate={{ width: "67%" }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-primary rounded-full" />
        <motion.div initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-primary/40" />
        <motion.div initial={{ width: 0 }} animate={{ width: "8%" }} transition={{ duration: 0.4, delay: 0.5 }} className="bg-primary/20 rounded-r-full" />
      </motion.div>
      <div className="space-y-2">
        {stats.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.2 + idx * 0.1 }}
            className={cn("flex items-center justify-between text-[11px]", isRTL && "flex-row-reverse")}
          >
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <div className={cn("size-2 rounded-full", idx === 0 ? "bg-primary" : idx === 1 ? "bg-primary/40" : "bg-primary/20")} />
              <span className="text-neutral-600 dark:text-neutral-400">{s.label}</span>
            </div>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{s.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Discussion Visual                                                  */
/* ------------------------------------------------------------------ */
function DiscussionVisual({ isRTL, t }: { isRTL: boolean; t: (key: string) => string }) {
  return (
    <div className="space-y-3" dir={isRTL ? "rtl" : "ltr"}>
      {/* Comment 1 */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
        <div className="size-6 rounded-full bg-primary/30 shrink-0 mt-0.5" />
        <div className={cn("rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-3 py-2 max-w-[85%]", isRTL && "text-right")}>
          <p className="text-[10px] font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">Sarah</p>
          <p className="text-[10px] text-neutral-600 dark:text-neutral-400">{t("collabComment1")}</p>
        </div>
      </motion.div>
      {/* Comment 2 with @mention */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
        <div className="size-6 rounded-full bg-primary/50 shrink-0 mt-0.5" />
        <div className={cn("rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-3 py-2 max-w-[85%]", isRTL && "text-right")}>
          <p className="text-[10px] font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">Ahmed</p>
          <p className="text-[10px] text-neutral-600 dark:text-neutral-400">
            <span className="text-primary font-semibold">@Sarah</span> {t("collabComment2").replace("@Sarah ", "")}
          </p>
        </div>
      </motion.div>
      {/* Typing indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <div className="size-6 rounded-full bg-primary/70 shrink-0" />
        <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-3 py-2">
          <div className="flex gap-1">
            <div className="size-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="size-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="size-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline Visual                                                    */
/* ------------------------------------------------------------------ */
function TimelineVisual({ isRTL, t }: { isRTL: boolean; t: (key: string) => string }) {
  const entries = [
    { text: t("collabTimeline1"), time: t("collabTimeline1Time") },
    { text: t("collabTimeline2"), time: t("collabTimeline2Time") },
    { text: t("collabTimeline3"), time: t("collabTimeline3Time") },
    { text: t("collabTimeline4"), time: t("collabTimeline4Time") },
  ];
  return (
    <div className="space-y-2" dir={isRTL ? "rtl" : "ltr"}>
      {entries.map((entry, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.08 }}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50",
            isRTL && "flex-row-reverse"
          )}
        >
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <IconClock className="size-3.5 text-primary" />
          </div>
          <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
            <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">{entry.text}</p>
            <p className="text-[9px] text-neutral-400 mt-0.5">{entry.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Permissions Visual                                                 */
/* ------------------------------------------------------------------ */
function PermissionsVisual({ isRTL, t }: { isRTL: boolean; t: (key: string) => string }) {
  const roles = [
    { name: t("collabPermRole1"), perms: [true, true, true, true] },
    { name: t("collabPermRole2"), perms: [true, true, true, false] },
    { name: t("collabPermRole3"), perms: [false, true, false, false] },
  ];
  const permLabels = [t("collabPermCreate"), t("collabPermRead"), t("collabPermUpdate"), t("collabPermDelete")];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={cn("grid grid-cols-5 gap-1 mb-2", isRTL && "direction-rtl")}>
        <div />
        {permLabels.map((label) => (
          <div key={label} className="text-center">
            <span className="text-[9px] font-medium text-neutral-400">{label}</span>
          </div>
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-2">
        {roles.map((role, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.1 }}
            className={cn("grid grid-cols-5 gap-1 items-center p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50", isRTL && "direction-rtl")}
          >
            <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
              <div className="size-4 rounded-full bg-primary/20 shrink-0" />
              <span className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">{role.name}</span>
            </div>
            {role.perms.map((allowed, pIdx) => (
              <div key={pIdx} className="flex justify-center">
                {allowed ? (
                  <div className="size-5 rounded-md bg-primary/10 flex items-center justify-center">
                    <IconCheck className="size-3 text-primary" />
                  </div>
                ) : (
                  <div className="size-5 rounded-md bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    <IconX className="size-3 text-neutral-400" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */
export function FeaturesCollaboration() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const [active, setActive] = useState<FeatureKey>("tasks");

  const features: { key: FeatureKey; icon: React.ReactNode; title: string; desc: string }[] = [
    { key: "tasks", icon: <IconCheckbox className="size-4" />, title: t("tasksTitle"), desc: t("tasksDesc") },
    { key: "progress", icon: <IconProgress className="size-4" />, title: t("progressTitle"), desc: t("progressDesc") },
    { key: "discussion", icon: <IconMessage className="size-4" />, title: t("discussionTitle"), desc: t("discussionDesc") },
    { key: "timeline", icon: <IconClock className="size-4" />, title: t("timelineTitle"), desc: t("timelineDesc") },
    { key: "permissions", icon: <IconShield className="size-4" />, title: t("permissionsTitle"), desc: t("permissionsDesc") },
  ];

  const activeFeature = features.find((f) => f.key === active)!;

  const visuals: Record<FeatureKey, React.ReactNode> = {
    tasks: <TasksVisual isRTL={isRTL} t={t} />,
    progress: <ProgressVisual isRTL={isRTL} t={t} />,
    discussion: <DiscussionVisual isRTL={isRTL} t={t} />,
    timeline: <TimelineVisual isRTL={isRTL} t={t} />,
    permissions: <PermissionsVisual isRTL={isRTL} t={t} />,
  };

  return (
    <SectionWrapper id="collaboration">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Heading>
            {t("collaborationSectionTitle")} <br className="hidden md:block" /> {t("collaborationSectionTitle2")}
          </Heading>
          <Subheading className="mt-4 mx-auto text-center">
            {t("collaborationSectionSubtitle")}
          </Subheading>
        </div>

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch",
          isRTL && "lg:direction-rtl"
        )}>
          {/* Visual panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="relative h-full"
          >
            <div className="h-full rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden p-5 md:p-6 flex flex-col">
              {/* Visual header */}
              <div className={cn("flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800", isRTL && "flex-row-reverse")}>
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {activeFeature.icon}
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{activeFeature.title}</span>
              </div>
              {/* Visual content */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {visuals[active]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Feature cards — clickable */}
          <div className="space-y-2">
            {features.map((feature, idx) => (
              <motion.button
                key={feature.key}
                type="button"
                initial={{ opacity: 0, x: isRTL ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setActive(feature.key)}
                dir={isRTL ? "rtl" : "ltr"}
                className={cn(
                  "w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer",
                  active === feature.key
                    ? "border-primary/30 bg-white dark:bg-neutral-800/80 shadow-sm"
                    : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800/50",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <div className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
                  active === feature.key ? "bg-primary/10 text-primary" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                )}>
                  {feature.icon}
                </div>
                <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                  <h3 className={cn(
                    "text-sm font-bold transition-colors duration-200",
                    active === feature.key ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {feature.title}
                  </h3>
                  <p className={cn(
                    "text-xs leading-relaxed mt-0.5 line-clamp-2 transition-colors duration-200",
                    active === feature.key ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-500"
                  )}>
                    {feature.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
