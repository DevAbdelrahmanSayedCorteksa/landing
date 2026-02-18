"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";

interface TypewriterMarkdownProps {
  content: string;
  /** Characters per tick */
  speed?: number;
  /** Milliseconds between ticks */
  interval?: number;
  /** Font size variant */
  size?: "sm" | "base";
  /** Show blinking cursor while typing (default true) */
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterMarkdown({
  content,
  speed = 2,
  interval = 12,
  size = "base",
  showCursor = true,
  onComplete,
}: TypewriterMarkdownProps) {
  const [revealed, setRevealed] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    setRevealed(0);
    completedRef.current = false;
  }, [content]);

  useEffect(() => {
    if (revealed >= content.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setRevealed((prev) => {
        const next = Math.min(prev + speed, content.length);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [revealed, content.length, speed, interval, onComplete]);

  const visibleText = content.slice(0, revealed);
  const isComplete = revealed >= content.length;

  const textSize = size === "sm" ? "text-[13px]" : "text-[14px]";
  const headingSize = size === "sm" ? "text-[11px]" : "text-[11px]";
  const leadingSize = size === "sm" ? "leading-[1.7]" : "leading-[1.75]";
  const bulletMt = size === "sm" ? "mt-[7px]" : "mt-[9px]";
  const gapSize = size === "sm" ? "gap-2.5" : "gap-3";
  const spaceY = size === "sm" ? "space-y-2" : "space-y-2.5";
  const mbSize = size === "sm" ? "mb-3" : "mb-4";
  const sectionMt = size === "sm" ? "mt-5" : "mt-6";
  const sectionMb = size === "sm" ? "mb-2.5" : "mb-3";
  const dividerMb = size === "sm" ? "mb-1" : "mb-4";

  return (
    <div className="relative">
      <ReactMarkdown
        components={{
          h3: ({ children }) => (
            <div className={`${sectionMt} ${sectionMb} first:mt-0`}>
              <div className={`h-px bg-white/[0.06] ${dividerMb}`} />
              <span className={`${headingSize} font-semibold uppercase tracking-widest text-[#7c3aed]`}>
                {children}
              </span>
            </div>
          ),
          p: ({ children }) => (
            <p className={`${textSize} text-[#9a9a9f] ${mbSize} ${leadingSize}`}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className={`${spaceY} ${mbSize} ps-0.5`}>
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className={`flex items-start ${gapSize} ${textSize} text-[#b0b0b5] ${leadingSize}`}>
              <span className={`${bulletMt} flex-shrink-0 size-[5px] rounded-full bg-[#7c3aed]/40`} />
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-[#e0e0e5]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-[#8a8a8f] not-italic">{children}</em>
          ),
        }}
      >
        {visibleText}
      </ReactMarkdown>

      {/* Blinking cursor */}
      {showCursor && !isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[14px] bg-[#7c3aed] ml-0.5 align-middle rounded-full"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      )}
    </div>
  );
}
