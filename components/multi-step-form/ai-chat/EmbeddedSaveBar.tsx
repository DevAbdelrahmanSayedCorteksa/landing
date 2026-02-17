"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { IconLoader2 } from "@tabler/icons-react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeneratedTemplatePreview } from "@/lib/types/workspace";

interface EmbeddedSaveBarProps {
  templateName: string;
  category: string;
  currentTemplate: GeneratedTemplatePreview | undefined;
  onSave: () => void;
}

export function EmbeddedSaveBar({
  templateName,
  category,
  currentTemplate,
  onSave,
}: EmbeddedSaveBarProps) {
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
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
      }}
      className="border-t border-primary/20 bg-gradient-to-t from-primary/5 to-transparent"
    >
      <div className="px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Template info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Check className="size-4 text-green-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-foreground truncate">
              <span className="text-primary">{templateName}</span>
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

        {/* Save button - full width on mobile */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="default"
          className="w-full sm:w-auto sm:min-w-[140px] transition-transform hover:scale-105"
        >
          {isSaving ? (
            <>
              <IconLoader2 className="size-4 me-2 animate-spin" />
              {t("saving")}
            </>
          ) : (
            <>
              <Check className="size-4 me-2" />
              {t("useThisTemplate")}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
