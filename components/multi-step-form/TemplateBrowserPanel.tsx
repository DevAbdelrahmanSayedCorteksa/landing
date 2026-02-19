"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { IconArrowLeft, IconSearch, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Template } from "@/lib/types/workspace";

interface TemplateBrowserPanelProps {
  templates: Template[];
  isLoading: boolean;
  selectedSlug?: string;
  previewingSlug?: string;
  onPreview: (slug: string) => void;
  onBack: () => void;
}


export function TemplateBrowserPanel({
  templates,
  isLoading,
  selectedSlug,
  previewingSlug,
  onPreview,
  onBack,
}: TemplateBrowserPanelProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(
    () => [...new Set(templates.map((t) => t.category).filter(Boolean))] as string[],
    [templates]
  );

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [templates, search, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full h-full flex flex-col"
    >
      {/* Fixed header — title + back, search, category pills */}
      <div className="flex-shrink-0">
        {/* Title row with back button at end */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-display font-bold tracking-tight">
            Choose a Template
          </h2>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <IconArrowLeft className="size-4" />
            Back
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <IconSearch className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates…"
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CategoryPill label="All" active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat.replace(/_/g, " ")}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scrollable cards grid — only this section scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <IconLoader2 className="size-7 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading templates…</p>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">No templates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 pb-4">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, i) => (
                <motion.div
                  key={template.slug}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: i < 9 ? i * 0.025 : 0,
                  }}
                >
                  <TemplateCard
                    template={template}
                    isPreviewing={previewingSlug === template.slug}
                    isSelected={selectedSlug === template.slug}
                    onPreview={onPreview}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Category Pill ──

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer capitalize",
        active
          ? "bg-primary/15 text-primary border-primary/30"
          : "bg-white/[0.04] text-muted-foreground border-white/[0.06] hover:border-white/[0.12] hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// ── Template Card ──

function TemplateCard({
  template,
  isPreviewing,
  isSelected,
  onPreview,
}: {
  template: Template;
  isPreviewing: boolean;
  isSelected: boolean;
  onPreview: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPreview(template.slug)}
      className={cn(
        "group relative w-full rounded-xl cursor-pointer transition-all duration-200 p-1.5",
        "border-2 bg-white/[0.02]",
        isPreviewing
          ? "border-primary shadow-[0_0_22px_-6px] shadow-primary/50"
          : isSelected
            ? "border-emerald-500/70"
            : "border-white/[0.07] hover:border-white/[0.15]"
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src="/og-image.png"
          alt={template.name}
          fill
          quality={100}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, 300px"
        />

        {/* Strong bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-black via-black/75 via-[40%] to-transparent" />

        {/* Text */}
        <div className="absolute bottom-0 inset-x-0 px-2.5 pb-2.5">
          {template.category && (
            <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-medium uppercase tracking-wide mb-1 border border-white/[0.08]">
              {template.category.replace(/_/g, " ")}
            </span>
          )}
          <p className="text-[11px] font-semibold text-white leading-snug line-clamp-2">
            {template.name}
          </p>
        </div>

        {/* Selected check */}
        {isSelected && (
          <div className="absolute top-2 end-2 size-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <Check className="size-3 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
}
