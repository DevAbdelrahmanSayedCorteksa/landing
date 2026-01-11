import { $api } from "@/lib/services/apiClient";
import { API_USER_LOGIN_ENDPOINT } from "@/lib/services/apis";

export const login = async (email: string, password: string) => {
  return await $api.post(API_USER_LOGIN_ENDPOINT, { email, password });
};
