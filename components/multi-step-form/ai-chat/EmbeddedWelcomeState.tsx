"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { IconSparkles, IconSend } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface EmbeddedWelcomeStateProps {
  onSend: (message: string) => void;
  isConnected: boolean;
  isTyping: boolean;
}

export function EmbeddedWelcomeState({
  onSend,
  isConnected,
  isTyping,
}: EmbeddedWelcomeStateProps) {
  const t = useTranslations("multiStepForm");
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    t("exampleDental"),
    t("exampleRealEstate"),
    t("exampleMarketing"),
    t("exampleEcommerce"),
  ];

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!message.trim() || !isConnected || isTyping) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center px-4 py-6"
    >
      <div className="w-full max-w-2xl">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex justify-center mb-4"
        >
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconSparkles className="size-6 text-primary" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center text-2xl md:text-3xl font-medium text-foreground mb-8"
        >
          {t("createYourCRM")}
        </motion.h2>

        {/* Input Box - Simple like ChatGPT/Gemini */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mb-4"
        >
          <div className="relative flex items-end rounded-3xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow focus-within:border-primary/50">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={t("chatPlaceholder")}
              disabled={!isConnected || isTyping}
              dir="ltr"
              rows={1}
              className={cn(
                "flex-1 bg-transparent px-6 py-4 text-base resize-none",
                "placeholder:text-muted-foreground",
                "focus:outline-none",
                "max-h-[200px] min-h-[56px]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              style={{
                height: "56px",
                lineHeight: "1.5"
              }}
            />

            <button
              onClick={handleSend}
              disabled={!message.trim() || !isConnected || isTyping}
              className={cn(
                "mb-2 me-2 p-2.5 rounded-full transition-all",
                message.trim() && isConnected && !isTyping
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <IconSend className="size-5" strokeWidth={2} />
            </button>
          </div>
        </motion.div>

        {/* Suggestion Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {suggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.2 }}
              onClick={() => {
                setMessage(suggestion);
                textareaRef.current?.focus();
              }}
              disabled={!isConnected || isTyping}
              className={cn(
                "px-4 py-2 rounded-full text-sm",
                "border border-border bg-background",
                "hover:bg-muted transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
