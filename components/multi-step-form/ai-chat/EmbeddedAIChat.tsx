"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
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
}

export function EmbeddedAIChat({ updateFormData, onMessagesChange }: EmbeddedAIChatProps) {
  const t = useTranslations("multiStepForm");
  const {
    messages,
    isConnected,
    builderState,
    phaseMessage,
    tasks,
    planResult,
    isProcessing,
    sessionId,
    savedTemplateSlug,
    templateName,
    sendMessage,
    confirmPlan,
    messagesEndRef,
  } = useAITemplateChatContext();

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
                suggestions={[
                  t("exampleDental"),
                  t("exampleRealEstate"),
                  t("exampleMarketing"),
                  t("exampleEcommerce"),
                ]}
                onSend={sendMessage}
              />
            </div>
          ) : (
            <div key="chat" className="h-full">
              <EmbeddedChatState
                messages={messages}
                isConnected={isConnected}
                builderState={builderState}
                phaseMessage={phaseMessage}
                tasks={tasks}
                planResult={planResult}
                isProcessing={isProcessing}
                onSend={sendMessage}
                onConfirm={confirmPlan}
                messagesEndRef={messagesEndRef}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
