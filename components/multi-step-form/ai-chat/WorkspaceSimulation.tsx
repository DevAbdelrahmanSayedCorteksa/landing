"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { GeneratedTemplatePreview } from "@/lib/types/workspace";
import {
  IconDatabase,
  IconHome,
  IconCheckbox,
  IconHeadphones,
  IconSearch,
  IconFilter,
  IconPlus,
  IconDotsVertical,
  IconChevronRight,
  IconChevronDown,
  IconSettings,
  IconBell,
  IconFlag,
  IconArrowsSort,
  IconTableImport,
  IconAdjustments,
  IconLayoutGrid,
} from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";
import Image from "next/image";

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

// ── Smart field type detection ──
type FieldType = "name" | "status" | "assignee" | "risk" | "default";

function detectFieldType(fieldName: string, fieldIndex: number): FieldType {
  const lower = fieldName.toLowerCase();
  if (lower.includes("status") || lower.includes("state") || lower === "stage") return "status";
  if (lower.includes("assign") || lower.includes("owner") || lower.includes("member") || lower.includes("responsible")) return "assignee";
  if (lower.includes("risk") || lower.includes("priority") || lower.includes("severity") || lower.includes("urgency")) return "risk";
  if (fieldIndex === 0 || lower.includes("name") || lower.includes("title") || lower.includes("subject")) return "name";
  return "default";
}

