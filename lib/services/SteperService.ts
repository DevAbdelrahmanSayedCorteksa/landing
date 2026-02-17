import { $api } from "./apiClient";
import { API_USER_STEPER_ENDPOINT } from "./apis";
import { WorkspaceCreationPayload } from "@/lib/types/workspace";

export const steperService = async (data: WorkspaceCreationPayload) => {
  return await $api.post(API_USER_STEPER_ENDPOINT, data);
};
