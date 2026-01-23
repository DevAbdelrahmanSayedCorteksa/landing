"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import {
  IconHeadset,
  IconDatabase,
  IconTool,
  IconLayoutKanban,
  IconSparkles,
  IconFileText,
  IconFileSpreadsheet,
  IconFolders,
  IconUsers,
  IconCheckbox,
  IconProgress,
  IconMessage,
  IconClock,
  IconShield,
  IconPuzzle,
  IconCircleCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";

// Visual Skeleton Components

// Units Skeleton - 3D layered cards showing unit builder
const UnitsSkeletonVisual = ({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) => {
  return (
    <div className={cn(
      "perspective-distant scale-[1.2] h-full w-full -translate-y-10 mask-radial-from-50% mask-r-from-50%",
      isRTL ? "rotate-z-15 rotate-y-20 rotate-x-30" : "rotate-z-15 -rotate-y-20 rotate-x-30"
    )}>
      <SkeletonCard
        className={cn("absolute bottom-4 max-w-[90%] z-30", isRTL ? "right-20" : "left-20")}
        icon={<IconDatabase className="size-4 text-primary" />}
        title={t("unitClientHub")}
        description={t("unitClientHubDesc")}
        tags={[t("tagCustomFields"), t("tagRelations"), t("tagKanban")]}
        isRTL={isRTL}
      />
      <SkeletonCard
        className={cn("absolute bottom-12 z-20", isRTL ? "right-16" : "left-16")}
        icon={<IconTool className="size-4 text-primary" />}
        title={t("unitProjectWorkflow")}
        description={t("unitProjectWorkflowDesc")}
        tags={[t("tagAutomation"), t("tagTemplates")]}
        isRTL={isRTL}
      />
      <SkeletonCard
        className={cn("absolute bottom-24 max-w-[80%] z-10", isRTL ? "right-12" : "left-12")}
        icon={<IconLayoutKanban className="size-4 text-primary" />}
        title={t("unitKanbanView")}
        description={t("unitKanbanViewDesc")}
        tags={[t("tagBoardView"), t("tagProgress")]}
        isRTL={isRTL}
      />
    </div>
  );
};

// Documents Skeleton - animated document cards
const DocumentsSkeletonVisual = ({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) => {
  return (
    <div className={cn(
      "perspective-distant scale-110 h-full w-full mask-radial-from-50% flex items-center justify-center",
      isRTL ? "rotate-z-10 -rotate-y-15 rotate-x-25" : "rotate-z-10 rotate-y-15 rotate-x-25"
    )}>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl max-w-sm"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className={cn("flex items-center gap-3 mb-3", isRTL && "flex-row-reverse")}>
            <IconFileText className="size-5 text-primary" />
            <p className="text-sm font-bold">{t("docContractTemplate")}</p>
            <span className={cn("text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full", isRTL ? "mr-auto" : "ml-auto")}>
              {t("docReady")}
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn("absolute -bottom-8 z-20 bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl", isRTL ? "-right-4" : "-left-4")}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <IconFileSpreadsheet className="size-5 text-blue-500" />
            <p className="text-sm font-bold">{t("docInvoice")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Collaboration Skeleton - team activity feed
const CollaborationSkeletonVisual = ({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) => {
  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-5 rotate-y-10 rotate-x-20" : "rotate-z-5 -rotate-y-10 rotate-x-20"
    )}>
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 left-6 right-6 z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <IconUsers className="size-4 text-primary" />
          </div>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <p className="text-sm font-bold mb-1">{t("collabTaskAssigned")}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("collabTaskDetail")}
            </p>
            <div className={cn("flex gap-2 mt-2", isRTL && "justify-end")}>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                {t("collabHighPriority")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute bottom-32 left-10 right-10 z-20 bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <IconCircleCheck className="size-4 text-green-500" />
          <p className="text-xs font-semibold">{t("collabCompleted")}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Support Skeleton - layered support tickets
const SupportSkeletonVisual = ({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) => {
  return (
    <div className={cn(
      "h-60 md:h-80 perspective-distant scale-110 mask-radial-from-50% flex items-center justify-center",
      isRTL ? "rotate-z-10 rotate-y-15 rotate-x-25" : "rotate-z-10 -rotate-y-15 rotate-x-25"
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[80%] max-w-sm bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
          <IconHeadset className="size-5 text-primary" />
          <span className="text-sm font-bold">{t("supportAvailable")}</span>
        </div>
        <p className={cn("text-xs text-neutral-600 dark:text-neutral-400", isRTL && "text-right")}>
          {t("supportHelp")}
        </p>
      </motion.div>
    </div>
  );
};

// Language Skeleton - multi-language preview
const LanguageSkeletonVisual = ({ isRTL }: { isRTL: boolean }) => {
  const languages = ["English", "العربية", "Español"];
  return (
    <div className="h-60 md:h-80 flex items-center justify-center">
      <div className="space-y-3 w-full max-w-xs">
        {languages.map((lang, idx) => (
          <motion.div
            key={lang}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.15 }}
            className={cn("bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between", isRTL && "flex-row-reverse")}
          >
            <span className="text-sm font-medium">{lang}</span>
            <IconCircleCheck className="size-4 text-primary" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Documents Generation Skeleton - template builder
const DocumentsGenerationSkeletonVisual = ({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) => {
  return (
    <div className={cn(
      "perspective-distant scale-110 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-10 rotate-y-15 rotate-x-25" : "rotate-z-10 -rotate-y-15 rotate-x-25"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("absolute bottom-12 max-w-[70%] mx-auto z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl", isRTL ? "right-8 left-8" : "left-8 right-8")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center justify-between mb-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <IconFileSpreadsheet className="size-5 text-primary" />
            <p className="text-sm font-bold">{t("docGenPriceOffer")}</p>
          </div>
          <Button size="sm" className="text-xs h-7 px-3">
            {t("docGenGenerate")}
          </Button>
        </div>
        <div className="space-y-2">
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{t("docGenClient")}</span>
          </div>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{t("docGenItems")}</span>
          </div>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{t("docGenTotal")}</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn("absolute bottom-44 max-w-[60%] z-20 bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg", isRTL ? "right-12" : "left-12")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <IconFileText className="size-4 text-blue-500" />
          <p className="text-xs font-semibold">{t("docGenContract")}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Storage Skeleton - folder organization
const StorageSkeletonVisual = ({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) => {
  const folders = [
    { name: t("folderContracts"), count: 24, color: "bg-blue-500" },
    { name: t("folderInvoices"), count: 156, color: "bg-green-500" },
    { name: t("folderReports"), count: 42, color: "bg-purple-500" },
  ];

  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-5 -rotate-y-10 rotate-x-20" : "rotate-z-5 rotate-y-10 rotate-x-20"
    )}>
      <div className="absolute inset-x-8 top-8 bottom-12 flex flex-col gap-3 justify-center max-w-[70%] mx-auto">
        {folders.map((folder, idx) => (
          <motion.div
            key={folder.name}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.15 }}
            className={cn("bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg flex items-center gap-3", isRTL && "flex-row-reverse")}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className={cn("size-8 rounded-lg flex items-center justify-center", folder.color, "bg-opacity-20")}>
              <IconFolders className={cn("size-4", folder.color.replace("bg-", "text-"))} />
            </div>
            <div className={cn("flex-1", isRTL && "text-right")}>
              <p className="text-sm font-bold">{folder.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{folder.count} {t("files")}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Assistant Skeleton - AI task organization
const AssistantSkeletonVisual = ({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) => {
  return (
    <div className={cn(
      "perspective-distant scale-105 h-full w-full mask-radial-from-50%",
      isRTL ? "rotate-z-10 -rotate-y-15 rotate-x-20" : "rotate-z-10 rotate-y-15 rotate-x-20"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("absolute bottom-18 max-w-[85%] z-30 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-primary/50 dark:border-primary/30 shadow-2xl", isRTL ? "right-14 left-8" : "left-14 right-8")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-start gap-2 mb-2", isRTL && "flex-row-reverse")}>
          <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <IconSparkles className="size-3.5 text-primary" />
          </div>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <p className="text-xs font-bold mb-1">{t("aiSuggestion")}</p>
            <p className="text-[10px] text-neutral-600 dark:text-neutral-400">
              {t("aiFocusTask")}
            </p>
          </div>
        </div>
        <div className={cn("flex gap-2", isRTL && "justify-end")}>
          <Button size="sm" className="text-[10px] h-6 px-2">
            {t("aiApply")}
          </Button>
          <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">
            {t("aiDismiss")}
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn("absolute bottom-36 max-w-[75%] z-20 bg-white dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg", isRTL ? "right-18 left-12" : "left-18 right-12")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <div className="size-1.5 rounded-full bg-green-500"></div>
          <p className="text-[10px] font-semibold">{t("aiAutoOrganized")}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Helper: Skeleton Card Component
const SkeletonCard = ({
  icon,
  title,
  description,
  tags,
  className,
  isRTL,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  className?: string;
  isRTL: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={cn("flex gap-3 items-center mb-2", isRTL && "flex-row-reverse")}>
        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <p className="text-xs md:text-sm font-bold text-neutral-800 dark:text-neutral-200">
          {title}
        </p>
      </div>
      <p className={cn("text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mb-3", isRTL && "text-right")}>
        {description}
      </p>
      <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// Card Components for layout structure
const CardContent = ({ children, isRTL }: { children: React.ReactNode; isRTL?: boolean }) => {
  return <div className={cn("p-4 md:p-8", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>{children}</div>;
};

const CardDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">
      {children}
    </p>
  );
};

const CardSkeleton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative h-80 sm:h-60 md:h-80 flex flex-col overflow-hidden perspective-distant",
        className
      )}
    >
      {children}
    </div>
  );
};

// Main Product Page Client Component
export function ProductsPageClient() {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
        <Container>
          <div className={cn(
            "flex xl:flex-row flex-col xl:items-baseline-last justify-between gap-10",
            isRTL && "xl:flex-row-reverse"
          )}>
            <Heading className={cn("text-center", isRTL ? "lg:text-right" : "lg:text-left")}>
              {t("heroTitle")} <br /> {t("heroTitle2")}
            </Heading>
            <Subheading className={cn("text-center mx-auto lg:mx-0", isRTL ? "lg:text-right" : "lg:text-left")}>
              {t("heroSubtitle")}
            </Subheading>
          </div>
        </Container>
      </section>

      {/* All Features - Unified Grid */}
      <section className="pt-10 md:pt-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800">
            {/* Support */}
            <div className={cn("border-b border-neutral-200 dark:border-neutral-800", isRTL ? "md:border-l" : "md:border-r")}>
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("supportTitle")}
                </h2>
                <CardDescription>
                  {t("supportDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <SupportSkeletonVisual t={t} isRTL={isRTL} />
              </CardSkeleton>
            </div>

            {/* Language */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("languageTitle")}
                </h2>
                <CardDescription>
                  {t("languageDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton className="mask-radial-from-50% mask-t-from-50%">
                <LanguageSkeletonVisual isRTL={isRTL} />
              </CardSkeleton>
            </div>

            {/* Units */}
            <div className={cn("border-b border-neutral-200 dark:border-neutral-800", isRTL ? "md:border-l" : "md:border-r")}>
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("unitsTitle")}
                </h2>
                <CardDescription>
                  {t("unitsDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <UnitsSkeletonVisual t={t} isRTL={isRTL} />
              </CardSkeleton>
            </div>

            {/* Cortex AI */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("aiTitle")}
                </h2>
                <CardDescription>
                  {t("aiDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <AssistantSkeletonVisual t={t} isRTL={isRTL} />
              </CardSkeleton>
            </div>

            {/* Documents */}
            <div className={cn("border-b border-neutral-200 dark:border-neutral-800", isRTL ? "md:border-l" : "md:border-r")}>
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("documentsTitle")}
                </h2>
                <CardDescription>
                  {t("documentsDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <DocumentsSkeletonVisual t={t} isRTL={isRTL} />
              </CardSkeleton>
            </div>

            {/* Collaboration */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("collaborationTitle")}
                </h2>
                <CardDescription>
                  {t("collaborationDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton className="mask-radial-from-20%">
                <CollaborationSkeletonVisual t={t} isRTL={isRTL} />
              </CardSkeleton>
            </div>

            {/* Documents Generation */}
            <div className={cn("border-neutral-200 dark:border-neutral-800", isRTL ? "md:border-l" : "md:border-r")}>
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("docGenTitle")}
                </h2>
                <CardDescription>
                  {t("docGenDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <DocumentsGenerationSkeletonVisual t={t} isRTL={isRTL} />
              </CardSkeleton>
            </div>
            {/* Storage & Organization */}
            <div>
              <CardContent isRTL={isRTL}>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  {t("storageTitle")}
                </h2>
                <CardDescription>
                  {t("storageDesc")}
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <StorageSkeletonVisual t={t} isRTL={isRTL} />
              </CardSkeleton>
            </div>
          </div>

          {/* Collaboration Sub-features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-10 md:mt-20">
            <div dir={isRTL ? "rtl" : "ltr"}>
              <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconCheckbox className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  {t("tasksTitle")}
                </h3>
              </div>
              <p className={cn("text-neutral-500 text-sm md:text-base", isRTL && "text-right")}>
                {t("tasksDesc")}
              </p>
            </div>
            <div dir={isRTL ? "rtl" : "ltr"}>
              <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconProgress className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  {t("progressTitle")}
                </h3>
              </div>
              <p className={cn("text-neutral-500 text-sm md:text-base", isRTL && "text-right")}>
                {t("progressDesc")}
              </p>
            </div>
            <div dir={isRTL ? "rtl" : "ltr"}>
              <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconMessage className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  {t("discussionTitle")}
                </h3>
              </div>
              <p className={cn("text-neutral-500 text-sm md:text-base", isRTL && "text-right")}>
                {t("discussionDesc")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6">
            <div dir={isRTL ? "rtl" : "ltr"}>
              <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconClock className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  {t("timelineTitle")}
                </h3>
              </div>
              <p className={cn("text-neutral-500 text-sm md:text-base", isRTL && "text-right")}>
                {t("timelineDesc")}
              </p>
            </div>
            <div dir={isRTL ? "rtl" : "ltr"}>
              <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconShield className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  {t("permissionsTitle")}
                </h3>
              </div>
              <p className={cn("text-neutral-500 text-sm md:text-base", isRTL && "text-right")}>
                {t("permissionsDesc")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Marketplace Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 pb-20">
        <Container>
          <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
            <Heading className="mb-4">{t("marketplaceTitle")}</Heading>
            <Subheading className="mx-auto">
              {t("marketplaceSubtitle")}
            </Subheading>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className={cn("text-center p-8 md:p-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900")} dir={isRTL ? "rtl" : "ltr"}>
              <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <IconPuzzle className="size-8 text-primary" />
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                {t("comingSoon")}
              </span>
              <h3 className="font-bold text-xl mb-3 text-neutral-800 dark:text-neutral-200">
                {t("marketplaceName")}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t("marketplaceDesc")}
              </p>
            </div>
          </div>
        </Container>
      </section>
      </div>
    </PageTransition>
  );
}
