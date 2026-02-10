"use client";

import React, { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { IconGripVertical } from "@tabler/icons-react";

type Card = { id: string; label: string };
type ColumnKey = "todo" | "progress" | "done";

export const KanbanSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const t = useTranslations("product");

  const [columns, setColumns] = useState<Record<ColumnKey, Card[]>>({
    todo: [
      { id: "t1", label: t("kanbanCard1") },
      { id: "t2", label: t("kanbanCard2") },
    ],
    progress: [
      { id: "p1", label: t("kanbanCard3") },
      { id: "p2", label: t("kanbanCard4") },
    ],
    done: [
      { id: "d1", label: t("kanbanCard5") },
    ],
  });

  const dragData = useRef<{ card: Card; from: ColumnKey } | null>(null);
  const [dropTarget, setDropTarget] = useState<ColumnKey | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const moveCard = useCallback((card: Card, from: ColumnKey, to: ColumnKey) => {
    if (from === to) return;
    setColumns((prev) => ({
      ...prev,
      [from]: prev[from].filter((c) => c.id !== card.id),
      [to]: [...prev[to], card],
    }));
  }, []);

  const columnMeta: { key: ColumnKey; title: string }[] = [
    { key: "todo", title: t("kanbanTodo") },
    { key: "progress", title: t("kanbanInProgress") },
    { key: "done", title: t("kanbanDone") },
  ];

  return (
    <div className="h-full w-full p-4 md:p-5 flex items-stretch justify-center">
      <div className="flex gap-3 w-full">
        {columnMeta.map((col, colIdx) => (
          <motion.div
            key={col.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: colIdx * 0.1 }}
            className={cn(
              "flex-1 rounded-2xl border bg-neutral-50 dark:bg-neutral-800/30 flex flex-col transition-all duration-150",
              dropTarget === col.key
                ? "border-primary/50 bg-primary/5"
                : "border-neutral-200 dark:border-neutral-700"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
              setDropTarget(col.key);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDropTarget(null);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDropTarget(null);
              setDraggingId(null);
              if (dragData.current) {
                moveCard(dragData.current.card, dragData.current.from, col.key);
                dragData.current = null;
              }
            }}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "size-2 rounded-full",
                  col.key === "done" ? "bg-primary" : "bg-primary/40"
                )} />
                <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                  {col.title}
                </span>
              </div>
              <span className="text-[9px] font-semibold text-neutral-400 bg-neutral-200/60 dark:bg-neutral-700/60 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {columns[col.key].length}
              </span>
            </div>

            {/* Cards area */}
            <div className="p-2 space-y-2 flex-1">
              <AnimatePresence mode="popLayout">
                {columns[col.key].map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: draggingId === card.id ? 0.4 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      draggable="true"
                      onDragStart={(e) => {
                        e.stopPropagation();
                        dragData.current = { card, from: col.key };
                        setDraggingId(card.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", card.id);
                      }}
                      onDragEnd={() => {
                        dragData.current = null;
                        setDraggingId(null);
                        setDropTarget(null);
                      }}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 cursor-grab active:cursor-grabbing transition-all duration-150 select-none",
                        "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary/30 hover:shadow-sm"
                      )}
                    >
                      <div className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                        <IconGripVertical className="size-3.5 text-neutral-300 dark:text-neutral-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 leading-snug flex-1">
                          {card.label}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="size-4 rounded-full bg-primary/15 shrink-0" />
                        <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-700" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Drop hint */}
              {dropTarget === col.key && dragData.current && dragData.current.from !== col.key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 36 }}
                  className="rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center"
                >
                  <span className="text-xs text-primary/60 font-medium">+</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
