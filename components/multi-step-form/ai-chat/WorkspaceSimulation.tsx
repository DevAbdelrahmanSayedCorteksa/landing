"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GeneratedTemplatePreview } from "@/lib/types/workspace";
import { IconDatabase } from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";

// Convert "tabler-heart" → "IconHeart"
function getTablerIcon(iconName?: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return IconDatabase;
  const name = iconName
    .replace(/^tabler-/, "")
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const key = `Icon${name}` as keyof typeof TablerIcons;
  const Icon = TablerIcons[key];
  return (typeof Icon === "function" ? Icon : IconDatabase) as React.ComponentType<{ className?: string }>;
}

interface WorkspaceSimulationProps {
  template: GeneratedTemplatePreview;
  isRTL?: boolean;
  onComplete?: () => void;
}

interface ObjectData {
  name: string;
  icon?: string;
  fields: { name: string }[];
  rows: Record<string, unknown>[];
}

// Timing constants (ms) — slow, realistic building pace
const T = {
  INITIAL: 600,
  SIDEBAR_SETTLE: 700,
  FIELD: 350,
  POST_FIELDS: 500,
  ROW_APPEAR: 150,
  CELL: 180,
  POST_ROW: 300,
  OBJECT_PAUSE: 1000,
};

export function WorkspaceSimulation({ template, isRTL = false, onComplete }: WorkspaceSimulationProps) {
  const objects = template.schema.objects || [];
  const sampleData = template.schema.sample_data || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objectsData: ObjectData[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return objects.slice(0, 6).map((obj: any, i: number) => {
      const name = obj.name || obj.object_name || `Object ${i + 1}`;
      const icon = obj.icon;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = (obj.fields || []).slice(0, 5).map((f: any, fi: number) => ({
        name: f.name || f.field_name || `Field ${fi + 1}`,
      }));
      const rows = ((sampleData[name] || []) as Record<string, unknown>[]).slice(0, 4);
      return { name, icon, fields, rows };
    });
  }, [objects, sampleData]);

  // ── Build state ──
  const [sidebarCount, setSidebarCount] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [fieldCount, setFieldCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [cellCounts, setCellCounts] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [userIdx, setUserIdx] = useState<number | null>(null);
  const [builtSet, setBuiltSet] = useState<Set<number>>(new Set());

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const q = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // ── Sequential build orchestrator ──
  useEffect(() => {
    if (!objectsData.length) return;

    let t = T.INITIAL;

    for (let oi = 0; oi < objectsData.length; oi++) {
      const obj = objectsData[oi];
      const fc = obj.fields.length;
      const rc = obj.rows.length > 0 ? Math.min(obj.rows.length, 4) : 3;
      const cap = oi;

      // 1. Sidebar item appears + become active
      q(() => {
        setSidebarCount(cap + 1);
        setActiveIdx(cap);
        setFieldCount(0);
        setRowCount(0);
        setCellCounts([]);
      }, t);
      t += T.SIDEBAR_SETTLE;

      // 2. Field headers appear one by one
      for (let fi = 0; fi < fc; fi++) {
        const cf = fi;
        q(() => setFieldCount(cf + 1), t);
        t += T.FIELD;
      }
      t += T.POST_FIELDS;

      // 3. Data rows + cells appear cell by cell
      for (let ri = 0; ri < rc; ri++) {
        const cr = ri;
        q(() => {
          setRowCount(cr + 1);
          setCellCounts(p => { const n = [...p]; n[cr] = 0; return n; });
        }, t);
        t += T.ROW_APPEAR;

        for (let ci = 0; ci < fc; ci++) {
          const cc = ci;
          q(() => {
            setCellCounts(p => { const n = [...p]; n[cr] = cc + 1; return n; });
          }, t);
          t += T.CELL;
        }
        t += T.POST_ROW;
      }

      // 4. Mark object as fully built
      q(() => setBuiltSet(p => new Set([...p, cap])), t);
      t += T.OBJECT_PAUSE;
    }

    // All done — notify parent
    q(() => {
      setDone(true);
      onCompleteRef.current?.();
    }, t);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [objectsData, q]);

  // ── Display logic ──
  const showIdx = userIdx ?? Math.max(activeIdx, 0);
  const obj = objectsData[showIdx];
  const isBuilding = showIdx === activeIdx && !done;
  const isBuilt = builtSet.has(showIdx) || done;

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
              className={`w-48 flex-shrink-0 border-white/[0.06] bg-[#141416] p-3 space-y-1 overflow-y-auto ${
                isRTL ? "border-l" : "border-r"
              }`}
            >
              <Typer
                text={template.template_name}
                className="text-xs font-semibold text-white/70 truncate block px-1"
                speed={45}
                delay={200}
              />
              <div className="h-px bg-white/[0.06] my-2" />

              {objectsData.map((o, i) => {
                if (i >= sidebarCount) return null;
                const isActive = i === showIdx;
                const SideIcon = getTablerIcon(o.icon);

                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    onClick={() => done && setUserIdx(i)}
                    disabled={!done}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-[#7c3aed]/10 text-[#a78bfa] font-medium"
                        : done
                          ? "text-[#6a6a6f] hover:bg-white/[0.04] hover:text-white cursor-pointer"
                          : "text-[#4a4a4f]"
                    }`}
                  >
                    <SideIcon className="size-3.5 flex-shrink-0" />
                    <Typer text={o.name} speed={40} delay={0} className="truncate" />
                  </motion.button>
                );
              })}

              {/* Build progress */}
              {!done && sidebarCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 pt-3 border-t border-white/[0.04]"
                >
                  <div className="flex items-center gap-2 px-1">
                    <div className="size-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
                    <span className="text-[10px] text-[#6a6a6f]">
                      Building {Math.min(sidebarCount, objectsData.length)}/{objectsData.length}
                    </span>
                  </div>
                  <div className="mt-1.5 mx-1 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full bg-[#7c3aed]/60 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(sidebarCount / objectsData.length) * 100}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}

              {done && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 pt-3 border-t border-white/[0.04]"
                >
                  <div className="flex items-center gap-2 px-1">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {objectsData.length} objects ready
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ═══ TABLE AREA ═══ */}
            <div className="flex-1 p-5 overflow-hidden">
              <AnimatePresence mode="wait">
                {obj && (
                  <motion.div
                    key={showIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Object header */}
                    <div className="flex items-center gap-2.5">
                      <ObjectHeaderIcon iconName={obj.icon} />
                      <div className="min-w-0">
                        {isBuilt && !isBuilding ? (
                          <span className="text-sm font-semibold text-white">{obj.name}</span>
                        ) : (
                          <Typer
                            text={obj.name}
                            className="text-sm font-semibold text-white"
                            speed={50}
                            delay={100}
                          />
                        )}
                      </div>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#7c3aed]/10 text-[#a78bfa] font-medium flex-shrink-0"
                      >
                        {obj.fields.length} fields
                      </motion.span>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#0f0f0f]/50">
                      {/* Column headers */}
                      <div className="flex bg-[#141416] border-b border-white/[0.06]">
                        {obj.fields.map((f, fi) => {
                          const visible = isBuilt || (isBuilding && fi < fieldCount);
                          if (!visible) return null;

                          return (
                            <motion.div
                              key={fi}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35 }}
                              className="flex-1 px-3 py-2.5 min-w-0"
                            >
                              {isBuilt && !isBuilding ? (
                                <span className="text-[10px] font-semibold text-[#6a6a6f] uppercase tracking-wider truncate block">
                                  {f.name}
                                </span>
                              ) : (
                                <Typer
                                  text={f.name}
                                  className="text-[10px] font-semibold text-[#6a6a6f] uppercase tracking-wider truncate block"
                                  speed={35}
                                  delay={0}
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Data rows */}
                      {obj.rows.length > 0 ? (
                        obj.rows.map((row, ri) => {
                          const showRow = isBuilt || (isBuilding && ri < rowCount);
                          if (!showRow) return null;

                          return (
                            <motion.div
                              key={ri}
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35 }}
                              className="flex border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                            >
                              {obj.fields.map((f, ci) => {
                                const val = String(row[f.name] ?? "\u2014");
                                const showCell = isBuilt || (isBuilding && (cellCounts[ri] ?? 0) > ci);

                                return (
                                  <div key={ci} className="flex-1 px-3 py-2 min-w-0">
                                    {showCell ? (
                                      isBuilt && !isBuilding ? (
                                        <span className="text-xs text-[#c0c0c5] truncate block">{val}</span>
                                      ) : (
                                        <Typer
                                          text={val}
                                          className="text-xs text-[#c0c0c5] truncate block"
                                          speed={25}
                                          delay={0}
                                        />
                                      )
                                    ) : (
                                      <div className="h-4" />
                                    )}
                                  </div>
                                );
                              })}
                            </motion.div>
                          );
                        })
                      ) : (
                        // Placeholder shimmer rows when no sample data
                        Array.from({ length: 3 }).map((_, ri) => {
                          const showRow = isBuilt || (isBuilding && ri < rowCount);
                          if (!showRow) return null;

                          return (
                            <motion.div
                              key={`ph-${ri}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.5 }}
                              transition={{ duration: 0.3 }}
                              className="flex border-b border-white/[0.03] last:border-0"
                            >
                              {obj.fields.map((_, ci) => (
                                <div key={ci} className="flex-1 px-3 py-2.5">
                                  <div
                                    className="h-3.5 rounded bg-white/[0.06] animate-pulse"
                                    style={{ width: `${50 + ((ri * 17 + ci * 31) % 40)}%` }}
                                  />
                                </div>
                              ))}
                            </motion.div>
                          );
                        })
                      )}
                    </div>

                    {/* Row count */}
                    {obj.rows.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-end"
                      >
                        <span className="text-[10px] text-[#6a6a6f]">
                          {isBuilt
                            ? `${obj.rows.length} records`
                            : isBuilding
                              ? `${Math.min(rowCount, obj.rows.length)}/${obj.rows.length} records`
                              : ""}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Self-contained typewriter with blinking cursor ──
function Typer({
  text,
  className = "",
  speed = 30,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [chars, setChars] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setChars("");
    setShowCursor(true);

    let interval: ReturnType<typeof setInterval> | undefined;
    let cursorTimer: ReturnType<typeof setTimeout> | undefined;

    const timeout = setTimeout(() => {
      let idx = 0;
      interval = setInterval(() => {
        if (idx < text.length) {
          setChars(text.slice(0, ++idx));
        } else {
          clearInterval(interval);
          cursorTimer = setTimeout(() => setShowCursor(false), 800);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
      if (cursorTimer) clearTimeout(cursorTimer);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {chars}
      {showCursor && chars.length < text.length && (
        <span className="animate-pulse text-[#7c3aed] font-light">|</span>
      )}
    </span>
  );
}

// ── Object header icon (resolves tabler icon name) ──
function ObjectHeaderIcon({ iconName }: { iconName?: string }) {
  const Icon = getTablerIcon(iconName);
  return (
    <div className="size-7 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center">
      <Icon className="size-4 text-[#7c3aed]" />
    </div>
  );
}
