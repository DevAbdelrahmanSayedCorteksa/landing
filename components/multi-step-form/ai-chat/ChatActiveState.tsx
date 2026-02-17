"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { IconSparkles } from "@tabler/icons-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Badge } from "@/components/ui/badge";
import { ChatMessage as ChatMessageType } from "@/lib/types/aiChat";
import { cn } from "@/lib/utils";

interface ChatActiveStateProps {
  messages: ChatMessageType[];
  isConnected: boolean;
  isTyping: boolean;
  onSend: (message: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatActiveState({
  messages,
  isConnected,
  isTyping,
  onSend,
  messagesEndRef,
}: ChatActiveStateProps) {
  const t = useTranslations("multiStepForm");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <IconSparkles className="size-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-semibold text-base">{t("aiChatTitle")}</h2>
          </div>
        </div>

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

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-gradient-to-t from-background to-transparent">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <ChatInput
            onSend={onSend}
            disabled={!isConnected}
            placeholder={
              messages.length === 0 ? t("chatPlaceholder") : t("refinePrompt")
            }
            isTyping={isTyping}
          />
        </div>
      </div>
    </motion.div>
  );
}
