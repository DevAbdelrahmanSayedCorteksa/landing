"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import {
  IconHeadset,
  IconLanguage,
  IconDatabase,
  IconTool,
  IconForms,
  IconLink,
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
  IconPlus,
  IconTextSize,
  IconNumber,
  IconCalendar,
  IconArrowRight,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Visual Skeleton Components

// Units Skeleton - 3D layered cards showing unit builder
const UnitsSkeletonVisual = () => {
  return (
    <div className="perspective-distant rotate-z-15 -rotate-y-20 rotate-x-30 scale-[1.2] h-full w-full -translate-y-10 mask-radial-from-50% mask-r-from-50%">
      <SkeletonCard
        className="absolute bottom-4 left-20 max-w-[90%] z-30"
        icon={<IconDatabase className="size-4 text-primary" />}
        title="Client Units"
        description="Track all client information, projects, and communications in one place"
        tags={["Custom Fields", "Relations", "Kanban"]}
      />
      <SkeletonCard
        className="absolute bottom-12 left-16 z-20"
        icon={<IconTool className="size-4 text-primary" />}
        title="Project Builder"
        description="Create project workflows with automated task assignments"
        tags={["Automation", "Templates"]}
      />
      <SkeletonCard
        className="absolute bottom-24 left-12 max-w-[80%] z-10"
        icon={<IconLayoutKanban className="size-4 text-primary" />}
        title="Task Board"
        description="Visualize progress across all projects with drag-and-drop kanban"
        tags={["Board View", "Progress"]}
      />
    </div>
  );
};

