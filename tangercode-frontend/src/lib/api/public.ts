import client from "./client";
import type { ApiResponse } from "./types";

export async function getServices(
  params?: Record<string, string>,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>("/services/", {
    params,
  });
  return response.data;
}

export async function getService(
  slug: string,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    `/services/${slug}/`,
  );
  return response.data;
}

export async function getProjects(
  params?: Record<string, string>,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>("/projects/", {
    params,
  });
  return response.data;
}

export async function getProject(
  slug: string,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    `/projects/${slug}/`,
  );
  return response.data;
}

export async function getBlogPosts(
  params?: Record<string, string>,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>("/blog/", {
    params,
  });
  return response.data;
}

export async function getBlogPost(
  slug: string,
): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>(
    `/blog/${slug}/`,
  );
  return response.data;
}

export async function getPricing(): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>("/pricing/");
  return response.data;
}

export async function getFAQs(): Promise<ApiResponse<unknown>> {
  const response = await client.get<ApiResponse<unknown>>("/faqs/");
  return response.data;
}

export async function getTestimonials(): Promise<ApiResponse<unknown>> {
  const response =
    await client.get<ApiResponse<unknown>>("/testimonials/");
  return response.data;
}

export async function getTechnologies(): Promise<ApiResponse<unknown>> {
  const response =
    await client.get<ApiResponse<unknown>>("/technologies/");
  return response.data;
}

export async function getSiteConfig(): Promise<ApiResponse<unknown>> {
  const response =
    await client.get<ApiResponse<unknown>>("/site-config/");
  return response.data;
}

export async function submitContact(
  data: Record<string, unknown>,
): Promise<ApiResponse<unknown>> {
  const response = await client.post<ApiResponse<unknown>>(
    "/contact/",
    data,
  );
  return response.data;
}
