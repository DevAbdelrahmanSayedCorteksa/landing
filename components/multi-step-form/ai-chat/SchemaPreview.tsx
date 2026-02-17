"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown, IconDatabase, IconLink, IconTable } from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";
import { GeneratedTemplatePreview } from "@/lib/types/workspace";
import { cn } from "@/lib/utils";

// Convert "tabler-heart" → "IconHeart", "tabler-building-store" → "IconBuildingStore"
function getObjectIcon(iconName?: string): React.ComponentType<{ className?: string }> {
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

interface SchemaPreviewProps {
  template: GeneratedTemplatePreview;
}

export function SchemaPreview({ template }: SchemaPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);

  const objectCount = template.schema.objects?.length || 0;
  const relationCount = template.schema.relations?.length || 0;
  const sampleData = template.schema.sample_data;
  const hasSampleData = sampleData && Object.keys(sampleData).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3 rounded-lg border border-[#7c3aed]/20 bg-[#7c3aed]/[0.08] p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm text-white">
              {template.template_name}
            </h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e22] text-[#a0a0a5] border border-white/[0.08]">
              {template.category}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#6a6a6f]">
            <span className="flex items-center gap-1">
              <IconDatabase className="size-3.5" />
              {objectCount} {objectCount === 1 ? "Object" : "Objects"}
            </span>
            <span className="flex items-center gap-1">
              <IconLink className="size-3.5" />
              {relationCount} {relationCount === 1 ? "Relation" : "Relations"}
            </span>
            {hasSampleData && (
              <span className="flex items-center gap-1 text-[#7c3aed]">
                <IconTable className="size-3.5" />
                Sample Data
              </span>
            )}
          </div>
        </div>

        {/* Expand button */}
        {objectCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "size-6 rounded-md flex items-center justify-center transition-colors",
              "hover:bg-white/5"
            )}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconChevronDown className="size-4 text-[#6a6a6f]" />
            </motion.div>
          </button>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && objectCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2 border-t border-[#7c3aed]/10 pt-4">
              {/* Objects list */}
              <div className="space-y-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {template.schema.objects.map((obj: any, index: number) => {
                  const ObjIcon = getObjectIcon(obj.icon);
                  return (
                    <div
                      key={index}
                      className="rounded-md bg-[#0f0f0f]/60 p-3 text-xs"
                    >
                      <div className="flex items-center gap-2 font-semibold text-white mb-1">
                        <ObjIcon className="size-3.5 text-[#7c3aed] flex-shrink-0" />
                        {obj.name || obj.object_name || `Object ${index + 1}`}
                      </div>
                      {obj.fields && obj.fields.length > 0 && (
                        <div className="text-[#6a6a6f] ps-5.5">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {obj.fields.slice(0, 3).map((field: any, idx: number) => (
                            <span key={idx}>
                              {field.name || field.field_name}
                              {idx < Math.min(obj.fields.length - 1, 2) && ", "}
                            </span>
                          ))}
                          {obj.fields.length > 3 && (
                            <span className="text-[#7c3aed]">
                              {" "}
                              +{obj.fields.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sample Data Toggle */}
              {hasSampleData && (
                <div className="mt-3 pt-3 border-t border-[#7c3aed]/10">
                  <button
                    type="button"
                    onClick={() => setShowSampleData(!showSampleData)}
                    className="flex items-center gap-2 text-xs font-medium text-[#7c3aed] hover:text-[#8b5cf6] transition-colors"
                  >
                    <IconTable className="size-3.5" />
                    {showSampleData ? "Hide" : "Show"} Sample Data
                    <motion.div
                      animate={{ rotate: showSampleData ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconChevronDown className="size-3" />
                    </motion.div>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Data Display */}
      <AnimatePresence>
        {isExpanded && showSampleData && hasSampleData && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {Object.entries(sampleData!).map(([objectName, records]) => (
                <div key={objectName} className="rounded-md bg-[#0f0f0f]/60 p-3">
                  <div className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                    <IconDatabase className="size-3.5 text-[#7c3aed]" />
                    {objectName}
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded border border-white/[0.06] text-[#6a6a6f]">
                      {records.length} {records.length === 1 ? "record" : "records"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {records.slice(0, 2).map((record, idx) => (
                      <div
                        key={idx}
                        className="rounded border border-white/[0.06] bg-[#0f0f0f]/50 p-2 text-[10px]"
                      >
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          {Object.entries(record).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="truncate">
                              <span className="text-[#6a6a6f]">{key}:</span>{" "}
                              <span className="text-white font-medium">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {Object.keys(record).length > 4 && (
                          <div className="text-[#7c3aed] mt-1">
                            +{Object.keys(record).length - 4} more fields
                          </div>
                        )}
                      </div>
                    ))}
                    {records.length > 2 && (
                      <div className="text-[10px] text-[#6a6a6f] text-center">
                        +{records.length - 2} more {records.length - 2 === 1 ? "record" : "records"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
