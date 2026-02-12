"use client";

import { createContext, useContext, useState } from "react";
import { TimePeriod } from "@/lib/types/pricing";

interface PricingContextValue {
  selectedTimePeriod: TimePeriod;
  setSelectedTimePeriod: (period: TimePeriod) => void;
}

const PricingContext = createContext<PricingContextValue | null>(null);

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("sixMonths");

  return (
    <PricingContext.Provider value={{ selectedTimePeriod, setSelectedTimePeriod }}>
      {children}
    </PricingContext.Provider>
  );
}

export function useTimePeriod() {
  const ctx = useContext(PricingContext);
  if (!ctx) throw new Error("useTimePeriod must be used within PricingProvider");
  return ctx;
}
