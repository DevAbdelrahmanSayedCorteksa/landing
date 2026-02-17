"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { IconCheck, IconSparkles } from "@tabler/icons-react";
import { useAITemplateChat } from "@/lib/hooks/useAITemplateChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AIChatInterfaceProps {
  onTemplateSaved?: (slug: string, sessionId: string) => void;
}

export function AIChatInterface({ onTemplateSaved }: AIChatInterfaceProps) {
  const t = useTranslations("multiStepForm");
  const {
    messages,
    isConnected,
    isTyping,
    sessionId,
    currentTemplate,
    savedTemplateSlug,
    templateName: aiTemplateName,
    category,
    sendMessage,
    saveTemplate,
    messagesEndRef,
  } = useAITemplateChat();

  const [isSaving, setIsSaving] = useState(false);

  // Notify parent when template is saved
  useEffect(() => {
    if (savedTemplateSlug && sessionId) {
      onTemplateSaved?.(savedTemplateSlug, sessionId);
    }
  }, [savedTemplateSlug, sessionId, onTemplateSaved]);

  const handleSaveTemplate = () => {
    if (!aiTemplateName) return;

    setIsSaving(true);
    saveTemplate();  // Uses template name from AI

    // Reset saving state after a delay
    setTimeout(() => setIsSaving(false), 1000);
  };

  const hasTemplate = !!currentTemplate && !savedTemplateSlug;
  const isSaved = !!savedTemplateSlug;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label className="text-base font-medium flex items-center gap-2">
            <IconSparkles className="size-5 text-primary" strokeWidth={2} />
            {t("aiChatTitle")}
          </Label>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className={cn(
              "text-[10px] uppercase font-semibold",
              isConnected && "bg-green-500/10 text-green-600 dark:text-green-400"
            )}
          >
            {isConnected ? t("connected") : t("disconnected")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("aiChatSubtitle")}
        </p>
      </div>

      {/* Chat container */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-background overflow-hidden">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <IconSparkles className="size-8 text-primary" strokeWidth={2} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("chatPlaceholder")}
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900/50">
          <ChatInput
            onSend={sendMessage}
            disabled={!isConnected}
            placeholder={
              messages.length === 0
                ? t("chatPlaceholder")
                : t("refinePrompt")
            }
            isTyping={isTyping}
          />
        </div>
      </div>

      {/* Save template section */}
      <AnimatePresence>
        {hasTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {t("templateReady")}: <span className="text-primary">{aiTemplateName}</span>
                  </p>
                  {category && (
                    <p className="text-xs text-muted-foreground mt-0.5">{category}</p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleSaveTemplate}
                  disabled={!aiTemplateName || isSaving || isSaved}
                  className="min-w-[140px]"
                >
                  {isSaved ? (
                    <>
                      <IconCheck className="size-4 me-2" />
                      {t("saved")}
                    </>
                  ) : isSaving ? (
                    t("saving")
                  ) : (
                    t("saveTemplate")
                  )}
                </Button>
              </div>
              {isSaved && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  {t("templateSaved")}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
