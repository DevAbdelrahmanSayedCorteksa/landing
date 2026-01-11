import { $api } from "@/lib/services/apiClient";
import { API_OTP_VERIFY_ENDPOINT, API_OTP_RESEND_ENDPOINT } from "@/lib/services/apis";

export const verifyOtp = async (otp: string) => {
  return await $api.post(API_OTP_VERIFY_ENDPOINT, { otp });
};

export const resendOtp = async () => {
  return await $api.post(API_OTP_RESEND_ENDPOINT, {});
};
