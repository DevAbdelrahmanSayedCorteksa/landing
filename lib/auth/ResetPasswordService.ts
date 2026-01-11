import { apiClient } from "@/lib/services/apiClient";
import { API_RESET_PASSWORD_ENDPOINT } from "@/lib/services/apis";

export const resetPassword = async (password: string) => {
  try {
    const response = await apiClient.post(API_RESET_PASSWORD_ENDPOINT, { password });
    return response;
  } catch (error) {
    throw error;
  }
};
