"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { SendHorizontal, Plus, Lightbulb, ChevronDown } from "lucide-react";
import Image from "next/image";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isTyping?: boolean;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
  isTyping = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isTyping) return;

    onSend(trimmedMessage);
    setMessage("");

    // Refocus input
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = disabled || !message.trim() || isTyping;

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      {/* Gradient border glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

      {/* Main container */}
      <div className="relative rounded-2xl bg-[#1e1e22] ring-1 ring-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_2px_20px_rgba(0,0,0,0.4)]">
        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            dir="ltr"
            className="w-full resize-none bg-transparent text-[15px] text-white placeholder-[#5a5a5f] px-5 pt-5 pb-3 focus:outline-none min-h-[80px] max-h-[200px]"
            style={{ height: "80px" }}
          />
        </div>

        {/* Bottom bar with buttons */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            {/* Add file button (disabled) */}
            <div className="relative">
              <button
                disabled
                className="flex items-center justify-center size-8 rounded-full bg-white/[0.08] text-[#8a8a8f] opacity-50 cursor-not-allowed"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Cortex AI Model Selector */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-[#8a8a8f] hover:text-white hover:bg-white/5 cursor-default">
              <div className="size-4 rounded-md bg-gradient-to-br from-[#7c3aed]/20 to-[#7c3aed]/10 flex items-center justify-center p-0.5">
                <Image
                  src="/Corteksa.svg"
                  alt="Cortex AI"
                  width={12}
                  height={12}
                  className="w-full h-full"
                />
              </div>
              <span>Cortex AI</span>
              <ChevronDown className="size-3.5 opacity-50" />
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {/* Plan button */}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-[#6a6a6f] hover:text-white hover:bg-white/5 transition-all duration-200">
              <Lightbulb className="size-4" />
              <span className="hidden sm:inline">Plan</span>
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={isDisabled}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              <span className="hidden sm:inline">Send</span>
              <SendHorizontal className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
