import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import Cookies from "js-cookie";
import { sileo } from "sileo";
import {
  AN_UNEXPECTED_ERROR,
  INVALID_MESSAGE,
  NETWORK_ERROR,
} from "./messages";
import {
  FORBIDDEN,
  UNAUTHORIZED_ERROR,
  UNPROCESSABLE_ENTITY,
} from "./statusCodes";
import { TO_LOGIN } from "./urls";
import { handleLogout } from "./AuthLocalService";
import { apiClient } from "./apiClient";
import { API_REFRESH_TOKEN_ENDPOINT } from "./apis";
import { AUTH_TOKEN, REFRESH_TOKEN } from "./LocalKeys";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Auth pages handle their own errors — never refresh on these routes
const AUTH_ROUTES = ["/login", "/signup", "/otp", "/forgot-password", "/reset-password"];

function isAuthPage(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return AUTH_ROUTES.some((route) => path.endsWith(route));
}

export const handleError = async (error: any) => {
  if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
    return Promise.reject(error);
  }

  if (!error.response) {
    sileo.error({ title: "Network Error", description: NETWORK_ERROR });
    return Promise.reject(error);
  }

  const { status } = error.response;
  const config = error.response.config as RetryableRequestConfig;

  // Skip refresh logic on auth pages — let components handle their own errors
  if (typeof window !== "undefined" && !isAuthPage()) {
    if (status === UNAUTHORIZED_ERROR && !config._retry) {
      config._retry = true;
      return await refreshAccessToken(config);
    }

    if (status === FORBIDDEN) {
      handleLogout();
      window.location.href = TO_LOGIN;
    } else if (status === UNPROCESSABLE_ENTITY) {
      sileo.error({ title: "Validation Error", description: INVALID_MESSAGE });
    } else if (status !== UNAUTHORIZED_ERROR) {
      sileo.error({ title: "Error", description: AN_UNEXPECTED_ERROR });
    }
  }

  return Promise.reject(error);
};

// Singleton promise to deduplicate concurrent refresh requests
let refreshingPromise: Promise<string> | null = null;

async function refreshAccessToken(config: RetryableRequestConfig) {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN);
        if (!refreshToken) {
          handleLogout();
          throw new Error("Refresh token is missing");
        }

        // Use a raw axios call — bypasses interceptors to avoid infinite loop
        const response = await axios.post(
          `${apiClient.defaults.baseURL}${API_REFRESH_TOKEN_ENDPOINT}`,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const newAccessToken = response.data.data.token;
        const newRefreshToken = response.data.data.refresh_token;

        Cookies.set(AUTH_TOKEN, newAccessToken);
        Cookies.set(REFRESH_TOKEN, newRefreshToken);
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        return newAccessToken;
      } catch (refreshError) {
        handleLogout();
        if (typeof window !== "undefined") {
          window.location.href = TO_LOGIN;
        }
        throw refreshError;
      } finally {
        refreshingPromise = null;
      }
    })();
  }

  try {
    await refreshingPromise;
    return apiClient(config);
  } catch (err) {
    return Promise.reject(err);
  }
}
