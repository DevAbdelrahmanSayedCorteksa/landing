"use client";

import { motion } from "motion/react";
import { ChatMessage as ChatMessageType } from "@/lib/types/aiChat";
import { SchemaPreview } from "./SchemaPreview";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";
import { IconAlertTriangle } from "@tabler/icons-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  const hasTemplate = !!message.template;

  // Error message — distinct style with warning icon
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex gap-3"
      >
        <div className="flex-shrink-0 pt-1">
          <div className="size-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <IconAlertTriangle className="size-3.5 text-red-400" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-red-500/[0.08] border border-red-500/15">
            <p className="text-sm text-red-600 dark:text-red-300/90 leading-relaxed">
              {message.content}
            </p>
            <p className="text-[11px] text-red-500/50 dark:text-red-400/50 mt-1.5">
              Try sending your message again.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // User message — right-aligned, no avatar, no timestamp
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex justify-end"
      >
        <div className="max-w-[85%]">
          <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 bg-neutral-100 dark:bg-[#1e1e22] border border-neutral-200 dark:border-white/[0.06]">
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // AI message — clean, modern style
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header: Avatar + Label + Template badge */}
      <div className="flex items-center gap-2 mb-2">
        <div className="size-6 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center p-1 flex-shrink-0">
          <Image
            src="/Corteksa.svg"
            alt="AI"
            width={14}
            height={14}
            className="w-full h-full"
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">Cortex AI</span>
        {message.templateName && (
          <Badge variant="secondary" className="text-[10px] h-5 bg-neutral-100 dark:bg-[#1e1e22] text-muted-foreground border-neutral-200 dark:border-white/[0.08]">
            {message.templateName}
          </Badge>
        )}
        {message.category && message.templateName && (
          <span className="text-[10px] text-muted-foreground">
            {message.category}
          </span>
        )}
      </div>

      {/* Message body */}
      <div className="ps-8">
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Schema preview */}
        {hasTemplate && (
          <div className="mt-3">
            <SchemaPreview template={message.template!} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
