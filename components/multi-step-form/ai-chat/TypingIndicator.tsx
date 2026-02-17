"use client";

import { motion } from "motion/react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import Image from "next/image";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3"
    >
      {/* Corteksa Logo Avatar */}
      <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center p-1.5">
        <Image
          src="/Corteksa.svg"
          alt="Corteksa AI"
          width={20}
          height={20}
          className="w-full h-full"
        />
      </div>

      {/* Shimmer text */}
      <div className="inline-block">
        <TextShimmer
          duration={1.5}
          className="text-sm font-medium [--base-color:#71717a] [--base-gradient-color:#ffffff] dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]"
        >
          Generating...
        </TextShimmer>
      </div>
    </motion.div>
  );
}
