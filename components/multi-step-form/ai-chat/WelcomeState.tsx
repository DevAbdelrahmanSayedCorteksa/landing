"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { IconSparkles, IconArrowUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface WelcomeStateProps {
  onSend: (message: string) => void;
  isConnected: boolean;
  isTyping: boolean;
}

export function WelcomeState({ onSend, isConnected, isTyping }: WelcomeStateProps) {
  const t = useTranslations("multiStepForm");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    t("exampleDental"),
    t("exampleRealEstate"),
    t("exampleMarketing"),
    t("exampleEcommerce"),
  ];

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
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

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-1 flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex justify-center"
        >
          <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <IconSparkles className="size-10 text-primary" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center space-y-2"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("createYourCRM")}
          </h1>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            {t("describeYourBusiness")}
          </p>
        </motion.div>

        {/* Large Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="relative"
        >
          <div className="relative flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full border-2 border-neutral-200 dark:border-neutral-700 focus-within:border-primary transition-colors">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chatPlaceholder")}
              disabled={!isConnected || isTyping}
              dir="ltr"
              rows={1}
              className={cn(
                "flex-1 bg-transparent px-6 py-4 text-base resize-none",
                "placeholder:text-muted-foreground",
                "focus:outline-none",
                "max-h-[120px] min-h-[56px]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Chat message input"
            />

            <button
              onClick={handleSend}
              disabled={!message.trim() || !isConnected || isTyping}
              className={cn(
                "size-10 rounded-full flex items-center justify-center mr-2",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                message.trim() && isConnected && !isTyping && "hover:scale-105"
              )}
              aria-label="Send message"
            >
              <IconArrowUp className="size-5" strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>

        {/* Suggestion Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {suggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              custom={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 0.3,
              }}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={!isConnected || isTyping}
              className={cn(
                "px-4 py-2 rounded-full text-sm",
                "bg-neutral-100 dark:bg-neutral-800",
                "border border-neutral-200 dark:border-neutral-700",
                "hover:border-primary hover:bg-primary/5",
                "transition-all duration-200",
                "cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {t("tryExample", { example: suggestion })}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
