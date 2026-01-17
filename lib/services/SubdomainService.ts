import { $api } from "./apiClient";
import { API_CHECK_SUBDOMAIN_ENDPOINT } from "./apis";

export interface SubdomainCheckResponse {
  message: string;
  data: {
    subdomain: string;
    available: boolean;
  };
}

export const checkSubdomainAvailability = async (
  subdomain: string
): Promise<SubdomainCheckResponse> => {
  return await $api.get<SubdomainCheckResponse>(
    `${API_CHECK_SUBDOMAIN_ENDPOINT}?subdomain=${subdomain}`
  );
};
