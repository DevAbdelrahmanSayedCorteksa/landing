import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_TOKEN } from "./LocalKeys";
import { NOT_DATA_RECEIVED_API } from "./messages";
import { handleError } from "./handleError";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = Cookies.get(AUTH_TOKEN);
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  response => response,
  async error => handleError(error)
);

export const $api = {
  get: async <T>(url: string, params?: object | null) => {
    try {
      const response = await apiClient.get(url, { params });
      if (!response || !response.data) {
        throw new Error(NOT_DATA_RECEIVED_API);
      }
      return response.data as T;
    } catch (error) {
      throw error;
    }
  },

  post: async <T>(url: string, data: object): Promise<T> => {
    try {
      const response = await apiClient.post(url, data);
      return response.data as T;
    } catch (error) {
      throw error;
    }
  },

  put: async <T>(url: string, data: object): Promise<T> => {
    try {
      const response = await apiClient.put(url, data);
      return response.data as T;
    } catch (error) {
      throw error;
    }
  },

  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete(url);
      return response.data as T;
    } catch (error) {
      throw error;
    }
  },
};
