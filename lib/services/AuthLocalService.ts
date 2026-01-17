"use client";

import Cookies from "js-cookie";
import { AUTH, AUTH_TOKEN, WORKSPACE_SUBDOMAIN } from "./LocalKeys";
import { LoginResponse } from "@/lib/types/authTypes";

export const handleLogin = (response: LoginResponse) => {
  Cookies.set(AUTH_TOKEN, response.token);
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

export const handleLogout = () => {
  Cookies.remove(AUTH_TOKEN);
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
