"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { TextShimmer } from "@/components/ui/text-shimmer";
import Image from "next/image";
import {
  IconBrain,
  IconListCheck,
  IconSearch,
  IconDatabase,
  IconTable,
  IconTestPipe,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { Check } from "lucide-react";

// ─── Step definitions (varied, realistic pacing) ─────────────────────
interface LogEntry {
  id: string;
  type: "thinking" | "planning" | "action" | "message";
  labelKey: string;
  resolvedLabelKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  appearsAt: number;
  resolvesAt: number; // 0 = stays active until isComplete
}

// Random message keys — one is picked per mount
const MESSAGE_KEYS = ["thinkingResult1", "thinkingResult2", "thinkingResult3"];

const LOG_ENTRIES: LogEntry[] = [
  { id: "think",    type: "thinking",  labelKey: "thinkingPhase",     resolvedLabelKey: "thoughtFor",       icon: IconBrain,           appearsAt: 0,      resolvesAt: 5500 },
  { id: "msg",      type: "message",   labelKey: "",                  icon: IconBrain,                      appearsAt: 6000,  resolvesAt: 6000 },
  { id: "plan",     type: "planning",  labelKey: "planningPhase",     resolvedLabelKey: "enteredPlanMode",  icon: IconListCheck,       appearsAt: 9000,   resolvesAt: 13500 },
  { id: "analyze",  type: "action",    labelKey: "buildingAnalyzing", icon: IconSearch,                     appearsAt: 14200, resolvesAt: 17500 },
  { id: "design",   type: "action",    labelKey: "buildingDesigning", icon: IconDatabase,                   appearsAt: 18300, resolvesAt: 23000 },
  { id: "create",   type: "action",    labelKey: "buildingCreating",  icon: IconTable,                      appearsAt: 23800, resolvesAt: 27000 },
  { id: "generate", type: "action",    labelKey: "buildingGenerating",icon: IconTestPipe,                   appearsAt: 27800, resolvesAt: 32000 },
  { id: "build",    type: "action",    labelKey: "buildingBuilding",  icon: IconLayoutDashboard,            appearsAt: 32800, resolvesAt: 0 },
];

// ─── Typewriter hook ─────────────────────────────────────────────────
function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (!text) return;

    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

// ─── Component ───────────────────────────────────────────────────────
interface BuildingProgressProps {
  isComplete?: boolean;
}

export function BuildingProgress({ isComplete = false }: BuildingProgressProps) {
  const t = useTranslations("multiStepForm");
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const startTimeRef = useRef(Date.now());

  // Pick a random message on mount (stable across re-renders)
  const messageKey = useMemo(
    () => MESSAGE_KEYS[Math.floor(Math.random() * MESSAGE_KEYS.length)],
    []
  );

  useEffect(() => {
    if (isComplete) return;
    startTimeRef.current = Date.now();

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const entry of LOG_ENTRIES) {
      timers.push(
        setTimeout(() => setVisibleIds((prev) => new Set(prev).add(entry.id)), entry.appearsAt)
      );
      if (entry.resolvesAt > 0 && entry.type !== "message") {
        timers.push(
          setTimeout(() => setResolvedIds((prev) => new Set(prev).add(entry.id)), entry.resolvesAt)
        );
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [isComplete]);

  useEffect(() => {
    if (isComplete) {
      setVisibleIds(new Set(LOG_ENTRIES.map((e) => e.id)));
      setResolvedIds(new Set(LOG_ENTRIES.map((e) => e.id)));
    }
  }, [isComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex gap-3"
    >
      {/* Corteksa Avatar */}
      <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center p-1.5">
        <Image src="/Corteksa.svg" alt="Corteksa AI" width={20} height={20} />
      </div>

      {/* Activity log */}
      <div className="pt-1">
        <div className="space-y-2.5">
          <AnimatePresence>
            {LOG_ENTRIES.map((entry) => {
              if (!visibleIds.has(entry.id)) return null;

              {/* Typewriter message — no background, appears between thinking and planning */}
              if (entry.type === "message") {
                return (
                  <TypewriterMessage
                    key={entry.id}
                    text={t(messageKey)}
                    isComplete={isComplete}
                  />
                );
              }

              const isResolved = resolvedIds.has(entry.id);
              return (
                <ActivityEntry
                  key={entry.id}
                  entry={entry}
                  isResolved={isResolved}
                  t={t}
                  startTime={startTimeRef.current}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typewriter message (no background) ──────────────────────────────
function TypewriterMessage({ text, isComplete }: { text: string; isComplete: boolean }) {
  const displayed = useTypewriter(isComplete ? text : text, isComplete ? 0 : 28);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="py-1.5"
    >
      <p className="text-[13px] text-[#e4e4e7] leading-relaxed">
        {isComplete ? text : displayed}
        {!isComplete && displayed.length < text.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-[2px] h-[14px] bg-[#7c3aed] ml-0.5 align-middle"
          />
        )}
      </p>
    </motion.div>
  );
}

// ─── Single activity entry ───────────────────────────────────────────
function ActivityEntry({
  entry,
  isResolved,
  t,
  startTime,
}: {
  entry: LogEntry;
  isResolved: boolean;
  t: ReturnType<typeof useTranslations>;
  startTime: number;
}) {
  const Icon = entry.icon;
  const elapsed = Math.round((entry.resolvesAt || (Date.now() - startTime)) / 1000);

  const resolvedLabel = entry.resolvedLabelKey
    ? t(entry.resolvedLabelKey, { seconds: String(elapsed) })
    : t(entry.labelKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center gap-2.5"
    >
      {/* Icon */}
      <AnimatePresence mode="wait">
        {isResolved ? (
          <motion.div
            key="resolved-icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex-shrink-0"
          >
            {entry.type === "thinking" || entry.type === "planning" ? (
              <div className="size-4.5 flex items-center justify-center">
                <Check className="size-3.5 text-emerald-500/60" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="size-4.5 flex items-center justify-center">
                <Icon className="size-3.5 text-[#4a4a4f]" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="active-icon"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0"
          >
            {entry.type === "thinking" || entry.type === "planning" ? (
              <div className="size-4.5 flex items-center justify-center">
                <motion.div
                  className="size-2.5 rounded-full bg-[#7c3aed]"
                  animate={{ scale: [1, 0.7, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            ) : (
              <div className="size-4.5 flex items-center justify-center">
                <Icon className="size-3.5 text-[#7c3aed]/70" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label */}
      {isResolved ? (
        <motion.span
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[13px] text-[#5a5a5f]"
        >
          {resolvedLabel}
        </motion.span>
      ) : (
        <TextShimmer
          duration={1.8}
          className="text-[13px] font-medium [--base-color:#71717a] [--base-gradient-color:#ffffff]"
        >
          {t(entry.labelKey)}
        </TextShimmer>
      )}
    </motion.div>
  );
}
