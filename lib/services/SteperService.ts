import { $api } from "./apiClient";
import { API_USER_STEPER_ENDPOINT } from "./apis";

export const steperService = async (data: any) => {
  return await $api.post(API_USER_STEPER_ENDPOINT, data);
};
