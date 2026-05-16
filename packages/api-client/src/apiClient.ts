import type {
  DashboardData,
  EnrollStubResponse,
  Notification,
  UserProgress,
} from "@academy/types";
import { request } from "./fetcher";

function getBaseUrl(): string {
  const fromVite = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL;
  const fromNode =
    typeof globalThis !== "undefined" &&
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
      ?.API_URL;
  return fromVite || fromNode || "http://localhost:3001";
}

function api<T>(path: string, opts?: Parameters<typeof request>[2]): Promise<T> {
  return request<T>(getBaseUrl(), path, opts);
}

export interface SyncUserResponse {
  id: string;
  strapiId: number;
  createdAt: string;
}

export const apiClient = {
  syncUser(): Promise<SyncUserResponse> {
    return api<SyncUserResponse>("/api/auth/sync", { method: "POST" });
  },
  getDashboard(): Promise<DashboardData> {
    return api<DashboardData>("/api/dashboard");
  },
  getProgress(): Promise<UserProgress[]> {
    return api<UserProgress[]>("/api/progress");
  },
  getProgressForCourse(courseId: number): Promise<UserProgress | null> {
    return api<UserProgress | null>(`/api/progress/${courseId}`);
  },
  getNotifications(): Promise<Notification[]> {
    return api<Notification[]>("/api/notifications");
  },
  getAchievements(): Promise<unknown[]> {
    return api<unknown[]>("/api/achievements");
  },
  stubEnroll(courseId: number): Promise<EnrollStubResponse> {
    return api<EnrollStubResponse>("/api/enrollments", {
      method: "POST",
      body: { courseId },
    });
  },
};
