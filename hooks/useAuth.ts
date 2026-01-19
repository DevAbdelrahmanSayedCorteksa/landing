"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getToken,
  getUser,
  handleLogout as authLogout,
} from "@/lib/services/AuthLocalService";

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = getToken();
    const userData = getUser();

    setAuthState({
      isAuthenticated: !!token,
      user: userData as User | null,
      isLoading: false,
    });
  }, []);

  const logout = () => {
    authLogout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    router.push("/");
  };

  return {
    ...authState,
    logout,
  };
}
