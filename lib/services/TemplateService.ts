import { $api } from "./apiClient";
import {
  Template,
  GenerateTemplatePayload,
  SaveTemplatePayload,
  GeneratedTemplatePreview
} from "@/lib/types/workspace";

export const TEMPLATES_KEY = "templates";

interface TemplatesResponse {
  status: number;
  message: string;
  data: Template[];
}

interface GenerateTemplateResponse {
  status: number;
  message: string;
  data: GeneratedTemplatePreview;
}

interface SaveTemplateResponse {
  status: number;
  message: string;
  data: Template;
}

export const templateService = {
  // Get list of templates
  getTemplates: async (): Promise<TemplatesResponse> => {
    return await $api.get<TemplatesResponse>("v1/object-template");
  },

  // Generate template preview with AI
  generateTemplate: async (payload: GenerateTemplatePayload): Promise<GenerateTemplateResponse> => {
    return await $api.post<GenerateTemplateResponse>("v1/user/auth/template/generate", payload);
  },

  // Save template and get slug
  saveTemplate: async (payload: SaveTemplatePayload): Promise<SaveTemplateResponse> => {
    return await $api.post<SaveTemplateResponse>("v1/user/auth/template/save", payload);
  },
};
