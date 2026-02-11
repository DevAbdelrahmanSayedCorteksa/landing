"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

export const TAB_IDS = [
  "the-system",
  "documents",
  "collaboration",
  "best-fit",
  "assistant",
] as const;

export type TabId = (typeof TAB_IDS)[number];

interface ScrollSyncContextType {
  activeTab: TabId;
  scrollToSection: (tabId: TabId) => void;
  registerSection: (tabId: TabId, element: HTMLElement) => void;
}

const ScrollSyncContext = createContext<ScrollSyncContextType | null>(null);

export function useScrollSync() {
  const context = useContext(ScrollSyncContext);
  if (!context) {
    throw new Error("useScrollSync must be used within a ScrollSyncProvider");
  }
  return context;
}

export function ScrollSyncProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>("the-system");
  const sectionsRef = useRef<Map<TabId, HTMLElement>>(new Map());
  const isScrollingRef = useRef(false);

  const registerSection = useCallback((tabId: TabId, element: HTMLElement) => {
    sectionsRef.current.set(tabId, element);
  }, []);

  const scrollToSection = useCallback((tabId: TabId) => {
    const section = sectionsRef.current.get(tabId);
    if (section) {
      isScrollingRef.current = true;
      setActiveTab(tabId);

      // Only the tab nav is sticky (top-0), so offset by its height + small buffer
      const tabNavHeight = 64;
      const y = section.getBoundingClientRect().top + window.scrollY - tabNavHeight;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        let maxRatio = 0;
        let maxId: TabId | null = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxId = entry.target.id as TabId;
          }
        });

        if (maxId && maxRatio > 0.1) {
          setActiveTab(maxId);
        }
      },
      {
        rootMargin: "-64px 0px -40% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    // Small delay to ensure sections are registered
    const timer = setTimeout(() => {
      sectionsRef.current.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <ScrollSyncContext.Provider value={{ activeTab, scrollToSection, registerSection }}>
      {children}
    </ScrollSyncContext.Provider>
  );
}
