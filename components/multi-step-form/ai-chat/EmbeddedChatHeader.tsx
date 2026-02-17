"use client";

import { useTranslations } from "next-intl";
import { IconSparkles } from "@tabler/icons-react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EmbeddedChatHeaderProps {
  isConnected: boolean;
  savedTemplateSlug: string | null;
  templateName: string;
}

export function EmbeddedChatHeader({
  isConnected,
  savedTemplateSlug,
  templateName,
}: EmbeddedChatHeaderProps) {
  const t = useTranslations("multiStepForm");

  return (
    <div className="pb-3 border-b border-border/50">
      {/* Top row: Icon + title + badge */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <IconSparkles className="size-4 text-primary" strokeWidth={2} />
          </div>
          <h3 className="font-semibold text-base">{t("aiChatTitle")}</h3>
        </div>
        <Badge
          variant={isConnected ? "default" : "secondary"}
          className={cn(
            "text-[10px] uppercase font-semibold",
            isConnected && "bg-green-500/10 text-green-600 dark:text-green-400"
          )}
        >
          {isConnected ? t("connected") : t("disconnected")}
        </Badge>
      </div>

      {/* Bottom row: Subtitle or saved status */}
      {savedTemplateSlug ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Check className="size-3 text-green-600" />
          <span>
            {t("templateSaved")}: <strong className="text-foreground">{templateName}</strong>
          </span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("aiChatSubtitle")}</p>
      )}
    </div>
  );
}
