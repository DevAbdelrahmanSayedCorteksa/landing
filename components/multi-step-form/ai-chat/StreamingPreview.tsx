"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import {
  parseStreamingSchema,
  type PartialSchema,
} from "@/lib/utils/streamingJsonParser";

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

function getRiskColor(value: string) {
  const lower = value.toLowerCase().trim();
  if (lower === "high" || lower === "critical") return { text: "text-red-400", icon: "text-red-400" };
  if (lower === "medium" || lower === "moderate") return { text: "text-yellow-400", icon: "text-yellow-400" };
  if (lower === "low") return { text: "text-green-400", icon: "text-green-400" };
  return null;
}

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

interface StreamingPreviewProps {
  streamingContent: string;
  isRTL?: boolean;
}

export function StreamingPreview({ streamingContent, isRTL = false }: StreamingPreviewProps) {
  const parsed: PartialSchema = useMemo(
    () => parseStreamingSchema(streamingContent),
    [streamingContent]
  );

  const allObjects = useMemo(() => {
    const objs = [...parsed.objects];
    if (parsed.currentObjectName) {
      objs.push({
        name: parsed.currentObjectName,
        fields: parsed.currentFields,
        sampleData: undefined,
      });
    }
    return objs;
  }, [parsed.objects, parsed.currentObjectName, parsed.currentFields]);

  const activeIdx = allObjects.length - 1;
  const activeObj = allObjects[activeIdx];

  if (!parsed.templateName && allObjects.length === 0) {
    return <StreamingSkeleton isRTL={isRTL} />;
  }

  const fields = activeObj?.fields.map((f, fi) => ({
    name: f.name,
    type: detectFieldType(f.name, fi),
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full h-full"
    >
      <div className="w-full h-full rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#1a1a1e] overflow-hidden">
        <div className="w-full h-full">
          <div className={`flex h-full ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
            {/* ═══ SIDEBAR ═══ */}
            <div
              className={`w-52 flex-shrink-0 border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-[#141416] flex flex-col overflow-hidden ${
                isRTL ? "border-l" : "border-r"
              }`}
            >
              {/* Logo area */}
              <div className="px-3 pt-3 pb-2 border-b border-neutral-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="size-6 flex items-center justify-center flex-shrink-0">
                    <Image src="/Corteksa.svg" alt="Logo" width={18} height={18} className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    {parsed.templateName ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[11px] font-semibold text-foreground truncate"
                      >
                        Corteksa CRM
                      </motion.span>
                    ) : (
                      <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-white/[0.06] animate-pulse" />
                    )}
                    <IconChevronDown className="size-3 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="px-3 mt-3 mb-2">
                <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-white dark:bg-[#1a1a1e] border border-neutral-200 dark:border-white/[0.08]">
                  <IconSearch className="size-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-[11px] text-muted-foreground flex-1">Search</span>
                  <span className="text-[10px] text-muted-foreground bg-neutral-200 dark:bg-white/[0.06] px-1.5 py-0.5 rounded-sm font-medium text-nowrap">⌘K</span>
                </div>
              </div>

              {/* Static nav items */}
              <div className="px-2 space-y-0.5">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-muted-foreground">
                  <IconHome className="size-3.5 flex-shrink-0" />
                  <span>Home</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-muted-foreground">
                  <IconCheckbox className="size-3.5 flex-shrink-0" />
                  <span>My Tasks</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-muted-foreground">
                  <IconHeadphones className="size-3.5 flex-shrink-0" />
                  <span>Support</span>
                </div>
              </div>

              {/* Units section */}
              <div className="px-3 mt-3">
                <div className="h-px bg-neutral-200 dark:bg-white/[0.06] mb-2" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-[#4a4a4f] px-0.5">Units</span>
              </div>

              {/* Object list */}
              <div className="px-2 mt-1.5 space-y-0.5 flex-1 overflow-y-auto min-h-0">
                {allObjects.map((obj, i) => {
                  const isActive = i === activeIdx;
                  const isComplete = i < parsed.objects.length;
                  const SideIcon = getTablerIcon(obj.icon);

                  return (
                    <motion.div
                      key={`${obj.name}-${i}`}
                      initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-200 ${
                        isActive
                          ? "bg-[#7c3aed]/10 text-[#a78bfa] font-medium"
                          : isComplete
                            ? "text-muted-foreground"
                            : "text-neutral-400 dark:text-[#4a4a4f]"
                      }`}
                    >
                      <SideIcon className="size-3.5 flex-shrink-0" />
                      <span className="truncate">{obj.name}</span>
                    </motion.div>
                  );
                })}

              </div>

              {/* Bottom icons bar */}
              <div className="px-3 h-10 border-t border-neutral-200 dark:border-white/[0.06] flex items-center gap-1">
                <div className="size-6 rounded-md flex items-center justify-center text-neutral-400 dark:text-[#4a4a4f]">
                  <IconBell className="size-3.5" />
                </div>
                <div className="size-6 rounded-md flex items-center justify-center text-neutral-400 dark:text-[#4a4a4f]">
                  <IconSettings className="size-3.5" />
                </div>
                <div className="size-6 rounded-md flex items-center justify-center text-neutral-400 dark:text-[#4a4a4f]">
                  <IconFlag className="size-3.5" />
                </div>
              </div>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-neutral-50 dark:bg-[#141416]">
              <AnimatePresence mode="wait">
                {activeObj ? (
                  <motion.div
                    key={activeObj.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 min-w-0 flex flex-col overflow-hidden"
                  >
                    {/* Breadcrumb + user avatar */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-neutral-200 dark:border-white/[0.06]">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <IconHome className="size-3" />
                        <span>Home</span>
                        <IconChevronRight className="size-2.5" />
                        <span className="text-muted-foreground">{activeObj.name}</span>
                      </div>
                      <div className="size-6 rounded-full bg-[#7c3aed]/30 flex items-center justify-center">
                        <span className="text-[9px] font-semibold text-[#a78bfa]">W</span>
                      </div>
                    </div>

                    {/* Title row */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-neutral-200 dark:border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <ObjectHeaderIcon iconName={activeObj.icon} />
                        <span className="text-sm font-semibold text-foreground">{activeObj.name}</span>
                        {fields.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7c3aed]/10 text-[#a78bfa] font-medium">
                            {fields.length} fields
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#7c3aed] text-white">
                        <IconPlus className="size-3" />
                        Add {activeObj.name}
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 px-5 border-b border-neutral-200 dark:border-white/[0.06]">
                      <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium text-foreground border-b-2 border-[#7c3aed]">
                        <IconLayoutGrid className="size-3" />
                        All {activeObj.name}
                      </div>
                      <div className="flex items-center gap-1 px-3 py-2 text-[10px] text-muted-foreground">
                        <IconPlus className="size-2.5" />
                        View
                        <IconChevronDown className="size-2.5" />
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-2 px-5 py-2 border-b border-neutral-200 dark:border-white/[0.06]">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/[0.04] text-[9px] text-muted-foreground">
                        <IconLayoutGrid className="size-3" />
                        <motion.div
                          className="size-1 rounded-full bg-[#7c3aed]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        Loading...
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/[0.04] text-[9px] text-muted-foreground flex-1 max-w-[120px]">
                        <IconSearch className="size-3" />
                        Search...
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/[0.04] text-[9px] text-muted-foreground">
                        <IconFilter className="size-3" />
                        Filter
                      </div>
                      <div className="flex-1" />
                      <div className="flex items-center gap-1 px-2 py-1 text-[9px] text-muted-foreground">
                        <IconTableImport className="size-3" />
                        Import Data
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 text-[9px] text-muted-foreground">
                        <IconAdjustments className="size-3" />
                        Manage Fields
                      </div>
                    </div>

                    {/* ═══ DATA TABLE ═══ */}
                    <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
                      <div className="relative flex-1">
                      <div className="absolute inset-0 overflow-auto">
                        {/* Table header */}
                        {fields.length > 0 && (
                          <div className="flex items-center bg-neutral-50 dark:bg-[#141416] border-b border-neutral-200 dark:border-white/[0.06] sticky top-0 z-10 min-w-max">
                            <div className="w-8 flex-shrink-0 flex items-center justify-center py-2">
                              <div className="size-3 rounded border border-neutral-300 dark:border-white/[0.15]" />
                            </div>
                            {fields.map((f, fi) => (
                              <motion.div
                                key={`${f.name}-${fi}`}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="w-[120px] flex-shrink-0 px-3 py-2"
                              >
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                                    {f.name}
                                  </span>
                                  <IconArrowsSort className="size-2.5 text-neutral-300 dark:text-[#3a3a3f] flex-shrink-0" />
                                </div>
                              </motion.div>
                            ))}
                            <div className="w-14 flex-shrink-0 px-2 py-2 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Actions
                            </div>
                          </div>
                        )}

                        {/* Data rows or shimmer */}
                        {fields.length > 0 && (
                          activeObj.sampleData && activeObj.sampleData.length > 0
                            ? activeObj.sampleData.slice(0, 8).map((row, ri) => (
                                <motion.div
                                  key={`row-${ri}`}
                                  initial={{ opacity: 0, y: 3 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.35, delay: ri * 0.08 }}
                                  className="flex items-center border-b border-neutral-100 dark:border-white/[0.03] hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors min-w-max"
                                >
                                  <div className="w-8 flex-shrink-0 flex items-center justify-center py-2">
                                    <div className="size-3 rounded border border-neutral-200 dark:border-white/[0.1]" />
                                  </div>
                                  {fields.map((f, ci) => {
                                    const val = String((row as Record<string, unknown>)[f.name] ?? "\u2014");
                                    return (
                                      <div key={ci} className="w-[120px] flex-shrink-0 px-3 py-2">
                                        <CellRenderer value={val} type={f.type} />
                                      </div>
                                    );
                                  })}
                                  <div className="w-14 flex-shrink-0 flex items-center justify-center py-2">
                                    <IconDotsVertical className="size-3.5 text-neutral-400 dark:text-[#4a4a4f]" />
                                  </div>
                                </motion.div>
                              ))
                            : Array.from({ length: 4 }).map((_, ri) => (
                                <motion.div
                                  key={`ph-${ri}`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3, delay: ri * 0.1 }}
                                  className="flex items-center border-b border-neutral-200 dark:border-white/[0.06] min-w-max"
                                >
                                  <div className="w-8 flex-shrink-0 flex items-center justify-center py-2.5">
                                    <div className="size-3 rounded border border-neutral-300 dark:border-white/[0.15]" />
                                  </div>
                                  {fields.map((_, ci) => (
                                    <div key={ci} className="w-[120px] flex-shrink-0 px-3 py-2.5">
                                      <div
                                        className="h-3 rounded bg-neutral-200 dark:bg-white/[0.12] animate-pulse"
                                        style={{ width: `${50 + ((ri * 17 + ci * 31) % 40)}%` }}
                                      />
                                    </div>
                                  ))}
                                  <div className="w-14 flex-shrink-0" />
                                </motion.div>
                              ))
                        )}

                        {/* Empty state while fields are loading */}
                        {fields.length === 0 && (
                          <div className="p-6 flex items-center justify-center">
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="size-1.5 rounded-full bg-[#7c3aed]"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                              />
                              <span className="text-xs text-muted-foreground">Loading fields...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      </div>

                      {/* Pagination footer — loading state */}
                      <div className="flex items-center justify-between px-4 h-10 border-t border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-[#141416]">
                        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                          <span>Rows per page</span>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]">
                            <span className="text-muted-foreground">13</span>
                            <IconChevronDown className="size-2.5" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                          <motion.div
                            className="size-1 rounded-full bg-[#7c3aed]"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                          <span>Loading...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="size-1.5 rounded-full bg-[#7c3aed]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
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

// ── Smart cell renderer ──
function CellRenderer({ value, type }: { value: string; type: FieldType }) {
  if (value === "\u2014" || value === "—" || !value) {
    return <span className="text-[10px] text-neutral-300 dark:text-[#3a3a3f]">—</span>;
  }

  switch (type) {
    case "name":
      return <span className="text-[10px] font-medium text-foreground truncate block">{value}</span>;

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
          <span className="text-[10px] text-foreground/80 dark:text-[#c0c0c5] truncate">{value}</span>
        </div>
      );
    }

    case "risk": {
      const rc = getRiskColor(value);
      if (!rc) return <span className="text-[10px] text-neutral-300 dark:text-[#3a3a3f]">—</span>;
      return (
        <div className="flex items-center gap-1">
          <IconFlag className={`size-3 ${rc.icon}`} />
          <span className={`text-[9px] font-medium ${rc.text}`}>{value}</span>
        </div>
      );
    }

    default:
      return <span className="text-[10px] text-foreground/80 dark:text-[#c0c0c5] truncate block">{value}</span>;
  }
}

// ── Skeleton shown before any data is parsed ──
function StreamingSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full h-full"
    >
      <div className="w-full h-full rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#1a1a1e] overflow-hidden">
        <div className="w-full h-full">
          <div className={`flex h-full ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
            {/* Sidebar skeleton */}
            <div
              className={`w-52 flex-shrink-0 border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-[#141416] p-3 space-y-2 ${
                isRTL ? "border-l" : "border-r"
              }`}
            >
              {/* Logo skeleton */}
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-neutral-200 dark:bg-white/[0.06] animate-pulse" />
                <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-white/[0.06] animate-pulse" />
              </div>
              {/* Search skeleton */}
              <div className="h-7 rounded-lg bg-neutral-100 dark:bg-white/[0.04] animate-pulse" />
              <div className="h-px bg-neutral-200 dark:bg-white/[0.06] my-2" />
              {/* Nav items skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5">
                  <div className="size-3.5 rounded bg-neutral-200 dark:bg-white/[0.06] animate-pulse" />
                  <div className="h-3 rounded bg-neutral-200 dark:bg-white/[0.06] animate-pulse" style={{ width: `${40 + i * 15}%` }} />
                </div>
              ))}
            </div>

            {/* Table skeleton */}
            <div className="flex-1 p-5 flex items-center justify-center">
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="size-1.5 rounded-full bg-[#7c3aed]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
                <span className="text-xs text-muted-foreground ms-1">Analyzing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
