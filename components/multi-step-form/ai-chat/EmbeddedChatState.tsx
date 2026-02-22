"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Check } from "lucide-react";
import { IconSearch, IconListDetails, IconLoader2 } from "@tabler/icons-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import {
  ChatMessage as ChatMessageType,
  BuilderState,
  TemplateTask,
  TemplatePlanResult,
} from "@/lib/types/aiChat";
import { TextShimmer } from "@/components/ui/text-shimmer";

interface EmbeddedChatStateProps {
  messages: ChatMessageType[];
  isConnected: boolean;
  builderState: BuilderState;
  phaseMessage: string;
  tasks: TemplateTask[];
  planResult: TemplatePlanResult | null;
  isProcessing: boolean;
  onSend: (message: string) => void;
  onConfirm?: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function EmbeddedChatState({
  messages,
  isConnected,
  builderState,
  phaseMessage,
  tasks,
  planResult,
  isProcessing,
  onSend,
  messagesEndRef,
}: EmbeddedChatStateProps) {
  const t = useTranslations("multiStepForm");

  const showIndicator = ["thinking", "analyzing", "plan_review", "building"].includes(
    builderState
  );

  return (
    <div className="flex flex-col h-full w-full bg-neutral-50 dark:bg-[#0f0f0f]">
      {/* Messages - scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-6 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-[680px] mx-auto space-y-6"
        >
          {/* All messages */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Live building indicator — full inline experience */}
          <AnimatePresence>
            {showIndicator && (
              <motion.div
                key="build-indicator"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* AI avatar header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center p-1 flex-shrink-0">
                    <Image
                      src="/Corteksa.svg"
                      alt="AI"
                      width={14}
                      height={14}
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Cortex AI
                  </span>
                </div>

                {/* Content area */}
                <div className="ps-8">
                  <InlineBuildProgress
                    builderState={builderState}
                    phaseMessage={phaseMessage}
                    tasks={tasks}
                    planResult={planResult}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-4" />
        </motion.div>
      </div>

      {/* Input - fixed at bottom */}
      <div className="flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <ChatInput
            onSend={onSend}
            disabled={!isConnected}
            placeholder={
              builderState === "plan_review"
                ? t("editPlanPlaceholder")
                : messages.length === 0
                  ? t("chatPlaceholder")
                  : "Ask a follow-up question..."
            }
            isTyping={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Inline Build Progress — shows phases + tasks inside chat
// ═══════════════════════════════════════════════════════════

function InlineBuildProgress({
  builderState,
  phaseMessage,
  tasks,
  planResult,
}: {
  builderState: BuilderState;
  phaseMessage: string;
  tasks: TemplateTask[];
  planResult: TemplatePlanResult | null;
}) {
  const t = useTranslations("multiStepForm");

  // ── Thinking: shimmer text ──
  if (builderState === "thinking") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <TextShimmer
          duration={1.8}
          className="text-sm font-medium [--base-color:#71717a] [--base-gradient-color:#18181b] dark:[--base-color:#c0c0c5] dark:[--base-gradient-color:#ffffff]"
        >
          {t("thinking")}
        </TextShimmer>
      </motion.div>
    );
  }

  // ── Analyzing: shimmer + progress bar ──
  if (builderState === "analyzing") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#1a1a1e]/80 p-4"
      >
        <div className="flex items-center gap-3">
          <PhaseIcon phase="analyzing" />
          <TextShimmer
            duration={1.8}
            className="text-sm font-medium [--base-color:#71717a] [--base-gradient-color:#18181b] dark:[--base-color:#c0c0c5] dark:[--base-gradient-color:#ffffff]"
          >
            {t("analyzing")}
          </TextShimmer>
        </div>
        <div className="mt-3 h-0.5 rounded-full bg-neutral-200 dark:bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#7c3aed]/50 via-[#a78bfa]/70 to-[#7c3aed]/50"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    );
  }

  // ── Plan Review: collapsed summary (details shown in right panel) ──
  if (builderState === "plan_review" && planResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-[#1e1e22] px-4 py-3"
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">
          {planResult.category.replace(/_/g, " ")}
        </p>
        <p className="text-sm font-medium text-foreground">
          {planResult.template_name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {planResult.objects.length} {planResult.objects.length === 1 ? "object" : "objects"} · {t("reviewPlanRight")}
        </p>
      </motion.div>
    );
  }

  // ── Building: task checklist ──
  if (builderState === "building") {
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="space-y-3"
      >
        {/* Phase header */}
        <div className="flex items-center gap-2.5">
          <IconLoader2 className="size-4 text-[#7c3aed] animate-spin" />
          <TextShimmer
            duration={1.8}
            className="text-sm font-semibold [--base-color:#52525b] [--base-gradient-color:#18181b] dark:[--base-color:#e0e0e5] dark:[--base-gradient-color:#ffffff]"
          >
            {phaseMessage || t("phaseBuilding")}
          </TextShimmer>
        </div>

        {/* Task list */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-1 ps-0.5"
          >
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex items-center gap-2.5 py-1 px-1"
              >
                {/* Checkbox */}
                <div className="flex-shrink-0">
                  {task.status === "completed" ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, ease: "backOut" }}
                      className="size-4 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                    >
                      <Check className="size-2.5 text-emerald-400" strokeWidth={3} />
                    </motion.div>
                  ) : task.status === "in_progress" ? (
                    <div className="size-4 rounded border-2 border-[#7c3aed]/60 bg-[#7c3aed]/10 flex items-center justify-center">
                      <div className="size-1.5 rounded-sm bg-[#7c3aed]" />
                    </div>
                  ) : (
                    <div className="size-4 rounded border border-neutral-300 dark:border-[#2a2a2f] bg-transparent" />
                  )}
                </div>

                {/* Label */}
                {task.status === "in_progress" ? (
                  <TextShimmer
                    duration={1.8}
                    className="text-[13px] [--base-color:#71717a] [--base-gradient-color:#18181b] dark:[--base-color:#a0a0a5] dark:[--base-gradient-color:#ffffff]"
                  >
                    {task.label}
                  </TextShimmer>
                ) : (
                  <span
                    className={`text-[13px] transition-colors duration-300 ${
                      task.status === "completed"
                        ? "text-neutral-400 dark:text-[#5a5a5f] line-through decoration-neutral-300 dark:decoration-[#3a3a3f]"
                        : "text-neutral-400 dark:text-[#3a3a3f]"
                    }`}
                  >
                    {task.label}
                  </span>
                )}
              </motion.div>
            ))}

          </motion.div>
        )}
      </motion.div>
    );
  }

  return null;
}

// ── Phase icon ──
function PhaseIcon({ phase }: { phase: BuilderState }) {
  const iconClass = "size-4 text-[#a78bfa]";

  if (phase === "analyzing") {
    return (
      <motion.div
        className="size-8 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(124, 58, 237, 0)",
            "0 0 0 6px rgba(124, 58, 237, 0.06)",
            "0 0 0 0 rgba(124, 58, 237, 0)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <IconSearch className={iconClass} strokeWidth={1.5} />
      </motion.div>
    );
  }

  if (phase === "plan_review") {
    return (
      <motion.div
        className="size-8 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(124, 58, 237, 0)",
            "0 0 0 6px rgba(124, 58, 237, 0.06)",
            "0 0 0 0 rgba(124, 58, 237, 0)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <IconListDetails className={iconClass} strokeWidth={1.5} />
      </motion.div>
    );
  }

  // Building
  return (
    <motion.div
      className="size-8 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0"
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(124, 58, 237, 0)",
          "0 0 0 6px rgba(124, 58, 237, 0.06)",
          "0 0 0 0 rgba(124, 58, 237, 0)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="size-2.5 rounded-full bg-[#7c3aed]"
        animate={{ scale: [1, 0.6, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
