import { apiClient } from "@/lib/services/apiClient";
import { API_FORGOT_PASSWORD_ENDPOINT } from "@/lib/services/apis";

export const sendForgotPasswordEmail = async (email: string) => {
  try {
    const response = await apiClient.post(API_FORGOT_PASSWORD_ENDPOINT, { email });
    return response;
  } catch (error) {
    throw error;
  }
};
