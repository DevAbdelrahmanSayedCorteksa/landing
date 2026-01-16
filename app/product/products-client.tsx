"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import {
  IconHeadset,
  IconLanguage,
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
  IconPlus,
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
        title="Client Hub"
        description="All client info, projects, and communications in one place"
        tags={["Custom Fields", "Relations", "Kanban"]}
      />
      <SkeletonCard
        className="absolute bottom-12 left-16 z-20"
        icon={<IconTool className="size-4 text-primary" />}
        title="Project Workflow"
        description="Automated task assignments and project templates"
        tags={["Automation", "Templates"]}
      />
      <SkeletonCard
        className="absolute bottom-24 left-12 max-w-[80%] z-10"
        icon={<IconLayoutKanban className="size-4 text-primary" />}
        title="Kanban View"
        description="Drag-and-drop boards to visualize progress"
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
              Focus on &quot;Proposal Review&quot; — deadline approaching
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

// Main Product Page Client Component
export function ProductsPageClient() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
        <Container>
          <div className="flex xl:flex-row flex-col xl:items-baseline-last justify-between gap-10">
            <Heading className="text-center lg:text-left">
              One platform. <br /> Endless possibilities.
            </Heading>
            <Subheading className="text-center lg:text-left mx-auto lg:mx-0">
              From idea to execution, Corteksa gives you the tools to build,
              organize, and grow — all without the complexity.
            </Subheading>
          </div>
        </Container>
      </section>

      {/* All Features - Unified Grid */}
      <section className="pt-10 md:pt-20 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800">
            {/* Support */}
            <div className="md:border-r border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  We&apos;re in this together
                </h2>
                <CardDescription>
                  Not just support — a partnership. Our team is always ready to
                  guide you, answer questions, and help you get the most out of
                  every feature.
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
                  Speak your language, literally
                </h2>
                <CardDescription>
                  Switch seamlessly between Arabic and English. Every button,
                  every label, every workflow — designed to feel natural in the
                  language you think in.
                </CardDescription>
              </CardContent>
              <CardSkeleton className="mask-radial-from-50% mask-t-from-50%">
                <LanguageSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Units */}
            <div className="md:border-r border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Build anything. No code required.
                </h2>
                <CardDescription>
                  Clients, projects, products, invoices — create custom units
                  that mirror how your business actually works. Add fields, set
                  relations, and watch everything connect.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <UnitsSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Cortex AI */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Cortex AI
                </h2>
                <CardDescription>
                  Your intelligent assistant that learns your patterns,
                  suggests priorities, and keeps your workflow humming. Less
                  thinking about what&apos;s next — more doing what matters.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <AssistantSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Documents */}
            <div className="md:border-r border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Every document, one home
                </h2>
                <CardDescription>
                  Contracts, proposals, invoices — upload, organize, and find
                  anything in seconds. No more digging through folders or lost
                  attachments.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <DocumentsSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Collaboration */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Teamwork without the chaos
                </h2>
                <CardDescription>
                  Assign tasks, mention teammates, track progress — everyone
                  stays aligned without endless meetings or scattered messages.
                </CardDescription>
              </CardContent>
              <CardSkeleton className="mask-radial-from-20%">
                <CollaborationSkeletonVisual />
              </CardSkeleton>
            </div>

            {/* Documents Generation */}
            <div className="md:border-r border-neutral-200 dark:border-neutral-800">
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  One click. Done.
                </h2>
                <CardDescription>
                  Build templates once — contracts, offers, reports. Then
                  generate polished documents instantly with auto-filled data.
                  Save hours every week.
                </CardDescription>
              </CardContent>
              <CardSkeleton>
                <DocumentsGenerationSkeletonVisual />
              </CardSkeleton>
            </div>
            {/* Storage & Organization */}
            <div>
              <CardContent>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Organized by design
                </h2>
                <CardDescription>
                  Every file has its place. Smart folders, automatic
                  organization, and powerful search mean you&apos;ll never lose
                  a document again.
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
                Crystal-clear assignments with deadlines and priorities.
                Everyone knows what&apos;s theirs and what&apos;s due.
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
                See the full picture at a glance. What&apos;s done, what&apos;s
                pending, and what needs attention — all in real time.
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
                Comments right where the work happens. Tag teammates, share
                updates, and keep conversations in context.
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
                A complete history of every action. Who did what, when, and how
                things evolved — full transparency.
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
                Fine-grained access control. Define roles, set boundaries, and
                trust that sensitive data stays protected.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Marketplace Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 pb-20">
        <Container>
          <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
            <Heading className="mb-4">Extend your workspace</Heading>
            <Subheading className="mx-auto">
              The Corteksa Marketplace is where your tools come together
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
                The Corteksa Marketplace
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Connect the tools you love. From accounting software to
                communication apps, our growing marketplace will bring
                everything together in one unified hub.
              </p>
            </div>
          </div>
        </Container>
      </section>
      </div>
    </PageTransition>
  );
}
