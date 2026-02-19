import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { AUTH_TOKEN, REFRESH_TOKEN } from "./LocalKeys";
import { NOT_DATA_RECEIVED_API } from "./messages";
import { handleError } from "./handleError";
import { API_REFRESH_TOKEN_ENDPOINT } from "./apis";
import { handleLogout, updateTokens } from "./AuthLocalService";
import { TO_LOGIN } from "./urls";

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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Token refresh state
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

// Auth endpoints that should not trigger a refresh
const AUTH_ENDPOINTS = [
  "auth/login",
  "auth/register",
  "auth/refresh",
  "auth/forgot-password",
  "auth/reset-password",
  "otp/verify",
  "otp/resend",
];

const isAuthEndpoint = (url?: string) =>
  AUTH_ENDPOINTS.some(endpoint => url?.includes(endpoint));

// Response interceptor - refresh token on 401
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh for 401, on client-side, not on auth endpoints, and not already retried
    if (
      error.response?.status !== 401 ||
      typeof window === "undefined" ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return handleError(error);
    }

    const refreshToken = Cookies.get(REFRESH_TOKEN);
    if (!refreshToken) {
      handleLogout();
      window.location.href = TO_LOGIN;
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(newToken => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      // Use raw axios to avoid triggering our interceptors
      const { data } = await axios.post(
        `${apiClient.defaults.baseURL}${API_REFRESH_TOKEN_ENDPOINT}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newToken = data.data.token;
      const newRefreshToken = data.data.refresh_token;

      updateTokens(newToken, newRefreshToken);
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleLogout();
      window.location.href = TO_LOGIN;
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
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
