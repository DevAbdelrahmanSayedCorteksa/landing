"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { useAITemplateChatContext } from "@/lib/contexts/AITemplateChatContext";
import { BoltStyleChat } from "@/components/ui/bolt-style-chat";
import { EmbeddedChatState } from "./EmbeddedChatState";

interface EmbeddedAIChatProps {
  formData: {
    template_slug?: string;
    sessionId?: string;
  };
  updateFormData: (data: { template_slug?: string; sessionId?: string; templateName?: string }) => void;
  onMessagesChange?: (hasMessages: boolean) => void;
  onBuildingStateChange?: (isBuilding: boolean) => void;
}

export function EmbeddedAIChat({ formData, updateFormData, onMessagesChange, onBuildingStateChange }: EmbeddedAIChatProps) {
  const {
    messages,
    isConnected,
    isTyping,
    sessionId,
    savedTemplateSlug,
    templateName,
    currentTemplate,
    previewBuildComplete,
    sendMessage,
    messagesEndRef,
  } = useAITemplateChatContext();
  const prevBuildingRef = useRef(false);
  const prevTypingRef = useRef(false);
  const panelTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Auto-update form data when template is saved
  useEffect(() => {
    if (savedTemplateSlug && sessionId) {
      updateFormData({
        template_slug: savedTemplateSlug,
        sessionId: sessionId,
        templateName: templateName,
      });
    }
  }, [savedTemplateSlug, sessionId, templateName, updateFormData]);

  // Notify parent when messages change
  useEffect(() => {
    onMessagesChange?.(messages.length > 0);
  }, [messages.length, onMessagesChange]);

  // Cleanup panel timer on unmount
  useEffect(() => {
    return () => {
      if (panelTimerRef.current) clearTimeout(panelTimerRef.current);
    };
  }, []);

  // Show right panel ONLY when a template arrives — not on every typing cycle
  // Text-only replies (e.g. "What business?") should NOT trigger the preview panel
  useEffect(() => {
    // Panel already visible from a previous template — keep it
    if (currentTemplate && prevBuildingRef.current) {
      prevTypingRef.current = isTyping;
      return;
    }

    // Template exists but panel not yet shown (e.g. page restore) — show immediately
    if (currentTemplate && !prevBuildingRef.current) {
      prevBuildingRef.current = true;
      // Start panel timer to match BuildingProgress animation
      if (panelTimerRef.current) clearTimeout(panelTimerRef.current);
      panelTimerRef.current = setTimeout(() => {
        onBuildingStateChange?.(true);
      }, 33800);
      prevTypingRef.current = isTyping;
      return;
    }

    // Typing stopped without a template → cancel any pending panel timer
    if (!isTyping && prevTypingRef.current && !currentTemplate) {
      if (panelTimerRef.current) clearTimeout(panelTimerRef.current);
    }

    prevTypingRef.current = isTyping;
  }, [isTyping, currentTemplate, onBuildingStateChange, messages]);

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      {/* Content area - switches between welcome and chat */}
      <div className="flex-1 overflow-hidden h-full">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <div key="welcome" className="h-full">
              <BoltStyleChat
                title="What will you"
                subtitle="Create your custom CRM template by chatting with AI."
                placeholder="Describe your business..."
                onSend={sendMessage}
              />
            </div>
          ) : (
            <div key="chat" className="h-full">
              <EmbeddedChatState
                messages={messages}
                isConnected={isConnected}
                isTyping={isTyping}
                onSend={sendMessage}
                messagesEndRef={messagesEndRef}
                isPreviewBuildComplete={previewBuildComplete}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
