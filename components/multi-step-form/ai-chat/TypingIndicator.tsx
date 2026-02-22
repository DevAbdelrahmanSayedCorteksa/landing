"use client";

import { motion } from "motion/react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import dynamic from "next/dynamic";

const PlasmaGlobe = dynamic(() => import("@/components/lightswind/plasma-globe"), { ssr: false });

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3"
    >
      {/* Plasma Globe Avatar - fast speed during thinking */}
      <div className="relative flex-shrink-0 size-8 rounded-full overflow-hidden">
        <PlasmaGlobe speed={5.0} intensity={1.0} />
      </div>

      {/* Shimmer text */}
      <div className="inline-block">
        <TextShimmer
          duration={1.5}
          className="text-sm font-medium [--base-color:#71717a] [--base-gradient-color:#18181b] dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]"
        >
          Generating...
        </TextShimmer>
      </div>
    </motion.div>
  );
}
