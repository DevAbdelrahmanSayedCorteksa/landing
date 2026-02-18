"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { useAITemplateChat } from "@/lib/hooks/useAITemplateChat";
import { WelcomeState } from "./WelcomeState";
import { ChatActiveState } from "./ChatActiveState";
import { SaveTemplateBar } from "./SaveTemplateBar";
import { cn } from "@/lib/utils";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSaved: (slug: string, sessionId: string) => void;
}

export function AIChatModal({
  isOpen,
  onClose,
  onTemplateSaved,
}: AIChatModalProps) {
  const {
    messages,
    isConnected,
    isProcessing,
    sessionId,
    currentTemplate,
    savedTemplateSlug,
    templateName,
    category,
    sendMessage,
    saveTemplate,
    messagesEndRef,
  } = useAITemplateChat();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, messages, savedTemplateSlug]);

  const handleClose = useCallback(() => {
    // Warn if chat active and not saved
    if (messages.length > 0 && !savedTemplateSlug) {
      const confirmClose = window.confirm(
        "You have an unsaved template. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    onClose();
  }, [messages, savedTemplateSlug, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close on backdrop click if in welcome state (no messages)
    if (messages.length === 0) {
      handleClose();
    }
  };

  const handleTemplateSave = () => {
    if (!templateName) return;
    saveTemplate();
  };

  // Notify parent when template is saved
  useEffect(() => {
    if (savedTemplateSlug && sessionId) {
      onTemplateSaved(savedTemplateSlug, sessionId);
    }
  }, [savedTemplateSlug, sessionId, onTemplateSaved]);

  const hasTemplate = !!currentTemplate && !savedTemplateSlug;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="absolute inset-4 md:inset-8 lg:inset-16 bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className={cn(
                "absolute top-4 right-4 z-10",
                "size-10 rounded-full flex items-center justify-center",
                "bg-neutral-100 dark:bg-neutral-800",
                "hover:bg-neutral-200 dark:hover:bg-neutral-700",
                "transition-colors duration-200",
                "cursor-pointer"
              )}
              aria-label="Close chat"
            >
              <IconX className="size-5 text-foreground" strokeWidth={2} />
            </button>

            {/* Content */}
            {messages.length === 0 ? (
              <WelcomeState
                onSend={sendMessage}
                isConnected={isConnected}
                isTyping={isProcessing}
              />
            ) : (
              <ChatActiveState
                messages={messages}
                isConnected={isConnected}
                isTyping={isProcessing}
                onSend={sendMessage}
                messagesEndRef={messagesEndRef}
              />
            )}

            {/* Save bar */}
            {hasTemplate && (
              <SaveTemplateBar
                templateName={templateName}
                category={category}
                currentTemplate={currentTemplate}
                onSave={handleTemplateSave}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
