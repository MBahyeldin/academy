import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StrapiUser } from "@academy/types";

export type UserRole = "student" | "teacher";

interface AuthState {
  jwt: string | null;
  user: StrapiUser | null;
  role: UserRole | null;
  setAuth: (jwt: string, user: StrapiUser, role?: UserRole) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: null,
      user: null,
      role: null,
      setAuth: (jwt, user, role = "student") => set({ jwt, user, role }),
      clearAuth: () => set({ jwt: null, user: null, role: null }),
    }),
    { name: "academy.auth" },
  ),
);
