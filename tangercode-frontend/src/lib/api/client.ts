import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import type { ApiError } from "./types";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token as string);
    }
  });
  failedQueue = [];
}

function getRefreshUrl(): string {
  if (typeof window === "undefined") {
    return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/refresh`;
  }
  return "/api/auth/refresh";
}

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    const { locale } = useUIStore.getState();
    if (config.headers) {
      config.headers["Accept-Language"] = locale;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<typeof originalRequest>((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(client(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await fetch(getRefreshUrl(), { method: "GET" });

      if (!response.ok) {
        useAuthStore.getState().logout();
        processQueue(new Error("Refresh failed"), null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      const data = await response.json();
      const newAccess = data.access;

      useAuthStore.getState().updateAccessToken(newAccess);
      processQueue(null, newAccess);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      }
      return client(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      isRefreshing = false;
      return Promise.reject(refreshError);
    }
  },
);

export default client;
