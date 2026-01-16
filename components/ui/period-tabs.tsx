"use client";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";

interface PeriodTabsProps {
  selectedTimePeriod: TimePeriod;
  setSelectedTimePeriod: (value: TimePeriod) => void;
  className?: string;
}

const triggerClassName = cn(
  "border-none rounded-xl px-6 py-3 min-w-[100px] text-[0.875rem] font-medium",
  "text-foreground/70 transition-all duration-300 relative overflow-visible bg-transparent",
  "hover:opacity-90 hover:-translate-y-[1px]",
  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:opacity-100",
  "data-[state=active]:[box-shadow:var(--shadow-brand)]"
);

export function PeriodTabs({
  selectedTimePeriod,
  setSelectedTimePeriod,
  className,
}: PeriodTabsProps) {
  return (
    <div className={cn("flex justify-center mb-10", className)}>
      <Tabs
        value={selectedTimePeriod}
        onValueChange={(val) => setSelectedTimePeriod(val as TimePeriod)}
        className="rounded-2xl p-1"
      >
        <TabsList className="bg-transparent flex gap-1">
          <TabsTrigger value="sixMonths" className={triggerClassName}>
            {TIME_PERIOD_LABELS.sixMonths}
          </TabsTrigger>
          <TabsTrigger value="nineMonths" className={triggerClassName}>
            {TIME_PERIOD_LABELS.nineMonths}
          </TabsTrigger>
          <TabsTrigger value="twelveMonths" className={triggerClassName}>
            {TIME_PERIOD_LABELS.twelveMonths}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
