import { PricingPlan, ApiResponse } from "@/lib/types/pricing";
import { $api } from "./apiClient";
import { API_PRICING_ENDPOINT } from "./apis";

export const PRICING_KEY = "pricing";

export const pricingService = {
  getPricingPlans: async (): Promise<ApiResponse<PricingPlan[]>> => {
    const response = await $api.get<ApiResponse<PricingPlan[]>>(API_PRICING_ENDPOINT);
    return response;
  },
};
