import { create } from "zustand";
import { fetchCurrentUser, logout as apiLogout, type AuthUser } from "../api/auth-api";

interface AuthState {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isInstructor: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "loading",

  checkSession: async () => {
    set({ status: "loading" });
    const user = await fetchCurrentUser();
    set({ user, status: user ? "authenticated" : "unauthenticated" });
  },

  logout: async () => {
    await apiLogout();
    set({ user: null, status: "unauthenticated" });
  },

  isAdmin: () => get().user?.role === "admin",
  isInstructor: () => get().user?.role === "instructor",
  isAuthenticated: () => get().status === "authenticated",
}));
