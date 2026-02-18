"use client";

import Cookies from "js-cookie";
import { AUTH, AUTH_TOKEN, REFRESH_TOKEN, WORKSPACE_SUBDOMAIN } from "./LocalKeys";
import { LoginResponse } from "@/lib/types/authTypes";

export const handleLogin = (response: LoginResponse) => {
  Cookies.set(AUTH_TOKEN, response.token);
  if (response.refresh_token) {
    Cookies.set(REFRESH_TOKEN, response.refresh_token);
  }
  if (response.user) {
    localStorage.setItem(AUTH, JSON.stringify(response.user));
  }
};

export const getToken = () => {
  return Cookies.get(AUTH_TOKEN);
};

export const handleOtpLogin = (token: string) => {
  Cookies.set(AUTH_TOKEN, token);
  Cookies.set("isOtp", "true");
};

export const getUser = (): LoginResponse | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    const data = localStorage.getItem(AUTH);
    return data ? (JSON.parse(data) as LoginResponse) : null;
  }
  return null;
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN);
};

export const handleLogout = () => {
  Cookies.remove(AUTH_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
  localStorage.removeItem(AUTH);
};

export const handleLogoutOtp = () => {
  Cookies.remove(AUTH_TOKEN);
  Cookies.remove("isOtp");
  sessionStorage.removeItem("verifyRegister");
  sessionStorage.removeItem("verifyForLogin");
  sessionStorage.removeItem("verifyForForgotPassword");
};

export const updateAuth = (key: string, value: string | undefined) => {
  if (value) {
    const userData = JSON.parse(localStorage.getItem(AUTH) || "{}");
    userData[key] = value;
    localStorage.setItem(AUTH, JSON.stringify(userData));
  }
};

// Workspace subdomain functions
export const saveWorkspaceSubdomain = (subdomain: string) => {
  Cookies.set(WORKSPACE_SUBDOMAIN, subdomain, { expires: 365 });
};

export const getWorkspaceSubdomain = () => {
  return Cookies.get(WORKSPACE_SUBDOMAIN);
};

export const removeWorkspaceSubdomain = () => {
  Cookies.remove(WORKSPACE_SUBDOMAIN);
};

// SSO Configuration
// NEXT_PUBLIC_CRM_URL: Full URL for local development (e.g., http://localhost:3001)
// NEXT_PUBLIC_CRM_ADMIN_DOMAIN: Domain for system admins (e.g., corteksa.org)
// NEXT_PUBLIC_CRM_USER_DOMAIN: Domain for regular users with subdomain (e.g., corteksa.net)
const CRM_BASE_URL = process.env.NEXT_PUBLIC_CRM_URL || "";
const CRM_ADMIN_DOMAIN = process.env.NEXT_PUBLIC_CRM_ADMIN_DOMAIN || "corteksa.org";
const CRM_USER_DOMAIN = process.env.NEXT_PUBLIC_CRM_USER_DOMAIN || "corteksa.net";
const SSO_CALLBACK_PATH = "/sso/callback";

/**
 * Encode a string to base64url format (URL-safe base64)
 */
const encodeBase64Url = (str: string): string => {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/**
 * Build SSO redirect URL with encoded tokens
 * @param subdomain - The workspace subdomain (used when isSystemAdmin is false)
 * @param token - The access token from login response
 * @param refreshToken - The refresh token from login response
 * @param isSystemAdmin - Whether the user is a system admin
 * @returns The full SSO redirect URL
 */
export const buildSSORedirectUrl = (
  subdomain: string | null,
  token: string,
  refreshToken: string,
  isSystemAdmin: boolean
): string => {
  // Check if using local development URL (NEXT_PUBLIC_CRM_URL is set)
  const isLocalDev = CRM_BASE_URL && CRM_BASE_URL.length > 0;

  let baseUrl: string;
  if (isLocalDev) {
    // For local development, always use the CRM_BASE_URL directly
    baseUrl = CRM_BASE_URL;
  } else {
    // For production, use different domains for admin vs regular users
    // Admin: corteksa.org
    // Users: subdomain.corteksa.net
    baseUrl = isSystemAdmin
      ? `https://${CRM_ADMIN_DOMAIN}`
      : `https://${subdomain}.${CRM_USER_DOMAIN}`;
  }

  const url = new URL(SSO_CALLBACK_PATH, baseUrl);
  url.searchParams.set("token", encodeBase64Url(token));
  url.searchParams.set("refresh_token", encodeBase64Url(refreshToken));
  url.searchParams.set("ts", Date.now().toString());

  return url.toString();
};