// Documents Skeleton - animated document cards
const DocumentsSkeletonVisual = () => {
  return (
    <div className="perspective-distant rotate-z-10 rotate-y-15 rotate-x-25 scale-110 h-full w-full mask-radial-from-50% flex items-center justify-center">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl max-w-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <IconFileText className="size-5 text-primary" />
            <p className="text-sm font-bold">Contract Template</p>
            <span className="ml-auto text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              Ready
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
          className="absolute -bottom-8 -left-4 z-20 bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <IconFileSpreadsheet className="size-5 text-blue-500" />
            <p className="text-sm font-bold">Invoice #1234</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Collaboration Skeleton - team activity feed
const CollaborationSkeletonVisual = () => {
  return (
    <div className="perspective-distant rotate-z-5 -rotate-y-10 rotate-x-20 scale-105 h-full w-full mask-radial-from-50%">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 left-6 right-6 z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <IconUsers className="size-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold mb-1">Task assigned to Sarah</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Review client proposal - Due tomorrow
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                High Priority
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute bottom-32 left-10 right-10 z-20 bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <IconCircleCheck className="size-4 text-green-500" />
          <p className="text-xs font-semibold">Completed: Update CRM</p>
        </div>
      </motion.div>
    </div>
  );
};

// Support Skeleton - layered support tickets
const SupportSkeletonVisual = () => {
  return (
    <div className="h-60 md:h-80 perspective-distant rotate-z-10 -rotate-y-15 rotate-x-25 scale-110 mask-radial-from-50% flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[80%] max-w-sm bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <IconHeadset className="size-5 text-primary" />
          <span className="text-sm font-bold">24/7 Support Available</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Get help from real people who know your workflow
        </p>
      </motion.div>
    </div>
  );
};

// Language Skeleton - multi-language preview
const LanguageSkeletonVisual = () => {
  const languages = ["English", "العربية", "Español"];
  return (
    <div className="h-60 md:h-80 flex items-center justify-center">
      <div className="space-y-3 w-full max-w-xs">
        {languages.map((lang, idx) => (
          <motion.div
            key={lang}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.15 }}
            className="bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between"
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
const DocumentsGenerationSkeletonVisual = () => {
  return (
    <div className="perspective-distant rotate-z-10 -rotate-y-15 rotate-x-25 scale-110 h-full w-full mask-radial-from-50%">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-12 left-8 right-8 max-w-[70%] mx-auto z-30 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconFileSpreadsheet className="size-5 text-primary" />
            <p className="text-sm font-bold">Price Offer Template</p>
          </div>
          <Button size="sm" className="text-xs h-7 px-3">
            Generate
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Client: [Auto-fill]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Items: [Auto-fill]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Total: [Auto-calculate]</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-44 left-12 max-w-[60%] z-20 bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <IconFileText className="size-4 text-blue-500" />
          <p className="text-xs font-semibold">Contract Template</p>
        </div>
      </motion.div>
    </div>
  );
};

// Storage Skeleton - folder organization
const StorageSkeletonVisual = () => {
  const folders = [
    { name: "Contracts", count: 24, color: "bg-blue-500" },
    { name: "Invoices", count: 156, color: "bg-green-500" },
    { name: "Reports", count: 42, color: "bg-purple-500" },
  ];

  return (
    <div className="perspective-distant rotate-z-5 rotate-y-10 rotate-x-20 scale-105 h-full w-full mask-radial-from-50%">
      <div className="absolute inset-x-8 top-8 bottom-12 flex flex-col gap-3 justify-center max-w-[70%] mx-auto">
        {folders.map((folder, idx) => (
          <motion.div
            key={folder.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.15 }}
            className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg flex items-center gap-3"
          >
            <div className={cn("size-8 rounded-lg flex items-center justify-center", folder.color, "bg-opacity-20")}>
              <IconFolders className={cn("size-4", folder.color.replace("bg-", "text-"))} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{folder.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{folder.count} files</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Assistant Skeleton - AI task organization
const AssistantSkeletonVisual = () => {
  return (
    <div className="perspective-distant rotate-z-10 rotate-y-15 rotate-x-20 scale-105 h-full w-full mask-radial-from-50%">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-18 left-14 right-8 max-w-[85%] z-30 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-primary/50 dark:border-primary/30 shadow-2xl"
      >
        <div className="flex items-start gap-2 mb-2">
          <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <IconSparkles className="size-3.5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold mb-1">AI Suggestion</p>
            <p className="text-[10px] text-neutral-600 dark:text-neutral-400">
              Prioritize "Client Review" task - deadline in 2 hours
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="text-[10px] h-6 px-2">
            Apply
          </Button>
          <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">
            Dismiss
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-36 left-18 right-12 max-w-[75%] z-20 bg-white dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-green-500"></div>
          <p className="text-[10px] font-semibold">3 tasks auto-organized today</p>
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl",
        className
      )}
    >
      <div className="flex gap-3 items-center mb-2">
        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <p className="text-xs md:text-sm font-bold text-neutral-800 dark:text-neutral-200">
          {title}
        </p>
      </div>
      <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mb-3">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
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
const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 md:p-8">{children}</div>;
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

// Builder Visual - Activity List (inspired by Audit Trail)
const BuilderVisual = () => {
  const items = [
    { title: "Client Unit", status: "active", color: "bg-blue-500" },
    { title: "Project Unit", status: "processing", color: "bg-orange-500" },
    { title: "Task Unit", status: "active", color: "bg-green-500" },
  ];

  return (
    <div className="absolute inset-0 p-3 flex flex-col gap-2">
      {items.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.15, duration: 0.4 }}
          className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
        >
          <div className={cn("size-3 rounded-full", item.color)}></div>
          <span className="text-xs font-medium">{item.title}</span>
          <span className={cn(
            "ml-auto text-[10px] px-1.5 py-0.5 rounded",
            item.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          )}>
            {item.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// Fields Visual - Grid with status badges (inspired by Approval Queue)
const FieldsVisual = () => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        "[background-size:20px_20px]",
        "[background-image:linear-gradient(to_right,var(--color-neutral-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-200)_1px,transparent_1px)]",
        "dark:[background-image:linear-gradient(to_right,var(--color-neutral-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-700)_1px,transparent_1px)]"
      )}
    >
      <div className="flex flex-col gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2"
        >
          <IconTextSize className="size-3" />
          <span className="text-xs">Text</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 font-medium flex items-center gap-2"
        >
          <IconNumber className="size-3" />
          <span className="text-xs">Number</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 font-medium flex items-center gap-2"
        >
          <IconCalendar className="size-3" />
          <span className="text-xs">Date</span>
        </motion.div>
      </div>
    </div>
  );
};

// Relations Visual - Connected arrows
const RelationsVisual = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="px-2 py-1 rounded bg-primary/10 border border-primary/30 text-xs font-medium"
        >
          Clients
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <IconArrowRight className="size-4 text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="px-2 py-1 rounded bg-primary/10 border border-primary/30 text-xs font-medium"
        >
          Projects
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <IconArrowRight className="size-4 text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="px-2 py-1 rounded bg-primary/10 border border-primary/30 text-xs font-medium"
        >
          Tasks
        </motion.div>
      </div>
    </div>
  );
};

// Kanban Visual - Column cards
const KanbanVisual = () => {
  return (
    <div className="absolute inset-0 p-3 flex gap-2">
      {["To Do", "In Progress", "Done"].map((col, idx) => (
        <motion.div
          key={col}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.15, duration: 0.4 }}
          className="flex-1 flex flex-col gap-2"
        >
          <div className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 px-2">
            {col}
          </div>
          <div className="flex-1 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-2">
            <div className="h-8 bg-neutral-100 dark:bg-neutral-700 rounded"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Main Product Page Client Component
export function ProductsPageClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
        <Container>
          <div className="flex xl:flex-row flex-col xl:items-baseline-last justify-between gap-10">
            <Heading className="text-center lg:text-left">
              Everything You Need <br /> To Run Your Business.
            </Heading>
            <Subheading className="text-center lg:text-left mx-auto lg:mx-0">
              From customizable units to document generation and team
              collaboration — Corteksa brings order to your workflow with
              powerful, easy-to-use tools.
            </Subheading>
          </div>
        </Container>
      </section>

      {/* Support + Language + Units + Assistant - Connected Grid */}
      <section className="pt-10 md:pt-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800">
            {/* Support */}
            <div className="md:border-r border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Support that's always within reach
                </h2>
                <CardDescription>
                  Real people, real help — available whenever you need clarity,
                  guidance, or a quick answer.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <SupportSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Language */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Your work, your language
                </h2>
                <CardDescription>
                  Everything in Corteksa is built to feel familiar, comfortable,
                  and truly yours — no translations, no confusion.
                </CardDescription>
              </CardContent>
              <CardSkeleton className="mask-radial-from-50% mask-t-from-50%">
                <LanguageSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Units */}
            <div className="md:border-r border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Create and customize units without a single line of code
                </h2>
                <CardDescription>
                  Create units that bring order to your workflow, replace
                  scattered tools, and give you the clarity you've always wanted.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <UnitsSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Assistant */}
            <div>
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Organize your tasks, effortlessly
                </h2>
                <CardDescription>
                  Let Corteksa Assistant help you manage your workload with
                  intelligent suggestions and automated task organization.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <AssistantSkeletonVisual />
              </CardSkeleton>
            </div>
          </div>
        </Container>
      </section>

      {/* Units Sub-features: 4-column Grid with Visual Skeletons */}
      <section className="py-10 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Builder */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconTool className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Builder
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base mb-4">
                Create units that match the way your business actually works —
                from clients and projects to site visits, approvals, and more.
              </p>
              <div className="relative h-64 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                <BuilderVisual />
              </div>
            </div>

            {/* Fields */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconForms className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Fields
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base mb-4">
                Use essential field types that keep information clean and
                consistent: text, numbers, dates, and dropdown selections.
              </p>
              <div className="relative h-64 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                <FieldsVisual />
              </div>
            </div>

            {/* Relations */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconLink className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Relations
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base mb-4">
                Connect everything with simple one-to-many relationships. Link
                clients → projects → tasks with clarity and structure.
              </p>
              <div className="relative h-64 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                <RelationsVisual />
              </div>
            </div>

            {/* Kanban */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconLayoutKanban className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Kanban
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base mb-4">
                See your entire workflow in motion. Every unit automatically comes
                with a Kanban view that lets you track progress at a glance.
              </p>
              <div className="relative h-64 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                <KanbanVisual />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Documents + Collaboration - 2x2 Grid */}
      <section className="pt-10 md:pt-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 divide-neutral-200 dark:divide-neutral-800">
            <div className="md:border-r border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Manage your documents effortlessly
                </h2>
                <CardDescription>
                  Create documents in one click and keep every file organized in a
                  single place — always easy to find, always up to date.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <DocumentsSkeletonVisual />
              </CardSkeleton>
            </div>
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Collaborate smoothly, no matter how your team works
                </h2>
                <CardDescription>
                  Keep everyone aligned with clear tasks, organized communication,
                  and the right permissions — all in one place.
                </CardDescription>
              </CardContent>
              <CardSkeleton className="mask-radial-from-20%">
                <CollaborationSkeletonVisual />
              </CardSkeleton>
            </div>
            <div className="md:border-r border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Documents Generation
                </h2>
                <CardDescription>
                  Create ready-to-send documents with a click. Build your templates
                  once — like price offers, contracts, or reports.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <DocumentsGenerationSkeletonVisual />
              </CardSkeleton>
            </div>
            <div>
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Storage & Organization
                </h2>
                <CardDescription>
                  Keep every file organized and easy to find. Upload and store all
                  project and client documents in one place.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <StorageSkeletonVisual />
              </CardSkeleton>
            </div>
          </div>

          {/* Collaboration Sub-features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-10 md:mt-20">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconCheckbox className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Tasks
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base">
                Assign tasks to team members with clear deadlines and priorities,
                so everyone knows exactly what to do next.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconProgress className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Progress
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base">
                Track the status of work at a glance. See what's done, what's
                pending, and what's falling behind.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconMessage className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Discussion
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base">
                Comment directly on any record to keep conversations organized.
                Mention teammates to bring them into the discussion instantly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconClock className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Timeline
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base">
                View every action taken on a task or record. Know who did what,
                when, and how things evolved.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconShield className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-neutral-600 dark:text-neutral-400">
                  Permissions
                </h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base">
                Control who can access what. Set roles, manage permissions (create,
                read, update, delete), and assign multiple roles for flexible team
                management.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Marketplace Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 pb-20">
        <Container>
          <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
            <Heading className="mb-4">Marketplace</Heading>
            <Subheading className="mx-auto">
              Extend Corteksa with powerful integrations and add-ons
            </Subheading>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-center p-8 md:p-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <IconPuzzle className="size-8 text-primary" />
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                Coming Soon
              </span>
              <h3 className="font-bold text-xl mb-3 text-neutral-800 dark:text-neutral-200">
                Powerful Integrations & Extensions
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Connect with your favorite tools, automate workflows, and extend Corteksa with powerful integrations designed to enhance your productivity.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
