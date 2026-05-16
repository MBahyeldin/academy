import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@academy/api-client";
import { useAuthStore } from "@/features/auth/auth.store";

export function useDashboard() {
  const jwt = useAuthStore((s) => s.jwt);
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiClient.getDashboard(),
    enabled: Boolean(jwt),
  });
}

export function useProgress() {
  const jwt = useAuthStore((s) => s.jwt);
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => apiClient.getProgress(),
    enabled: Boolean(jwt),
  });
}

export function useNotifications() {
  const jwt = useAuthStore((s) => s.jwt);
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiClient.getNotifications(),
    enabled: Boolean(jwt),
  });
}
