"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export interface TimelineItem {
  id: number;
  title: string;
  date?: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
}

export default function RadialOrbitalTimeline({
  timelineData,
  className,
}: RadialOrbitalTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulsingIds, setPulsingIds] = useState<Set<number>>(new Set());
  const [radius, setRadius] = useState(200);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  // ── Responsive sizing ──
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setRadius(Math.max(140, Math.min(width, height) * 0.34));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Smooth rotation via requestAnimationFrame ──
  useEffect(() => {
    if (!autoRotate) {
      lastTimeRef.current = 0;
      return;
    }
    const animate = (time: number) => {
      if (lastTimeRef.current) {
        const delta = time - lastTimeRef.current;
        setRotationAngle((prev) => (prev + delta * 0.006) % 360);
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoRotate]);

  // ── Helpers ──
  const getRelatedIds = useCallback(
    (id: number) => timelineData.find((i) => i.id === id)?.relatedIds ?? [],
    [timelineData]
  );

  const getNodePos = useCallback(
    (index: number) => {
      const angle =
        ((index / timelineData.length) * 360 + rotationAngle) % 360;
      const rad = (angle * Math.PI) / 180;
      const sinVal = Math.sin(rad);
      return {
        x: radius * Math.cos(rad),
        y: radius * sinVal,
        angle,
        zIndex: Math.round(100 + 50 * ((1 + sinVal) / 2)),
        scale: 0.78 + 0.22 * ((1 + sinVal) / 2),
        opacity: 0.45 + 0.55 * ((1 + sinVal) / 2),
      };
    },
    [timelineData.length, rotationAngle, radius]
  );

  // ── Actions ──
  const toggleItem = useCallback(
    (id: number) => {
      setExpandedId((prev) => {
        if (prev === id) {
          setAutoRotate(true);
          setPulsingIds(new Set());
          return null;
        }
        setAutoRotate(false);
        setPulsingIds(new Set(getRelatedIds(id)));
        const idx = timelineData.findIndex((i) => i.id === id);
        const target = (idx / timelineData.length) * 360;
        setRotationAngle(270 - target);
        return id;
      });
    },
    [timelineData, getRelatedIds]
  );

  const handleBgClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedId(null);
      setAutoRotate(true);
      setPulsingIds(new Set());
    }
  };

  const getStatusStyle = (s: TimelineItem["status"]) => {
    switch (s) {
      case "completed":
        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/25";
      case "in-progress":
        return "bg-amber-500/15 text-amber-500 border-amber-500/25";
      case "pending":
        return "bg-neutral-500/15 text-neutral-400 border-neutral-500/25";
    }
  };

  const getStatusLabel = (s: TimelineItem["status"]) => {
    switch (s) {
      case "completed":
        return "Active";
      case "in-progress":
        return "In Progress";
      case "pending":
        return "Planned";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex items-center justify-center",
        "min-h-[480px] sm:min-h-[600px] md:min-h-[720px]",
        className
      )}
      onClick={handleBgClick}
    >
      {/* Orbit area */}
      <div
        ref={orbitRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* ── Center logo ── */}
        <div className="absolute z-10 flex items-center justify-center">
          {/* Outer subtle ring */}
          <div className="absolute size-24 md:size-28 rounded-full border border-neutral-200 dark:border-neutral-800" />
          {/* Inner ring */}
          <div className="absolute size-[4.5rem] md:size-[5.5rem] rounded-full border border-neutral-100 dark:border-neutral-800/60" />
          {/* Logo circle */}
          <div className="size-14 md:size-[4.25rem] rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <div className="relative size-8 md:size-10">
              <Image
                src="/Corteksa.svg"
                alt="Corteksa"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* ── Orbit ring ── */}
        <div
          className="absolute rounded-full border border-dashed border-neutral-300/50 dark:border-neutral-600/50"
          style={{ width: radius * 2, height: radius * 2 }}
        />

        {/* ── Nodes ── */}
        {timelineData.map((item, index) => {
          const pos = getNodePos(index);
          const isExpanded = expandedId === item.id;
          const isRelated = pulsingIds.has(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="absolute group cursor-pointer"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${isExpanded ? 1.3 : pos.scale})`,
                zIndex: isExpanded ? 200 : isRelated ? 150 : pos.zIndex,
                opacity:
                  isExpanded || isRelated || expandedId === null
                    ? isExpanded
                      ? 1
                      : pos.opacity
                    : 0.2,
                transition:
                  "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Node circle */}
              <div
                className={cn(
                  "size-12 md:size-14 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isExpanded
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/40"
                    : isRelated
                      ? "bg-primary/15 dark:bg-primary/20 text-primary border-primary/50 animate-pulse"
                      : "bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border-neutral-200/80 dark:border-neutral-700/60 group-hover:border-primary/40 group-hover:text-primary"
                )}
              >
                <Icon className="size-5 md:size-6" />
              </div>

              {/* Label — always visible */}
              <div
                className={cn(
                  "absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap",
                  "text-[10px] md:text-xs font-semibold tracking-wide transition-all duration-300 pointer-events-none",
                  isExpanded
                    ? "text-foreground"
                    : isRelated
                      ? "text-primary"
                      : "text-muted-foreground"
                )}
              >
                {item.title}
              </div>

              {/* ── Expand card ── */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={cn(
                      "absolute top-20 left-1/2 -translate-x-1/2 w-60 md:w-72",
                      "rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl",
                      "border border-neutral-200 dark:border-neutral-800",
                      "shadow-2xl shadow-primary/5 dark:shadow-primary/10",
                      "p-4 z-[300]"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Connector */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-primary/30" />

                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0.5 font-medium",
                          getStatusStyle(item.status)
                        )}
                      >
                        {getStatusLabel(item.status)}
                      </Badge>
                      {item.date && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {item.date}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>

                    {/* Connected nodes */}
                    {item.relatedIds.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-1 mb-2">
                          <LinkIcon size={10} className="text-muted-foreground" />
                          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                            Connected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relId) => {
                            const related = timelineData.find(
                              (i) => i.id === relId
                            );
                            if (!related) return null;
                            return (
                              <Button
                                key={relId}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[10px] rounded-md gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(relId);
                                }}
                              >
                                {related.title}
                                <ArrowRight size={8} />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
