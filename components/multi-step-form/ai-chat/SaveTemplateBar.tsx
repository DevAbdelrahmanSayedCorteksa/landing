"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeneratedTemplatePreview } from "@/lib/types/workspace";

interface SaveTemplateBarProps {
  templateName: string;
  category: string;
  currentTemplate: GeneratedTemplatePreview | undefined;
  onSave: () => void;
}

export function SaveTemplateBar({
  templateName,
  category,
  currentTemplate,
  onSave,
}: SaveTemplateBarProps) {
  const t = useTranslations("multiStepForm");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    onSave();
    // Reset after delay
    setTimeout(() => setIsSaving(false), 1000);
  };

  const objectCount = currentTemplate?.schema.objects?.length || 0;
  const relationCount = currentTemplate?.schema.relations?.length || 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
      }}
      className="border-t border-primary/20 bg-gradient-to-t from-primary/5 to-transparent"
    >
      <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        {/* Template info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <IconCheck className="size-4 text-green-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-foreground truncate">
              {t("templateReady")}: <span className="text-primary">{templateName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Badge variant="secondary" className="text-[10px]">
              {category}
            </Badge>
            <span>•</span>
            <span>
              {objectCount} {objectCount === 1 ? "Object" : "Objects"}
            </span>
            <span>•</span>
            <span>
              {relationCount} {relationCount === 1 ? "Relation" : "Relations"}
            </span>
          </div>
        </div>

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="flex-shrink-0 min-w-[160px] transition-transform hover:scale-105"
        >
          {isSaving ? (
            <>
              <IconLoader2 className="size-4 me-2 animate-spin" />
              {t("saving")}
            </>
          ) : (
            <>
              <IconCheck className="size-4 me-2" />
              {t("useThisTemplate")}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
