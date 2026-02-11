"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Container } from "@/components/container";
import { useScrollSync, TAB_IDS, type TabId } from "./scroll-sync-provider";

const TAB_LABELS: Record<TabId, string> = {
  "the-system": "tabTheSystem",
  documents: "tabDocuments",
  collaboration: "tabCollaboration",
  "best-fit": "tabBestFit",
  assistant: "tabAssistant",
  "all-features": "tabAllFeatures",
};

export function FeaturesTabsNav() {
  const t = useTranslations("product");
  const { activeTab, scrollToSection } = useScrollSync();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Detect when the nav becomes sticky via sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll tab container on mobile to keep active tab centered
  useEffect(() => {
    const activeTabEl = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (activeTabEl && container) {
      const scrollLeft =
        activeTabEl.offsetLeft - container.offsetWidth / 2 + activeTabEl.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <>
      {/* Invisible sentinel: when it scrolls out of view, the nav is "stuck" */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

      <nav
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          "bg-background/95 backdrop-blur-2xl",
          "border-b border-neutral-200/80 dark:border-neutral-800/80",
          isStuck && "shadow-md shadow-neutral-900/5 dark:shadow-black/30 bg-background/98"
        )}
      >
        <Container>
          <div
            ref={containerRef}
            className="flex items-center justify-start lg:justify-center overflow-x-auto gap-0.5 lg:gap-1 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TAB_IDS.map((tabId, index) => {
              const isActive = activeTab === tabId;
              return (
                <button
                  key={tabId}
                  ref={(el) => {
                    if (el) tabRefs.current.set(tabId, el);
                  }}
                  onClick={() => scrollToSection(tabId)}
                  className={cn(
                    "relative flex items-center gap-2 px-3.5 md:px-5 py-4 md:py-5 whitespace-nowrap transition-all duration-200 shrink-0 group",
                    isActive
                      ? "text-primary"
                      : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  )}
                >
                  <span
                    className={cn(
                      "text-[11px] md:text-xs font-mono tabular-nums transition-opacity duration-200",
                      isActive ? "opacity-80 text-primary" : "opacity-40 group-hover:opacity-60"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-sm md:text-[15px] transition-all duration-200",
                      isActive ? "font-semibold" : "font-medium"
                    )}
                  >
                    {t(TAB_LABELS[tabId])}
                  </span>

                  {/* Active tab indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="product-tab-indicator"
                      className="absolute bottom-0 inset-x-2 h-[2.5px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Container>
      </nav>
    </>
  );
}
