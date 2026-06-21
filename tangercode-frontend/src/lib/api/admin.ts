import client from "./client";
import type { ApiResponse } from "./types";

export async function getDashboardStats(): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    "/admin/dashboard/",
  );
  return response.data;
}

export async function getServices(
  params?: Record<string, string>,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    "/admin/services/",
    { params },
  );
  return response.data;
}

export async function createService(
  data: Record<string, unknown>,
): Promise<ApiResponse<unknown>> {
  const response = await client.post<ApiResponse<unknown>>(
    "/admin/services/",
    data,
  );
  return response.data;
}

export async function updateService(
  id: number,
  data: Record<string, unknown>,
): Promise<ApiResponse<unknown>> {
  const response = await client.put<ApiResponse<unknown>>(
    `/admin/services/${id}/`,
    data,
  );
  return response.data;
}

export async function deleteService(
  id: number,
): Promise<ApiResponse<unknown>> {
  const response = await client.delete<ApiResponse<unknown>>(
    `/admin/services/${id}/`,
  );
  return response.data;
}

export async function getProjects(
  params?: Record<string, string>,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    "/admin/projects/",
    { params },
  );
  return response.data;
}

export async function createProject(
  data: Record<string, unknown>,
): Promise<ApiResponse<unknown>> {
  const response = await client.post<ApiResponse<unknown>>(
    "/admin/projects/",
    data,
  );
  return response.data;
}

export async function updateProject(
  id: number,
  data: Record<string, unknown>,
): Promise<ApiResponse<unknown>> {
  const response = await client.put<ApiResponse<unknown>>(
    `/admin/projects/${id}/`,
    data,
  );
  return response.data;
}

export async function deleteProject(
  id: number,
): Promise<ApiResponse<unknown>> {
  const response = await client.delete<ApiResponse<unknown>>(
    `/admin/projects/${id}/`,
  );
  return response.data;
}

export async function getMessages(
  params?: Record<string, string>,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    "/admin/messages/",
    { params },
  );
  return response.data;
}

export async function replyToMessage(
  id: number,
  data: Record<string, unknown>,
): Promise<ApiResponse<unknown>> {
  const response = await client.post<ApiResponse<unknown>>(
    `/admin/messages/${id}/reply/`,
    data,
  );
  return response.data;
}

export async function getAnalyticsOverview(
  params?: Record<string, string>,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    "/admin/analytics/overview/",
    { params },
  );
  return response.data;
}
