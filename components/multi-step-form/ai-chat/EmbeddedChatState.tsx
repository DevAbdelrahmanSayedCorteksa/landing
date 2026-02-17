"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { BuildingProgress } from "./BuildingProgress";
import { ChatMessage as ChatMessageType } from "@/lib/types/aiChat";

interface EmbeddedChatStateProps {
  messages: ChatMessageType[];
  isConnected: boolean;
  isTyping: boolean;
  onSend: (message: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isPreviewBuildComplete?: boolean;
}

export function EmbeddedChatState({
  messages,
  isConnected,
  isTyping,
  onSend,
  messagesEndRef,
  isPreviewBuildComplete = false,
}: EmbeddedChatStateProps) {
  const t = useTranslations("multiStepForm");

  const [buildCycle, setBuildCycle] = useState(0);
  const [showBuilding, setShowBuilding] = useState(false);
  const [buildingComplete, setBuildingComplete] = useState(false);
  const [revealResponse, setRevealResponse] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const prevTypingRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const msgSnapshotRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTyping && !prevTypingRef.current) {
      // User sent message — show typing indicator, don't start BuildingProgress yet
      // We don't know if the response will be text or template until it arrives
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      msgSnapshotRef.current = messages.length;
      setRevealResponse(false);
      setShowBuilding(false);
      setBuildingComplete(false);
      setWaitingForResponse(true);
    } else if (!isTyping && prevTypingRef.current) {
      setWaitingForResponse(false);

      const lastMsg = messages[messages.length - 1];
      const isError = lastMsg?.role === "error";
      const hasTemplate = !!lastMsg?.template;

      if (isError) {
        // Error — show error immediately
        setRevealResponse(true);
      } else if (hasTemplate) {
        // Template result — NOW start BuildingProgress + simulation
        setBuildCycle((c) => c + 1);
        setShowBuilding(true);
        setBuildingComplete(false);
        // The isPreviewBuildComplete effect below handles the reveal
      } else {
        // Text reply — show response directly, no simulation
        setRevealResponse(true);
      }
    }
    prevTypingRef.current = isTyping;
  }, [isTyping, messages]);

  // React to preview build completion — reveals AI response after right panel finishes
  useEffect(() => {
    if (isPreviewBuildComplete && showBuilding && !buildingComplete) {
      setBuildingComplete(true);
      fadeTimerRef.current = setTimeout(() => {
        setRevealResponse(true);
      }, 2000);
    }
  }, [isPreviewBuildComplete, showBuilding, buildingComplete]);

  // Split messages: before the build cycle vs after (AI response)
  const beforeBuildMessages = messages.slice(0, msgSnapshotRef.current);
  const afterBuildMessages = messages.slice(msgSnapshotRef.current);

  return (
    <div className="flex flex-col h-full w-full bg-[#0f0f0f]">
      {/* Messages - scrollable area with dark scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-[680px] mx-auto space-y-6"
        >
          {/* Messages BEFORE the build (user message + earlier history) */}
          {beforeBuildMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing indicator — shown while waiting for AI response (before we know the type) */}
          <AnimatePresence>
            {waitingForResponse && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 size-6 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center p-1">
                  <Image src="/Corteksa.svg" alt="" width={14} height={14} className="w-full h-full" />
                </div>
                <div className="flex items-center gap-1 py-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="size-1.5 rounded-full bg-[#7c3aed]"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BuildingProgress: only for template results */}
          <AnimatePresence>
            {showBuilding && (
              <motion.div
                key={`build-${buildCycle}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <BuildingProgress isComplete={buildingComplete} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI response — appears BELOW the steps after reveal */}
          {revealResponse && afterBuildMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}

          {/* When no build is active, show remaining messages normally */}
          {!showBuilding && !revealResponse && afterBuildMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

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
            placeholder={messages.length === 0 ? t("chatPlaceholder") : "Ask a follow-up question..."}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
}
