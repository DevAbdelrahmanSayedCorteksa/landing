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
  "rounded-full px-5 py-2 text-sm font-medium cursor-pointer transition-all",
  "text-muted-foreground bg-transparent shadow-none border-none",
  "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
);

export function PeriodTabs({
  selectedTimePeriod,
  setSelectedTimePeriod,
  className,
}: PeriodTabsProps) {
  return (
    <div className={cn("flex justify-center mb-10", className)}>
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-sm font-medium text-primary">
          Save up to 30% with yearly
        </span>

        <Tabs
          value={selectedTimePeriod}
          onValueChange={(val) => setSelectedTimePeriod(val as TimePeriod)}
        >
          <TabsList className="h-auto rounded-full border border-border bg-muted/50 p-1 gap-0">
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
    </div>
  );
}
