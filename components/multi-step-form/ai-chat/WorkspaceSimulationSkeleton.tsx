"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconDatabase, IconTable } from "@tabler/icons-react";

interface WorkspaceSimulationSkeletonProps {
  isRTL?: boolean;
}

// Simulates sequential building with shimmer bars — creates visual continuity
// with the real WorkspaceSimulation that follows
export function WorkspaceSimulationSkeleton({ isRTL = false }: WorkspaceSimulationSkeletonProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),    // Sidebar header
      setTimeout(() => setPhase(2), 500),    // First sidebar item (active)
      setTimeout(() => setPhase(3), 900),    // Second sidebar item
      setTimeout(() => setPhase(4), 1300),   // Third sidebar item
      setTimeout(() => setPhase(5), 1600),   // Table object header
      setTimeout(() => setPhase(6), 1900),   // Field 1
      setTimeout(() => setPhase(7), 2100),   // Field 2
      setTimeout(() => setPhase(8), 2300),   // Field 3
      setTimeout(() => setPhase(9), 2500),   // Field 4
      setTimeout(() => setPhase(10), 2800),  // Row 1
      setTimeout(() => setPhase(11), 3200),  // Row 2
      setTimeout(() => setPhase(12), 3600),  // Row 3
      setTimeout(() => setPhase(13), 4000),  // Row 4
      // Loop: switch to 2nd sidebar item
      setTimeout(() => setPhase(14), 5000),  // Switch active sidebar
      setTimeout(() => setPhase(15), 5300),  // New table headers
      setTimeout(() => setPhase(16), 5600),  // New rows start
      setTimeout(() => setPhase(17), 6000),  // More rows
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const sidebarItems = [
    { phase: 2, active: phase >= 2 && phase < 14 },
    { phase: 3, active: phase >= 14 },
    { phase: 4, active: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full h-full"
    >
      <div className="w-full h-full rounded-2xl border border-white/[0.08] bg-[#1a1a1e]/80 backdrop-blur-sm overflow-hidden shadow-lg">
        <div
          className="w-full h-full"
          style={{
            transform: `rotateY(${isRTL ? "3deg" : "-3deg"}) rotateX(2deg)`,
            transformOrigin: isRTL ? "right center" : "left center",
            perspective: "1200px",
          }}
        >
          <div className={`flex h-full ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
            {/* ═══ SIDEBAR ═══ */}
            <div
              className={`w-48 flex-shrink-0 border-white/[0.06] bg-[#141416] p-3 space-y-1 ${
                isRTL ? "border-l" : "border-r"
              }`}
            >
              {/* Workspace name shimmer */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                animate={{
                  opacity: phase >= 1 ? 1 : 0,
                  x: phase >= 1 ? 0 : isRTL ? 10 : -10,
                }}
                transition={{ duration: 0.3 }}
                className="px-1"
              >
                <div className="h-3.5 w-24 rounded bg-white/[0.08] animate-pulse" />
              </motion.div>
              <div className="h-px bg-white/[0.06] my-2" />

              {/* Sidebar items — appear sequentially */}
              {sidebarItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                  animate={{
                    opacity: phase >= item.phase ? 1 : 0,
                    x: phase >= item.phase ? 0 : isRTL ? 12 : -12,
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors duration-300 ${
                    item.active ? "bg-[#7c3aed]/10" : ""
                  }`}
                >
                  <IconDatabase
                    className={`size-3.5 flex-shrink-0 transition-colors duration-300 ${
                      item.active ? "text-[#7c3aed]/50" : "text-[#3a3a3f]"
                    }`}
                  />
                  <div
                    className={`h-3 rounded animate-pulse ${
                      item.active ? "bg-[#7c3aed]/20" : "bg-white/[0.06]"
                    }`}
                    style={{ width: `${60 + i * 12}%` }}
                  />
                </motion.div>
              ))}

              {/* Building indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-3 pt-3 border-t border-white/[0.04]"
              >
                <div className="flex items-center gap-2 px-1">
                  <div className="size-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
                  <div className="h-2.5 w-20 rounded bg-white/[0.06] animate-pulse" />
                </div>
                <div className="mt-1.5 mx-1 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#7c3aed]/40 rounded-full"
                    animate={{
                      width: phase < 14 ? "33%" : phase < 17 ? "66%" : "80%",
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </div>

            {/* ═══ TABLE AREA ═══ */}
            <div className="flex-1 p-5 space-y-4">
              {/* Object header */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{
                  opacity: phase >= 5 ? 1 : 0,
                  y: phase >= 5 ? 0 : -5,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5"
              >
                <div className="size-7 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center">
                  <IconTable className="size-4 text-[#7c3aed]/40" />
                </div>
                <div className="h-4 w-28 rounded bg-white/[0.08] animate-pulse" />
                <div className="h-4 w-14 rounded-full bg-[#7c3aed]/10 animate-pulse" />
              </motion.div>

              {/* Table */}
              <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#0f0f0f]/50">
                {/* Headers — appear one by one */}
                <div className="flex bg-[#141416] border-b border-white/[0.06]">
                  {[6, 7, 8, 9].map((p, fi) => (
                    <motion.div
                      key={fi}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{
                        opacity: phase >= p ? 1 : 0,
                        y: phase >= p ? 0 : -4,
                      }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 px-3 py-2.5 min-w-0"
                    >
                      <div
                        className="h-2.5 rounded bg-white/[0.06] animate-pulse"
                        style={{ width: `${65 + fi * 8}%` }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Rows — appear sequentially */}
                {[10, 11, 12, 13].map((p, ri) => (
                  <motion.div
                    key={ri}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{
                      opacity: phase >= p ? 1 : 0,
                      y: phase >= p ? 0 : 3,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex border-b border-white/[0.03] last:border-0"
                  >
                    {[0, 1, 2, 3].map((ci) => (
                      <div key={ci} className="flex-1 px-3 py-2.5 min-w-0">
                        <div
                          className="h-3.5 rounded bg-white/[0.06] animate-pulse"
                          style={{ width: `${50 + ((ri * 17 + ci * 31) % 40)}%` }}
                        />
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
