"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { accessToken, refreshToken, user, isAuthenticated, login, logout, setUser, updateAccessToken } =
    useAuthStore();

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
