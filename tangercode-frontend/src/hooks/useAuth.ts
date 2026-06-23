"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    updateAccessToken,
  } = useAuthStore();

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    updateAccessToken,
  };
}

export function useRequireAuth(redirectTo = "/admin/login") {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return isAuthenticated;
}

export function useRole() {
  const { user } = useAuthStore();
  return user?.role || null;
}
