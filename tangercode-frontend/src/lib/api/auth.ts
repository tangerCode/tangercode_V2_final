import client from "./client";
import { useAuthStore } from "@/store/authStore";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from "./types";

export async function login(
  data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
  const response = await client.post<ApiResponse<LoginResponse>>(
    "/admin/auth/login/",
    data,
  );
  return response.data;
}

export async function refresh(
  refreshToken: string,
): Promise<ApiResponse<RefreshResponse>> {
  const response = await client.post<ApiResponse<RefreshResponse>>(
    "/admin/auth/refresh/",
    { refresh: refreshToken },
  );
  return response.data;
}

export async function logout(): Promise<void> {
  const currentRefreshToken = useAuthStore.getState().refreshToken;
  if (currentRefreshToken) {
    await client.post("/admin/auth/logout/", { refresh: currentRefreshToken });
  }
  useAuthStore.getState().logout();
}

export async function getMe(): Promise<
  ApiResponse<LoginResponse["user"]>
> {
  const response = await client.get<
    ApiResponse<LoginResponse["user"]>
  >("/admin/auth/me/");
  return response.data;
}
