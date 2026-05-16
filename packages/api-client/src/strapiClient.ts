import type {
  StrapiCategory,
  StrapiCourse,
  StrapiInstructor,
  StrapiAuthResponse,
} from "@academy/types";
import { request, type RequestOptions } from "./fetcher";

/**
 * Strapi v5 returns `{ data, meta }`. Each item is `{ id, ...attributes }`
 * (in v5 flat mode) or `{ id, attributes: {...} }` (legacy). We normalize
 * to the flat shape on the way out.
 */

type StrapiListResponse<T> = { data: T[]; meta?: unknown };
type StrapiItemResponse<T> = { data: T; meta?: unknown };

export interface GetCoursesParams {
  category?: string;
  level?: string;
  search?: string;
  limit?: number;
  page?: number;
}

function getBaseUrl(): string {
  const fromVite = (import.meta as { env?: Record<string, string> }).env?.VITE_STRAPI_URL;
  const fromNode =
    typeof globalThis !== "undefined" &&
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
      ?.STRAPI_URL;
  return fromVite || fromNode || "http://localhost:1337";
}

function strapi<T>(path: string, opts?: RequestOptions): Promise<T> {
  return request<T>(getBaseUrl(), path, opts);
}

function flatten<T extends { id: number; attributes?: Record<string, unknown> }>(item: T): T {
  if (item && typeof item === "object" && "attributes" in item && item.attributes) {
    return { id: item.id, ...item.attributes } as unknown as T;
  }
  return item;
}

export async function getCourses(params: GetCoursesParams = {}): Promise<StrapiCourse[]> {
  const query: Record<string, string | number | undefined> = {
    "populate[0]": "category",
    "populate[1]": "instructor",
    "populate[2]": "thumbnail",
    "populate[3]": "modules.lessons",
    "populate[4]": "reviews",
  };
  if (params.category) query["filters[category][slug][$eq]"] = params.category;
  if (params.level) query["filters[level][$eq]"] = params.level;
  if (params.search) query["filters[title][$containsi]"] = params.search;
  if (params.limit) query["pagination[pageSize]"] = params.limit;
  if (params.page) query["pagination[page]"] = params.page;

  const res = await strapi<StrapiListResponse<StrapiCourse>>("/api/courses", { query });
  return res.data.map(flatten);
}

export async function getCourse(id: number | string): Promise<StrapiCourse> {
  const res = await strapi<StrapiItemResponse<StrapiCourse>>(`/api/courses/${id}`, {
    query: {
      "populate[0]": "category",
      "populate[1]": "instructor",
      "populate[2]": "thumbnail",
      "populate[3]": "modules.lessons",
      "populate[4]": "reviews",
    },
  });
  return flatten(res.data);
}

export async function getCategories(): Promise<StrapiCategory[]> {
  const res = await strapi<StrapiListResponse<StrapiCategory>>("/api/categories", {});
  return res.data.map(flatten);
}

export async function getInstructors(): Promise<StrapiInstructor[]> {
  const res = await strapi<StrapiListResponse<StrapiInstructor>>("/api/instructors", {
    query: { "populate[0]": "avatar" },
  });
  return res.data.map(flatten);
}

export async function login(identifier: string, password: string): Promise<StrapiAuthResponse> {
  return strapi<StrapiAuthResponse>("/api/auth/local", {
    method: "POST",
    skipAuth: true,
    body: { identifier, password },
  });
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<StrapiAuthResponse> {
  return strapi<StrapiAuthResponse>("/api/auth/local/register", {
    method: "POST",
    skipAuth: true,
    body: { username, email, password },
  });
}

export const strapiClient = {
  getCourses,
  getCourse,
  getCategories,
  getInstructors,
  login,
  register,
};
