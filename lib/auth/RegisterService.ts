import { $api } from "@/lib/services/apiClient";
import { API_USER_REGISTER_ENDPOINT } from "@/lib/services/apis";
import { RegisterData } from "@/lib/types/authTypes";

export const register = async (data: RegisterData) => {
  return await $api.post(API_USER_REGISTER_ENDPOINT, data);
};
