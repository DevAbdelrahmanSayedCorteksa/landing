export type TimePeriod = "sixMonths" | "nineMonths" | "twelveMonths";

export interface TimePeriodPricing {
  sixMonths: number;
  nineMonths: number;
  twelveMonths: number;
}

export interface PricingPlan {
  slug: string;
  roleName: string;
  name: string;
  description: string;
  currency: string;
  buttonText: string;
  buttonVariant: "outline" | "contained";
  isPopular: boolean;
  features: string[];
  timePeriodPricing: TimePeriodPricing;
  userPermissions: { name: string }[];
}

export const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  sixMonths: "6 Months",
  nineMonths: "9 Months",
  twelveMonths: "12 Months",
};

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
