import { configureAuth } from "@academy/api-client";
import { useAuthStore } from "@/features/auth/auth.store";

export function configureAuthBridge(): void {
  configureAuth({
    getToken: () => useAuthStore.getState().jwt,
    onUnauthorized: () => {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    },
  });
}