// ── Status badge colors ──
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:       { bg: "bg-amber-500/15",   text: "text-amber-400",   dot: "bg-amber-400" },
  "in progress": { bg: "bg-purple-500/15",  text: "text-purple-400",  dot: "bg-purple-400" },
  "in_progress": { bg: "bg-purple-500/15",  text: "text-purple-400",  dot: "bg-purple-400" },
  active:        { bg: "bg-blue-500/15",    text: "text-blue-400",    dot: "bg-blue-400" },
  completed:     { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  done:          { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  planned:       { bg: "bg-rose-500/15",    text: "text-rose-400",    dot: "bg-rose-400" },
  cancelled:     { bg: "bg-zinc-500/15",    text: "text-zinc-400",    dot: "bg-zinc-400" },
  open:          { bg: "bg-blue-500/15",    text: "text-blue-400",    dot: "bg-blue-400" },
  closed:        { bg: "bg-zinc-500/15",    text: "text-zinc-400",    dot: "bg-zinc-400" },
};

function getStatusColor(value: string) {
  const lower = value.toLowerCase().trim();
  return STATUS_COLORS[lower] || { bg: "bg-zinc-500/15", text: "text-zinc-400", dot: "bg-zinc-400" };
}

// ── Risk badge colors ──
function getRiskColor(value: string) {
  const lower = value.toLowerCase().trim();
  if (lower === "high" || lower === "critical") return { text: "text-red-400", icon: "text-red-400" };
  if (lower === "medium" || lower === "moderate") return { text: "text-yellow-400", icon: "text-yellow-400" };
  if (lower === "low") return { text: "text-green-400", icon: "text-green-400" };
  return null;
}

// ── Assignee avatar colors (deterministic from name) ──
const AVATAR_COLORS = [
  "bg-red-500/80", "bg-blue-500/80", "bg-emerald-500/80", "bg-purple-500/80",
  "bg-amber-500/80", "bg-cyan-500/80", "bg-pink-500/80", "bg-teal-500/80",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Types ──
interface WorkspaceSimulationProps {
  template: GeneratedTemplatePreview;
  isRTL?: boolean;
  onComplete?: () => void;
  skipAnimation?: boolean;
}

interface ObjectData {
  name: string;
  icon?: string;
  fields: { name: string; type: FieldType }[];
  rows: Record<string, unknown>[];
}

// Timing constants (ms)
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

export function WorkspaceSimulation({ template, isRTL = false, onComplete, skipAnimation = false }: WorkspaceSimulationProps) {
  const objects = template.schema.objects || [];
  const sampleData = template.schema.sample_data || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objectsData: ObjectData[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return objects.map((obj: any, i: number) => {
      const name = obj.name || obj.object_name || `Object ${i + 1}`;
      const icon = obj.icon;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = (obj.fields || []).map((f: any, fi: number) => ({
        name: f.name || f.field_name || `Field ${fi + 1}`,
        type: detectFieldType(f.name || f.field_name || "", fi),
      }));
      const rows = ((sampleData[name] || []) as Record<string, unknown>[]).slice(0, 8);
      return { name, icon, fields, rows };
    });
  }, [objects, sampleData]);

  // ── Build state ──
  const allIndices = useMemo(() => new Set(objectsData.map((_, i) => i)), [objectsData]);
  const [sidebarCount, setSidebarCount] = useState(skipAnimation ? objectsData.length : 0);
  const [activeIdx, setActiveIdx] = useState(skipAnimation ? 0 : -1);
  const [fieldCount, setFieldCount] = useState(skipAnimation ? (objectsData[0]?.fields.length ?? 0) : 0);
  const [rowCount, setRowCount] = useState(skipAnimation ? (objectsData[0]?.rows.length || 3) : 0);
  const [cellCounts, setCellCounts] = useState<number[]>([]);
  const [done, setDone] = useState(skipAnimation);
  const [userIdx, setUserIdx] = useState<number | null>(null);
  const [builtSet, setBuiltSet] = useState<Set<number>>(skipAnimation ? allIndices : new Set());

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
    if (!objectsData.length || skipAnimation) return;

    let t = T.INITIAL;

    for (let oi = 0; oi < objectsData.length; oi++) {
      const obj = objectsData[oi];
      const fc = obj.fields.length;
      const rc = obj.rows.length > 0 ? Math.min(obj.rows.length, 8) : 3;
      const cap = oi;

      q(() => {
        setSidebarCount(cap + 1);
        setActiveIdx(cap);
        setFieldCount(0);
        setRowCount(0);
        setCellCounts([]);
      }, t);
      t += T.SIDEBAR_SETTLE;

      for (let fi = 0; fi < fc; fi++) {
        const cf = fi;
        q(() => setFieldCount(cf + 1), t);
        t += T.FIELD;
      }
      t += T.POST_FIELDS;

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

      q(() => setBuiltSet(p => new Set([...p, cap])), t);
      t += T.OBJECT_PAUSE;
    }

    q(() => {
      setDone(true);
      onCompleteRef.current?.();
    }, t);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [objectsData, q, skipAnimation]);

  // ── Display logic ──
  const showIdx = userIdx ?? Math.max(activeIdx, 0);
  const obj = objectsData[showIdx];
  const isBuilding = showIdx === activeIdx && !done;
  const isBuilt = builtSet.has(showIdx) || done;
  const totalRecords = obj ? (obj.rows.length > 0 ? Math.max(obj.rows.length * 30 + 7, 247) : 247) : 0;

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
              className={`w-52 flex-shrink-0 border-white/[0.06] bg-[#141416] flex flex-col overflow-hidden ${
                isRTL ? "border-l" : "border-r"
              }`}
            >
              {/* Logo area */}
              <div className="px-3 pt-3 pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="size-6 flex items-center justify-center flex-shrink-0">
                    <Image src="/Corteksa.svg" alt="Logo" width={18} height={18} className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-[11px] font-semibold text-white/80 truncate">Corteksa CRM</span>
                    <IconChevronDown className="size-3 text-white/30 flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="px-3 mt-3 mb-2">
                <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-[#1a1a1e] border border-white/[0.08]">
                  <IconSearch className="size-3.5 text-[#52525b] flex-shrink-0" />
                  <span className="text-[11px] text-[#52525b] flex-1">Search</span>
                  <span className="text-[10px] text-[#52525b] bg-white/[0.06] px-1.5 py-0.5 rounded-sm font-medium text-nowrap">⌘K</span>
                </div>
              </div>

              {/* Static nav items */}
              <div className="px-2 space-y-0.5">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#6a6a6f]">
                  <IconHome className="size-3.5 flex-shrink-0" />
                  <span>Home</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#6a6a6f]">
                  <IconCheckbox className="size-3.5 flex-shrink-0" />
                  <span>My Tasks</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#6a6a6f]">
                  <IconHeadphones className="size-3.5 flex-shrink-0" />
                  <span>Support</span>
                </div>
              </div>

              {/* Units section */}
              <div className="px-3 mt-3">
                <div className="h-px bg-white/[0.06] mb-2" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-[#4a4a4f] px-0.5">Units</span>
              </div>

              {/* Object list */}
              <div className="px-2 mt-1.5 space-y-0.5 flex-1 overflow-y-auto min-h-0">
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
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-200 ${
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

              </div>

              {/* Bottom icons bar */}
              <div className="px-3 h-10 border-t border-white/[0.06] flex items-center gap-1">
                <div className="size-6 rounded-md flex items-center justify-center text-[#4a4a4f] hover:text-[#6a6a6f]">
                  <IconBell className="size-3.5" />
                </div>
                <div className="size-6 rounded-md flex items-center justify-center text-[#4a4a4f] hover:text-[#6a6a6f]">
                  <IconSettings className="size-3.5" />
                </div>
                <div className="size-6 rounded-md flex items-center justify-center text-[#4a4a4f] hover:text-[#6a6a6f]">
                  <IconFlag className="size-3.5" />
                </div>
              </div>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#141416]">
              {obj && (
                  <div
                    key={showIdx}
                    className="flex-1 min-w-0 flex flex-col overflow-hidden"
                  >
                    {/* Breadcrumb + user avatar */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6a6a6f]">
                        <IconHome className="size-3" />
                        <span>Home</span>
                        <IconChevronRight className="size-2.5" />
                        <span className="text-[#a1a1aa]">{obj.name}</span>
                      </div>
                      <div className="size-6 rounded-full bg-[#7c3aed]/30 flex items-center justify-center">
                        <span className="text-[9px] font-semibold text-[#a78bfa]">W</span>
                      </div>
                    </div>

                    {/* Title row */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <ObjectHeaderIcon iconName={obj.icon} />
                        <div className="min-w-0">
                          {isBuilt && !isBuilding ? (
                            <span className="text-sm font-semibold text-white">{obj.name}</span>
                          ) : (
                            <Typer text={obj.name} className="text-sm font-semibold text-white" speed={50} delay={100} />
                          )}
                        </div>
                      </div>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#7c3aed] text-white"
                      >
                        <IconPlus className="size-3" />
                        Add {obj.name}
                      </motion.button>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 px-5 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium text-white border-b-2 border-[#7c3aed]">
                        <IconLayoutGrid className="size-3" />
                        All {obj.name}
                      </div>
                      <div className="flex items-center gap-1 px-3 py-2 text-[10px] text-[#6a6a6f]">
                        <IconPlus className="size-2.5" />
                        View
                        <IconChevronDown className="size-2.5" />
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-2 px-5 py-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] text-[9px] text-[#a1a1aa]">
                        <IconLayoutGrid className="size-3" />
                        {isBuilt ? totalRecords : "..."} records
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] text-[9px] text-[#6a6a6f] flex-1 max-w-[120px]">
                        <IconSearch className="size-3" />
                        Search...
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] text-[9px] text-[#6a6a6f]">
                        <IconFilter className="size-3" />
                        Filter
                      </div>
                      <div className="flex-1" />
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] text-[#6a6a6f]">
                        <IconTableImport className="size-3" />
                        Import Data
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] text-[#6a6a6f]">
                        <IconAdjustments className="size-3" />
                        Manage Fields
                      </div>
                    </div>

                    {/* ═══ DATA TABLE ═══ */}
                    <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
                      <div className="relative flex-1">
                      <div className="absolute inset-0 overflow-auto">
                        {/* Table header */}
                        <div className="flex items-center bg-[#141416] border-b border-white/[0.06] sticky top-0 z-10 min-w-max">
                          {/* Checkbox col */}
                          <div className="w-8 flex-shrink-0 flex items-center justify-center py-2">
                            <div className="size-3 rounded border border-white/[0.15]" />
                          </div>

                          {obj.fields.map((f, fi) => {
                            const visible = isBuilt || (isBuilding && fi < fieldCount);
                            if (!visible) return null;

                            return (
                              <motion.div
                                key={fi}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="w-[120px] flex-shrink-0 px-3 py-2"
                              >
                                <div className="flex items-center gap-1">
                                  {isBuilt && !isBuilding ? (
                                    <span className="text-[9px] font-semibold text-[#6a6a6f] uppercase tracking-wider truncate">
                                      {f.name}
                                    </span>
                                  ) : (
                                    <Typer
                                      text={f.name}
                                      className="text-[9px] font-semibold text-[#6a6a6f] uppercase tracking-wider truncate"
                                      speed={35}
                                      delay={0}
                                    />
                                  )}
                                  <IconArrowsSort className="size-2.5 text-[#3a3a3f] flex-shrink-0" />
                                </div>
                              </motion.div>
                            );
                          })}

                          {/* Actions col */}
                          <div className="w-14 flex-shrink-0 px-2 py-2 text-[9px] font-semibold text-[#6a6a6f] uppercase tracking-wider">
                            Actions
                          </div>
                        </div>

                        {/* Table rows */}
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
                                className="flex items-center border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors min-w-max"
                              >
                                {/* Checkbox */}
                                <div className="w-8 flex-shrink-0 flex items-center justify-center py-2">
                                  <div className="size-3 rounded border border-white/[0.1]" />
                                </div>

                                {obj.fields.map((f, ci) => {
                                  const val = String(row[f.name] ?? "\u2014");
                                  const showCell = isBuilt || (isBuilding && (cellCounts[ri] ?? 0) > ci);

                                  return (
                                    <div key={ci} className="w-[120px] flex-shrink-0 px-3 py-2">
                                      {showCell ? (
                                        isBuilt && !isBuilding ? (
                                          <CellRenderer value={val} type={f.type} />
                                        ) : (
                                          <Typer text={val} className="text-[10px] text-[#c0c0c5] truncate block" speed={25} delay={0} />
                                        )
                                      ) : (
                                        <div className="h-4" />
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Actions */}
                                <div className="w-14 flex-shrink-0 flex items-center justify-center py-2">
                                  <IconDotsVertical className="size-3.5 text-[#4a4a4f]" />
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          // Placeholder shimmer rows
                          Array.from({ length: 4 }).map((_, ri) => {
                            const showRow = isBuilt || (isBuilding && ri < rowCount);
                            if (!showRow) return null;

                            return (
                              <motion.div
                                key={`ph-${ri}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center border-b border-white/[0.03] min-w-max"
                              >
                                <div className="w-8 flex-shrink-0 flex items-center justify-center py-2.5">
                                  <div className="size-3 rounded border border-white/[0.06]" />
                                </div>
                                {obj.fields.map((_, ci) => (
                                  <div key={ci} className="w-[120px] flex-shrink-0 px-3 py-2.5">
                                    <div
                                      className="h-3 rounded bg-white/[0.06] animate-pulse"
                                      style={{ width: `${50 + ((ri * 17 + ci * 31) % 40)}%` }}
                                    />
                                  </div>
                                ))}
                                <div className="w-14 flex-shrink-0" />
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                      </div>

                      {/* Pagination footer */}
                      <div className="flex items-center justify-between px-4 h-10 border-t border-white/[0.06] bg-[#141416]">
                        <div className="flex items-center gap-2 text-[9px] text-[#6a6a6f]">
                          <span>Rows per page</span>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                            <span className="text-[#a1a1aa]">{Math.min(obj.rows.length || 13, 13)}</span>
                            <IconChevronDown className="size-2.5" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-[#6a6a6f]">
                          <span>
                            {isBuilt
                              ? `1 - ${Math.min(obj.rows.length || 13, 13)} of ${totalRecords}`
                              : isBuilding
                                ? `${Math.min(rowCount, obj.rows.length)}/${obj.rows.length || "..."}`
                                : ""}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((p) => (
                              <div
                                key={p}
                                className={`size-5 rounded flex items-center justify-center text-[9px] ${
                                  p === 1
                                    ? "bg-[#7c3aed] text-white"
                                    : "text-[#6a6a6f] hover:bg-white/[0.04]"
                                }`}
                              >
                                {p}
                              </div>
                            ))}
                            <span className="text-[#4a4a4f] px-0.5">...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Smart cell renderer ──
function CellRenderer({ value, type }: { value: string; type: FieldType }) {
  if (value === "\u2014" || value === "—" || !value) {
    return <span className="text-[10px] text-[#3a3a3f]">—</span>;
  }

  switch (type) {
    case "name":
      return <span className="text-[10px] font-medium text-white truncate block">{value}</span>;

    case "status": {
      const sc = getStatusColor(value);
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${sc.bg} ${sc.text}`}>
          <span className={`size-1.5 rounded-full ${sc.dot}`} />
          {value}
        </span>
      );
    }

    case "assignee": {
      const color = getAvatarColor(value);
      const initials = getInitials(value);
      return (
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`size-5 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
            <span className="text-[8px] font-bold text-white">{initials}</span>
          </div>
          <span className="text-[10px] text-[#c0c0c5] truncate">{value}</span>
        </div>
      );
    }

    case "risk": {
      const rc = getRiskColor(value);
      if (!rc) return <span className="text-[10px] text-[#3a3a3f]">—</span>;
      return (
        <div className="flex items-center gap-1">
          <IconFlag className={`size-3 ${rc.icon}`} />
          <span className={`text-[9px] font-medium ${rc.text}`}>{value}</span>
        </div>
      );
    }

    default:
      return <span className="text-[10px] text-[#c0c0c5] truncate block">{value}</span>;
  }
}

// ── Self-contained typewriter ──
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

// ── Object header icon ──
function ObjectHeaderIcon({ iconName }: { iconName?: string }) {
  const Icon = getTablerIcon(iconName);
  return (
    <div className="size-7 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center">
      <Icon className="size-4 text-[#7c3aed]" />
    </div>
  );
}
