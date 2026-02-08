"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScrollSync, type TabId } from "./scroll-sync-provider";
import { motion } from "motion/react";

interface SectionWrapperProps {
  id: TabId;
  children: React.ReactNode;
  className?: string;
  alternate?: boolean;
}

export function SectionWrapper({ id, children, className, alternate }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const { registerSection } = useScrollSync();

  useEffect(() => {
    if (ref.current) {
      registerSection(id, ref.current);
    }
  }, [id, registerSection]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "py-16 md:py-24 lg:py-32",
        alternate && "bg-neutral-50/50 dark:bg-neutral-900/30",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
